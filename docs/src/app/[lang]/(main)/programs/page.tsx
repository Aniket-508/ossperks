import {
  programs,
  getCategories,
  getAllPerkTypes,
  getProgramPerkTypes,
} from "@ossperks/data";
import { Plus } from "lucide-react";
import type { Metadata } from "next";

import { ProgramSubmissionDialog } from "@/components/programs/program-submission-dialog";
import { ProgramsFilter } from "@/components/programs/programs-filter";
import { Button } from "@/components/ui/button";
import { getT } from "@/lib/get-t";
import { i18n } from "@/lib/i18n";

export const generateStaticParams = () =>
  i18n.languages.map((lang) => ({ lang }));

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> => {
  const { lang } = await params;
  const t = await getT(lang);
  return {
    description: t.programs.listing.description,
    openGraph: {
      description: t.programs.listing.description,
      images: [
        {
          alt: t.programs.listing.heading,
          height: 630,
          url: `/og/${lang}/programs`,
          width: 1200,
        },
      ],
      title: t.programs.listing.heading,
    },
    title: t.programs.listing.heading,
    twitter: {
      card: "summary_large_image",
      description: t.programs.listing.description,
      images: [`/og/${lang}/programs`],
      title: t.programs.listing.heading,
    },
  };
};

export default async function ProgramsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const t = await getT(lang);
  const categories = getCategories();
  const perkTypes = getAllPerkTypes();

  const programsWithPerkTypes = programs.map((p) => ({
    ...p,
    perkTypes: getProgramPerkTypes(p),
  }));

  return (
    <div className="container flex-1 flex flex-col w-full py-12 px-4 mx-auto">
      <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            {t.programs.listing.heading}
          </h1>
          <p className="text-fd-muted-foreground text-lg max-w-2xl">
            {programs.length} curated programs for open-source projects.{" "}
            {t.programs.listing.description}
          </p>
        </div>
        <div className="shrink-0">
          <ProgramSubmissionDialog
            trigger={
              <Button size="lg">
                <Plus />
                {t.programs.submit.buttonText}
              </Button>
            }
            translations={t.programs.submit}
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
