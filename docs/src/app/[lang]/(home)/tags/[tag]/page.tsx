import { getProgramsByTag, getTagsWithProgramCounts } from "@ossperks/core";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense, ViewTransition } from "react";

import { ProgramsFilteredGrid } from "@/components/programs/programs-filtered-grid";
import { ProgramsListingToolbar } from "@/components/programs/programs-listing-toolbar";
import { PageBreadcrumb } from "@/components/shared/page-breadcrumb";
import { ROUTES } from "@/constants/routes";
import { i18n } from "@/i18n/config";
import { getT } from "@/i18n/get-t";
import { withLocalePrefix } from "@/i18n/navigation";
import { getProgram } from "@/lib/programs";
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
}: {
  params: Promise<{ lang: string; tag: string }>;
}) {
  const { lang, tag: tagParam } = await params;
  const decodedTag = decodeUrlFromPath(tagParam);
  if (!validTagSet().has(decodedTag)) {
    notFound();
  }

  const t = await getT(lang);
  const corePrograms = getProgramsByTag(decodedTag);
  const translatedPrograms = await Promise.all(
    corePrograms.map((p) => getProgram(p.slug, lang)),
  );
  const programs = translatedPrograms.filter(
    (p): p is NonNullable<typeof p> => p !== undefined,
  );

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
        programs={programs.map((p) => ({ name: p.name, slug: p.slug }))}
      />
      <div className="view-container flex flex-1 flex-col">
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
        <p className="text-fd-muted-foreground mb-10 text-lg text-balance">
          {pageDescription}
        </p>

        <Suspense>
          <ProgramsListingToolbar
            labels={{
              orderBy: t.tags.detail.orderBy,
              resetFilters: t.tags.detail.resetFilters,
              searchPlaceholder,
              sortNameAsc: t.tags.detail.sortNameAsc,
              sortNameDesc: t.tags.detail.sortNameDesc,
            }}
          />

          <ProgramsFilteredGrid
            categoryLabels={t.common.categories}
            emptyMessage={
              programs.length === 0
                ? t.tags.detail.emptyTag
                : t.tags.detail.noMatches
            }
            learnMore={t.programs.learnMore}
            more={t.programs.more}
            programHrefPrefix={withLocalePrefix(lang, ROUTES.PROGRAMS)}
            programs={programs}
          />
        </Suspense>
      </div>
    </ViewTransition>
  );
}
