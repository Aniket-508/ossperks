import {
  CATEGORY_LABELS,
  getCategories,
  getProgramsByCategory,
} from "@ossperks/core";
import type { Category } from "@ossperks/core";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense, ViewTransition } from "react";

import { ProgramsFilteredGrid } from "@/components/programs/programs-filtered-grid";
import { ProgramsListingToolbar } from "@/components/programs/programs-listing-toolbar";
import { PageBreadcrumb } from "@/components/shared/page-breadcrumb";
import { ROUTES } from "@/constants/routes";
import { i18n } from "@/i18n/config";
import { formatProgramsCategoryIntro } from "@/i18n/format-programs-category-intro";
import { getT } from "@/i18n/get-t";
import { withLocalePrefix } from "@/i18n/navigation";
import { getProgram } from "@/lib/programs";
import { BreadcrumbJsonLd, CategoryProgramListJsonLd } from "@/seo/json-ld";
import { createMetadata } from "@/seo/metadata";

const VALID_CATEGORIES = new Set<string>(Object.keys(CATEGORY_LABELS));

export const generateStaticParams = (): { category: string; lang: string }[] =>
  i18n.languages.flatMap((lang) =>
    getCategories().map((category) => ({ category, lang })),
  );

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ category: string; lang: string }>;
}): Promise<Metadata> => {
  const { category, lang } = await params;
  if (!VALID_CATEGORIES.has(category)) {
    notFound();
  }
  const t = await getT(lang);
  const categoryLabel =
    t.common.categories[category as keyof typeof t.common.categories] ??
    category;
  const programCount = getProgramsByCategory(category as Category).length;
  const title = t.programs.category.heading.replace(
    "{category}",
    categoryLabel,
  );
  const description = formatProgramsCategoryIntro(
    t.programs.category.intro,
    programCount,
    categoryLabel,
    lang,
  );
  return createMetadata({
    description,
    lang,
    path: `${ROUTES.CATEGORIES}/${category}` as `/${string}`,
    title,
  });
};

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ category: string; lang: string }>;
}) {
  const { category, lang } = await params;
  if (!VALID_CATEGORIES.has(category)) {
    notFound();
  }

  const t = await getT(lang);
  const categoryLabel =
    t.common.categories[category as keyof typeof t.common.categories] ??
    category;

  const corePrograms = getProgramsByCategory(category as Category);
  const translatedPrograms = await Promise.all(
    corePrograms.map((p) => getProgram(p.slug, lang)),
  );
  const programs = translatedPrograms.filter(
    (p): p is NonNullable<typeof p> => p !== undefined,
  );

  const pageHeading = t.programs.category.heading.replace(
    "{category}",
    categoryLabel,
  );
  const searchPlaceholder = t.categories.detail.searchPlaceholder.replace(
    "{category}",
    categoryLabel,
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
          {
            name: t.categories.detail.breadcrumb,
            path: ROUTES.CATEGORIES,
          },
          {
            name: categoryLabel,
            path: `${ROUTES.CATEGORIES}/${category}` as `/${string}`,
          },
        ]}
        lang={lang}
      />
      <CategoryProgramListJsonLd
        categoryLabel={categoryLabel}
        lang={lang}
        pageName={pageHeading}
        programs={programs.map((p) => ({ name: p.name, slug: p.slug }))}
      />
      <div className="view-container flex flex-1 flex-col">
        <PageBreadcrumb
          homeHref={withLocalePrefix(lang, ROUTES.HOME)}
          homeLabel={t.common.breadcrumbHome}
          segments={[
            {
              href: withLocalePrefix(lang, ROUTES.CATEGORIES),
              label: t.categories.detail.breadcrumb,
            },
            { current: true, label: categoryLabel },
          ]}
        />

        <h1 className="mb-2 text-4xl font-bold">{pageHeading}</h1>
        <p className="text-fd-muted-foreground mb-10 max-w-2xl text-lg">
          {formatProgramsCategoryIntro(
            t.programs.category.intro,
            programs.length,
            categoryLabel,
            lang,
          )}
        </p>

        <Suspense>
          <ProgramsListingToolbar
            labels={{
              ...t.categories.detail,
              searchPlaceholder,
            }}
          />

          <ProgramsFilteredGrid
            categoryLabels={t.common.categories}
            emptyMessage={
              programs.length === 0
                ? t.programs.category.empty
                : t.categories.detail.noMatches
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
