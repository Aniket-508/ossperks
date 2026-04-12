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
import { cliSource, getCliPageImage } from "@/lib/source";
import { createMetadata } from "@/seo/metadata";

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
      <div className="flex flex-row items-center gap-2 border-b pb-6">
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

  return createMetadata({
    description: page.data.description,
    lang,
    ogImage: getCliPageImage(page).url,
    ogType: "article",
    path: cliPath,
    title: page.data.title,
  });
};
