import type { Metadata } from "next";

import { LINK } from "@/constants/links";
import { SITE } from "@/constants/site";
import { i18n, withLocalePrefix } from "@/lib/i18n";

const ogLocaleMap: Record<string, string> = {
  de: "de_DE",
  en: "en_US",
  es: "es_ES",
  fr: "fr_FR",
  ja: "ja_JP",
  ko: "ko_KR",
  "pt-BR": "pt_BR",
  ru: "ru_RU",
  "zh-CN": "zh_CN",
};

const toOgLocale = (lang: string): string => ogLocaleMap[lang] ?? "en_US";

const buildAlternates = (lang: string, path: `/${string}`) => {
  const canonical = withLocalePrefix(lang, path);
  const languages: Record<string, string> = Object.fromEntries(
    i18n.languages.map((locale) => [locale, withLocalePrefix(locale, path)])
  );
  languages["x-default"] = withLocalePrefix(i18n.defaultLanguage, path);
  return { canonical, languages };
};

interface CreateMetadataOptions {
  description: string;
  lang: string;
  noIndex?: boolean;
  ogDescription?: string;
  ogImage?: string;
  ogImageAlt?: string;
  ogTitle?: string;
  ogType?: "article" | "website";
  path: `/${string}`;
  title: string;
}

export const createMetadata = (options: CreateMetadataOptions): Metadata => {
  const {
    description,
    lang,
    noIndex = false,
    ogDescription,
    ogImage,
    ogImageAlt,
    ogTitle,
    ogType = "website",
    path,
    title,
  } = options;

  const alternates = buildAlternates(lang, path);
  const resolvedOgImage = ogImage ?? `/og/${lang}${path === "/" ? "" : path}`;
  const resolvedTitle = ogTitle ?? title;

  return {
    alternates,
    description,
    openGraph: {
      description: ogDescription ?? description,
      images: [
        {
          alt: ogImageAlt ?? resolvedTitle,
          height: 630,
          url: resolvedOgImage,
          width: 1200,
        },
      ],
      locale: toOgLocale(lang),
      siteName: SITE.NAME,
      title: resolvedTitle,
      type: ogType,
      url: `${SITE.URL}${alternates.canonical}`,
    },
    title,
    twitter: {
      card: "summary_large_image",
      creator: SITE.AUTHOR.TWITTER,
      description: ogDescription ?? description,
      images: [resolvedOgImage],
      site: SITE.AUTHOR.TWITTER,
      title: resolvedTitle,
    },
    ...(noIndex && {
      robots: {
        follow: false,
        index: false,
      },
    }),
  };
};

export const baseMetadata: Metadata = {
  alternates: {
    canonical: "/",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: SITE.NAME,
  },
  applicationName: SITE.NAME,
  authors: [{ name: SITE.AUTHOR.NAME, url: LINK.GITHUB }],
  category: "technology",
  creator: SITE.AUTHOR.NAME,
  description: SITE.DESCRIPTION.LONG,
  keywords: [...SITE.KEYWORDS],
  metadataBase: new URL(SITE.URL),
  openGraph: {
    description: SITE.DESCRIPTION.SHORT,
    images: [
      {
        alt: `${SITE.NAME} - open-source perks and eligibility checker`,
        height: 630,
        url: SITE.OG_IMAGE,
        width: 1200,
      },
    ],
    locale: "en_US",
    siteName: SITE.NAME,
    title: SITE.NAME,
    type: "website",
    url: SITE.URL,
  },
  publisher: SITE.AUTHOR.NAME,
  title: {
    default: `${SITE.NAME} | Open-source perks and eligibility checker`,
    template: `%s | ${SITE.NAME}`,
  },
  twitter: {
    card: "summary_large_image",
    creator: SITE.AUTHOR.TWITTER,
    description: SITE.DESCRIPTION.SHORT,
    images: [SITE.OG_IMAGE],
    site: SITE.AUTHOR.TWITTER,
    title: `${SITE.NAME} | Open-source perks and eligibility checker`,
  },
};
