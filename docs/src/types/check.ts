import type { EligibilityReason, EligibilityStatus } from "@ossperks/core";

export enum CheckApiErrorCode {
  InvalidProvider = "invalid-provider",
  MissingParams = "missing-params",
  NotFound = "not-found",
  RateLimit = "rate-limit",
  Upstream = "upstream",
}

export interface CheckApiErrorResponse {
  error?: string;
  errorCode?: CheckApiErrorCode;
}

export interface RepoInfo {
  description: string | null;
  isFork: boolean;
  isPrivate: boolean;
  license: string | null;
  name: string;
  owner: string;
  path: string;
  provider: string;
  pushedAt: string;
  repo: string;
  stars: number;
}

export interface CheckResult {
  name: string;
  perksCount: number;
  reasons: EligibilityReason[];
  slug: string;
  status: EligibilityStatus;
}

export interface TranslatedCheckResult extends Omit<CheckResult, "reasons"> {
  reasons: string[];
}

export interface CheckResponse {
  repo: RepoInfo;
  results: CheckResult[];
}

export interface TranslatedCheckResponse extends Omit<
  CheckResponse,
  "results"
> {
  results: TranslatedCheckResult[];
}

export interface ProgramTranslation {
  eligibility: string[];
  hasEligibilityParity: boolean;
  name: string;
}

export type ProgramTranslationMap = Record<string, ProgramTranslation>;
