import type { Program } from "./schema";
import type {
  EligibilityResult,
  ProgramEligibility,
  RepoContext,
} from "./types";

const OSI_PERMISSIVE = new Set([
  "MIT",
  "Apache-2.0",
  "BSD-2-Clause",
  "BSD-3-Clause",
  "ISC",
  "Artistic-2.0",
  "Zlib",
  "BSL-1.0",
  "MIT-0",
  "0BSD",
  "BlueOak-1.0.0",
  "UPL-1.0",
]);

const OSI_COPYLEFT = new Set([
  "GPL-2.0",
  "GPL-2.0-only",
  "GPL-2.0-or-later",
  "GPL-3.0",
  "GPL-3.0-only",
  "GPL-3.0-or-later",
  "AGPL-3.0",
  "AGPL-3.0-only",
  "AGPL-3.0-or-later",
  "LGPL-2.0",
  "LGPL-2.1",
  "LGPL-2.1-only",
  "LGPL-2.1-or-later",
  "LGPL-3.0",
  "LGPL-3.0-only",
  "LGPL-3.0-or-later",
  "MPL-2.0",
  "EUPL-1.1",
  "EUPL-1.2",
  "CDDL-1.0",
  "EPL-1.0",
  "EPL-2.0",
  "OSL-3.0",
]);

const isOsiApproved = (spdx: string | null): boolean =>
  Boolean(spdx && (OSI_PERMISSIVE.has(spdx) || OSI_COPYLEFT.has(spdx)));

const isPermissive = (spdx: string | null): boolean =>
  Boolean(spdx && OSI_PERMISSIVE.has(spdx));

const daysSince = (date: Date): number =>
  Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));

const extractStarThreshold = (text: string): number | null => {
  const patterns = [
    /(\d[\d,]*)\+\s*(?:github\s+)?stars?/i,
    /(\d[\d,]*)\s+(?:github\s+)?stars?/i,
    /at\s+least\s+(\d[\d,]*)\s+stars?/i,
    /minimum\s+of\s+(\d[\d,]*)\s+stars?/i,
  ];
  for (const pattern of patterns) {
    const m = text.match(pattern);
    if (m) {
      return Number.parseInt(m[1].replaceAll(",", ""), 10);
    }
  }
  return null;
};

const extractAgeDays = (text: string): number | null => {
  const dayMatch = text.match(/(\d+)\s+days?\s+old/i);
  if (dayMatch) {
    return Number.parseInt(dayMatch[1], 10);
  }
  const monthMatch = text.match(/(\d+)\s+months?\s+old/i);
  if (monthMatch) {
    return Number.parseInt(monthMatch[1], 10) * 30;
  }
  return null;
};

type RuleResult = "pass" | "fail" | "unknown";
interface RuleVerdict {
  verdict: RuleResult;
  reason?: string;
}

const checkSubjective = (rule: string): RuleVerdict | null => {
  if (
    /non[\s-]?commercial|non[\s-]?profit|not\s+for\s+commercial|solely\s+on\s+a\s+non/i.test(
      rule
    )
  ) {
    return {
      reason: "non-commercial requirement cannot be auto-verified",
      verdict: "unknown",
    };
  }
  if (/hosted\s+on|intend.*host/i.test(rule)) {
    return {
      reason: "hosting platform requirement cannot be auto-verified",
      verdict: "unknown",
    };
  }
  if (/code\s+of\s+conduct/i.test(rule)) {
    return {
      reason: "Code of Conduct cannot be auto-verified",
      verdict: "unknown",
    };
  }
  if (
    /applicant\s+must\s+be|must\s+be\s+a\s+(core|maintainer|owner|contributor)/i.test(
      rule
    )
  ) {
    return {
      reason: "role requirement cannot be auto-verified",
      verdict: "unknown",
    };
  }
  if (/create\s+or\s+access|invite|14[\s-]?day|trial/i.test(rule)) {
    return { reason: "procedural step — apply manually", verdict: "unknown" };
  }
  if (
    /measurable\s+impact|quality|innovation|community\s+impact|stand\s+out|valuable\s+contributions|prioritized\s+based/i.test(
      rule
    )
  ) {
    return {
      reason: "subjective criteria cannot be auto-verified",
      verdict: "unknown",
    };
  }
  if (/welcome\s+open\s+collaboration|open\s+reuse/i.test(rule)) {
    return { reason: "criteria cannot be auto-verified", verdict: "unknown" };
  }
  return null;
};

const checkProvider = (rule: string, ctx: RepoContext): RuleVerdict | null => {
  const lower = rule.toLowerCase();
  if (
    /\bon\s+github\b|github\.com|github\s+repository/i.test(lower) &&
    ctx.provider !== "github"
  ) {
    return { reason: "requires a GitHub repository", verdict: "fail" };
  }
  if (
    /\bon\s+gitlab\b|gitlab\.com|gitlab\s+repository/i.test(lower) &&
    ctx.provider !== "gitlab"
  ) {
    return { reason: "requires a GitLab repository", verdict: "fail" };
  }
  return null;
};

const checkStars = (rule: string, ctx: RepoContext): RuleVerdict | null => {
  if (
    /popularity.*threshold|activity.*threshold|threshold.*popularit/i.test(rule)
  ) {
    return {
      reason: "popularity threshold is determined by the provider",
      verdict: "unknown",
    };
  }
  const threshold = extractStarThreshold(rule);
  if (threshold === null) {
    return null;
  }
  if (ctx.stars < threshold) {
    return {
      reason: `requires ${threshold.toLocaleString()}+ stars (you have ${ctx.stars.toLocaleString()})`,
      verdict: "fail",
    };
  }
  return {
    reason: `${ctx.stars.toLocaleString()} stars meets the ${threshold.toLocaleString()}+ threshold`,
    verdict: "pass",
  };
};

const checkActivity = (rule: string, ctx: RepoContext): RuleVerdict | null => {
  const ageDays = extractAgeDays(rule);
  if (ageDays !== null && daysSince(ctx.createdAt) < ageDays) {
    return {
      reason: `project must be at least ${ageDays} days old (yours is ${daysSince(ctx.createdAt)} days old)`,
      verdict: "fail",
    };
  }
  if (
    /actively\s+maintained|actively\s+developed|active\s+open[\s-]?source|active\s+project/i.test(
      rule
    )
  ) {
    const age = daysSince(ctx.pushedAt);
    return age > 180
      ? {
          reason: `last commit was ${age} days ago (project may be inactive)`,
          verdict: "fail",
        }
      : { verdict: "pass" };
  }
  return null;
};

const checkLicense = (rule: string, ctx: RepoContext): RuleVerdict | null => {
  const label = ctx.license ?? "no detected license";
  if (/permissive\s+(?:open[\s-]?source\s+)?licen[sc]e/i.test(rule)) {
    return isPermissive(ctx.license)
      ? { verdict: "pass" }
      : {
          reason: `requires a permissive license (detected: ${label})`,
          verdict: "fail",
        };
  }
  if (
    /open[\s-]?source\s+licen[sc]e|oss\s+licen[sc]e|recognized\s+licen[sc]e/i.test(
      rule
    )
  ) {
    return isOsiApproved(ctx.license)
      ? { verdict: "pass" }
      : {
          reason: `requires an OSI-approved license (detected: ${label})`,
          verdict: "fail",
        };
  }
  if (
    /open[\s-]?source\s+project|oss\s+project|open[\s-]?source\s+repositor/i.test(
      rule
    )
  ) {
    return isOsiApproved(ctx.license)
      ? { verdict: "pass" }
      : {
          reason: `no OSI-approved license detected (detected: ${label})`,
          verdict: "fail",
        };
  }
  return null;
};

const checkRepoAttrs = (rule: string, ctx: RepoContext): RuleVerdict | null => {
  if (
    /publicly\s+available|public\s+repositor|publicly\s+accessible/i.test(rule)
  ) {
    return ctx.isPrivate
      ? { reason: "repository is private", verdict: "fail" }
      : { verdict: "pass" };
  }
  if (/not\s+a\s+fork|original\s+project/i.test(rule)) {
    return ctx.isFork
      ? { reason: "repository is a fork", verdict: "fail" }
      : { verdict: "pass" };
  }
  if (/dedicated\s+community/i.test(rule)) {
    return {
      reason: "community size cannot be auto-verified",
      verdict: "unknown",
    };
  }
  if (/credits?\s+must\s+be\s+used|used\s+exclusively/i.test(rule)) {
    return {
      reason: "usage restriction cannot be auto-verified",
      verdict: "unknown",
    };
  }
  if (/align\s+with.*mission|project.*mission/i.test(rule)) {
    return {
      reason: "mission alignment cannot be auto-verified",
      verdict: "unknown",
    };
  }
  return null;
};

const matchRule = (rule: string, ctx: RepoContext): RuleVerdict =>
  checkSubjective(rule) ??
  checkProvider(rule, ctx) ??
  checkStars(rule, ctx) ??
  checkActivity(rule, ctx) ??
  checkLicense(rule, ctx) ??
  checkRepoAttrs(rule, ctx) ?? { reason: rule, verdict: "unknown" };

export const checkEligibility = (
  program: Program,
  ctx: RepoContext
): EligibilityResult => {
  const failReasons: string[] = [];
  const unknownReasons: string[] = [];

  for (const rule of program.eligibility) {
    const { verdict, reason } = matchRule(rule, ctx);
    if (verdict === "fail" && reason) {
      failReasons.push(reason);
    } else if (verdict === "unknown" && reason) {
      unknownReasons.push(reason);
    }
  }

  if (failReasons.length > 0) {
    return { reasons: failReasons, status: "ineligible" };
  }
  if (unknownReasons.length > 0) {
    return { reasons: unknownReasons, status: "needs-review" };
  }
  return { reasons: [], status: "eligible" };
};

export const checkAllPrograms = (
  programs: Program[],
  ctx: RepoContext
): ProgramEligibility[] =>
  programs
    .map((program) => ({ program, result: checkEligibility(program, ctx) }))
    .toSorted((a, b) => {
      const order = { eligible: 0, ineligible: 2, "needs-review": 1 };
      return order[a.result.status] - order[b.result.status];
    });
