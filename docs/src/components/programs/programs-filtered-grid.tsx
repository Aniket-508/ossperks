"use client";

import type { Program } from "@ossperks/core";
import { useQueryStates } from "nuqs";
import { useMemo, useTransition } from "react";

import { ProgramCard } from "@/components/programs/program-card";
import { filterSortPrograms } from "@/lib/programs-filter";
import { programListSearchParams } from "@/lib/search-params";
import { cn } from "@/lib/utils";

interface ProgramsFilteredGridProps {
  categoryLabels: Record<string, string>;
  emptyMessage: string;
  learnMore: string;
  more: string;
  programHrefPrefix: string;
  programs: Program[];
}

export const ProgramsFilteredGrid = ({
  categoryLabels,
  emptyMessage,
  learnMore,
  more,
  programHrefPrefix,
  programs,
}: ProgramsFilteredGridProps) => {
  const [isPending, startTransition] = useTransition();
  const [{ q, sort }] = useQueryStates(programListSearchParams, {
    shallow: true,
    startTransition,
  });

  const filtered = useMemo(
    () => filterSortPrograms(programs, { q, sort }),
    [programs, q, sort],
  );

  if (filtered.length === 0) {
    return (
      <div className="bg-fd-muted/30 rounded-lg border border-dashed p-12 text-center">
        <p className="text-fd-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid gap-4 transition-opacity md:grid-cols-2",
        isPending && "pointer-events-none opacity-60",
      )}
    >
      {filtered.map((program) => {
        const categoryLabel =
          categoryLabels[program.category] ?? program.category;
        return (
          <ProgramCard
            categoryLabel={categoryLabel}
            key={program.slug}
            learnMore={learnMore}
            more={more}
            program={program}
            programHref={`${programHrefPrefix}/${program.slug}`}
          />
        );
      })}
    </div>
  );
};
