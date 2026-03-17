import _1password from "./programs/1password.json" with { type: "json" };
import algolia from "./programs/algolia.json" with { type: "json" };
import anthropicClaude from "./programs/anthropic-claude.json" with { type: "json" };
import argos from "./programs/argos.json" with { type: "json" };
import atlassian from "./programs/atlassian.json" with { type: "json" };
import blacksmith from "./programs/blacksmith.json" with { type: "json" };
import browserstack from "./programs/browserstack.json" with { type: "json" };
import cal from "./programs/cal.json" with { type: "json" };
import chromatic from "./programs/chromatic.json" with { type: "json" };
import circleci from "./programs/circleci.json" with { type: "json" };
import cloudflare from "./programs/cloudflare.json" with { type: "json" };
import codacy from "./programs/codacy.json" with { type: "json" };
import codeClimate from "./programs/code-climate.json" with { type: "json" };
import codecov from "./programs/codecov.json" with { type: "json" };
import coderabbit from "./programs/coderabbit.json" with { type: "json" };
import convex from "./programs/convex.json" with { type: "json" };
import coveralls from "./programs/coveralls.json" with { type: "json" };
import crowdin from "./programs/crowdin.json" with { type: "json" };
import datadog from "./programs/datadog.json" with { type: "json" };
import deepsource from "./programs/deepsource.json" with { type: "json" };
import digitalocean from "./programs/digitalocean.json" with { type: "json" };
import docker from "./programs/docker.json" with { type: "json" };
import gitbook from "./programs/gitbook.json" with { type: "json" };
import githubCopilot from "./programs/github-copilot.json" with { type: "json" };
import gitlab from "./programs/gitlab.json" with { type: "json" };
import greptile from "./programs/greptile.json" with { type: "json" };
import jetbrains from "./programs/jetbrains.json" with { type: "json" };
import microsoftFossFund from "./programs/microsoft-foss-fund.json" with { type: "json" };
import mintlify from "./programs/mintlify.json" with { type: "json" };
import neon from "./programs/neon.json" with { type: "json" };
import netlify from "./programs/netlify.json" with { type: "json" };
import openaiCodexFund from "./programs/openai-codex-fund.json" with { type: "json" };
import openaiCodex from "./programs/openai-codex.json" with { type: "json" };
import openpanel from "./programs/openpanel.json" with { type: "json" };
import sanity from "./programs/sanity.json" with { type: "json" };
import semaphore from "./programs/semaphore.json" with { type: "json" };
import sentry from "./programs/sentry.json" with { type: "json" };
import signpath from "./programs/signpath.json" with { type: "json" };
import snyk from "./programs/snyk.json" with { type: "json" };
import sonarcloud from "./programs/sonarcloud.json" with { type: "json" };
import sourcery from "./programs/sourcery.json" with { type: "json" };
import upstash from "./programs/upstash.json" with { type: "json" };
import vercel from "./programs/vercel.json" with { type: "json" };
import zulip from "./programs/zulip.json" with { type: "json" };
import { programSchema, getPerkType, PERK_TYPES } from "./schema";
import type { Category, PerkType, Program } from "./schema";
import { formatSlug } from "./slug";
import type { PersonDetail, PersonWithProgram, ProgramSummary } from "./types";

const raw = [
  _1password,
  algolia,
  argos,
  anthropicClaude,
  atlassian,
  blacksmith,
  browserstack,
  cal,
  chromatic,
  circleci,
  cloudflare,
  codacy,
  codeClimate,
  codecov,
  coderabbit,
  convex,
  coveralls,
  crowdin,
  datadog,
  deepsource,
  digitalocean,
  docker,
  gitbook,
  githubCopilot,
  gitlab,
  greptile,
  jetbrains,
  microsoftFossFund,
  mintlify,
  neon,
  netlify,
  openaiCodex,
  openaiCodexFund,
  openpanel,
  sanity,
  semaphore,
  sentry,
  sourcery,
  signpath,
  snyk,
  sonarcloud,
  upstash,
  vercel,
  zulip,
];

export const programs: Program[] = raw.map((p) => programSchema.parse(p));

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
  programs.map((program) => [program.slug, program] as const)
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
  })
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
    (p): p is Program => p !== undefined
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
export { fetchGitHub, fetchGitLab, fetchRepoContext } from "./fetch";
export { parseRepoUrl } from "./parse";
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
  RepoRef,
} from "./types";
