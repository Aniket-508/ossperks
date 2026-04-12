import { cancel, groupMultiselect, isCancel, spinner } from "@clack/prompts";
import {
  checkAllPrograms,
  checkEligibility,
  fetchRepoContext,
  getProgramBySlug,
  programs,
  PROVIDER_HOSTS,
  VALID_PROVIDERS,
} from "@ossperks/core";
import type {
  EligibilityResult,
  Program,
  ProgramEligibility,
  RepoContext,
  RepoProvider,
  RepoRef,
} from "@ossperks/core";

import { detectLocalTree, detectRepo } from "../utils/detect.js";
import {
  eligibilityRow,
  error as displayError,
  header,
  info,
  maxNameLength,
} from "../utils/format.js";
import { highlighter } from "../utils/highlighter.js";
import { closestId } from "../utils/id.js";
import { capture } from "../utils/telemetry.js";
import {
  buildGroupMultiselectOptions,
  printCheckResults,
  printRepoSummary,
} from "./check-output.js";

export interface CheckOpts {
  repo?: string;
  provider?: string;
  program?: string;
  json?: boolean;
  interactive?: boolean;
}

export const resolveRef = (opts: CheckOpts): RepoRef | null => {
  if (!opts.repo) {
    return detectRepo();
  }
  const provider: RepoProvider = VALID_PROVIDERS.has(
    opts.provider as RepoProvider,
  )
    ? (opts.provider as RepoProvider)
    : "github";
  const parts = opts.repo.split("/").filter(Boolean);
  const isValid =
    provider === "gitlab" ? parts.length >= 2 : parts.length === 2;
  if (!isValid || !parts[0] || !parts.at(-1)) {
    displayError(
      provider === "gitlab"
        ? '--repo must be in the format "owner/repo" or "group/subgroup/repo"'
        : '--repo must be in the format "owner/repo"',
    );
    process.exit(1);
  }
  return {
    owner: parts[0],
    path: parts.join("/"),
    provider,
    repo: parts.at(-1) ?? "",
  };
};

const pickInteractiveSlugs = async (
  opts: CheckOpts,
): Promise<Set<string> | undefined> => {
  if (
    !opts.interactive ||
    !process.stdout.isTTY ||
    opts.program !== undefined ||
    opts.json
  ) {
    return undefined;
  }

  const groupOptions = buildGroupMultiselectOptions();
  const selected = await groupMultiselect({
    message: "Select programs to check eligibility for",
    options: groupOptions,
    required: true,
  });
  if (isCancel(selected)) {
    cancel("Cancelled.");
    process.exit(0);
  }
  return new Set(selected);
};

const resolveTargetProgram = (opts: CheckOpts): Program | undefined => {
  if (opts.program === undefined) {
    return undefined;
  }
  const resolved = getProgramBySlug(opts.program);
  if (resolved === undefined) {
    const suggestion = closestId(opts.program);
    const hint = suggestion === null ? "" : ` Did you mean "${suggestion}"?`;
    displayError(`Unknown program id "${opts.program}".${hint}`);
    process.exit(1);
  }
  return resolved;
};

const fetchRepoContextWithSpinner = async (
  ref: RepoRef,
  opts: CheckOpts,
): Promise<RepoContext> => {
  const host = PROVIDER_HOSTS[ref.provider];
  const useClackSpinner = !opts.json && process.stdout.isTTY;

  if (!opts.json && !useClackSpinner) {
    info(`Fetching repo info for ${host}/${ref.path}...`);
  }

  try {
    if (useClackSpinner) {
      const s = spinner();
      s.start(`Fetching repo info for ${host}/${ref.path}...`);
      const context = await fetchRepoContext(ref);
      s.stop("Repo info fetched");
      return context;
    }
    return await fetchRepoContext(ref);
  } catch (error) {
    displayError(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
};

const mergeLocalIntoContext = (ctx: RepoContext): RepoContext => {
  const localTree = detectLocalTree();
  return {
    ...ctx,
    dependencies: [
      ...new Set([...ctx.dependencies, ...localTree.dependencies]),
    ],
    filePaths: [...new Set([...(ctx.filePaths ?? []), ...localTree.filePaths])],
  };
};

const repoJsonSlice = (ctx: RepoContext) => ({
  dependencies: ctx.dependencies,
  isFork: ctx.isFork,
  isPrivate: ctx.isPrivate,
  license: ctx.license,
  owner: ctx.owner,
  path: ctx.path,
  provider: ctx.provider,
  repo: ctx.repo,
  stars: ctx.stars,
});

const printSingleProgramText = (
  targetProgram: Program,
  ctx: RepoContext,
  result: EligibilityResult,
): void => {
  printRepoSummary(ctx);
  console.log();
  header(`Eligibility for ${targetProgram.name}`);
  console.log();
  const padName = maxNameLength([targetProgram]);
  console.log(eligibilityRow(targetProgram, result, padName));
  for (const reason of result.reasons.slice(1)) {
    console.log(
      `  ${" ".repeat(padName + 6)}${highlighter.dim(`• ${reason}`)}`,
    );
  }
  console.log();
};

const runSingleProgramBranch = (
  targetProgram: Program,
  ctx: RepoContext,
  opts: CheckOpts,
  ref: RepoRef,
): void => {
  const result = checkEligibility(targetProgram, ctx);

  capture("cli:check", {
    eligible: result.status === "eligible" ? 1 : 0,
    ineligible: result.status === "ineligible" ? 1 : 0,
    programFilter: true,
    provider: ref.provider,
    review: result.status === "needs-review" ? 1 : 0,
  });

  if (opts.json) {
    console.log(
      JSON.stringify(
        {
          repo: repoJsonSlice(ctx),
          results: [
            {
              name: targetProgram.name,
              reasons: result.reasons,
              slug: targetProgram.slug,
              status: result.status,
            },
          ],
        },
        null,
        2,
      ),
    );
    return;
  }

  printSingleProgramText(targetProgram, ctx, result);
};

const runAllProgramsBranch = (
  ctx: RepoContext,
  opts: CheckOpts,
  ref: RepoRef,
  programFilterSlugs: Set<string> | undefined,
): void => {
  let results: ProgramEligibility[] = checkAllPrograms(programs, ctx);
  if (programFilterSlugs) {
    results = results.filter((r) => programFilterSlugs.has(r.program.slug));
  }

  const eligibleCount = results.filter(
    (r) => r.result.status === "eligible",
  ).length;
  const reviewCount = results.filter(
    (r) => r.result.status === "needs-review",
  ).length;
  const ineligibleCount = results.filter(
    (r) => r.result.status === "ineligible",
  ).length;

  capture("cli:check", {
    eligible: eligibleCount,
    ineligible: ineligibleCount,
    programFilter: Boolean(programFilterSlugs),
    provider: ref.provider,
    review: reviewCount,
  });

  if (opts.json) {
    console.log(
      JSON.stringify(
        {
          repo: repoJsonSlice(ctx),
          results: results.map(({ program, result }) => ({
            name: program.name,
            reasons: result.reasons,
            slug: program.slug,
            status: result.status,
          })),
        },
        null,
        2,
      ),
    );
    return;
  }

  printCheckResults(ctx, results);
};

export const runCheckCommand = async (opts: CheckOpts): Promise<void> => {
  const programFilterSlugs = await pickInteractiveSlugs(opts);
  const targetProgram = resolveTargetProgram(opts);
  const ref = resolveRef(opts);

  if (!ref) {
    displayError(
      "Could not detect a repository.\n" +
        "  Make sure your package.json has a repository field, or use --repo <owner/repo>.",
    );
    process.exit(1);
  }

  let ctx = await fetchRepoContextWithSpinner(ref, opts);
  ctx = mergeLocalIntoContext(ctx);

  if (targetProgram) {
    runSingleProgramBranch(targetProgram, ctx, opts, ref);
    return;
  }

  runAllProgramsBranch(ctx, opts, ref, programFilterSlugs);
};
