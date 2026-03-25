import type { Metadata } from "next";

import { generateLangParams } from "@/i18n/config";
import { getT } from "@/i18n/get-t";
import { createMetadata } from "@/seo/metadata";

import { ProgramSubmitPageClient } from "./page.client";

export const generateStaticParams = generateLangParams;

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> => {
  const { lang } = await params;
  const t = await getT(lang);
  return createMetadata({
    description: t.programs.submit.description,
    lang,
    path: "/programs/submit",
    title: t.programs.submit.heading,
  });
};

export default async function ProgramSubmitPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const t = await getT(lang);

  return (
    <ProgramSubmitPageClient
      lang={lang}
      translations={t.programs.submit}
      categoryLabels={t.common.categories}
    />
  );
}
