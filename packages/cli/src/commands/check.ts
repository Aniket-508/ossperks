import {
  checkAllPrograms,
  checkEligibility,
  getProgramBySlug,
  fetchRepoContext,
  programs,
  PROVIDER_HOSTS,
  VALID_PROVIDERS,
} from "@ossperks/core";
import type {
  Program,
  ProgramEligibility,
  RepoContext,
  RepoProvider,
  RepoRef,
} from "@ossperks/core";
import { Command } from "commander";
import pc from "picocolors";

import { detectLocalTree, detectRepo } from "../utils/detect.js";
import {
  eligibilityRow,
  error as displayError,
  header,
  info,
  maxSlugLength,
  success,
} from "../utils/format.js";
import { closestSlug } from "../utils/slug.js";

interface CheckOpts {
  repo?: string;
  provider?: string;
  program?: string;
  json?: boolean;
}

const formatAge = (date: Date): string => {
  const days = Math.floor(
    (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (days === 0) {
    return "today";
  }
  if (days === 1) {
    return "yesterday";
  }
  if (days < 30) {
    return `${days} days ago`;
  }
  if (days < 365) {
    return `${Math.floor(days / 30)} months ago`;
  }
  return `${Math.floor(days / 365)} years ago`;
};

const printRepoSummary = (ctx: RepoContext): void => {
  const parts: string[] = [];
  if (ctx.license) {
    parts.push(ctx.license);
  }
  parts.push(`${ctx.stars.toLocaleString()} stars`);
  parts.push(`last push ${formatAge(ctx.pushedAt)}`);
  if (ctx.isFork) {
    parts.push(pc.yellow("fork"));
  }
  if (ctx.isPrivate) {
    parts.push(pc.red("private"));
  }
  success(`${pc.bold(ctx.name)} ${pc.dim("—")} ${parts.join(pc.dim(" · "))}`);
};

const resolveRef = (opts: CheckOpts): RepoRef | null => {
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

const printEligibilitySection = (
  items: ProgramEligibility[],
  pad: number,
): void => {
  for (const { program, result } of items) {
    console.log(eligibilityRow(program, result, pad));
    for (const reason of result.reasons.slice(1)) {
      console.log(`  ${" ".repeat(pad + 6)}${pc.dim(`• ${reason}`)}`);
    }
  }
  console.log();
};

const printCheckResults = (
  ctx: RepoContext,
  results: ProgramEligibility[],
): void => {
  printRepoSummary(ctx);
  console.log();

  const eligible = results.filter((r) => r.result.status === "eligible");
  const review = results.filter((r) => r.result.status === "needs-review");
  const ineligible = results.filter((r) => r.result.status === "ineligible");
  const pad = maxSlugLength(programs);

  header(
    `Eligibility across ${programs.length} programs — ${eligible.length} eligible, ${review.length} need review, ${ineligible.length} ineligible`,
  );
  console.log();

  if (eligible.length > 0) {
    for (const { program, result } of eligible) {
      console.log(eligibilityRow(program, result, pad));
    }
    console.log();
  }

  printEligibilitySection(review, pad);
  printEligibilitySection(ineligible, pad);

  if (review.length > 0) {
    console.log(
      pc.dim(
        `  ⚠️  Programs marked "needs review" have requirements that can't be\n` +
          `     auto-determined (e.g. non-commercial use). Review them manually.`,
      ),
    );
    console.log();
  }
};

export const checkCommand = new Command("check")
  .description(
    "Check your project's eligibility for OSS perk programs by fetching live repo data",
  )
  .option(
    "--repo <owner/repo>",
    "explicitly specify a repo (e.g. vercel/next.js)",
  )
  .option(
    "--provider <provider>",
    'git provider to use with --repo: "github", "gitlab", "codeberg", or "gitea"',
    "github",
  )
  .option(
    "-p, --program <slug>",
    "check eligibility for a specific program only (e.g. vercel, sentry)",
  )
  .option("--json", "output results as JSON")
  .action(async (opts: CheckOpts) => {
    let targetProgram: Program | undefined;
    if (opts.program === undefined) {
      targetProgram = undefined;
    } else {
      const resolved = getProgramBySlug(opts.program);
      if (resolved === undefined) {
        const suggestion = closestSlug(opts.program);
        const hint =
          suggestion === null ? "" : ` Did you mean "${suggestion}"?`;
        displayError(`Unknown program slug "${opts.program}".${hint}`);
        process.exit(1);
      }
      targetProgram = resolved;
    }

    const ref = resolveRef(opts);

    if (!ref) {
      displayError(
        "Could not detect a repository.\n" +
          "  Make sure your package.json has a repository field, or use --repo <owner/repo>.",
      );
      process.exit(1);
    }

    if (!opts.json) {
      info(
        `Fetching repo info for ${PROVIDER_HOSTS[ref.provider]}/${ref.path}...`,
      );
    }

    let ctx: RepoContext;
    try {
      ctx = await fetchRepoContext(ref);
    } catch (error) {
      displayError(error instanceof Error ? error.message : String(error));
      process.exit(1);
    }

    const localTree = detectLocalTree();
    ctx = {
      ...ctx,
      dependencies: [
        ...new Set([...ctx.dependencies, ...localTree.dependencies]),
      ],
      filePaths: [
        ...new Set([...(ctx.filePaths ?? []), ...localTree.filePaths]),
      ],
    };

    if (targetProgram) {
      const result = checkEligibility(targetProgram, ctx);

      if (opts.json) {
        console.log(
          JSON.stringify(
            {
              repo: {
                dependencies: ctx.dependencies,
                isFork: ctx.isFork,
                isPrivate: ctx.isPrivate,
                license: ctx.license,
                owner: ctx.owner,
                path: ctx.path,
                provider: ctx.provider,
                repo: ctx.repo,
                stars: ctx.stars,
              },
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

      printRepoSummary(ctx);
      console.log();
      header(`Eligibility for ${targetProgram.name}`);
      console.log();
      const pad = maxSlugLength([targetProgram]);
      console.log(eligibilityRow(targetProgram, result, pad));
      for (const reason of result.reasons.slice(1)) {
        console.log(`  ${" ".repeat(pad + 6)}${pc.dim(`• ${reason}`)}`);
      }
      console.log();
      return;
    }

    const results = checkAllPrograms(programs, ctx);

    if (opts.json) {
      console.log(
        JSON.stringify(
          {
            repo: {
              dependencies: ctx.dependencies,
              isFork: ctx.isFork,
              isPrivate: ctx.isPrivate,
              license: ctx.license,
              owner: ctx.owner,
              path: ctx.path,
              provider: ctx.provider,
              repo: ctx.repo,
              stars: ctx.stars,
            },
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
  });
