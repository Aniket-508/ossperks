"use client";

import { Search } from "lucide-react";
import type { RefObject } from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const ListingQueryField = ({
  className,
  inputRef,
  labels,
  onChange,
  value,
}: {
  className?: string;
  inputRef: RefObject<HTMLInputElement | null>;
  labels: { searchPlaceholder: string };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
}) => (
  <div className={cn("relative min-w-0 flex-1", className)}>
    <Search className="text-fd-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
    <Input
      aria-label={labels.searchPlaceholder}
      className="pl-9"
      inputSize="default"
      onChange={onChange}
      placeholder={labels.searchPlaceholder}
      ref={inputRef}
      value={value}
    />
  </div>
);
