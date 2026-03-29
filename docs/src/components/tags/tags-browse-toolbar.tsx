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
import { tagsBrowseSearchParams } from "@/lib/search-params";
import type { TagsBrowseSort } from "@/lib/tags-browse-server";
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

  const setLetter = useCallback(
    async (next: string) => {
      await setParams({
        letter: next,
        page: 1,
      });
    },
    [setParams],
  );

  const setSort = useCallback(
    async (value: TagsBrowseSort | null) => {
      await setParams({
        page: 1,
        sort: value,
      });
    },
    [setParams],
  );

  const handleSearchInput = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      await setParams({ page: 1, q: value === "" ? null : value });
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

  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <div className="relative min-w-0 flex-1">
            <Search className="text-fd-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
            <Input
              aria-label={labels.searchPlaceholder}
              className="pl-9"
              inputSize="default"
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
            <SelectItem value="count-desc">{labels.sortCountDesc}</SelectItem>
            <SelectItem value="count-asc">{labels.sortCountAsc}</SelectItem>
          </SelectContent>
        </Select>
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
