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
    <div className={cn("w-full min-w-[200px] lg:w-[240px]", className)}>
      <Select onValueChange={handleValueChange} value={sortValue ?? null}>
        <SelectTrigger
          aria-label={labelHeading}
          className="w-full min-w-0"
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
    </div>
  );
};
