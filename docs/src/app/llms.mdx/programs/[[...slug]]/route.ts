import { notFound } from "next/navigation";

import { isLocale } from "@/i18n/config";
import { getLLMText, programsSource } from "@/lib/source";

export const revalidate = false;

export const GET = async (
  _req: Request,
  { params }: RouteContext<"/llms.mdx/programs/[[...slug]]">,
) => {
  const { slug = [] } = await params;

  let lang: string | undefined;
  let pageSlug = slug;

  const [first, ...rest] = slug;
  if (rest.length > 0 && isLocale(first)) {
    lang = first;
    pageSlug = rest;
  }

  const page = programsSource.getPage(pageSlug, lang);
  if (!page) {
    notFound();
  }

  return new Response(await getLLMText(page), {
    headers: {
      "Content-Type": "text/markdown",
    },
  });
};

export const generateStaticParams = () => programsSource.generateParams();
