import { getAllProgramSlugs, getProgramBySlug } from "@ossperks/core";
import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";

import OgImage from "@/components/og/og-image";
import { SITE } from "@/constants/site";
import { generateLangParamsWithSlug, isLocale } from "@/i18n/config";
import { getT } from "@/i18n/get-t";
import { loadOgFonts, OG_DIMENSIONS } from "@/lib/og";

export const GET = async (
  _req: Request,
  { params }: { params: Promise<{ lang: string; slug: string }> },
) => {
  const { lang, slug } = await params;
  if (!isLocale(lang)) {
    notFound();
  }

  const program = getProgramBySlug(slug);
  if (!program) {
    notFound();
  }

  const t = await getT(lang);
  const fonts = await loadOgFonts();

  const title = t.check.checkProgram.replace("{program}", program.name);

  return new ImageResponse(
    <OgImage
      description={program.description}
      footerLabel="Eligibility Check"
      siteName={SITE.NAME}
      title={title}
    />,
    { ...OG_DIMENSIONS, fonts },
  );
};

export const generateStaticParams = () =>
  generateLangParamsWithSlug(getAllProgramSlugs);
