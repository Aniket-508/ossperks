"use client";

import { useQueryStates } from "nuqs";
import { useCallback } from "react";

import { Button } from "@/components/ui/button";
import type { LetterFilterParsers } from "@/lib/search-params";
import { cn } from "@/lib/utils";

const LETTERS = [...("abcdefghijklmnopqrstuvwxyz" as const)];

export interface LetterFilterLabels {
  all: string;
  other: string;
}

export interface LetterFilterProps {
  labels: LetterFilterLabels;
  parsers: LetterFilterParsers;
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
      className={cn("font-mono text-xs", isActive && "border-primary")}
      onClick={handleClick}
      size="icon-sm"
      type="button"
      variant={isActive ? "default" : "outline"}
    >
      {letter.toUpperCase()}
    </Button>
  );
};

export const LetterFilter = ({ labels, parsers }: LetterFilterProps) => {
  const [params, setParams] = useQueryStates(parsers, {
    shallow: false,
  });

  const letter = params.letter ?? "";

  const setLetter = useCallback(
    async (next: string) => {
      await setParams({
        letter: next,
      });
    },
    [setParams],
  );

  const handleLetterChar = useCallback(
    async (l: string) => {
      await setLetter(letter === l ? "" : l);
    },
    [letter, setLetter],
  );

  const handleLetterOther = useCallback(async () => {
    await setLetter(letter === "other" ? "" : "other");
  }, [letter, setLetter]);

  const handleLetterAll = useCallback(async () => {
    await setLetter("");
  }, [setLetter]);

  return (
    <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(2rem,1fr))] gap-1">
      <Button
        className={cn(
          "size-8 px-0 font-mono text-xs",
          letter === "" && "border-primary",
        )}
        onClick={handleLetterAll}
        size="sm"
        type="button"
        variant={letter === "" ? "default" : "outline"}
      >
        {labels.all}
      </Button>
      {LETTERS.map((l) => (
        <LetterCharButton
          isActive={letter === l}
          key={l}
          letter={l}
          onPick={handleLetterChar}
        />
      ))}
      <LetterCharButton
        isActive={letter === "other"}
        letter="#"
        onPick={handleLetterOther}
      />
    </div>
  );
};
