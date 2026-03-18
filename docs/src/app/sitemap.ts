import { programs } from "@ossperks/core";
import type { MetadataRoute } from "next";

import { ROUTES } from "@/constants/routes";
import { SITE } from "@/constants/site";
import { i18n, withLocalePrefix } from "@/lib/i18n";

const staticPaths: `/${string}`[] = [
  ROUTES.HOME,
  ROUTES.ABOUT,
  ROUTES.CHECK,
  ROUTES.PROGRAMS,
  ROUTES.PEOPLE,
  ROUTES.SPONSORS,
];

const buildAlternates = (
  path: `/${string}`
): { languages: Record<string, string> } => {
  const languages: Record<string, string> = {};
  for (const lang of i18n.languages) {
    languages[lang] = `${SITE.URL}${withLocalePrefix(lang, path)}`;
  }
  languages["x-default"] = `${SITE.URL}${path}`;
  return { languages };
};

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const path of staticPaths) {
    entries.push({
      alternates: buildAlternates(path),
      changeFrequency: "weekly" as const,
      lastModified: new Date(),
      priority: path === ROUTES.HOME ? 1 : 0.8,
      url: `${SITE.URL}${path}`,
    });
  }

  for (const program of programs) {
    const path = `${ROUTES.PROGRAMS}/${program.slug}` as `/${string}`;
    entries.push({
      alternates: buildAlternates(path),
      changeFrequency: "weekly" as const,
      lastModified: new Date(),
      priority: 0.7,
      url: `${SITE.URL}${path}`,
    });
  }

  return entries;
}
