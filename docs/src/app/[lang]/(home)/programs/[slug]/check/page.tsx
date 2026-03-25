import { programs as corePrograms, getAllProgramSlugs } from "@ossperks/core";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { i18n } from "@/i18n/config";
import { getT } from "@/i18n/get-t";
import { getProgram } from "@/lib/programs";
import { createMetadata } from "@/seo/metadata";
import type { ProgramTranslationMap } from "@/types/check";

import { ProgramCheckPageClient } from "./page.client";

export const generateStaticParams = () =>
  i18n.languages.flatMap((lang) =>
    getAllProgramSlugs().map((slug) => ({ lang, slug })),
  );

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> => {
  const { lang, slug } = await params;
  const program = await getProgram(slug, lang);
  if (!program) {
    notFound();
  }

  const t = await getT(lang);
  const title = t.check.checkProgram.replace("{program}", program.name);

  return createMetadata({
    description: program.description,
    lang,
    path: `/programs/${slug}/check`,
    title,
  });
};

export default async function ProgramCheckPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const [program, t] = await Promise.all([getProgram(slug, lang), getT(lang)]);
  if (!program) {
    notFound();
  }

  const englishProgram = corePrograms.find((p) => p.slug === slug);
  const programTranslation: ProgramTranslationMap = {
    [slug]: {
      eligibility: program.eligibility,
      hasEligibilityParity:
        lang === i18n.defaultLanguage ||
        program.eligibility.length ===
          (englishProgram?.eligibility.length ?? program.eligibility.length),
      name: program.name,
    },
  };

  return (
    <ProgramCheckPageClient
      lang={lang}
      programSlug={slug}
      programName={program.name}
      translations={t.check}
      programTranslations={programTranslation}
    />
  );
}
