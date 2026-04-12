import { getTagsWithProgramCounts } from "@ossperks/core";
import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import type { SearchParams } from "nuqs/server";
import { ViewTransition } from "react";

import { ListingPagination } from "@/components/shared/listing-pagination";
import { PageBreadcrumb } from "@/components/shared/page-breadcrumb";
import { TagsBrowseToolbar } from "@/components/tags/tags-browse-toolbar";
import { ROUTES } from "@/constants/routes";
import { generateLangParams } from "@/i18n/config";
import { getT } from "@/i18n/get-t";
import { withLocalePrefix } from "@/i18n/navigation";
import { tagsBrowseParamsCache } from "@/lib/search-params";
import { filterSortPaginateTags } from "@/lib/tags-filter";
import type { TagsBrowseSort } from "@/lib/tags-filter";
import { encodeUrlForPath } from "@/lib/url";
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
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { lang } = await params;
  const query = await tagsBrowseParamsCache.parse(searchParams);
  const t = await getT(lang);
  const allRows = getTagsWithProgramCounts();
  const {
    page: _page,
    pageCount,
    rows,
  } = filterSortPaginateTags(allRows, {
    letter: query.letter,
    page: query.page,
    q: query.q,
    sort: (query.sort ?? null) as TagsBrowseSort | null,
  });

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
      <div className="view-container flex w-full flex-1 flex-col px-4 py-12">
        <PageBreadcrumb
          homeHref={withLocalePrefix(lang, ROUTES.HOME)}
          homeLabel={t.common.breadcrumbHome}
          segments={[{ current: true, label: t.tags.browse.breadcrumb }]}
        />
        <h1 className="mb-2 text-4xl font-bold">{t.tags.browse.heading}</h1>
        <p className="text-fd-muted-foreground mb-10 max-w-2xl text-lg">
          {t.tags.browse.intro.replace("{count}", String(allRows.length))}
        </p>

        <TagsBrowseToolbar labels={t.tags.browse} />

        {rows.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-3">
            {rows.map((row) => {
              const href = withLocalePrefix(
                lang,
                `${ROUTES.TAGS}/${encodeUrlForPath(row.tag)}` as `/${string}`,
              );
              return (
                <Link
                  className="border-fd-border/60 hover:bg-fd-muted/40 flex items-center justify-between gap-3 rounded-lg border px-4 py-3 transition-colors"
                  href={href}
                  key={row.tag}
                  transitionTypes={["nav-forward"]}
                >
                  <div className="min-w-0">
                    <div className="truncate font-medium">{row.tag}</div>
                    <div className="text-fd-muted-foreground text-sm">
                      {t.tags.browse.programsCount.replace(
                        "{count}",
                        String(row.count),
                      )}
                    </div>
                  </div>
                  <ChevronRight className="text-fd-muted-foreground size-4 shrink-0" />
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="bg-fd-muted/30 rounded-lg border border-dashed p-12 text-center">
            <p className="text-fd-muted-foreground">
              {t.tags.browse.noMatches}
            </p>
          </div>
        )}

        <ListingPagination
          labels={{
            next: t.tags.browse.paginationNext,
            previous: t.tags.browse.paginationPrevious,
          }}
          pageCount={pageCount}
        />
      </div>
    </ViewTransition>
  );
}
