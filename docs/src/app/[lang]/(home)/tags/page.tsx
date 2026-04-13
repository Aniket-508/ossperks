import { getTagsWithProgramCounts } from "@ossperks/core";
import type { Metadata } from "next";
import { Suspense, ViewTransition } from "react";

import { PageBreadcrumb } from "@/components/shared/page-breadcrumb";
import { TagsBrowseListing } from "@/components/tags/tags-browse-listing";
import { TagsBrowseToolbar } from "@/components/tags/tags-browse-toolbar";
import { ROUTES } from "@/constants/routes";
import { generateLangParams } from "@/i18n/config";
import { getT } from "@/i18n/get-t";
import { withLocalePrefix } from "@/i18n/navigation";
import { BreadcrumbJsonLd, TagsIndexItemListJsonLd } from "@/seo/json-ld";
import { createMetadata } from "@/seo/metadata";

export const generateStaticParams = generateLangParams;

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> => {
  const { lang } = await params;
  const t = await getT(lang);
  const allTags = getTagsWithProgramCounts();
  return createMetadata({
    description: t.tags.browse.intro.replace("{count}", String(allTags.length)),
    lang,
    path: ROUTES.TAGS,
    title: t.tags.browse.heading,
  });
};

export default async function TagsBrowsePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const t = await getT(lang);
  const allRows = getTagsWithProgramCounts();

  return (
    <ViewTransition
      enter={{
        default: "none",
        "nav-back": "nav-back",
        "nav-forward": "nav-forward",
      }}
      exit={{
        default: "none",
        "nav-back": "nav-back",
        "nav-forward": "nav-forward",
      }}
      default="none"
    >
      <BreadcrumbJsonLd
        items={[
          { name: t.common.breadcrumbHome, path: "/" },
          { name: t.tags.browse.breadcrumb, path: ROUTES.TAGS },
        ]}
        lang={lang}
      />
      <TagsIndexItemListJsonLd
        lang={lang}
        listName={t.tags.browse.heading}
        tags={allRows.map((row) => ({ tag: row.tag }))}
      />
      <div className="view-container flex flex-1 flex-col">
        <PageBreadcrumb
          homeHref={withLocalePrefix(lang, ROUTES.HOME)}
          homeLabel={t.common.breadcrumbHome}
          segments={[{ current: true, label: t.tags.browse.breadcrumb }]}
        />
        <h1 className="mb-2 text-4xl font-bold">{t.tags.browse.heading}</h1>
        <p className="text-fd-muted-foreground mb-10 max-w-2xl text-lg">
          {t.tags.browse.intro.replace("{count}", String(allRows.length))}
        </p>

        <Suspense>
          <TagsBrowseToolbar labels={t.tags.browse} />

          <TagsBrowseListing
            allTags={allRows}
            labels={{
              noMatches: t.tags.browse.noMatches,
              paginationNext: t.tags.browse.paginationNext,
              paginationPrevious: t.tags.browse.paginationPrevious,
              programsCount: t.tags.browse.programsCount,
            }}
            lang={lang}
          />
        </Suspense>
      </div>
    </ViewTransition>
  );
}
