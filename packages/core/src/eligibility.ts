import spdxLicenseList from "spdx-license-list";

import type { Program } from "./schema";
import type {
  EligibilityReason,
  EligibilityResult,
  EligibilityResultDetailed,
  ProgramEligibility,
  ProgramEligibilityDetailed,
  RepoContext,
} from "./types";

const PERMISSIVE_IDS = new Set(
  [
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
  ].map((id) => id.toLowerCase()),
);

const isOsiApproved = (spdx: string | null): boolean => {
  if (!spdx) {
    return false;
  }
  const entry =
    spdxLicenseList[spdx as keyof typeof spdxLicenseList] ??
    spdxLicenseList[spdx.toUpperCase() as keyof typeof spdxLicenseList];
  return entry?.osiApproved === true;
};

const isPermissive = (spdx: string | null): boolean => {
  if (!spdx) {
    return false;
  }
  return PERMISSIVE_IDS.has(spdx.toLowerCase());
};

const daysSince = (date: Date): number =>
  Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));

const formatCount = (value: number): string => value.toLocaleString("en-US");

type RuleResult = "pass" | "fail" | "unknown";
interface RuleVerdict {
  verdict: RuleResult;
  reason?: EligibilityReason;
}

const makeReason = (
  code: EligibilityReason["code"],
  message: string,
  params?: EligibilityReason["params"],
): EligibilityReason => ({
  code,
  message,
  ...(params ? { params } : {}),
});

const normalizeRule = (text: string): string =>
  text
    .toLowerCase()
    .replaceAll("-", " ")
    .replaceAll(/[^\w\s]/g, " ")
    .replaceAll(/\s+/g, " ")
    .trim();

const containsAll = (text: string, keywords: string[]): boolean =>
  keywords.every((kw) => text.includes(kw));

const matchesAny = (text: string, keywordSets: string[][]): boolean =>
  keywordSets.some((kws) => containsAll(text, kws));

interface RuleIntent {
  keywordSets: string[][];
  check: (rule: string, ctx: RepoContext, program: Program) => RuleVerdict;
}

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
  const monthMatch = text.match(/(\d+)\s+months?\b/i);
  if (monthMatch) {
    return Number.parseInt(monthMatch[1], 10) * 30;
  }
  return null;
};

const INTENTS: RuleIntent[] = [
  {
    check: (_, ctx) => {
      const label = ctx.license ?? "no detected license";
      return isPermissive(ctx.license)
        ? { verdict: "pass" }
        : {
            reason: makeReason(
              "permissiveLicense",
              `Requires a permissive license (detected: ${label})`,
              { license: label },
            ),
            verdict: "fail",
          };
    },
    keywordSets: [["permissive", "license"]],
  },

  {
    check: (_, ctx) => {
      const label = ctx.license ?? "no detected license";
      return isOsiApproved(ctx.license)
        ? { verdict: "pass" }
        : {
            reason: makeReason(
              "osiLicense",
              `Requires an OSI-approved license (detected: ${label})`,
              { license: label },
            ),
            verdict: "fail",
          };
    },
    keywordSets: [
      ["open", "source", "license"],
      ["oss", "license"],
      ["recognized", "license"],
      ["approved", "license", "open", "source"],
      ["osi", "approved"],
      ["osi", "definition"],
      ["osi", "license"],
    ],
  },

  {
    check: (_, ctx) => {
      const label = ctx.license ?? "no detected license";
      return isOsiApproved(ctx.license)
        ? { verdict: "pass" }
        : {
            reason: makeReason(
              "noOsiLicense",
              `No OSI-approved license detected (detected: ${label})`,
              { license: label },
            ),
            verdict: "fail",
          };
    },
    keywordSets: [
      ["open", "source", "project"],
      ["open", "source", "must"],
      ["must", "be", "open", "source"],
      ["definition", "open", "source"],
      ["fully", "open", "source"],
      ["foss"],
      ["open", "source", "repositor"],
      ["oss", "project"],
    ],
  },

  {
    check: (_, ctx) =>
      ctx.isPrivate
        ? {
            reason: makeReason("repoPrivate", "Repository is private"),
            verdict: "fail",
          }
        : { verdict: "pass" },
    keywordSets: [
      ["public", "repository"],
      ["publicly", "available"],
      ["publicly", "accessible"],
      ["public", "on", "github"],
      ["public", "on", "gitlab"],
      ["public", "on", "bitbucket"],
      ["source", "code", "publicly"],
      ["repository", "must", "be", "public"],
      ["repo", "must", "be", "public"],
      ["public", "codebase"],
    ],
  },

  {
    check: (_, ctx) =>
      ctx.isFork
        ? {
            reason: makeReason("repoFork", "Repository is a fork"),
            verdict: "fail",
          }
        : { verdict: "pass" },
    keywordSets: [
      ["not", "a", "fork"],
      ["original", "project"],
    ],
  },

  {
    check: (rule, ctx) => {
      if (!/\bgithub\b/i.test(rule)) {
        return { verdict: "pass" };
      }
      const wantsGitlab = /\bgitlab\b/i.test(rule);
      if (
        ctx.provider === "github" ||
        (wantsGitlab && ctx.provider === "gitlab")
      ) {
        return { verdict: "pass" };
      }
      if (wantsGitlab) {
        return { verdict: "pass" };
      }
      return {
        reason: makeReason("requiresGithub", "Requires a GitHub repository"),
        verdict: "fail",
      };
    },
    keywordSets: [["github"]],
  },

  {
    check: (rule, ctx) => {
      if (
        /popularity.*threshold|activity.*threshold|threshold.*popularit/i.test(
          rule,
        )
      ) {
        return {
          reason: makeReason(
            "popularityThreshold",
            "Popularity threshold is determined by the provider",
          ),
          verdict: "unknown",
        };
      }
      const threshold = extractStarThreshold(rule);
      if (threshold === null) {
        return { verdict: "pass" };
      }
      const hasAlternativeThresholds =
        /\bor\b/i.test(rule) &&
        /(downloads|contributors?|installs?)/i.test(rule);
      if (hasAlternativeThresholds && ctx.stars < threshold) {
        return {
          reason: makeReason(
            "popularityThreshold",
            "Eligibility may also depend on downloads or contributors",
          ),
          verdict: "unknown",
        };
      }
      if (ctx.stars < threshold) {
        return {
          reason: makeReason(
            "starsBelow",
            `Requires ${formatCount(threshold)}+ stars (you have ${formatCount(ctx.stars)})`,
            { current: ctx.stars, threshold },
          ),
          verdict: "fail",
        };
      }
      return {
        reason: makeReason(
          "starsMet",
          `${formatCount(ctx.stars)} stars meets the ${formatCount(threshold)}+ threshold`,
          { current: ctx.stars, threshold },
        ),
        verdict: "pass",
      };
    },
    keywordSets: [
      ["stars"],
      ["popularity", "threshold"],
      ["activity", "threshold"],
    ],
  },

  {
    check: (_, ctx) => {
      const age = daysSince(ctx.pushedAt);
      return age > 180
        ? {
            reason: makeReason(
              "inactive",
              `Last commit was ${age} days ago (project may be inactive)`,
              { days: age },
            ),
            verdict: "fail",
          }
        : { verdict: "pass" };
    },
    keywordSets: [
      ["actively", "maintained"],
      ["actively", "developed"],
      ["active", "open", "source"],
      ["active", "project"],
      ["active", "development"],
    ],
  },

  {
    check: (rule, ctx) => {
      const ageDays = extractAgeDays(rule);
      if (ageDays === null) {
        return { verdict: "pass" };
      }
      const current = daysSince(ctx.createdAt);
      if (current < ageDays) {
        return {
          reason: makeReason(
            "projectTooNew",
            `Project must be at least ${ageDays} days old (yours is ${current} days old)`,
            { current, required: ageDays },
          ),
          verdict: "fail",
        };
      }
      return { verdict: "pass" };
    },
    keywordSets: [["days", "old"], ["months"]],
  },

  {
    check: (_, _ctx, program) => {
      if (program.configFiles && program.configFiles.length > 0) {
        return { verdict: "pass" };
      }
      return {
        reason: makeReason(
          "hostingPlatform",
          "Hosting platform requirement cannot be auto-verified",
        ),
        verdict: "unknown",
      };
    },
    keywordSets: [
      ["hosted", "on"],
      ["host", "on"],
      ["intend", "host"],
    ],
  },

  {
    check: () => ({
      reason: makeReason(
        "nonCommercial",
        "Non-commercial requirement cannot be auto-verified",
      ),
      verdict: "unknown",
    }),
    keywordSets: [
      ["non", "commercial"],
      ["non", "profit"],
      ["not", "commercial"],
      ["not", "for", "commercial"],
      ["commercialization"],
    ],
  },

  {
    check: () => ({
      reason: makeReason(
        "codeOfConduct",
        "Code of Conduct cannot be auto-verified",
      ),
      verdict: "unknown",
    }),
    keywordSets: [["code", "of", "conduct"]],
  },

  {
    check: () => ({
      reason: makeReason("role", "Role requirement cannot be auto-verified"),
      verdict: "unknown",
    }),
    keywordSets: [
      ["maintainer"],
      ["core", "contributor"],
      ["project", "owner"],
      ["project", "lead"],
      ["applicant", "must", "be"],
    ],
  },

  {
    check: () => ({
      reason: makeReason("procedural", "Procedural step — apply manually"),
      verdict: "unknown",
    }),
    keywordSets: [
      ["create", "account"],
      ["create", "or", "access"],
      ["14", "day"],
      ["trial"],
    ],
  },

  {
    check: () => ({
      reason: makeReason(
        "subjective",
        "Subjective criteria cannot be auto-verified",
      ),
      verdict: "unknown",
    }),
    keywordSets: [
      ["measurable", "impact"],
      ["growth", "potential"],
      ["quality"],
      ["innovation"],
      ["community", "impact"],
      ["stand", "out"],
      ["valuable", "contributions"],
      ["prioritized", "based"],
    ],
  },

  {
    check: () => ({
      reason: makeReason(
        "communitySize",
        "Community size cannot be auto-verified",
      ),
      verdict: "unknown",
    }),
    keywordSets: [
      ["dedicated", "community"],
      ["active", "community"],
    ],
  },

  {
    check: () => ({
      reason: makeReason(
        "usageRestriction",
        "Usage restriction cannot be auto-verified",
      ),
      verdict: "unknown",
    }),
    keywordSets: [
      ["credits", "must", "be", "used"],
      ["used", "exclusively"],
    ],
  },

  {
    check: () => ({
      reason: makeReason(
        "missionAlignment",
        "Mission alignment cannot be auto-verified",
      ),
      verdict: "unknown",
    }),
    keywordSets: [
      ["align", "mission"],
      ["project", "mission"],
    ],
  },

  {
    check: () => ({
      reason: makeReason(
        "criteriaUnverifiable",
        "Criteria cannot be auto-verified",
      ),
      verdict: "unknown",
    }),
    keywordSets: [
      ["welcome", "open", "collaboration"],
      ["open", "reuse"],
    ],
  },
];

const checkProvider = (rule: string, ctx: RepoContext): RuleVerdict | null => {
  const providers = new Set<RepoContext["provider"]>();
  if (/\bgithub\b|github\.com/i.test(rule)) {
    providers.add("github");
  }
  if (/\bgitlab\b|gitlab\.com/i.test(rule)) {
    providers.add("gitlab");
  }
  if (providers.size === 0) {
    return null;
  }
  if (providers.has(ctx.provider)) {
    return { verdict: "pass" };
  }
  if (providers.size === 1 && providers.has("github")) {
    return {
      reason: makeReason("requiresGithub", "Requires a GitHub repository"),
      verdict: "fail",
    };
  }
  if (providers.size === 1 && providers.has("gitlab")) {
    return {
      reason: makeReason("requiresGitlab", "Requires a GitLab repository"),
      verdict: "fail",
    };
  }
  return null;
};

const matchRule = (
  rule: string,
  ctx: RepoContext,
  program: Program,
): RuleVerdict | null => {
  const normalized = normalizeRule(rule);
  const verdicts: RuleVerdict[] = [];

  const providerVerdict = checkProvider(rule, ctx);
  if (providerVerdict) {
    verdicts.push(providerVerdict);
  }

  for (const intent of INTENTS) {
    if (matchesAny(normalized, intent.keywordSets)) {
      verdicts.push(intent.check(rule, ctx, program));
    }
  }

  const failVerdict = verdicts.find((v) => v.verdict === "fail");
  if (failVerdict) {
    return failVerdict;
  }

  const unknownVerdict = verdicts.find((v) => v.verdict === "unknown");
  if (unknownVerdict) {
    return unknownVerdict;
  }

  return verdicts.find((v) => v.verdict === "pass") ?? null;
};

const checkTechStack = (
  program: Program,
  ctx: RepoContext,
): RuleVerdict | null => {
  if (!program.techPackages || program.techPackages.length === 0) {
    return null;
  }
  if (ctx.dependencies.length === 0) {
    return {
      reason: makeReason(
        "techStackUnknown",
        `Could not detect project dependencies (requires ${program.techPackages.join(" or ")})`,
      ),
      verdict: "unknown",
    };
  }
  const depSet = new Set(ctx.dependencies);
  const matched = program.techPackages.find((pkg) => depSet.has(pkg));
  if (matched) {
    return {
      reason: makeReason(
        "techStackMet",
        `Technology dependency detected (${matched})`,
        { matched },
      ),
      verdict: "pass",
    };
  }
  return {
    reason: makeReason(
      "techStackMissing",
      `No matching technology dependency found in package.json (requires ${program.techPackages.join(" or ")})`,
    ),
    verdict: "fail",
  };
};

const checkConfigFiles = (
  program: Program,
  ctx: RepoContext,
): RuleVerdict | null => {
  if (!program.configFiles || program.configFiles.length === 0) {
    return null;
  }
  const paths = ctx.filePaths ?? [];
  if (paths.length === 0) {
    return {
      reason: makeReason(
        "configFileUnknown",
        `Could not detect project files (looking for ${program.configFiles.join(" or ")})`,
      ),
      verdict: "unknown",
    };
  }
  const matched = program.configFiles.find((cf) =>
    paths.some((fp) => fp === cf || fp.endsWith(`/${cf}`)),
  );
  if (matched) {
    return {
      reason: makeReason("configFileMet", `Config file detected (${matched})`, {
        matched,
      }),
      verdict: "pass",
    };
  }
  return {
    reason: makeReason(
      "configFileUnknown",
      `No config file found (looking for ${program.configFiles.join(" or ")})`,
    ),
    verdict: "unknown",
  };
};

const collectVerdict = (
  verdict: RuleVerdict | null,
  failReasons: EligibilityReason[],
  unknownReasons: EligibilityReason[],
  ruleIndex?: number,
): void => {
  if (!verdict?.reason) {
    return;
  }
  const reason =
    ruleIndex !== undefined && verdict.reason.code !== "rule"
      ? { ...verdict.reason, ruleIndex }
      : verdict.reason;
  if (verdict.verdict === "fail") {
    failReasons.push(reason);
  } else if (verdict.verdict === "unknown") {
    unknownReasons.push(reason);
  }
};

export const checkEligibilityDetailed = (
  program: Program,
  ctx: RepoContext,
): EligibilityResultDetailed => {
  const failReasons: EligibilityReason[] = [];
  const unknownReasons: EligibilityReason[] = [];

  collectVerdict(checkTechStack(program, ctx), failReasons, unknownReasons);
  collectVerdict(checkConfigFiles(program, ctx), failReasons, unknownReasons);

  for (const [ruleIndex, rule] of program.eligibility.entries()) {
    const verdict = matchRule(rule, ctx, program) ?? {
      reason: {
        code: "rule" as const,
        message: rule,
        ruleIndex,
      },
      verdict: "unknown" as const,
    };
    collectVerdict(verdict, failReasons, unknownReasons, ruleIndex);
  }

  if (failReasons.length > 0) {
    return { reasons: failReasons, status: "ineligible" };
  }
  if (unknownReasons.length > 0) {
    return { reasons: unknownReasons, status: "needs-review" };
  }
  return { reasons: [], status: "eligible" };
};

export const checkEligibility = (
  program: Program,
  ctx: RepoContext,
): EligibilityResult => {
  const detailed = checkEligibilityDetailed(program, ctx);
  return {
    reasons: detailed.reasons.map((reason) => reason.message),
    status: detailed.status,
  };
};

export const checkAllProgramsDetailed = (
  programs: Program[],
  ctx: RepoContext,
): ProgramEligibilityDetailed[] =>
  programs
    .map((program) => ({
      program,
      result: checkEligibilityDetailed(program, ctx),
    }))
    .toSorted((a, b) => {
      const order = { eligible: 0, ineligible: 2, "needs-review": 1 };
      return order[a.result.status] - order[b.result.status];
    });

export const checkAllPrograms = (
  programs: Program[],
  ctx: RepoContext,
): ProgramEligibility[] =>
  programs
    .map((program) => ({ program, result: checkEligibility(program, ctx) }))
    .toSorted((a, b) => {
      const order = { eligible: 0, ineligible: 2, "needs-review": 1 };
      return order[a.result.status] - order[b.result.status];
    });
