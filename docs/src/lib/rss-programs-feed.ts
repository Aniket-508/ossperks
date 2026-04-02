import "server-only";
import { Feed } from "feed";

import { LINK } from "@/constants/links";
import { ROUTES } from "@/constants/routes";
import { SITE } from "@/constants/site";
import type { Locale } from "@/i18n/config";
import { withLocalePrefix } from "@/i18n/navigation";
import { getPrograms } from "@/lib/programs";

/**
 * RSS 2.0 `<language>` uses BCP 47 tags. One feed per locale is the usual pattern
 * for multilingual sites (separate subscriber URLs per language).
 *
 * @see https://www.rssboard.org/rss-specification#ltenclosuregtSubelementOfLtitemgt
 * @see https://www.w3.org/2005/atom/rfc-4287.html (Atom; cross-reference for lang tagging)
 */
const LOCALE_TO_RSS_LANGUAGE: Record<Locale, string> = {
  de: "de",
  en: "en",
  es: "es",
  fr: "fr",
  ja: "ja",
  ko: "ko",
  "pt-BR": "pt-br",
  ru: "ru",
  "zh-CN": "zh-cn",
};

export const buildProgramsRssResponse = async (lang: Locale) => {
  const updated = new Date();
  const feedPath = withLocalePrefix(lang, ROUTES.RSS);
  const feedUrl = `${SITE.URL}${feedPath}`;
  const homePath = withLocalePrefix(lang, ROUTES.HOME);
  const siteLink = `${SITE.URL}${homePath === "/" ? "" : homePath}`;

  const programsList = await getPrograms(lang);
  const sorted = [...programsList].toSorted((a, b) =>
    a.slug.localeCompare(b.slug),
  );

  const feed = new Feed({
    author: {
      link: LINK.GITHUB,
      name: SITE.AUTHOR.NAME,
    },
    copyright: `© ${updated.getFullYear()} ${SITE.AUTHOR.NAME}`,
    description: SITE.DESCRIPTION.LONG,
    favicon: `${SITE.URL}/favicon.ico`,
    feedLinks: {
      rss: feedUrl,
    },
    id: feedUrl,
    image: SITE.OG_IMAGE,
    language: LOCALE_TO_RSS_LANGUAGE[lang],
    link: siteLink,
    title: SITE.NAME,
    updated,
  });

  for (const program of sorted) {
    const path = `${ROUTES.PROGRAMS}/${program.slug}` as `/${string}`;
    const link = `${SITE.URL}${withLocalePrefix(lang, path)}`;

    feed.addItem({
      date: updated,
      description: program.description,
      id: link,
      link,
      title: program.name,
    });
  }

  return new Response(feed.rss2(), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
};
