"use client";

import { SearchIcon } from "lucide-react";
import { useQueryStates } from "nuqs";
import { useCallback, useMemo, useRef } from "react";

import { useSlashFocusSearch } from "@/components/hotkeys/use-slash-focus-search";
import { ListingOrderControl } from "@/components/shared/listing-order";
import type { ListingOrderOption } from "@/components/shared/listing-order";
import { ListingReset } from "@/components/shared/listing-reset";
import { Button } from "@/components/ui/button";
import { InputIcon, InputRoot, Input } from "@/components/ui/input";
import { tagsBrowseSearchParams } from "@/lib/search-params";
import { cn } from "@/lib/utils";

const LETTERS = [..."abcdefghijklmnopqrstuvwxyz"];

interface BrowseCopy {
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

const LetterCharButton = ({
  isActive,
  letter,
  onPick,
}: {
  isActive: boolean;
  letter: string;
  onPick: (l: string) => void | Promise<void>;
}) => {
  const handleClick = useCallback(async () => {
    await onPick(letter);
  }, [letter, onPick]);

  return (
    <Button
      className={cn(
        "size-8 px-0 font-mono text-xs",
        isActive && "border-primary",
      )}
      onClick={handleClick}
      size="sm"
      type="button"
      variant={isActive ? "default" : "outline"}
    >
      {letter.toUpperCase()}
    </Button>
  );
};

interface TagsBrowseToolbarProps {
  labels: BrowseCopy;
}

export const TagsBrowseToolbar = ({ labels }: TagsBrowseToolbarProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  useSlashFocusSearch(inputRef);

  const [{ letter, q, sort }, setParams] = useQueryStates(
    tagsBrowseSearchParams,
    { shallow: false },
  );

  const hasActiveFilters = Boolean(
    (q ?? "").trim() || sort || (letter ?? "").length > 0,
  );

  const resetFilters = useCallback(async () => {
    await setParams({
      letter: "",
      page: 1,
      q: null,
      sort: null,
    });
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

  const handleSortChange = useCallback(
    async (sortValue: string | null) => {
      await setParams({
        page: 1,
        sort: sortValue,
      } as Parameters<typeof setParams>[0]);
    },
    [setParams],
  );

  const setLetter = useCallback(
    async (next: string) => {
      await setParams({
        letter: next,
        page: 1,
      });
    },
    [setParams],
  );

  const handleLetterAll = useCallback(async () => {
    await setLetter("");
  }, [setLetter]);

  const handleLetterChar = useCallback(
    async (l: string) => {
      const activeLetter = letter ?? "";
      await setLetter(activeLetter === l ? "" : l);
    },
    [letter, setLetter],
  );

  const handleLetterOther = useCallback(async () => {
    const activeLetter = letter ?? "";
    await setLetter(activeLetter === "other" ? "" : "other");
  }, [letter, setLetter]);

  const activeLetter = letter ?? "";

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
          </InputRoot>
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

      <div className="flex flex-wrap gap-1">
        <Button
          className={cn(
            "size-8 px-0 font-mono text-xs",
            activeLetter === "" && "border-primary",
          )}
          onClick={handleLetterAll}
          size="sm"
          type="button"
          variant={activeLetter === "" ? "default" : "outline"}
        >
          {labels.letterAll}
        </Button>
        {LETTERS.map((l) => (
          <LetterCharButton
            isActive={activeLetter === l}
            key={l}
            letter={l}
            onPick={handleLetterChar}
          />
        ))}
        <Button
          className={cn(
            "size-8 px-0 font-mono text-xs",
            activeLetter === "other" && "border-primary",
          )}
          onClick={handleLetterOther}
          size="sm"
          type="button"
          variant={activeLetter === "other" ? "default" : "outline"}
        >
          {labels.letterOther}
        </Button>
      </div>
    </div>
  );
};
