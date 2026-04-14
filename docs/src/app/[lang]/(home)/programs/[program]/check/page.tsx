import { getAllProgramSlugs } from "@ossperks/core";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";

import { CheckPageClient } from "@/components/check/check-page-client";
import { generateLangParamsWithProgram } from "@/i18n/config";
import { getT } from "@/i18n/get-t";
import { getProgram, getSingleProgramTranslation } from "@/lib/programs";
import { createMetadata } from "@/seo/metadata";

export const generateStaticParams = () =>
  generateLangParamsWithProgram(getAllProgramSlugs);

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ lang: string; program: string }>;
}): Promise<Metadata> => {
  const { lang, program: programSlug } = await params;
  const program = await getProgram(programSlug, lang);
  if (!program) {
    notFound();
  }

  const t = await getT(lang);
  const title = t.check.checkProgram.replace("{program}", program.name);

  return createMetadata({
    description: program.description,
    lang,
    path: `/programs/${programSlug}/check`,
    title,
  });
};

export default async function ProgramCheckPage({
  params,
}: {
  params: Promise<{ lang: string; program: string }>;
}) {
  const { lang, program: programSlug } = await params;
  const [program, t, programTranslations] = await Promise.all([
    getProgram(programSlug, lang),
    getT(lang),
    getSingleProgramTranslation(programSlug, lang),
  ]);
  if (!program) {
    notFound();
  }

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
        program={{ name: program.name, slug: programSlug }}
        programTranslations={programTranslations}
        translations={t.check}
      />
    </ViewTransition>
  );
}
