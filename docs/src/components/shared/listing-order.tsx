"use client";

import { useCallback } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface ListingOrderOption {
  label: string;
  value: string;
}

export const ListingOrderControl = ({
  className,
  labelHeading,
  onSortValueChange,
  options,
  sortValue,
}: {
  className?: string;
  labelHeading: string;
  onSortValueChange: (value: string | null) => void | Promise<void>;
  options: ListingOrderOption[];
  sortValue: string | null | undefined;
}) => {
  const handleValueChange = useCallback(
    async (next: string | null) => {
      await onSortValueChange(next);
    },
    [onSortValueChange],
  );

  return (
    <Select onValueChange={handleValueChange} value={sortValue ?? null}>
      <SelectTrigger
        aria-label={labelHeading}
        className={cn("w-[200px]", className)}
        size="default"
      >
        <SelectValue placeholder={labelHeading} />
      </SelectTrigger>
      <SelectContent align="start" side="bottom">
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
