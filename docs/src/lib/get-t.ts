import "server-only";
import aboutEn from "@/locales/en/about";
import type { AboutTranslations } from "@/locales/en/about";
import commonEn from "@/locales/en/common";
import type { CommonTranslations } from "@/locales/en/common";
import footerEn from "@/locales/en/footer";
import type { FooterTranslations } from "@/locales/en/footer";
import homeEn from "@/locales/en/home";
import type { HomeTranslations } from "@/locales/en/home";
import peopleEn from "@/locales/en/people";
import type { PeopleTranslations } from "@/locales/en/people";
import programsEn from "@/locales/en/programs";
import type { ProgramsTranslations } from "@/locales/en/programs";
import sponsorsEn from "@/locales/en/sponsors";
import type { SponsorsTranslations } from "@/locales/en/sponsors";

export interface Translations {
  about: AboutTranslations;
  common: CommonTranslations;
  footer: FooterTranslations;
  home: HomeTranslations;
  people: PeopleTranslations;
  programs: ProgramsTranslations;
  sponsors: SponsorsTranslations;
}

const loaders = {
  de: {
    about: () => import("@/locales/de/about"),
    common: () => import("@/locales/de/common"),
    footer: () => import("@/locales/de/footer"),
    home: () => import("@/locales/de/home"),
    people: () => import("@/locales/de/people"),
    programs: () => import("@/locales/de/programs"),
    sponsors: () => import("@/locales/de/sponsors"),
  },
  en: {
    about: () => import("@/locales/en/about"),
    common: () => import("@/locales/en/common"),
    footer: () => import("@/locales/en/footer"),
    home: () => import("@/locales/en/home"),
    people: () => import("@/locales/en/people"),
    programs: () => import("@/locales/en/programs"),
    sponsors: () => import("@/locales/en/sponsors"),
  },
  es: {
    about: () => import("@/locales/es/about"),
    common: () => import("@/locales/es/common"),
    footer: () => import("@/locales/es/footer"),
    home: () => import("@/locales/es/home"),
    people: () => import("@/locales/es/people"),
    programs: () => import("@/locales/es/programs"),
    sponsors: () => import("@/locales/es/sponsors"),
  },
  fr: {
    about: () => import("@/locales/fr/about"),
    common: () => import("@/locales/fr/common"),
    footer: () => import("@/locales/fr/footer"),
    home: () => import("@/locales/fr/home"),
    people: () => import("@/locales/fr/people"),
    programs: () => import("@/locales/fr/programs"),
    sponsors: () => import("@/locales/fr/sponsors"),
  },
  ja: {
    about: () => import("@/locales/ja/about"),
    common: () => import("@/locales/ja/common"),
    footer: () => import("@/locales/ja/footer"),
    home: () => import("@/locales/ja/home"),
    people: () => import("@/locales/ja/people"),
    programs: () => import("@/locales/ja/programs"),
    sponsors: () => import("@/locales/ja/sponsors"),
  },
  ko: {
    about: () => import("@/locales/ko/about"),
    common: () => import("@/locales/ko/common"),
    footer: () => import("@/locales/ko/footer"),
    home: () => import("@/locales/ko/home"),
    people: () => import("@/locales/ko/people"),
    programs: () => import("@/locales/ko/programs"),
    sponsors: () => import("@/locales/ko/sponsors"),
  },
  "pt-BR": {
    about: () => import("@/locales/pt-BR/about"),
    common: () => import("@/locales/pt-BR/common"),
    footer: () => import("@/locales/pt-BR/footer"),
    home: () => import("@/locales/pt-BR/home"),
    people: () => import("@/locales/pt-BR/people"),
    programs: () => import("@/locales/pt-BR/programs"),
    sponsors: () => import("@/locales/pt-BR/sponsors"),
  },
  ru: {
    about: () => import("@/locales/ru/about"),
    common: () => import("@/locales/ru/common"),
    footer: () => import("@/locales/ru/footer"),
    home: () => import("@/locales/ru/home"),
    people: () => import("@/locales/ru/people"),
    programs: () => import("@/locales/ru/programs"),
    sponsors: () => import("@/locales/ru/sponsors"),
  },
  "zh-CN": {
    about: () => import("@/locales/zh-CN/about"),
    common: () => import("@/locales/zh-CN/common"),
    footer: () => import("@/locales/zh-CN/footer"),
    home: () => import("@/locales/zh-CN/home"),
    people: () => import("@/locales/zh-CN/people"),
    programs: () => import("@/locales/zh-CN/programs"),
    sponsors: () => import("@/locales/zh-CN/sponsors"),
  },
};

export type SupportedLocale = keyof typeof loaders;

export const getT = async (locale: string): Promise<Translations> => {
  const localeLoaders = loaders[locale as SupportedLocale] ?? loaders.en;

  const [about, common, footer, home, people, programs, sponsors] =
    await Promise.all([
      localeLoaders
        .about()
        .then((m) => m.default as AboutTranslations)
        .catch(() => aboutEn),
      localeLoaders
        .common()
        .then((m) => m.default as CommonTranslations)
        .catch(() => commonEn),
      localeLoaders
        .footer()
        .then((m) => m.default as FooterTranslations)
        .catch(() => footerEn),
      localeLoaders
        .home()
        .then((m) => m.default as HomeTranslations)
        .catch(() => homeEn),
      localeLoaders
        .people()
        .then((m) => m.default as PeopleTranslations)
        .catch(() => peopleEn),
      localeLoaders
        .programs()
        .then((m) => m.default as ProgramsTranslations)
        .catch(() => programsEn),
      localeLoaders
        .sponsors()
        .then((m) => m.default as SponsorsTranslations)
        .catch(() => sponsorsEn),
    ]);

  return { about, common, footer, home, people, programs, sponsors };
};
