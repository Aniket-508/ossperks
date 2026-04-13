import {
  CATEGORY_LABELS,
  getAllPeopleSlugs,
  getCategories,
  getPersonBySlug,
  getProgramBySlug,
  getTagsWithProgramCounts,
  programs,
} from "@ossperks/core";
import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";

import OgImage from "@/components/og/og-image";
import { SITE } from "@/constants/site";
import { i18n, isLocale } from "@/i18n/config";
import { getT } from "@/i18n/get-t";
import { loadOgFonts } from "@/lib/og";
import { cliSource } from "@/lib/source";
import { decodeUrlFromPath, encodeUrlForPath } from "@/lib/url";

import { buildOgContent } from "./og-content";
import type { OgContext } from "./og-content";

export const revalidate = false;

const validTagSet = (): Set<string> =>
  new Set(getTagsWithProgramCounts().map((row) => row.tag));

const SINGLE_SEGMENT: Record<string, OgContext> = {
  about: { type: "about" },
  categories: { type: "categories-index" },
  people: { type: "people" },
  programs: { type: "programs" },
  sponsors: { type: "sponsors" },
  tags: { type: "tags-index" },
};

const resolveTwoSegment = (slug: [string, string]): OgContext | null => {
  const [first, second] = slug;
  if (first === "programs" && second === "submit") {
    return { type: "submit" };
  }
  if (first === "programs") {
    return { slug: second, type: "program" };
  }
  if (first === "categories") {
    return { category: second, type: "category" };
  }
  if (first === "tags") {
    return { tag: decodeUrlFromPath(second), type: "tag" };
  }
  if (first === "people") {
    return { personSlug: second, type: "person" };
  }
  return null;
};

const resolveContext = (slug: string[] | undefined): OgContext | null => {
  if (!slug?.length) {
    return { type: "home" };
  }
  if (slug[0] === "cli") {
    return { slugs: slug.slice(1), type: "cli" };
  }
  if (slug.length === 1) {
    return SINGLE_SEGMENT[slug[0]] ?? null;
  }
  if (slug.length === 2) {
    return resolveTwoSegment([slug[0], slug[1]]);
  }
  return null;
};

const getFooterLabel = (context: OgContext): string | undefined => {
  if (context.type === "program") {
    return "Program";
  }
  if (context.type === "category" || context.type === "categories-index") {
    return "Category";
  }
  if (context.type === "tag" || context.type === "tags-index") {
    return "Tags";
  }
  if (context.type === "person") {
    return "Person";
  }
  if (context.type === "submit") {
    return "Submit";
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
  if (context.type === "category" && !(context.category in CATEGORY_LABELS)) {
    notFound();
  }
  if (context.type === "tag" && !validTagSet().has(context.tag)) {
    notFound();
  }
  if (context.type === "person") {
    const person = getPersonBySlug(context.personSlug);
    if (!person) {
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

const getOgContent = async (lang: string, context: OgContext) => {
  const t = await getT(lang);
  return buildOgContent(t, lang, context);
};

export const GET = async (
  _req: Request,
  { params }: { params: Promise<{ lang: string; slug?: string[] }> },
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
    },
  );
};

export const generateStaticParams = () => {
  const params: { lang: string; slug?: string[] }[] = [];
  for (const lang of i18n.languages) {
    params.push({ lang });
    params.push({ lang, slug: ["about"] });
    params.push({ lang, slug: ["programs"] });
    params.push({ lang, slug: ["programs", "submit"] });
    params.push({ lang, slug: ["people"] });
    params.push({ lang, slug: ["sponsors"] });
    params.push({ lang, slug: ["categories"] });
    params.push({ lang, slug: ["tags"] });
    for (const program of programs) {
      params.push({ lang, slug: ["programs", program.slug] });
    }
    for (const category of getCategories()) {
      params.push({ lang, slug: ["categories", category] });
    }
    for (const { tag } of getTagsWithProgramCounts()) {
      params.push({ lang, slug: ["tags", encodeUrlForPath(tag)] });
    }
    for (const personSlug of getAllPeopleSlugs()) {
      params.push({ lang, slug: ["people", personSlug] });
    }
  }
  for (const page of cliSource.getPages()) {
    const locale = page.locale ?? i18n.defaultLanguage;
    const slugs = page.slugs ?? [];
    params.push({ lang: locale, slug: ["cli", ...slugs] });
  }
  return params;
};
