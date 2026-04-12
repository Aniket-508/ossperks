"use client";

import type { Category, PerkType } from "@ossperks/core";
import { SearchIcon, XIcon } from "lucide-react";
import { useQueryStates } from "nuqs";
import { useCallback, useMemo, useRef, ViewTransition } from "react";

import { useSlashFocusSearch } from "@/components/hotkeys/use-slash-focus-search";
import { ProgramCard } from "@/components/programs/program-card";
import type { ProgramsListingCopy } from "@/components/programs/programs-listing-types";
import { ListingFilters } from "@/components/shared/listing-filters";
import type {
  ListingFiltersData,
  ListingFiltersSelection,
} from "@/components/shared/listing-filters";
import { ListingOrderControl } from "@/components/shared/listing-order";
import type { ListingOrderOption } from "@/components/shared/listing-order";
import {
  Input,
  InputButton,
  InputIcon,
  InputRoot,
} from "@/components/ui/input";
import { withLocalePrefix } from "@/i18n/navigation";
import {
  collectDistinctTags,
  filterProgramsIndex,
} from "@/lib/programs-index-filter";
import type { ProgramWithPerkTypes } from "@/lib/programs-index-filter";
import { programsSearchParams } from "@/lib/search-params";

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
  const inputRef = useRef<HTMLInputElement>(null);
  useSlashFocusSearch(inputRef);

  const [
    { q, sort, categories: urlCategories, types: urlTypes, tags: urlTags },
    setParams,
  ] = useQueryStates(programsSearchParams, { shallow: false });

  const appliedQ = q ?? "";
  const appliedSort = sort ?? null;

  const filtered = useMemo(
    () =>
      filterProgramsIndex(programs, {
        categories: urlCategories,
        q: appliedQ,
        sort: appliedSort,
        tags: urlTags,
        types: urlTypes,
      }),
    [programs, appliedQ, appliedSort, urlCategories, urlTypes, urlTags],
  );

  const resetAll = useCallback(async () => {
    await setParams({
      categories: [],
      q: null,
      sort: null,
      tags: [],
      types: [],
    });
  }, [setParams]);

  const handleQueryChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value: next } = e.target;
      await setParams({ q: next === "" ? null : next });
    },
    [setParams],
  );

  const handleSortChange = useCallback(
    async (sortValue: string | null) => {
      await setParams({
        sort: sortValue,
      } as Parameters<typeof setParams>[0]);
    },
    [setParams],
  );

  const handleApplyListingFilters = useCallback(
    async (next: ListingFiltersSelection) => {
      await setParams({
        categories: (next.categories ?? []) as Category[],
        tags: next.tags ?? [],
        types: (next.types ?? []) as PerkType[],
      } as Parameters<typeof setParams>[0]);
    },
    [setParams],
  );

  const distinctTags = useMemo(() => collectDistinctTags(programs), [programs]);

  const hasActiveFilters = Boolean(
    appliedQ.trim() ||
    appliedSort ||
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

  const listingFiltersData = useMemo<ListingFiltersData>(
    () => ({
      applied: {
        categories: [...urlCategories],
        tags: [...urlTags],
        types: [...urlTypes],
      },
      labels: {
        apply: translations.filters.apply,
        clearAll: translations.filters.clearAll,
        emptySection: translations.filters.emptySection,
        filterButton: translations.filters.filterButton,
        removeChip: translations.filters.removeChip,
        reset: translations.filters.reset,
        select: translations.filters.select,
      },
      onApply: handleApplyListingFilters,
      sections: [
        {
          emptySelectionLabel: translations.filters.allCategories,
          id: "categories",
          itemKey: String,
          itemLabel: (item) => categoryLabels[String(item)] ?? String(item),
          items: categories,
          searchPlaceholder: translations.filters.searchCategories,
          title: translations.filters.sectionCategories,
        },
        {
          emptySelectionLabel: translations.filters.allTypes,
          id: "types",
          itemKey: String,
          itemLabel: (item) => perkTypeLabels[String(item)] ?? String(item),
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
    }),
    [
      categories,
      categoryLabels,
      distinctTags,
      handleApplyListingFilters,
      perkTypeLabels,
      perkTypes,
      translations.filters,
      urlCategories,
      urlTags,
      urlTypes,
    ],
  );

  return (
    <>
      <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <InputRoot className="min-w-0 flex-1">
            <InputIcon render={<SearchIcon />} />
            <Input
              ref={inputRef}
              placeholder={translations.listing.searchPlaceholder}
              value={appliedQ}
              onChange={handleQueryChange}
            />
            {hasActiveFilters && (
              <InputButton onClick={resetAll}>
                <XIcon /> Reset
              </InputButton>
            )}
          </InputRoot>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ListingOrderControl
            labelHeading={translations.listing.orderBy}
            onSortValueChange={handleSortChange}
            options={orderOptions}
            sortValue={sort}
          />
          <ListingFilters data={listingFiltersData} />
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

      <div className="grid gap-4 sm:grid-cols-2">
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
