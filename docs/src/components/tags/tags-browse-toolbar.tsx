"use client";

import { useQueryStates } from "nuqs";
import { useCallback, useMemo } from "react";

import { LetterFilter } from "@/components/shared/letter-filter";
import { ListingOrder } from "@/components/shared/listing-order";
import type { ListingOrderOption } from "@/components/shared/listing-order";
import { ListingSearch } from "@/components/shared/listing-search";
import {
  tagsBrowseLetterParams,
  tagsBrowseSearchParams,
} from "@/lib/search-params";

interface TagsBrowseLabels {
  letterAll: string;
  letterOther: string;
  orderBy: string;
  resetFilters: string;
  searchPlaceholder: string;
  sortCountAsc: string;
  sortCountDesc: string;
  sortNameAsc: string;
  sortNameDesc: string;
}

interface TagsBrowseToolbarProps {
  labels: TagsBrowseLabels;
}

export const TagsBrowseToolbar = ({ labels }: TagsBrowseToolbarProps) => {
  const [{ q, sort, letter }, setParams] = useQueryStates(
    tagsBrowseSearchParams,
    { shallow: false },
  );

  const hasActiveFilters = Boolean(
    q.trim() || sort || (letter ?? "").length > 0,
  );

  const resetFilters = useCallback(async () => {
    await setParams(null);
  }, [setParams]);

  const orderOptions = useMemo<ListingOrderOption[]>(
    () => [
      { label: labels.sortNameAsc, value: "name-asc" },
      { label: labels.sortNameDesc, value: "name-desc" },
      { label: labels.sortCountDesc, value: "count-desc" },
      { label: labels.sortCountAsc, value: "count-asc" },
    ],
    [
      labels.sortCountAsc,
      labels.sortCountDesc,
      labels.sortNameAsc,
      labels.sortNameDesc,
    ],
  );

  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <ListingSearch
          labels={{
            resetLabel: labels.resetFilters,
            searchPlaceholder: labels.searchPlaceholder,
          }}
          onReset={resetFilters}
          parsers={{ q: tagsBrowseSearchParams.q }}
          showReset={hasActiveFilters}
        />
        <ListingOrder
          labels={{ placeholder: labels.orderBy }}
          options={orderOptions}
          parsers={{ sort: tagsBrowseSearchParams.sort }}
        />
      </div>

      <LetterFilter
        labels={{ all: labels.letterAll, other: labels.letterOther }}
        parsers={tagsBrowseLetterParams}
      />
    </div>
  );
};
