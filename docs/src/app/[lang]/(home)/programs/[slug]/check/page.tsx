import { getAllProgramSlugs } from "@ossperks/core";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { generateLangParamsWithSlug } from "@/i18n/config";
import { getT } from "@/i18n/get-t";
import { getProgram, getSingleProgramTranslation } from "@/lib/programs";
import { createMetadata } from "@/seo/metadata";

import { ProgramCheckPageClient } from "./page.client";

export const generateStaticParams = () =>
  generateLangParamsWithSlug(getAllProgramSlugs);

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
  const [program, t, programTranslations] = await Promise.all([
    getProgram(slug, lang),
    getT(lang),
    getSingleProgramTranslation(slug, lang),
  ]);
  if (!program) {
    notFound();
  }

  return (
    <ProgramCheckPageClient
      lang={lang}
      programSlug={slug}
      programName={program.name}
      translations={t.check}
      programTranslations={programTranslations}
    />
  );
}
