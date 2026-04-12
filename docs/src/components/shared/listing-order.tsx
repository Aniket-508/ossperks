"use client";

import { useQueryStates } from "nuqs";
import { useCallback } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  ProgramsSortParser,
  TagsBrowseSortParser,
} from "@/lib/search-params";
import { cn } from "@/lib/utils";

export interface ListingOrderOption {
  label: string;
  value: string;
}

export type ListingOrderParsers =
  | { sort: ProgramsSortParser }
  | { sort: TagsBrowseSortParser };

export interface ListingOrderProps {
  className?: string;
  labels: { placeholder: string };
  options: ListingOrderOption[];
  parsers: ListingOrderParsers;
}

export const ListingOrder = ({
  className,
  labels,
  options,
  parsers,
}: ListingOrderProps) => {
  const [{ sort }, setParams] = useQueryStates(parsers, {
    shallow: false,
  });

  const handleValueChange = useCallback(
    async (sortValue: string | null) => {
      await setParams({
        sort: sortValue,
      } as Parameters<typeof setParams>[0]);
    },
    [setParams],
  );

  return (
    <Select onValueChange={handleValueChange} value={sort}>
      <SelectTrigger
        aria-label={labels.placeholder}
        className={cn("w-auto min-w-36 max-sm:flex-1", className)}
        size="default"
      >
        <SelectValue placeholder={labels.placeholder} />
      </SelectTrigger>
      <SelectContent align="start" side="bottom" className="min-w-36">
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
