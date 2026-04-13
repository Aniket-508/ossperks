"use client";

import { useQueryStates } from "nuqs";
import { useCallback, useMemo, useTransition } from "react";

import { ListingOrder } from "@/components/shared/listing-order";
import type { ListingOrderOption } from "@/components/shared/listing-order";
import { ListingSearch } from "@/components/shared/listing-search";
import { programListSearchParams } from "@/lib/search-params";

interface ToolbarCopy {
  orderBy: string;
  resetFilters: string;
  searchPlaceholder: string;
  sortNameAsc: string;
  sortNameDesc: string;
}

export const ProgramListToolbar = ({ labels }: { labels: ToolbarCopy }) => {
  const [, startTransition] = useTransition();
  const [{ q, sort }, setParams] = useQueryStates(programListSearchParams, {
    shallow: false,
    startTransition,
  });

  const hasActiveFilters = Boolean(q.trim() || sort);

  const resetFilters = useCallback(async () => {
    await setParams(null);
  }, [setParams]);

  const orderOptions = useMemo<ListingOrderOption[]>(
    () => [
      { label: labels.sortNameAsc, value: "name-asc" },
      { label: labels.sortNameDesc, value: "name-desc" },
    ],
    [labels.sortNameAsc, labels.sortNameDesc],
  );

  return (
    <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-center">
      <ListingSearch
        labels={{
          resetLabel: labels.resetFilters,
          searchPlaceholder: labels.searchPlaceholder,
        }}
        onReset={resetFilters}
        parsers={{ q: programListSearchParams.q }}
        showReset={hasActiveFilters}
      />
      <ListingOrder
        labels={{ placeholder: labels.orderBy }}
        options={orderOptions}
        parsers={{ sort: programListSearchParams.sort }}
      />
    </div>
  );
};
