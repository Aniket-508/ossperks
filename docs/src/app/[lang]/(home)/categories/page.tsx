import { getCategories, getProgramsByCategory } from "@ossperks/core";
import type { Category } from "@ossperks/core";
import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ViewTransition } from "react";

import { PageBreadcrumb } from "@/components/shared/page-breadcrumb";
import { ROUTES } from "@/constants/routes";
import { generateLangParams } from "@/i18n/config";
import { getT } from "@/i18n/get-t";
import { withLocalePrefix } from "@/i18n/navigation";
import { BreadcrumbJsonLd, CategoriesIndexItemListJsonLd } from "@/seo/json-ld";
import { createMetadata } from "@/seo/metadata";

export const generateStaticParams = generateLangParams;

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> => {
  const { lang } = await params;
  const t = await getT(lang);
  return createMetadata({
    description: t.categories.listing.intro,
    lang,
    path: ROUTES.CATEGORIES,
    title: t.categories.listing.heading,
  });
};

export default async function CategoriesListingPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const t = await getT(lang);
  const categories = getCategories();
  const categoriesForJsonLd = categories.map((category) => ({
    label:
      t.common.categories[category as keyof typeof t.common.categories] ??
      category,
    slug: category,
  }));

  return (
    <ViewTransition
      enter={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      exit={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      default="none"
    >
      <div>
      <BreadcrumbJsonLd
        items={[
          { name: t.common.breadcrumbHome, path: "/" },
          {
            name: t.categories.listing.breadcrumb,
            path: ROUTES.CATEGORIES,
          },
        ]}
        lang={lang}
      />
      <CategoriesIndexItemListJsonLd
        categories={categoriesForJsonLd}
        lang={lang}
        listName={t.categories.listing.heading}
      />
      <div className="view-container flex w-full flex-1 flex-col px-4 py-12">
        <PageBreadcrumb
          homeHref={withLocalePrefix(lang, ROUTES.HOME)}
          homeLabel={t.common.breadcrumbHome}
          segments={[{ current: true, label: t.categories.listing.breadcrumb }]}
        />
        <h1 className="mb-2 text-4xl font-bold">
          {t.categories.listing.heading}
        </h1>
        <p className="text-fd-muted-foreground mb-10 max-w-2xl text-lg">
          {t.categories.listing.intro}
        </p>

        <div className="grid gap-3 md:grid-cols-3">
          {categories.map((category) => {
            const count = getProgramsByCategory(category as Category).length;
            const label =
              t.common.categories[
                category as keyof typeof t.common.categories
              ] ?? category;
            const href = withLocalePrefix(
              lang,
              `${ROUTES.CATEGORIES}/${category}` as `/${string}`,
            );
            return (
              <Link
                className="border-fd-border/60 hover:bg-fd-muted/40 flex items-center justify-between gap-3 rounded-lg border px-4 py-3 transition-colors"
                href={href}
                key={category}
                transitionTypes={["nav-forward"]}
              >
                <div className="min-w-0">
                  <div className="truncate font-medium">{label}</div>
                  <div className="text-fd-muted-foreground text-sm">
                    {t.categories.listing.programsCount.replace(
                      "{count}",
                      String(count),
                    )}
                  </div>
                </div>
                <ChevronRight className="text-fd-muted-foreground size-4 shrink-0" />
              </Link>
            );
          })}
        </div>
      </div>
      </div>
    </ViewTransition>
  );
}
