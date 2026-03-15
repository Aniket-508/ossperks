import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
  ViewOptionsPopover,
} from "fumadocs-ui/layouts/docs/page";
import { createRelativeLink } from "fumadocs-ui/mdx";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getMDXComponents } from "@/components/mdx";
import { LINK } from "@/constants/links";
import { ROUTES } from "@/constants/routes";
import { i18n, withLocalePrefix } from "@/lib/i18n";
import { cliSource, getCliPageImage } from "@/lib/source";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; slug?: string[] }>;
}) {
  const { lang, slug } = await params;
  const page = cliSource.getPage(slug, lang);
  if (!page) {
    notFound();
  }

  const MdxContent = page.data.body;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription className="mb-0">
        {page.data.description}
      </DocsDescription>
      <div className="flex flex-row gap-2 items-center border-b pb-6">
        <MarkdownCopyButton markdownUrl={`${page.url}.mdx`} />
        <ViewOptionsPopover
          markdownUrl={`${page.url}.mdx`}
          githubUrl={`${LINK.CLI}/${page.path}`}
        />
      </div>
      <DocsBody>
        <MdxContent
          components={getMDXComponents({
            a: createRelativeLink(cliSource, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export const generateStaticParams = () => cliSource.generateParams();

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ lang: string; slug?: string[] }>;
}): Promise<Metadata> => {
  const { lang, slug } = await params;
  const page = cliSource.getPage(slug, lang);
  if (!page) {
    notFound();
  }

  const cliPath = `${ROUTES.CLI}/${page.slugs.join("/")}` as `/${string}`;
  const canonical = withLocalePrefix(lang, cliPath);
  const languages: Record<string, string> = Object.fromEntries(
    i18n.languages.map((locale) => [locale, withLocalePrefix(locale, cliPath)])
  );
  languages["x-default"] = withLocalePrefix(i18n.defaultLanguage, cliPath);

  const ogLocale = lang.replace("-", "_");

  return {
    alternates: {
      canonical,
      languages,
    },
    description: page.data.description,
    openGraph: {
      description: page.data.description,
      images: [
        {
          alt: page.data.title,
          height: 630,
          url: getCliPageImage(page).url,
          width: 1200,
        },
      ],
      locale: ogLocale,
      title: page.data.title,
      type: "article",
    },
    title: page.data.title,
    twitter: {
      card: "summary_large_image",
      description: page.data.description,
      images: [getCliPageImage(page).url],
      title: page.data.title,
    },
  };
};
