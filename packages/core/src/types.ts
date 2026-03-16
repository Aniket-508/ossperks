import type { Program } from "./schema";

export interface RepoRef {
  provider: "github" | "gitlab";
  owner: string;
  repo: string;
}

export interface RepoContext {
  provider: "github" | "gitlab";
  owner: string;
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
}

export type EligibilityStatus = "eligible" | "needs-review" | "ineligible";

export interface EligibilityResult {
  status: EligibilityStatus;
  reasons: string[];
}

export interface ProgramEligibility {
  program: Program;
  result: EligibilityResult;
}
