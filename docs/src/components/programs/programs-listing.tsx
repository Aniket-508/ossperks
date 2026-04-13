"use client";

import type { Category, PerkType } from "@ossperks/core";
import { useQueryStates } from "nuqs";
import { useCallback, useMemo, useTransition, ViewTransition } from "react";

import { ProgramCard } from "@/components/programs/program-card";
import type { ProgramsListingCopy } from "@/components/programs/programs-listing-types";
import { ListingFilters } from "@/components/shared/listing-filters";
import { ListingOrder } from "@/components/shared/listing-order";
import type { ListingOrderOption } from "@/components/shared/listing-order";
import { ListingSearch } from "@/components/shared/listing-search";
import { withLocalePrefix } from "@/i18n/navigation";
import {
  collectDistinctTags,
  filterProgramsIndex,
} from "@/lib/programs-filter";
import type { ProgramWithPerkTypes } from "@/lib/programs-filter";
import { programsFacetParams, programsSearchParams } from "@/lib/search-params";
import { cn } from "@/lib/utils";

export type { ProgramsListingCopy } from "@/components/programs/programs-listing-types";

interface ProgramsListingProps {
  programs: ProgramWithPerkTypes[];
  categories: Category[];
  perkTypes: PerkType[];
  lang: string;
  translations: ProgramsListingCopy;
  categoryLabels: Record<string, string>;
  perkTypeLabels: Record<string, string>;
}

export const ProgramsListing = ({
  programs,
  categories,
  perkTypes,
  lang,
  translations,
  categoryLabels,
  perkTypeLabels,
}: ProgramsListingProps) => {
  const [isPending, startTransition] = useTransition();
  const [
    { q, sort, categories: urlCategories, types: urlTypes, tags: urlTags },
    setParams,
  ] = useQueryStates(programsSearchParams, {
    shallow: true,
    startTransition,
  });

  const filtered = useMemo(
    () =>
      filterProgramsIndex(programs, {
        categories: urlCategories,
        q,
        sort,
        tags: urlTags,
        types: urlTypes,
      }),
    [programs, q, sort, urlCategories, urlTypes, urlTags],
  );

  const resetAll = useCallback(async () => {
    await setParams(null);
  }, [setParams]);

  const distinctTags = useMemo(() => collectDistinctTags(programs), [programs]);

  const hasActiveFilters = Boolean(
    q.trim() ||
    sort ||
    urlCategories.length > 0 ||
    urlTypes.length > 0 ||
    urlTags.length > 0,
  );

  const orderOptions = useMemo<ListingOrderOption[]>(
    () => [
      { label: translations.listing.sortNameAsc, value: "name-asc" },
      { label: translations.listing.sortNameDesc, value: "name-desc" },
    ],
    [translations.listing.sortNameAsc, translations.listing.sortNameDesc],
  );

  const filterSections = useMemo(
    () => [
      {
        emptySelectionLabel: translations.filters.allCategories,
        id: "categories",
        itemKey: (item: unknown) => String(item) as string,
        itemLabel: (item: unknown) =>
          categoryLabels[String(item)] ?? String(item),
        items: categories,
        searchPlaceholder: translations.filters.searchCategories,
        title: translations.filters.sectionCategories,
      },
      {
        emptySelectionLabel: translations.filters.allTypes,
        id: "types",
        itemKey: (item: unknown) => String(item) as string,
        itemLabel: (item: unknown) =>
          perkTypeLabels[String(item)] ?? String(item),
        items: perkTypes,
        searchPlaceholder: translations.filters.searchTypes,
        title: translations.filters.sectionTypes,
      },
      {
        emptySelectionLabel: translations.filters.allTags,
        id: "tags",
        itemKey: String,
        itemLabel: String,
        items: distinctTags,
        searchPlaceholder: translations.filters.searchTags,
        title: translations.filters.sectionTags,
      },
    ],
    [
      categories,
      categoryLabels,
      distinctTags,
      perkTypeLabels,
      perkTypes,
      translations.filters,
    ],
  );

  const filterLabels = useMemo(
    () => ({
      apply: translations.filters.apply,
      clearAll: translations.filters.clearAll,
      emptySection: translations.filters.emptySection,
      filterButton: translations.filters.filterButton,
      removeChip: translations.filters.removeChip,
      reset: translations.filters.reset,
      select: translations.filters.select,
    }),
    [translations.filters],
  );

  return (
    <>
      <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <ListingSearch
            labels={{
              resetLabel: translations.filters.reset,
              searchPlaceholder: translations.listing.searchPlaceholder,
            }}
            onReset={resetAll}
            parsers={{ q: programsSearchParams.q }}
            shallow
            showReset={hasActiveFilters}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ListingOrder
            labels={{ placeholder: translations.listing.orderBy }}
            options={orderOptions}
            parsers={{ sort: programsSearchParams.sort }}
            shallow
          />
          <ListingFilters
            labels={filterLabels}
            parsers={programsFacetParams}
            sections={filterSections}
          />
        </div>
      </div>

      {filtered.length === programs.length ? null : (
        <p className="text-fd-muted-foreground mb-4 text-sm">
          {translations.filters.showingCount.replace(
            "{count}",
            String(filtered.length),
          )}
        </p>
      )}

      <div
        className={cn(
          "grid gap-4 transition-opacity sm:grid-cols-2",
          isPending && "pointer-events-none opacity-60",
        )}
      >
        {filtered.map((program) => {
          const categoryLabel =
            categoryLabels[program.category] ?? program.category;
          const programHref = withLocalePrefix(
            lang,
            `/programs/${program.slug}` as `/${string}`,
          );
          return (
            <ViewTransition key={program.slug}>
              <ProgramCard
                categoryLabel={categoryLabel}
                learnMore={translations.learnMore}
                more={translations.more}
                program={program}
                programHref={programHref}
              />
            </ViewTransition>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-fd-muted/30 rounded-lg border border-dashed p-12 text-center">
          <p className="text-fd-muted-foreground">
            {translations.filters.noMatches}
          </p>
        </div>
      ) : null}
    </>
  );
};
