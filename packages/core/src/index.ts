import { rawPrograms } from "./programs.generated";
import { programSchema, getPerkType, PERK_TYPES } from "./schema";
import type { Category, PerkType, Program } from "./schema";
import { formatSlug } from "./slug";
import type { PersonDetail, PersonWithProgram, ProgramSummary } from "./types";

export const programs: Program[] = rawPrograms.map((p) =>
  programSchema.parse(p),
);

const toProgramSummary = (program: Program): ProgramSummary => ({
  category: program.category,
  description: program.description,
  name: program.name,
  perks: program.perks,
  provider: program.provider,
  slug: program.slug,
  tags: program.tags,
});

const programsBySlug = new Map(
  programs.map((program) => [program.slug, program] as const),
);

const peopleBySlug = new Map<string, PersonDetail>();
for (const program of programs) {
  if (!program.contact) {
    continue;
  }
  const slug = formatSlug(program.contact.name);
  const existing = peopleBySlug.get(slug);
  if (existing) {
    existing.programs.push(toProgramSummary(program));
    continue;
  }
  peopleBySlug.set(slug, {
    contact: program.contact,
    programs: [toProgramSummary(program)],
    slug,
  });
}

const people: PersonWithProgram[] = Array.from(
  peopleBySlug.values(),
  (person) => ({
    contact: person.contact,
    programSlug: person.programs[0]?.slug ?? "",
    provider: person.programs[0]?.provider ?? "",
  }),
);

export const getProgramBySlug = (slug: string): Program | undefined =>
  programsBySlug.get(slug);

export const getAllProgramSlugs = (): string[] => [...programsBySlug.keys()];

export const FEATURED_PROGRAM_SLUGS: string[] = [
  "vercel",
  "github-copilot",
  "sentry",
  "jetbrains",
  "cloudflare",
  "gitlab",
];

export const getFeaturedPrograms = (): Program[] =>
  FEATURED_PROGRAM_SLUGS.map((slug) => getProgramBySlug(slug)).filter(
    (p): p is Program => p !== undefined,
  );

export const getProgramsByCategory = (category: Category): Program[] =>
  programs.filter((p) => p.category === category);

export const getCategories = (): Category[] =>
  [...new Set(programs.map((p) => p.category))].toSorted();

export const getPersonSlug = (name: string): string => formatSlug(name);

export const getPeople = (): PersonWithProgram[] => people;

export const getPersonBySlug = (slug: string): PersonDetail | undefined => {
  const normalizedSlug = formatSlug(slug);
  return peopleBySlug.get(normalizedSlug);
};

export const getAllPeopleSlugs = (): string[] => [...peopleBySlug.keys()];

export const getProgramPerkTypes = (program: Program): PerkType[] => [
  ...new Set(program.perks.map((p) => getPerkType(p.title))),
];

export const getAllPerkTypes = (): PerkType[] =>
  Object.values(PERK_TYPES).toSorted();

export { programSchema, type Category, type Program } from "./schema";
export { type Contact, type PerkType } from "./schema";
export { CATEGORY_LABELS, getPerkType, PERK_TYPES } from "./schema";

export {
  checkEligibility,
  checkEligibilityDetailed,
  checkAllPrograms,
  checkAllProgramsDetailed,
} from "./eligibility";
export {
  aggregateDependencies,
  extractDependencyNames,
  fetchGitHub,
  fetchGitLab,
  fetchGitea,
  fetchRepoContext,
} from "./fetch";
export { parseRepoUrl, PROVIDER_HOSTS, VALID_PROVIDERS } from "./parse";
export { formatSlug } from "./slug";
export type {
  EligibilityReason,
  EligibilityReasonCode,
  EligibilityResult,
  EligibilityResultDetailed,
  EligibilityStatus,
  PersonDetail,
  PersonWithProgram,
  ProgramEligibility,
  ProgramEligibilityDetailed,
  ProgramSummary,
  RepoContext,
  RepoProvider,
  RepoRef,
} from "./types";
