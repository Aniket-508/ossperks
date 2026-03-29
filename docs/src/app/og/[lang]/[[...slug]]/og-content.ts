import type { Category } from "@ossperks/core";
import {
  getProgramBySlug,
  getProgramsByCategory,
  getProgramsByTag,
  getPersonBySlug,
  getTagsWithProgramCounts,
  programs,
} from "@ossperks/core";

import { formatProgramsCategoryIntro } from "@/i18n/format-programs-category-intro";
import type { Translations } from "@/i18n/get-t";
import { cliSource, programsSource } from "@/lib/source";

export type OgContext =
  | { type: "home" }
  | { type: "about" }
  | { type: "programs" }
  | { type: "program"; slug: string }
  | { type: "category"; category: string }
  | { type: "categories-index" }
  | { type: "tags-index" }
  | { type: "tag"; tag: string }
  | { type: "person"; personSlug: string }
  | { type: "submit" }
  | { type: "people" }
  | { type: "sponsors" }
  | { slugs: string[]; type: "cli" };

interface OgText {
  description: string;
  title: string;
}

const ogHome = (t: Translations): OgText => ({
  description: t.home.description,
  title: t.home.heading,
});

const ogAbout = (t: Translations): OgText => ({
  description: t.about.intro,
  title: t.about.heading,
});

const ogProgramsListing = (t: Translations): OgText => ({
  description: t.programs.listing.intro.replace(
    "{count}",
    String(programs.length),
  ),
  title: t.programs.listing.heading,
});

const ogProgram = (t: Translations, lang: string, slug: string): OgText => {
  const program = getProgramBySlug(slug);
  if (!program) {
    return { description: "", title: "" };
  }
  const page = programsSource.getPage([program.slug], lang);
  return {
    description: page?.data.description ?? program.description,
    title: program.name,
  };
};

const ogCategory = (
  t: Translations,
  lang: string,
  category: string,
): OgText => {
  const categoryLabel =
    t.common.categories[category as keyof typeof t.common.categories] ??
    category;
  const count = getProgramsByCategory(category as Category).length;
  return {
    description: formatProgramsCategoryIntro(
      t.programs.category.intro,
      count,
      categoryLabel,
      lang,
    ),
    title: t.programs.category.heading.replace("{category}", categoryLabel),
  };
};

const ogCategoriesIndex = (t: Translations): OgText => ({
  description: t.categories.listing.intro,
  title: t.categories.listing.heading,
});

const ogTagsIndex = (t: Translations): OgText => {
  const allTags = getTagsWithProgramCounts();
  return {
    description: t.tags.browse.intro.replace("{count}", String(allTags.length)),
    title: t.tags.browse.heading,
  };
};

const ogTag = (t: Translations, tag: string): OgText => {
  const count = getProgramsByTag(tag).length;
  return {
    description: t.tags.detail.intro.replace("{count}", String(count)),
    title: `${tag} — ${t.tags.detail.titleSuffix}`,
  };
};

const ogPerson = (personSlug: string): OgText => {
  const person = getPersonBySlug(personSlug);
  if (!person) {
    return { description: "", title: "" };
  }
  const primaryProvider = person.programs[0]?.provider ?? "";
  const roleDesc = person.contact.role
    ? `${person.contact.role} at ${primaryProvider}`
    : primaryProvider;
  const programNames = person.programs.map((p) => p.name).join(", ");
  const description = programNames
    ? `${person.contact.name} is ${roleDesc}. Contact for ${programNames} on OSS Perks.`
    : `${person.contact.name} — ${roleDesc}`;
  return {
    description,
    title: person.contact.name,
  };
};

const ogSubmit = (t: Translations): OgText => ({
  description: t.programs.submit.description,
  title: t.programs.submit.heading,
});

const ogPeople = (t: Translations): OgText => ({
  description: t.people.description,
  title: t.people.heading,
});

const ogSponsors = (t: Translations): OgText => ({
  description: t.sponsors.intro,
  title: t.sponsors.heading,
});

const ogCli = (lang: string, slugs: string[]): OgText => {
  const page = cliSource.getPage(slugs, lang);
  if (!page) {
    return { description: "", title: "" };
  }
  return {
    description: page.data.description ?? "",
    title: page.data.title ?? "",
  };
};

export const buildOgContent = (
  t: Translations,
  lang: string,
  context: OgContext,
): OgText => {
  if (context.type === "home") {
    return ogHome(t);
  }
  if (context.type === "about") {
    return ogAbout(t);
  }
  if (context.type === "programs") {
    return ogProgramsListing(t);
  }
  if (context.type === "program") {
    return ogProgram(t, lang, context.slug);
  }
  if (context.type === "category") {
    return ogCategory(t, lang, context.category);
  }
  if (context.type === "categories-index") {
    return ogCategoriesIndex(t);
  }
  if (context.type === "tags-index") {
    return ogTagsIndex(t);
  }
  if (context.type === "tag") {
    return ogTag(t, context.tag);
  }
  if (context.type === "person") {
    return ogPerson(context.personSlug);
  }
  if (context.type === "submit") {
    return ogSubmit(t);
  }
  if (context.type === "people") {
    return ogPeople(t);
  }
  if (context.type === "sponsors") {
    return ogSponsors(t);
  }
  if (context.type === "cli") {
    return ogCli(lang, context.slugs);
  }
  const _: never = context;
  return { description: "", title: "" };
};
