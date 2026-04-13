export {
  CATEGORY_LABELS,
  FEATURED_PROGRAM_SLUGS,
  getAllPeopleSlugs,
  getAllPerkTypes,
  getAllProgramSlugs,
  getCategories,
  getFeaturedPrograms,
  getPeople,
  getPeopleByProgramSlug,
  getPersonBySlug,
  getPersonSlug,
  getPerkType,
  getProgramBySlug,
  getProgramPerkTypes,
  getProgramsByCategory,
  getProgramsByTag,
  getTagsWithProgramCounts,
  PERK_TYPE_LABELS,
  perkTypeEnum,
  programs,
  programSchema,
  formatSlug,
} from "@ossperks/data";
export type { Category, Contact, PerkType, Program } from "@ossperks/data";
export type {
  PersonDetail,
  PersonWithProgram,
  ProgramSummary,
} from "@ossperks/data";
export type { TagWithProgramCount } from "@ossperks/data";

export {
  checkEligibility,
  checkEligibilityDetailed,
  checkAllPrograms,
  checkAllProgramsDetailed,
} from "./eligibility";
export {
  calculateTimeUnits,
  englishFormatter,
  formatRelativeTime,
  templateFormatter,
  type TimeFormatter,
  type TimeTemplates,
  type TimeUnit,
  type TimeUnitResult,
} from "./date";
export {
  aggregateDependencies,
  extractDependencyNames,
  fetchGitHub,
  fetchGitLab,
  fetchGitea,
  fetchRepoContext,
  MAX_PACKAGE_JSON_FILES,
} from "./fetch";
export { parseRepoUrl, PROVIDER_HOSTS, VALID_PROVIDERS } from "./parse";
export type {
  EligibilityReason,
  EligibilityReasonCode,
  EligibilityResult,
  EligibilityResultDetailed,
  EligibilityStatus,
  ProgramEligibility,
  ProgramEligibilityDetailed,
  RepoContext,
  RepoProvider,
  RepoRef,
} from "./types";
