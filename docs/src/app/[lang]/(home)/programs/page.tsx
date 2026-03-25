import {
  getCategories,
  getAllPerkTypes,
  getProgramPerkTypes,
} from "@ossperks/core";
import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { ProgramsFilter } from "@/components/programs/programs-filter";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { generateLangParams } from "@/i18n/config";
import { getT } from "@/i18n/get-t";
import { withLocalePrefix } from "@/i18n/navigation";
import { getPrograms } from "@/lib/programs";
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
    description: t.programs.listing.description,
    lang,
    path: "/programs",
    title: t.programs.listing.heading,
  });
};

export default async function ProgramsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
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
    <div className="container mx-auto flex w-full flex-1 flex-col px-4 py-12">
      <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="mb-2 text-4xl font-bold">
            {t.programs.listing.heading}
          </h1>
          <p className="text-fd-muted-foreground max-w-2xl text-lg">
            {translatedPrograms.length} curated programs for open-source
            projects. {t.programs.listing.description}
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

      <ProgramsFilter
        programs={programsWithPerkTypes}
        categories={categories}
        perkTypes={perkTypes}
        lang={lang}
        translations={{
          filters: t.programs.filters,
          learnMore: t.programs.learnMore,
          more: t.programs.more,
        }}
        categoryLabels={t.common.categories}
      />
    </div>
  );
}
