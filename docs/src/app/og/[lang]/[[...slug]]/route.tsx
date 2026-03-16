import { getProgramBySlug, programs } from "@ossperks/core";
import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";

import OgImage from "@/components/og/og-image";
import { SITE } from "@/constants/site";
import { loadOgFonts } from "@/lib/fonts";
import { getT } from "@/lib/get-t";
import { i18n, isLocale } from "@/lib/i18n";
import { cliSource, programsSource } from "@/lib/source";

export const revalidate = false;

type OgContext =
  | { type: "home" }
  | { type: "about" }
  | { type: "programs" }
  | { type: "program"; slug: string }
  | { type: "people" }
  | { type: "sponsors" }
  | { slugs: string[]; type: "cli" };

const resolveContext = (slug: string[] | undefined): OgContext | null => {
  if (!slug || slug.length === 0) {
    return { type: "home" };
  }
  if (slug[0] === "cli") {
    return { slugs: slug.slice(1), type: "cli" };
  }
  if (slug.length === 1) {
    if (slug[0] === "about") {
      return { type: "about" };
    }
    if (slug[0] === "programs") {
      return { type: "programs" };
    }
    if (slug[0] === "people") {
      return { type: "people" };
    }
    if (slug[0] === "sponsors") {
      return { type: "sponsors" };
    }
  }
  if (slug.length === 2 && slug[0] === "programs") {
    return { slug: slug[1], type: "program" };
  }
  return null;
};

const getFooterLabel = (context: OgContext): string | undefined => {
  if (context.type === "program") {
    return "Program";
  }
  if (context.type === "cli") {
    return "CLI";
  }
  return undefined;
};

const validateOgRequest = (params: {
  lang: string;
  slug?: string[];
}): { context: OgContext; lang: string } => {
  const { lang, slug } = params;
  if (!isLocale(lang)) {
    notFound();
  }
  const context = resolveContext(slug ?? undefined);
  if (!context) {
    notFound();
  }
  if (context.type === "program") {
    const program = getProgramBySlug(context.slug);
    if (!program) {
      notFound();
    }
  }
  if (context.type === "cli") {
    const page = cliSource.getPage(context.slugs, lang);
    if (!page) {
      notFound();
    }
  }
  return { context, lang };
};

const getOgContent = async (
  lang: string,
  context: OgContext
): Promise<{ description: string; title: string }> => {
  const t = await getT(lang);
  switch (context.type) {
    case "home": {
      return { description: t.home.description, title: t.home.heading };
    }
    case "about": {
      return { description: t.about.intro, title: t.about.heading };
    }
    case "programs": {
      return {
        description: t.programs.listing.description,
        title: t.programs.listing.heading,
      };
    }
    case "program": {
      const program = getProgramBySlug(context.slug);
      if (!program) {
        return { description: "", title: "" };
      }
      const page = programsSource.getPage([program.slug], lang);
      return {
        description: page?.data.description ?? program.description,
        title: program.name,
      };
    }
    case "people": {
      return { description: t.people.description, title: t.people.heading };
    }
    case "sponsors": {
      return { description: t.sponsors.intro, title: t.sponsors.heading };
    }
    case "cli": {
      const page = cliSource.getPage(context.slugs, lang);
      if (!page) {
        return { description: "", title: "" };
      }
      const description = page.data.description ?? "";
      const title = page.data.title ?? "";
      return { description, title };
    }
    default: {
      const _: never = context;
      return { description: "", title: "" };
    }
  }
};

export const GET = async (
  _req: Request,
  { params }: { params: Promise<{ lang: string; slug?: string[] }> }
) => {
  const { context, lang } = validateOgRequest(await params);
  const { description, title } = await getOgContent(lang, context);
  if (!title) {
    notFound();
  }
  const fonts = await loadOgFonts();
  return new ImageResponse(
    <OgImage
      description={description}
      footerLabel={getFooterLabel(context)}
      siteName={SITE.NAME}
      title={title}
    />,
    {
      fonts,
      height: 630,
      width: 1200,
    }
  );
};

export const generateStaticParams = () => {
  const params: { lang: string; slug?: string[] }[] = [];
  for (const lang of i18n.languages) {
    params.push({ lang });
    params.push({ lang, slug: ["about"] });
    params.push({ lang, slug: ["programs"] });
    params.push({ lang, slug: ["people"] });
    params.push({ lang, slug: ["sponsors"] });
    for (const program of programs) {
      params.push({ lang, slug: ["programs", program.slug] });
    }
  }
  for (const page of cliSource.getPages()) {
    const locale = page.locale ?? i18n.defaultLanguage;
    const slugs = page.slugs ?? [];
    params.push({ lang: locale, slug: ["cli", ...slugs] });
  }
  return params;
};
