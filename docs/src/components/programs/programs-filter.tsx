"use client";

import type { Category, PerkType, Program } from "@ossperks/core";
import { useCallback, useMemo, useState } from "react";

import { ProgramCard } from "@/components/programs/program-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { withLocalePrefix } from "@/lib/i18n";

interface ProgramWithPerkTypes extends Program {
  perkTypes: PerkType[];
}

interface ProgramsFilterProps {
  programs: ProgramWithPerkTypes[];
  categories: Category[];
  perkTypes: PerkType[];
  lang: string;
  translations: {
    filters: { allCategories: string; allTypes: string };
    learnMore: string;
    more: string;
  };
  categoryLabels: Record<string, string>;
}

const ALL = "__all__";

export const ProgramsFilter = ({
  programs,
  categories,
  perkTypes,
  lang,
  translations,
  categoryLabels,
}: ProgramsFilterProps) => {
  const [selectedCategory, setSelectedCategory] = useState(ALL);
  const [selectedPerkType, setSelectedPerkType] = useState(ALL);

  const filtered = useMemo(
    () =>
      programs.filter((p) => {
        if (selectedCategory !== ALL && p.category !== selectedCategory) {
          return false;
        }
        if (
          selectedPerkType !== ALL &&
          !p.perkTypes.includes(selectedPerkType as PerkType)
        ) {
          return false;
        }
        return true;
      }),
    [programs, selectedCategory, selectedPerkType]
  );

  const handleCategoryChange = useCallback(
    (v: string | number | null) => setSelectedCategory(v as string),
    []
  );

  const handlePerkTypeChange = useCallback(
    (v: string | number | null) => setSelectedPerkType(v as string),
    []
  );

  return (
    <>
      <div className="flex flex-wrap gap-3 mb-8">
        <Select value={selectedCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger>
            <SelectValue>
              {selectedCategory === ALL
                ? translations.filters.allCategories
                : (categoryLabels[selectedCategory] ?? selectedCategory)}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>
              {translations.filters.allCategories}
            </SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {categoryLabels[cat] ?? cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedPerkType} onValueChange={handlePerkTypeChange}>
          <SelectTrigger>
            <SelectValue>
              {selectedPerkType === ALL
                ? translations.filters.allTypes
                : selectedPerkType}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>{translations.filters.allTypes}</SelectItem>
            {perkTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((program) => {
          const categoryLabel =
            categoryLabels[program.category] ?? program.category;
          const programHref = withLocalePrefix(
            lang,
            `/programs/${program.slug}` as `/${string}`
          );
          return (
            <ProgramCard
              key={program.slug}
              program={program}
              programHref={programHref}
              categoryLabel={categoryLabel}
              learnMore={translations.learnMore}
              more={translations.more}
            />
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-lg border border-dashed bg-fd-muted/30 p-12 text-center">
          <p className="text-fd-muted-foreground">
            No programs match the selected filters.
          </p>
        </div>
      )}
    </>
  );
};
