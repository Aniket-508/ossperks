"use client";

import { Search } from "lucide-react";
import { useQueryStates } from "nuqs";
import { useCallback, useRef } from "react";

import { useSlashFocusSearch } from "@/components/hotkeys/use-slash-focus-search";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ProgramListSort } from "@/lib/program-list-server";
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

  const handleSearchInput = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      await setParams({ q: value === "" ? null : value });
    },
    [setParams],
  );

  const setSort = useCallback(
    async (value: ProgramListSort | null) => {
      await setParams({ sort: value });
    },
    [setParams],
  );

  return (
    <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <div className="relative min-w-0 flex-1">
          <Search className="text-fd-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
          <Input
            aria-label={labels.searchPlaceholder}
            className="pl-9"
            onChange={handleSearchInput}
            placeholder={labels.searchPlaceholder}
            ref={inputRef}
            value={q ?? ""}
          />
        </div>
        {hasActiveFilters ? (
          <Button
            className="shrink-0"
            onClick={resetFilters}
            size="default"
            type="button"
            variant="outline"
          >
            {labels.resetFilters}
          </Button>
        ) : null}
      </div>
      <Select
        onValueChange={setSort}
        value={sort === null || sort === undefined ? undefined : sort}
      >
        <SelectTrigger className="w-full min-w-[200px] lg:w-[240px]">
          <SelectValue placeholder={labels.orderBy} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name-asc">{labels.sortNameAsc}</SelectItem>
          <SelectItem value="name-desc">{labels.sortNameDesc}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
