import { programs } from "@ossperks/core";
import type { MetadataRoute } from "next";

import { ROUTES } from "@/constants/routes";
import { SITE } from "@/constants/site";
import { i18n, withLocalePrefix } from "@/lib/i18n";

const staticPaths: `/${string}`[] = [
  ROUTES.HOME,
  ROUTES.ABOUT,
  ROUTES.PROGRAMS,
  ROUTES.PEOPLE,
  ROUTES.SPONSORS,
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE.URL;
  const entries: MetadataRoute.Sitemap = [];

  for (const lang of i18n.languages) {
    for (const path of staticPaths) {
      const pathWithLocale = withLocalePrefix(lang, path);
      entries.push({
        changeFrequency: "weekly" as const,
        lastModified: new Date(),
        priority: path === ROUTES.HOME ? 1 : 0.8,
        url: `${baseUrl}${pathWithLocale}`,
      });
    }

    for (const program of programs) {
      const path = `${ROUTES.PROGRAMS}/${program.slug}` as `/${string}`;
      const pathWithLocale = withLocalePrefix(lang, path);
      entries.push({
        changeFrequency: "weekly" as const,
        lastModified: new Date(),
        priority: 0.7,
        url: `${baseUrl}${pathWithLocale}`,
      });
    }
  }

  return entries;
}
