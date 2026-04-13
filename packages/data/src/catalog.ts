import type {
  PersonDetail,
  PersonWithProgram,
  ProgramSummary,
} from "./catalog-types";
import { rawPrograms } from "./programs.generated";
import { getPerkType, perkTypeEnum, programSchema } from "./schema";
import type { Category, PerkType, Program } from "./schema";
import { formatSlug } from "./slug";

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
    programSlug: person.programs[0]?.slug,
    provider: person.programs[0]?.provider,
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

export const getPeopleByProgramSlug = (programSlug: string): PersonDetail[] =>
  [...peopleBySlug.values()].filter((person) =>
    person.programs.some((p) => p.slug === programSlug),
  );

export const getProgramPerkTypes = (program: Program): PerkType[] => [
  ...new Set(program.perks.map((p) => getPerkType(p.title))),
];

export const getAllPerkTypes = (): PerkType[] =>
  [...perkTypeEnum.options].toSorted();

export interface TagWithProgramCount {
  count: number;
  tag: string;
}

/** All distinct tags with how many programs reference each (stable sort by tag name). */
export const getTagsWithProgramCounts = (): TagWithProgramCount[] => {
  const counts = new Map<string, number>();
  for (const program of programs) {
    for (const tag of program.tags ?? []) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ count, tag }))
    .toSorted((a, b) => a.tag.localeCompare(b.tag));
};

/** Programs that include this exact tag string in `tags`. */
export const getProgramsByTag = (tag: string): Program[] => {
  const normalized = tag.trim();
  if (!normalized) {
    return [];
  }
  return programs.filter((p) => p.tags?.includes(normalized));
};
