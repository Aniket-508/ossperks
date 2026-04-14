import type { Metadata } from "next";
import { ViewTransition } from "react";

import { generateLangParams } from "@/i18n/config";
import { getT } from "@/i18n/get-t";
import { parseCheckUrlSearch } from "@/lib/check";
import { getProgramTranslations } from "@/lib/programs";
import { createMetadata } from "@/seo/metadata";

import { CheckPageClient } from "./page.client";

export const generateStaticParams = generateLangParams;

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> => {
  const { lang } = await params;
  const t = await getT(lang);

  return createMetadata({
    description: t.check.description,
    lang,
    path: "/check",
    title: t.check.heading,
  });
};

export default async function CheckPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { lang } = await params;
  const [t, programTranslations, sp] = await Promise.all([
    getT(lang),
    getProgramTranslations(lang),
    searchParams,
  ]);

  return (
    <ViewTransition
      enter={{
        default: "none",
        "nav-back": "nav-back",
        "nav-forward": "nav-forward",
      }}
      exit={{
        default: "none",
        "nav-back": "nav-back",
        "nav-forward": "nav-forward",
      }}
      default="none"
    >
      <CheckPageClient
        lang={lang}
        translations={t.check}
        programTranslations={programTranslations}
        searchParams={parseCheckUrlSearch(sp)}
      />
    </ViewTransition>
  );
}
