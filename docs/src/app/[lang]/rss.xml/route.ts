import { notFound } from "next/navigation";

import { generateLangParams, isLocale } from "@/i18n/config";
import { buildProgramsRssResponse } from "@/lib/rss-programs-feed";

export const revalidate = false;

export const generateStaticParams = generateLangParams;

export const GET = async (
  _req: Request,
  { params }: { params: Promise<{ lang: string }> },
) => {
  const { lang } = await params;
  if (!isLocale(lang)) {
    notFound();
  }
  return buildProgramsRssResponse(lang);
};
