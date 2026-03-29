import type { Program } from "@ossperks/data";

export type RepoProvider = "github" | "gitlab" | "codeberg" | "gitea";

export interface RepoRef {
  provider: RepoProvider;
  owner: string;
  path: string;
  repo: string;
}

export interface RepoContext {
  provider: RepoProvider;
  owner: string;
  path: string;
  repo: string;
  name: string;
  stars: number;
  license: string | null;
  isFork: boolean;
  isPrivate: boolean;
  isOrgOwned: boolean;
  pushedAt: Date;
  createdAt: Date;
  topics: string[];
  description: string | null;
  dependencies: string[];
  filePaths?: string[];
}

export interface TreeScanResult {
  dependencies: string[];
  filePaths: string[];
}

export interface GiteaRepoResponse {
  created_at: string;
  description: string;
  fork: boolean;
  internal: boolean;
  name: string;
  owner: { type: string };
  private: boolean;
  stars_count: number;
  topics: string[];
  updated_at: string;
  license: { spdx_id: string } | null;
}

export interface GiteaTreeEntry {
  path?: string;
  type?: string;
}

export interface GiteaTreeResponse {
  tree?: GiteaTreeEntry[];
  truncated?: boolean;
}

export interface GiteaFileContentResponse {
  content?: string;
}

export type EligibilityStatus = "eligible" | "needs-review" | "ineligible";

export type EligibilityReasonCode =
  | "codeOfConduct"
  | "communitySize"
  | "configFileMet"
  | "configFileUnknown"
  | "criteriaUnverifiable"
  | "hostingPlatform"
  | "inactive"
  | "missionAlignment"
  | "noOsiLicense"
  | "nonCommercial"
  | "osiLicense"
  | "permissiveLicense"
  | "popularityThreshold"
  | "procedural"
  | "projectTooNew"
  | "repoFork"
  | "repoPrivate"
  | "requiresGithub"
  | "requiresGitlab"
  | "role"
  | "rule"
  | "starsBelow"
  | "starsMet"
  | "subjective"
  | "techStackMet"
  | "techStackMissing"
  | "techStackUnknown"
  | "usageRestriction";

export interface EligibilityReason {
  code: EligibilityReasonCode;
  message: string;
  params?: Record<string, number | string>;
  ruleIndex?: number;
}

export type RuleResult = "pass" | "fail" | "unknown";

export interface RuleVerdict {
  verdict: RuleResult;
  reason?: EligibilityReason;
}

export interface RuleIntent {
  keywordSets: string[][];
  check: (rule: string, ctx: RepoContext, program: Program) => RuleVerdict;
}

export interface EligibilityResult {
  status: EligibilityStatus;
  reasons: string[];
}

export interface EligibilityResultDetailed {
  status: EligibilityStatus;
  reasons: EligibilityReason[];
}

export interface ProgramEligibility {
  program: Program;
  result: EligibilityResult;
}

export interface ProgramEligibilityDetailed {
  program: Program;
  result: EligibilityResultDetailed;
}
