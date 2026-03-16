import _1password from "./programs/1password.json" with { type: "json" };
import anthropicClaude from "./programs/anthropic-claude.json" with { type: "json" };
import browserstack from "./programs/browserstack.json" with { type: "json" };
import circleci from "./programs/circleci.json" with { type: "json" };
import cloudflare from "./programs/cloudflare.json" with { type: "json" };
import githubCopilot from "./programs/github-copilot.json" with { type: "json" };
import gitlab from "./programs/gitlab.json" with { type: "json" };
import jetbrains from "./programs/jetbrains.json" with { type: "json" };
import netlify from "./programs/netlify.json" with { type: "json" };
import openaiCodex from "./programs/openai-codex.json" with { type: "json" };
import openpanel from "./programs/openpanel.json" with { type: "json" };
import sentry from "./programs/sentry.json" with { type: "json" };
import snyk from "./programs/snyk.json" with { type: "json" };
import vercel from "./programs/vercel.json" with { type: "json" };
import zulip from "./programs/zulip.json" with { type: "json" };
import { programSchema, getPerkType, PERK_TYPES } from "./schema";
import type { Category, Contact, PerkType, Program } from "./schema";

const raw = [
  _1password,
  anthropicClaude,
  browserstack,
  circleci,
  cloudflare,
  githubCopilot,
  gitlab,
  jetbrains,
  netlify,
  openaiCodex,
  openpanel,
  sentry,
  snyk,
  vercel,
  zulip,
];

export const programs: Program[] = raw.map((p) => programSchema.parse(p));

export const getProgramBySlug = (slug: string): Program | undefined =>
  programs.find((p) => p.slug === slug);

export const FEATURED_PROGRAM_SLUGS: string[] = [
  "vercel",
  "github-copilot",
  "sentry",
  "jetbrains",
  "cloudflare",
  "gitlab",
];

export const getFeaturedPrograms = (): Program[] =>
  FEATURED_PROGRAM_SLUGS.map((slug) => getProgramBySlug(slug))
    .filter((p): p is Program => p !== undefined)
    .slice(0, 6);

export const getProgramsByCategory = (category: Category): Program[] =>
  programs.filter((p) => p.category === category);

export const getCategories = (): Category[] =>
  [...new Set(programs.map((p) => p.category))].toSorted();

export interface PersonWithProgram {
  contact: Contact;
  programSlug: string;
  provider: string;
}

export const getPeople = (): PersonWithProgram[] => {
  const seen = new Set<string>();
  const result: PersonWithProgram[] = [];
  for (const program of programs) {
    if (!program.contact) {
      continue;
    }
    const key = program.contact.name.toLowerCase();
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    result.push({
      contact: program.contact,
      programSlug: program.slug,
      provider: program.provider,
    });
  }
  return result;
};

export const getProgramPerkTypes = (program: Program): PerkType[] => [
  ...new Set(program.perks.map((p) => getPerkType(p.title))),
];

export const getAllPerkTypes = (): PerkType[] =>
  Object.values(PERK_TYPES).toSorted();

export { programSchema, type Category, type Program } from "./schema";
export { type Contact, type PerkType } from "./schema";
export { CATEGORY_LABELS, getPerkType, PERK_TYPES } from "./schema";

export { checkEligibility, checkAllPrograms } from "./eligibility";
export { fetchGitHub, fetchGitLab, fetchRepoContext } from "./fetch";
export { parseRepoUrl } from "./parse";
export type {
  EligibilityResult,
  EligibilityStatus,
  ProgramEligibility,
  RepoContext,
  RepoRef,
} from "./types";
