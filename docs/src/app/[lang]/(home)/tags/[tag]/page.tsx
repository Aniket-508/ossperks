import { getProgramsByTag, getTagsWithProgramCounts } from "@ossperks/core";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { SearchParams } from "nuqs/server";
import { ViewTransition } from "react";

import { ProgramCard } from "@/components/programs/program-card";
import { ProgramListToolbar } from "@/components/programs/program-list-toolbar";
import { PageBreadcrumb } from "@/components/shared/page-breadcrumb";
import { ROUTES } from "@/constants/routes";
import { i18n } from "@/i18n/config";
import { getT } from "@/i18n/get-t";
import { withLocalePrefix } from "@/i18n/navigation";
import { getProgram } from "@/lib/programs";
import { filterSortPrograms } from "@/lib/programs-filter";
import { programListParamsCache } from "@/lib/search-params";
import { decodeUrlFromPath, encodeUrlForPath } from "@/lib/url";
import { formatSlug } from "@/lib/utils";
import { BreadcrumbJsonLd, CategoryProgramListJsonLd } from "@/seo/json-ld";
import { createMetadata } from "@/seo/metadata";

const validTagSet = (): Set<string> =>
  new Set(getTagsWithProgramCounts().map((row) => row.tag));

export const generateStaticParams = (): { lang: string; tag: string }[] =>
  i18n.languages.flatMap((lang) =>
    getTagsWithProgramCounts().map(({ tag }) => ({
      lang,
      tag: encodeUrlForPath(tag),
    })),
  );

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ lang: string; tag: string }>;
}): Promise<Metadata> => {
  const { lang, tag: tagParam } = await params;
  const decoded = decodeUrlFromPath(tagParam);
  if (!validTagSet().has(decoded)) {
    notFound();
  }
  const t = await getT(lang);
  const tagLabel = formatSlug(decoded.replaceAll(/\s+/g, "-"));
  const title = t.tags.detail.metaTitle.replace("{tag}", tagLabel);
  const description = t.tags.detail.metaDescription.replace("{tag}", tagLabel);
  return createMetadata({
    description,
    lang,
    path: `${ROUTES.TAGS}/${encodeUrlForPath(decoded)}` as `/${string}`,
    title,
  });
};

export default async function TagDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string; tag: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { lang, tag: tagParam } = await params;
  const decodedTag = decodeUrlFromPath(tagParam);
  if (!validTagSet().has(decodedTag)) {
    notFound();
  }

  const query = await programListParamsCache.parse(searchParams);
  const t = await getT(lang);
  const corePrograms = getProgramsByTag(decodedTag);
  const translatedPrograms = await Promise.all(
    corePrograms.map((p) => getProgram(p.slug, lang)),
  );
  const programs = translatedPrograms.filter(
    (p): p is NonNullable<typeof p> => p !== undefined,
  );
  const filtered = filterSortPrograms(programs, {
    q: query.q,
    sort: query.sort,
  });

  const tagLabel = formatSlug(decodedTag.replaceAll(/\s+/g, "-"));
  const pageTitle = t.tags.detail.metaTitle.replace("{tag}", tagLabel);
  const pageDescription = t.tags.detail.metaDescription.replace(
    "{tag}",
    tagLabel,
  );
  const searchPlaceholder = t.tags.detail.searchPlaceholder.replace(
    "{tag}",
    decodedTag,
  );

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
          { name: t.tags.detail.breadcrumb, path: ROUTES.TAGS },
          {
            name: tagLabel,
            path: `${ROUTES.TAGS}/${encodeUrlForPath(decodedTag)}` as `/${string}`,
          },
        ]}
        lang={lang}
      />
      <CategoryProgramListJsonLd
        categoryLabel={tagLabel}
        lang={lang}
        pageName={pageTitle}
        programs={filtered.map((p) => ({ name: p.name, slug: p.slug }))}
      />
      <div className="view-container flex w-full flex-1 flex-col px-4 py-12">
        <PageBreadcrumb
          homeHref={withLocalePrefix(lang, ROUTES.HOME)}
          homeLabel={t.common.breadcrumbHome}
          segments={[
            {
              href: withLocalePrefix(lang, ROUTES.TAGS),
              label: t.tags.detail.breadcrumb,
            },
            { current: true, label: tagLabel },
          ]}
        />

        <h1 className="mb-2 text-4xl font-bold">{pageTitle}</h1>
        <p className="text-fd-muted-foreground mb-10 max-w-2xl text-lg">
          {pageDescription}
        </p>

        <ProgramListToolbar
          labels={{
            orderBy: t.tags.detail.orderBy,
            resetFilters: t.tags.detail.resetFilters,
            searchPlaceholder,
            sortNameAsc: t.tags.detail.sortNameAsc,
            sortNameDesc: t.tags.detail.sortNameDesc,
          }}
        />

        {filtered.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-3">
            {filtered.map((program) => {
              const programCategoryLabel =
                t.common.categories[
                  program.category as keyof typeof t.common.categories
                ] ?? program.category;
              const programHref = withLocalePrefix(
                lang,
                `${ROUTES.PROGRAMS}/${program.slug}` as `/${string}`,
              );
              return (
                <ProgramCard
                  categoryLabel={programCategoryLabel}
                  key={program.slug}
                  learnMore={t.programs.learnMore}
                  more={t.programs.more}
                  program={program}
                  programHref={programHref}
                />
              );
            })}
          </div>
        ) : (
          <div className="bg-fd-muted/30 rounded-lg border border-dashed p-12 text-center">
            <p className="text-fd-muted-foreground">
              {programs.length === 0
                ? t.tags.detail.emptyTag
                : t.tags.detail.noMatches}
            </p>
          </div>
        )}
      </div>
    </ViewTransition>
  );
}
