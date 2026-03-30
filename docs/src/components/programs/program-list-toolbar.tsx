"use client";

import { useQueryStates } from "nuqs";
import { useCallback, useMemo, useRef } from "react";

import { useSlashFocusSearch } from "@/components/hotkeys/use-slash-focus-search";
import { ListingOrderControl } from "@/components/shared/listing-order";
import type { ListingOrderOption } from "@/components/shared/listing-order";
import { ListingReset } from "@/components/shared/listing-reset";
import { ListingQueryField } from "@/components/shared/listing-search";
import { programListSearchParams } from "@/lib/search-params";

interface ToolbarCopy {
  orderBy: string;
  resetFilters: string;
  searchPlaceholder: string;
  sortNameAsc: string;
  sortNameDesc: string;
}

export const ProgramListToolbar = ({ labels }: { labels: ToolbarCopy }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  useSlashFocusSearch(inputRef);

  const [{ q, sort }, setParams] = useQueryStates(programListSearchParams, {
    shallow: false,
  });

  const hasActiveFilters = Boolean((q ?? "").trim() || sort);

  const resetFilters = useCallback(async () => {
    await setParams({ q: null, sort: null });
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

  const orderOptions = useMemo<ListingOrderOption[]>(
    () => [
      { label: labels.sortNameAsc, value: "name-asc" },
      { label: labels.sortNameDesc, value: "name-desc" },
    ],
    [labels.sortNameAsc, labels.sortNameDesc],
  );

  return (
    <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <ListingQueryField
          inputRef={inputRef}
          labels={{ searchPlaceholder: labels.searchPlaceholder }}
          onChange={handleQueryChange}
          value={q ?? ""}
        />
        <ListingReset
          hasActiveFilters={hasActiveFilters}
          label={labels.resetFilters}
          onReset={resetFilters}
        />
      </div>
      <ListingOrderControl
        labelHeading={labels.orderBy}
        onSortValueChange={handleSortChange}
        options={orderOptions}
        sortValue={sort}
      />
    </div>
  );
};
