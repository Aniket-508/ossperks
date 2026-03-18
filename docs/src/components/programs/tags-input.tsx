"use client";

import { formatSlug } from "@ossperks/core";
import { Plus } from "lucide-react";
import React, { useCallback, useMemo, useState } from "react";

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  useComboboxAnchor,
} from "@/components/ui/combobox";

interface TagsInputProps {
  items: string[];
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  addNewLabel?: string;
  noResultsLabel?: string;
}

export const TagsInput = ({
  items,
  value,
  onChange,
  placeholder,
  disabled = false,
  addNewLabel = 'Add "{value}"',
  noResultsLabel = "No tags found.",
}: TagsInputProps) => {
  const [inputValue, setInputValue] = useState("");
  const anchor = useComboboxAnchor();

  const allItems = useMemo(() => {
    const merged = new Set([...items, ...value]);
    return [...merged].toSorted();
  }, [items, value]);

  const filteredItems = useMemo(() => {
    if (!inputValue) {
      return allItems;
    }
    const lower = inputValue.toLowerCase();
    return allItems.filter((item) => item.toLowerCase().includes(lower));
  }, [allItems, inputValue]);

  const canCreate = useMemo(() => {
    const slug = formatSlug(inputValue);
    return slug.length > 0 && !allItems.includes(slug);
  }, [inputValue, allItems]);

  const handleValueChange = useCallback(
    (newValue: string[]) => {
      onChange(newValue);
    },
    [onChange]
  );

  const handleCreateTag = useCallback(() => {
    const slug = formatSlug(inputValue);
    if (slug && !value.includes(slug)) {
      onChange([...value, slug]);
      setInputValue("");
    }
  }, [inputValue, value, onChange]);

  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && canCreate) {
        e.preventDefault();
        handleCreateTag();
      }
    },
    [canCreate, handleCreateTag]
  );

  return (
    <Combobox
      multiple
      value={value}
      onValueChange={handleValueChange}
      onInputValueChange={setInputValue}
      inputValue={inputValue}
      disabled={disabled}
    >
      {/* eslint-disable react-perf/jsx-no-new-function-as-prop */}
      <ComboboxChips ref={anchor}>
        {value.map((tag) => (
          <ComboboxChip key={tag} value={tag}>
            {tag}
          </ComboboxChip>
        ))}
        <ComboboxChipsInput
          placeholder={value.length === 0 ? placeholder : undefined}
          onKeyDown={handleInputKeyDown}
        />
      </ComboboxChips>

      <ComboboxContent anchor={anchor}>
        <ComboboxList>
          {(item: string) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
        {canCreate && (
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              handleCreateTag();
            }}
            className="flex w-full items-center gap-2 border-t border-border px-2 py-1.5 text-sm text-fd-primary hover:bg-accent cursor-pointer"
          >
            <Plus className="size-3.5" />
            {addNewLabel.replace("{value}", formatSlug(inputValue))}
          </button>
        )}
        {filteredItems.length === 0 && !canCreate && (
          <ComboboxEmpty>{noResultsLabel}</ComboboxEmpty>
        )}
      </ComboboxContent>
      {/* eslint-enable react-perf/jsx-no-new-function-as-prop */}
    </Combobox>
  );
};
