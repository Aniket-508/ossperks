import {
  getCategories,
  getAllPerkTypes,
  getProgramPerkTypes,
  PERK_TYPE_LABELS,
} from "@ossperks/core";
import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import type { SearchParams } from "nuqs/server";
import { ViewTransition } from "react";

import { ProgramsListing } from "@/components/programs/programs-listing";
import { PageBreadcrumb } from "@/components/shared/page-breadcrumb";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { generateLangParams } from "@/i18n/config";
import { getT } from "@/i18n/get-t";
import { withLocalePrefix } from "@/i18n/navigation";
import { getPrograms } from "@/lib/programs";
import { programsParamsCache } from "@/lib/search-params";
import { BreadcrumbJsonLd, ProgramListJsonLd } from "@/seo/json-ld";
import { createMetadata } from "@/seo/metadata";

export const generateStaticParams = generateLangParams;

export const generateMetadata = async ({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> => {
  const { lang } = await params;
  await programsParamsCache.parse(searchParams);
  const t = await getT(lang);

  const translatedPrograms = await getPrograms(lang);
  return createMetadata({
    description: t.programs.listing.intro.replace(
      "{count}",
      String(translatedPrograms.length),
    ),
    lang,
    path: "/programs",
    title: t.programs.listing.heading,
  });
};

export default async function ProgramsPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { lang } = await params;
  await programsParamsCache.parse(searchParams);
  const [t, translatedPrograms] = await Promise.all([
    getT(lang),
    getPrograms(lang),
  ]);
  const categories = getCategories();
  const perkTypes = getAllPerkTypes();

  const programsWithPerkTypes = translatedPrograms.map((p) => ({
    ...p,
    perkTypes: getProgramPerkTypes(p),
  }));

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
          { name: t.programs.listing.heading, path: ROUTES.PROGRAMS },
        ]}
        lang={lang}
      />
      <ProgramListJsonLd
        lang={lang}
        programs={translatedPrograms.map((p) => ({
          name: p.name,
          slug: p.slug,
        }))}
      />
      <div className="mx-auto flex w-full max-w-(--fd-layout-width) flex-1 flex-col px-4 py-12">
        <PageBreadcrumb
          homeHref={withLocalePrefix(lang, ROUTES.HOME)}
          homeLabel={t.common.breadcrumbHome}
          segments={[{ current: true, label: t.programs.listing.heading }]}
        />
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="mb-2 text-4xl font-bold">
              {t.programs.listing.heading}
            </h1>
            <p className="text-fd-muted-foreground max-w-2xl text-lg">
              {t.programs.listing.intro.replace(
                "{count}",
                String(translatedPrograms.length),
              )}
            </p>
          </div>
          <div className="shrink-0">
            <Button
              size="lg"
              nativeButton={false}
              render={
                <Link href={withLocalePrefix(lang, ROUTES.SUBMIT_PROGRAM)}>
                  <Plus />
                  {t.programs.submit.buttonText}
                </Link>
              }
            />
          </div>
        </div>

        <ProgramsListing
          categoryLabels={t.common.categories}
          categories={categories}
          lang={lang}
          perkTypeLabels={PERK_TYPE_LABELS}
          perkTypes={perkTypes}
          programs={programsWithPerkTypes}
          translations={{
            filters: t.programs.filters,
            learnMore: t.programs.learnMore,
            listing: t.programs.listing,
            more: t.programs.more,
          }}
        />
      </div>
    </ViewTransition>
  );
}
