import type { Metadata } from "next";
import { ViewTransition } from "react";

import { generateLangParams } from "@/i18n/config";
import { getT } from "@/i18n/get-t";
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
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const [t, programTranslations] = await Promise.all([
    getT(lang),
    getProgramTranslations(lang),
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
      />
    </ViewTransition>
  );
}
