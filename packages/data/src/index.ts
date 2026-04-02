export { rawPrograms } from "./programs.generated";
export {
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
  getProgramBySlug,
  getProgramPerkTypes,
  getProgramsByCategory,
  getProgramsByTag,
  getTagsWithProgramCounts,
  programs,
  type TagWithProgramCount,
} from "./catalog";
export type {
  PersonDetail,
  PersonWithProgram,
  ProgramSummary,
} from "./catalog-types";
export {
  CATEGORY_LABELS,
  PERK_TYPE_LABELS,
  categoryEnum,
  contactSchema,
  getPerkType,
  perkSchema,
  perkTypeEnum,
  programSchema,
} from "./schema";
export type { Category, Contact, Perk, PerkType, Program } from "./schema";
export { formatSlug } from "./slug";
