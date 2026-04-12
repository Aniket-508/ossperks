"use client";

import { SearchIcon, XIcon } from "lucide-react";
import { useQueryStates } from "nuqs";
import { useCallback, useMemo, useRef } from "react";

import { useSlashFocusSearch } from "@/components/hotkeys/use-slash-focus-search";
import { LetterFilter } from "@/components/shared/letter-filter";
import { ListingOrder } from "@/components/shared/listing-order";
import type { ListingOrderOption } from "@/components/shared/listing-order";
import {
  InputIcon,
  InputRoot,
  Input,
  InputButton,
} from "@/components/ui/input";
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
  const inputRef = useRef<HTMLInputElement>(null);
  useSlashFocusSearch(inputRef);

  const [{ letter, q, sort }, setParams] = useQueryStates(
    tagsBrowseSearchParams,
    {
      shallow: false,
    },
  );

  const hasActiveFilters = Boolean(
    (q ?? "").trim() || sort || (letter ?? "").length > 0,
  );

  const resetFilters = useCallback(async () => {
    await setParams(null);
  }, [setParams]);

  const handleQueryChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value: next } = e.target;
      await setParams({
        page: 1,
        q: next === "" || next === null ? null : next,
      });
    },
    [setParams],
  );

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
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <InputRoot className="min-w-0 flex-1">
            <InputIcon render={<SearchIcon />} />
            <Input
              ref={inputRef}
              placeholder={labels.searchPlaceholder}
              value={q ?? ""}
              onChange={handleQueryChange}
            />
            {hasActiveFilters && (
              <InputButton onClick={resetFilters} type="button">
                <XIcon /> {labels.resetFilters}
              </InputButton>
            )}
          </InputRoot>
        </div>
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
