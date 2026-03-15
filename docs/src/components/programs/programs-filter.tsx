"use client";

import type { Category, PerkType, Program } from "@ossperks/data";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
            <SelectValue />
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
            <SelectValue />
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
          const extraPerks = program.perks.length - 2;
          const categoryLabel =
            categoryLabels[program.category] ?? program.category;

          return (
            <Link
              key={program.slug}
              href={withLocalePrefix(
                lang,
                `/programs/${program.slug}` as `/${string}`
              )}
              className="group block"
            >
              <Card className="h-full transition-colors hover:bg-fd-accent">
                <CardHeader>
                  <Badge>{categoryLabel}</Badge>
                  <CardTitle className="font-semibold group-hover:text-fd-primary mt-2">
                    {program.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-fd-muted-foreground line-clamp-2">
                    {program.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {program.perks.slice(0, 2).map((perk) => (
                      <Badge key={perk.title} variant="outline">
                        {perk.title}
                      </Badge>
                    ))}
                    {extraPerks > 0 && (
                      <Badge variant="secondary">
                        {translations.more.replace(
                          "{count}",
                          String(extraPerks)
                        )}
                      </Badge>
                    )}
                  </div>
                  <div className="flex justify-end">
                    <span className="inline-flex items-center gap-1 text-xs text-fd-primary group-hover:underline">
                      {translations.learnMore}
                      <ArrowRight className="size-3" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
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
