import type { Program } from "@ossperks/core";
import { getProgramsByCategory } from "@ossperks/data";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

import { ROUTES } from "@/constants/routes";
import { withLocalePrefix } from "@/i18n/navigation";
import { getProgram } from "@/lib/programs";
import { cn } from "@/lib/utils";

import { Button } from "../ui/button";
import { ProgramCard } from "./program-card";

export interface SimilarProgramsProps {
  program: Program;
  lang: string;
  labels: {
    similarTo: string;
    viewAll: string;
    more: string;
    learnMore: string;
    categories: Record<string, string>;
  };
}

export const SimilarPrograms = async ({
  program,
  lang,
  labels,
}: SimilarProgramsProps) => {
  const similarRaw = getProgramsByCategory(program.category)
    .filter((p) => p.slug !== program.slug)
    .slice(0, 3);
  const similarProgramsResolved = await Promise.all(
    similarRaw.map((p) => getProgram(p.slug, lang)),
  );
  const similarPrograms = similarProgramsResolved.filter(
    (p): p is NonNullable<typeof p> => p !== null,
  );

  if (!similarPrograms.length) {
    return null;
  }

  const renderCta = (className?: string) => (
    <Button
      nativeButton={false}
      render={
        <Link
          href={withLocalePrefix(lang, ROUTES.PROGRAMS)}
          transitionTypes={["nav-back"]}
        >
          {labels.viewAll}
          <ArrowRightIcon />
        </Link>
      }
      size="sm"
      variant="ghost"
      className={cn("text-fd-primary", className)}
    />
  );

  return (
    <section className="border-fd-border/60 mt-14 border-t pt-10">
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <h2 className="truncate text-xl font-semibold">
            {labels.similarTo.replace("{name}", program.name)}
          </h2>
        </div>
        {renderCta("max-sm:hidden")}
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {similarPrograms.map((p) => {
          const similarCategoryLabel =
            labels.categories[p.category as keyof typeof labels.categories] ??
            p.category;
          const programHref = withLocalePrefix(
            lang,
            `${ROUTES.PROGRAMS}/${p.slug}` as `/${string}`,
          );
          return (
            <ProgramCard
              categoryLabel={similarCategoryLabel}
              key={p.slug}
              learnMore={labels.learnMore}
              more={labels.more}
              program={p}
              programHref={programHref}
            />
          );
        })}
      </div>
      {renderCta("mt-4 w-full sm:hidden")}
    </section>
  );
};
