"use client";

import { useHotkey } from "@tanstack/react-hotkeys";
import { SearchIcon, XIcon } from "lucide-react";
import { useQueryStates } from "nuqs";
import { useCallback, useRef } from "react";

import {
  Input,
  InputButton,
  InputIcon,
  InputRoot,
} from "@/components/ui/input";
import type { ListingQParser } from "@/lib/search-params";
import { cn } from "@/lib/utils";

export interface ListingSearchProps {
  className?: string;
  labels: { resetLabel: string; searchPlaceholder: string };
  onReset?: () => void;
  parsers: { q: ListingQParser };
  showReset?: boolean;
}

export const ListingSearch = ({
  className,
  labels,
  onReset,
  parsers,
  showReset,
}: ListingSearchProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useHotkey("/", (e) => {
    e.preventDefault();
    inputRef.current?.focus();
  });

  const [{ q }, setParams] = useQueryStates(parsers, { shallow: false });

  const handleQueryChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value: next } = e.target;
      await setParams({ q: next === "" ? null : next });
    },
    [setParams],
  );

  return (
    <InputRoot className={cn("flex-1", className)}>
      <InputIcon render={<SearchIcon />} />
      <Input
        ref={inputRef}
        placeholder={labels.searchPlaceholder}
        value={q}
        onChange={handleQueryChange}
      />
      {showReset && (
        <InputButton onClick={onReset} type="button">
          <XIcon /> {labels.resetLabel}
        </InputButton>
      )}
    </InputRoot>
  );
};
