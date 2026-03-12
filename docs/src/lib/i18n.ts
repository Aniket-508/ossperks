import { defineI18n } from "fumadocs-core/i18n";

export const i18n = defineI18n({
  defaultLanguage: "en",
  hideLocale: "default-locale",
  languages: ["en", "es", "zh-CN", "fr", "de", "pt-BR", "ja", "ko", "ru"],
  parser: "dir",
});

export type Locale = (typeof i18n.languages)[number];

export const isLocale = (value: string): value is Locale =>
  i18n.languages.includes(value as Locale);

export const withLocalePrefix = (locale: string, path: `/${string}`): string =>
  locale === i18n.defaultLanguage ? path : `/${locale}${path}`;

export const parseLocaleSlugs = (
  slugs: string[] | undefined
): { locale: Locale; slugs: string[] } => {
  const normalized = slugs ?? [];
  const [first, ...rest] = normalized;

  if (first && isLocale(first)) {
    return { locale: first, slugs: rest };
  }

  return {
    locale: i18n.defaultLanguage,
    slugs: normalized,
  };
};

export const buildLocaleSlugs = (locale: string, slugs: string[]): string[] =>
  locale === i18n.defaultLanguage ? slugs : [locale, ...slugs];
