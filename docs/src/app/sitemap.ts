import {
  getCategories,
  getPeople,
  getPersonSlug,
  getTagsWithProgramCounts,
  programs,
} from "@ossperks/core";
import type { MetadataRoute } from "next";

import { ROUTES } from "@/constants/routes";
import { SITE } from "@/constants/site";
import { i18n } from "@/i18n/config";
import { withLocalePrefix } from "@/i18n/navigation";
import { cliSource } from "@/lib/source";
import { encodeTagForPath } from "@/lib/tag-path";

type ChangeFrequency = MetadataRoute.Sitemap[number]["changeFrequency"];

const STATIC_PATHS: {
  changeFrequency: ChangeFrequency;
  path: `/${string}`;
  priority: number;
}[] = [
  { changeFrequency: "daily", path: ROUTES.HOME, priority: 1 },
  { changeFrequency: "monthly", path: ROUTES.ABOUT, priority: 0.5 },
  { changeFrequency: "weekly", path: ROUTES.CHECK, priority: 0.7 },
  { changeFrequency: "weekly", path: ROUTES.PROGRAMS, priority: 0.9 },
  { changeFrequency: "weekly", path: ROUTES.CATEGORIES, priority: 0.85 },
  { changeFrequency: "weekly", path: ROUTES.TAGS, priority: 0.85 },
  { changeFrequency: "monthly", path: ROUTES.SUBMIT_PROGRAM, priority: 0.6 },
  { changeFrequency: "weekly", path: ROUTES.PEOPLE, priority: 0.7 },
  { changeFrequency: "monthly", path: ROUTES.SPONSORS, priority: 0.5 },
  { changeFrequency: "weekly", path: ROUTES.CLI, priority: 0.9 },
];

const buildAlternates = (
  path: `/${string}`,
): { languages: Record<string, string> } => {
  const languages: Record<string, string> = {};
  for (const lang of i18n.languages) {
    languages[lang] = `${SITE.URL}${withLocalePrefix(lang, path)}`;
  }
  languages["x-default"] = `${SITE.URL}${path}`;
  return { languages };
};

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const { changeFrequency, path, priority } of STATIC_PATHS) {
    entries.push({
      alternates: buildAlternates(path),
      changeFrequency,
      lastModified,
      priority,
      url: `${SITE.URL}${withLocalePrefix(i18n.defaultLanguage, path)}`,
    });
  }

  for (const program of programs) {
    const path = `${ROUTES.PROGRAMS}/${program.slug}` as `/${string}`;
    entries.push({
      alternates: buildAlternates(path),
      changeFrequency: "weekly" as const,
      lastModified,
      priority: 0.8,
      url: `${SITE.URL}${withLocalePrefix(i18n.defaultLanguage, path)}`,
    });

    const checkPath =
      `${ROUTES.PROGRAMS}/${program.slug}/check` as `/${string}`;
    entries.push({
      alternates: buildAlternates(checkPath),
      changeFrequency: "weekly" as const,
      lastModified,
      priority: 0.7,
      url: `${SITE.URL}${withLocalePrefix(i18n.defaultLanguage, checkPath)}`,
    });
  }

  const cliSlugs = [
    ...new Map(
      cliSource
        .getPages()
        .filter((page) => page.locale === i18n.defaultLanguage)
        .map((page) => {
          const slugs = page.slugs ?? [];
          return [slugs.join("/"), slugs] as const;
        }),
    ).values(),
  ];

  for (const slugs of cliSlugs) {
    const path =
      `${ROUTES.CLI}${slugs.length > 0 ? `/${slugs.join("/")}` : ""}` as `/${string}`;
    entries.push({
      alternates: buildAlternates(path),
      changeFrequency: "weekly" as const,
      lastModified,
      priority: 0.8,
      url: `${SITE.URL}${withLocalePrefix(i18n.defaultLanguage, path)}`,
    });
  }

  for (const category of getCategories()) {
    const path = `${ROUTES.CATEGORIES}/${category}` as `/${string}`;
    entries.push({
      alternates: buildAlternates(path),
      changeFrequency: "weekly" as const,
      lastModified,
      priority: 0.8,
      url: `${SITE.URL}${withLocalePrefix(i18n.defaultLanguage, path)}`,
    });
  }

  for (const { tag } of getTagsWithProgramCounts()) {
    const path = `${ROUTES.TAGS}/${encodeTagForPath(tag)}` as `/${string}`;
    entries.push({
      alternates: buildAlternates(path),
      changeFrequency: "weekly" as const,
      lastModified,
      priority: 0.75,
      url: `${SITE.URL}${withLocalePrefix(i18n.defaultLanguage, path)}`,
    });
  }

  for (const person of getPeople()) {
    const path =
      `${ROUTES.PEOPLE}/${getPersonSlug(person.contact.name)}` as `/${string}`;
    entries.push({
      alternates: buildAlternates(path),
      changeFrequency: "monthly" as const,
      lastModified,
      priority: 0.5,
      url: `${SITE.URL}${withLocalePrefix(i18n.defaultLanguage, path)}`,
    });
  }

  return entries;
}
