import type { Category, Contact, Program } from "./schema";

export interface ProgramSummary {
  category: Category;
  description: string;
  name: string;
  perks: Program["perks"];
  provider: string;
  slug: string;
  tags?: string[];
}

export interface PersonWithProgram {
  contact: Contact;
  programSlug: string;
  provider: string;
}

export interface PersonDetail {
  contact: Contact;
  slug: string;
  programs: ProgramSummary[];
}

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
