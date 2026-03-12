import "server-only";
import commonEn from "@/locales/en/common";
import type { CommonTranslations } from "@/locales/en/common";
import homeEn from "@/locales/en/home";
import type { HomeTranslations } from "@/locales/en/home";
import programsEn from "@/locales/en/programs";
import type { ProgramsTranslations } from "@/locales/en/programs";

export interface Translations {
  common: CommonTranslations;
  home: HomeTranslations;
  programs: ProgramsTranslations;
}

const loaders = {
  de: {
    common: () => import("@/locales/de/common"),
    home: () => import("@/locales/de/home"),
    programs: () => import("@/locales/de/programs"),
  },
  en: {
    common: () => import("@/locales/en/common"),
    home: () => import("@/locales/en/home"),
    programs: () => import("@/locales/en/programs"),
  },
  es: {
    common: () => import("@/locales/es/common"),
    home: () => import("@/locales/es/home"),
    programs: () => import("@/locales/es/programs"),
  },
  fr: {
    common: () => import("@/locales/fr/common"),
    home: () => import("@/locales/fr/home"),
    programs: () => import("@/locales/fr/programs"),
  },
  ja: {
    common: () => import("@/locales/ja/common"),
    home: () => import("@/locales/ja/home"),
    programs: () => import("@/locales/ja/programs"),
  },
  ko: {
    common: () => import("@/locales/ko/common"),
    home: () => import("@/locales/ko/home"),
    programs: () => import("@/locales/ko/programs"),
  },
  "pt-BR": {
    common: () => import("@/locales/pt-BR/common"),
    home: () => import("@/locales/pt-BR/home"),
    programs: () => import("@/locales/pt-BR/programs"),
  },
  ru: {
    common: () => import("@/locales/ru/common"),
    home: () => import("@/locales/ru/home"),
    programs: () => import("@/locales/ru/programs"),
  },
  "zh-CN": {
    common: () => import("@/locales/zh-CN/common"),
    home: () => import("@/locales/zh-CN/home"),
    programs: () => import("@/locales/zh-CN/programs"),
  },
};

export type SupportedLocale = keyof typeof loaders;

export const getT = async (locale: string): Promise<Translations> => {
  const localeLoaders = loaders[locale as SupportedLocale] ?? loaders.en;

  const [common, home, programs] = await Promise.all([
    localeLoaders
      .common()
      .then((m) => m.default as CommonTranslations)
      .catch(() => commonEn),
    localeLoaders
      .home()
      .then((m) => m.default as HomeTranslations)
      .catch(() => homeEn),
    localeLoaders
      .programs()
      .then((m) => m.default as ProgramsTranslations)
      .catch(() => programsEn),
  ]);

  return { common, home, programs };
};
