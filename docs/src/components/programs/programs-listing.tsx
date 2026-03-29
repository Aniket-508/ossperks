"use client";

import type { Category, PerkType } from "@ossperks/core";
import { ChevronRight, ListFilter, Search, XIcon } from "lucide-react";
import { useQueryStates } from "nuqs";
import { memo, useCallback, useMemo, useRef, useState } from "react";

import { useSlashFocusSearch } from "@/components/hotkeys/use-slash-focus-search";
import { ProgramCard } from "@/components/programs/program-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { withLocalePrefix } from "@/i18n/navigation";
import type { ProgramListSort } from "@/lib/program-list-server";
import type { ProgramWithPerkTypes } from "@/lib/programs-index-filter";
import {
  collectDistinctTags,
  filterProgramsIndex,
} from "@/lib/programs-index-filter";
import { programsSearchParams } from "@/lib/search-params";
import { cn } from "@/lib/utils";

type FilterSection = "categories" | "types" | "tags";

interface Draft {
  categories: Category[];
  types: PerkType[];
  tags: string[];
}

const emptyDraft = (): Draft => ({
  categories: [],
  tags: [],
  types: [],
});

interface ProgramsListingCopy {
  filters: {
    allCategories: string;
    allTypes: string;
    allTags: string;
    noMatches: string;
    filterButton: string;
    apply: string;
    reset: string;
    clearAll: string;
    select: string;
    sectionCategories: string;
    sectionTypes: string;
    sectionTags: string;
    searchCategories: string;
    searchTypes: string;
    searchTags: string;
    emptySection: string;
    showingCount: string;
    removeChip: string;
  };
  learnMore: string;
  more: string;
  listing: {
    orderBy: string;
    resetFilters: string;
    searchPlaceholder: string;
    sortNameAsc: string;
    sortNameDesc: string;
  };
}

const filterSectionSearchPlaceholder = (
  section: FilterSection,
  filters: ProgramsListingCopy["filters"],
): string => {
  if (section === "categories") {
    return filters.searchCategories;
  }
  if (section === "types") {
    return filters.searchTypes;
  }
  return filters.searchTags;
};

const filterSectionAllLabel = (
  section: FilterSection,
  filters: ProgramsListingCopy["filters"],
): string => {
  if (section === "categories") {
    return filters.allCategories;
  }
  if (section === "types") {
    return filters.allTypes;
  }
  return filters.allTags;
};

const labelForSectionItem = (
  section: FilterSection,
  item: string,
  categoryLabels: Record<string, string>,
  perkTypeLabels: Record<string, string>,
): string => {
  if (section === "categories") {
    return categoryLabels[item as Category] ?? item;
  }
  if (section === "types") {
    return perkTypeLabels[item as PerkType] ?? item;
  }
  return item;
};

const nestedDrawerSectionTitle = (
  section: FilterSection | null,
  filters: ProgramsListingCopy["filters"],
): string => {
  if (section === "categories") {
    return filters.sectionCategories;
  }
  if (section === "types") {
    return filters.sectionTypes;
  }
  return filters.sectionTags;
};

const DesktopFilterNavButton = memo(function DesktopFilterNavButton({
  active,
  id,
  label,
  onActivate,
}: {
  active: boolean;
  id: FilterSection;
  label: string;
  onActivate: (id: FilterSection) => void;
}) {
  const onClick = useCallback(() => {
    onActivate(id);
  }, [id, onActivate]);

  return (
    <button
      className={cn(
        "hover:bg-fd-muted/50 text-fd-muted-foreground border-fd-border border-b px-3 py-2.5 text-left text-sm transition-colors",
        active && "bg-fd-muted/40 text-fd-foreground font-medium",
      )}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
});

const DesktopFilterCheckboxRow = memo(function DesktopFilterCheckboxRow({
  checked,
  itemKey,
  label,
  onToggle,
}: {
  checked: boolean;
  itemKey: string;
  label: string;
  onToggle: (key: string, next: boolean) => void;
}) {
  const onCheckedChange = useCallback(
    (v: boolean | "indeterminate") => {
      onToggle(itemKey, v === true);
    },
    [itemKey, onToggle],
  );

  return (
    <li>
      <label className="hover:bg-fd-muted/30 flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5">
        <Checkbox checked={checked} onCheckedChange={onCheckedChange} />
        <span className="text-sm">{label}</span>
      </label>
    </li>
  );
});

const MobileDraftChip = memo(function MobileDraftChip({
  label,
  onRemoveValue,
  removeAriaLabel,
  value,
}: {
  label: string;
  onRemoveValue: (v: string) => void;
  removeAriaLabel: string;
  value: string;
}) {
  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onRemoveValue(value);
    },
    [onRemoveValue, value],
  );

  return (
    <Badge className="gap-1 pr-1" variant="secondary">
      {label}
      <button
        aria-label={removeAriaLabel}
        className="hover:bg-fd-muted rounded p-0.5"
        onClick={handleRemove}
        type="button"
      >
        <XIcon className="size-3" />
      </button>
    </Badge>
  );
});

const MobileFilterSectionRow = memo(function MobileFilterSectionRow({
  emptyLabel,
  onOpen,
  sectionKey,
  title,
  values,
  categoryLabels,
  perkTypeLabels,
  removeChipAria,
  onChipRemove,
}: {
  emptyLabel: string;
  onOpen: () => void;
  sectionKey: FilterSection;
  title: string;
  values: readonly string[];
  categoryLabels: Record<string, string>;
  perkTypeLabels: Record<string, string>;
  removeChipAria: string;
  onChipRemove: (value: string) => void;
}) {
  return (
    <button
      className="border-fd-border hover:bg-fd-muted/30 w-full rounded-lg border p-3 text-left transition-colors"
      onClick={onOpen}
      type="button"
    >
      <div className="text-fd-muted-foreground mb-2 flex items-center justify-between text-xs font-medium tracking-wide uppercase">
        <span>{title}</span>
        <ChevronRight className="size-4" />
      </div>
      {values.length === 0 ? (
        <span className="text-fd-muted-foreground text-sm">{emptyLabel}</span>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {values.map((v) => {
            const chipLabel = labelForSectionItem(
              sectionKey,
              v,
              categoryLabels,
              perkTypeLabels,
            );
            return (
              <MobileDraftChip
                key={`${sectionKey}-${v}`}
                label={chipLabel}
                onRemoveValue={onChipRemove}
                removeAriaLabel={removeChipAria}
                value={v}
              />
            );
          })}
        </div>
      )}
    </button>
  );
});

const NestedFilterCheckboxRow = memo(function NestedFilterCheckboxRow({
  checked,
  itemKey,
  label,
  onToggle,
}: {
  checked: boolean;
  itemKey: string;
  label: string;
  onToggle: (key: string, next: boolean) => void;
}) {
  const onCheckedChange = useCallback(
    (v: boolean | "indeterminate") => {
      onToggle(itemKey, v === true);
    },
    [itemKey, onToggle],
  );

  return (
    <li>
      <label className="hover:bg-fd-muted/30 flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5">
        <Checkbox checked={checked} onCheckedChange={onCheckedChange} />
        <span className="text-sm">{label}</span>
      </label>
    </li>
  );
});

interface ProgramsListingProps {
  programs: ProgramWithPerkTypes[];
  categories: Category[];
  perkTypes: PerkType[];
  lang: string;
  translations: ProgramsListingCopy;
  categoryLabels: Record<string, string>;
  perkTypeLabels: Record<string, string>;
}

export const ProgramsListing = ({
  programs,
  categories,
  perkTypes,
  lang,
  translations,
  categoryLabels,
  perkTypeLabels,
}: ProgramsListingProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  useSlashFocusSearch(inputRef);

  const [
    { q, sort, categories: urlCategories, types: urlTypes, tags: urlTags },
    setParams,
  ] = useQueryStates(programsSearchParams, { shallow: false });

  const allTags = useMemo(() => collectDistinctTags(programs), [programs]);

  const appliedQ = q ?? "";
  const appliedSort = sort ?? null;

  const filtered = useMemo(
    () =>
      filterProgramsIndex(programs, {
        categories: urlCategories,
        q: appliedQ,
        sort: appliedSort,
        tags: urlTags,
        types: urlTypes,
      }),
    [programs, appliedQ, appliedSort, urlCategories, urlTypes, urlTags],
  );

  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [desktopOpen, setDesktopOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] =
    useState<FilterSection>("categories");
  const [sectionSearch, setSectionSearch] = useState("");

  const [nestedSection, setNestedSection] = useState<FilterSection | null>(
    null,
  );
  const [nestedSelection, setNestedSelection] = useState<string[]>([]);
  const [nestedSearch, setNestedSearch] = useState("");

  const syncDraftFromUrl = useCallback(() => {
    setDraft({
      categories: [...urlCategories],
      tags: [...urlTags],
      types: [...urlTypes],
    });
  }, [urlCategories, urlTags, urlTypes]);

  const openDesktop = useCallback(
    (open: boolean) => {
      if (open) {
        syncDraftFromUrl();
        setSectionSearch("");
        setActiveSection("categories");
      }
      setDesktopOpen(open);
    },
    [syncDraftFromUrl],
  );

  const openMobile = useCallback(
    (open: boolean) => {
      if (open) {
        syncDraftFromUrl();
        setNestedSection(null);
      } else {
        setNestedSection(null);
      }
      setMobileOpen(open);
    },
    [syncDraftFromUrl],
  );

  const applyDraft = useCallback(async () => {
    await setParams({
      categories: draft.categories,
      tags: draft.tags,
      types: draft.types,
    });
    setDesktopOpen(false);
    setMobileOpen(false);
    setNestedSection(null);
  }, [draft, setParams]);

  const resetDraft = useCallback(() => {
    setDraft(emptyDraft());
    setSectionSearch("");
  }, []);

  const resetAll = useCallback(async () => {
    await setParams({
      categories: [],
      q: null,
      sort: null,
      tags: [],
      types: [],
    });
  }, [setParams]);

  const hasActiveFilters = Boolean(
    appliedQ.trim() ||
    appliedSort ||
    urlCategories.length > 0 ||
    urlTypes.length > 0 ||
    urlTags.length > 0,
  );

  const handleSearchChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      await setParams({ q: v === "" ? null : v });
    },
    [setParams],
  );

  const setSort = useCallback(
    async (value: ProgramListSort | null) => {
      await setParams({ sort: value });
    },
    [setParams],
  );

  const handleSortChange = useCallback(
    (v: ProgramListSort | null) => {
      setSort(v);
    },
    [setSort],
  );

  const toggleDraftValue = useCallback(
    (section: FilterSection, value: string, checked: boolean) => {
      setDraft((d) => {
        if (section === "categories") {
          const next = new Set(d.categories);
          if (checked) {
            next.add(value as Category);
          } else {
            next.delete(value as Category);
          }
          return { ...d, categories: [...next] };
        }
        if (section === "types") {
          const next = new Set(d.types);
          if (checked) {
            next.add(value as PerkType);
          } else {
            next.delete(value as PerkType);
          }
          return { ...d, types: [...next] };
        }
        const next = new Set(d.tags);
        if (checked) {
          next.add(value);
        } else {
          next.delete(value);
        }
        return { ...d, tags: [...next] };
      });
    },
    [],
  );

  const handleDesktopToggle = useCallback(
    (key: string, next: boolean) => {
      toggleDraftValue(activeSection, key, next);
    },
    [activeSection, toggleDraftValue],
  );

  const activateFilterSection = useCallback((id: FilterSection) => {
    setActiveSection(id);
    setSectionSearch("");
  }, []);

  const handleSectionSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSectionSearch(e.target.value);
    },
    [],
  );

  const isInDraft = (section: FilterSection, value: string): boolean => {
    if (section === "categories") {
      return draft.categories.includes(value as Category);
    }
    if (section === "types") {
      return draft.types.includes(value as PerkType);
    }
    return draft.tags.includes(value);
  };

  const sectionItems = useMemo(() => {
    const needle = sectionSearch.trim().toLowerCase();
    if (activeSection === "categories") {
      return categories.filter((c) =>
        (categoryLabels[c] ?? c).toLowerCase().includes(needle),
      );
    }
    if (activeSection === "types") {
      return perkTypes.filter((t) =>
        (perkTypeLabels[t] ?? t).toLowerCase().includes(needle),
      );
    }
    return allTags.filter((t) => t.toLowerCase().includes(needle));
  }, [
    activeSection,
    allTags,
    categories,
    categoryLabels,
    perkTypeLabels,
    perkTypes,
    sectionSearch,
  ]);

  const nestedItems = useMemo(() => {
    const needle = nestedSearch.trim().toLowerCase();
    if (nestedSection === "categories") {
      return categories.filter((c) =>
        (categoryLabels[c] ?? c).toLowerCase().includes(needle),
      );
    }
    if (nestedSection === "types") {
      return perkTypes.filter((t) =>
        (perkTypeLabels[t] ?? t).toLowerCase().includes(needle),
      );
    }
    if (nestedSection === "tags") {
      return allTags.filter((t) => t.toLowerCase().includes(needle));
    }
    return [];
  }, [
    allTags,
    categories,
    categoryLabels,
    nestedSearch,
    nestedSection,
    perkTypeLabels,
    perkTypes,
  ]);

  const openNested = useCallback(
    (section: FilterSection) => {
      setNestedSection(section);
      setNestedSearch("");
      if (section === "categories") {
        setNestedSelection([...draft.categories]);
      } else if (section === "types") {
        setNestedSelection([...draft.types]);
      } else {
        setNestedSelection([...draft.tags]);
      }
    },
    [draft.categories, draft.types, draft.tags],
  );

  const handleNestedToggle = useCallback((key: string, checked: boolean) => {
    setNestedSelection((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(key);
      } else {
        next.delete(key);
      }
      return [...next];
    });
  }, []);

  const commitNested = useCallback(() => {
    if (!nestedSection) {
      return;
    }
    if (nestedSection === "categories") {
      setDraft((d) => ({
        ...d,
        categories: [...nestedSelection] as Category[],
      }));
    } else if (nestedSection === "types") {
      setDraft((d) => ({
        ...d,
        types: [...nestedSelection] as PerkType[],
      }));
    } else {
      setDraft((d) => ({ ...d, tags: [...nestedSelection] }));
    }
    setNestedSection(null);
  }, [nestedSection, nestedSelection]);

  const openMobileDrawer = useCallback(() => {
    openMobile(true);
  }, [openMobile]);

  const handleNestedDrawerOpenChange = useCallback((o: boolean) => {
    if (!o) {
      setNestedSection(null);
    }
  }, []);

  const handleNestedSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setNestedSearch(e.target.value);
    },
    [],
  );

  const clearNestedSelection = useCallback(() => {
    setNestedSelection([]);
  }, []);

  const appliedFilterCount =
    urlCategories.length + urlTypes.length + urlTags.length;

  const filterTriggerLabel = `${translations.filters.filterButton}${appliedFilterCount > 0 ? ` (${appliedFilterCount})` : ""}`;

  const desktopSectionPlaceholder = useMemo(
    () => filterSectionSearchPlaceholder(activeSection, translations.filters),
    [activeSection, translations.filters],
  );

  const desktopPanel = (
    <div className="flex max-h-[min(80vh,520px)] w-[min(100vw-2rem,560px)] min-w-0 flex-col">
      <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden">
        <nav
          aria-label={translations.filters.filterButton}
          className="border-fd-border flex w-36 shrink-0 flex-col border-r md:w-40"
        >
          {(
            [
              ["categories", translations.filters.sectionCategories],
              ["types", translations.filters.sectionTypes],
              ["tags", translations.filters.sectionTags],
            ] as const
          ).map(([id, label]) => (
            <DesktopFilterNavButton
              active={activeSection === id}
              id={id}
              key={id}
              label={label}
              onActivate={activateFilterSection}
            />
          ))}
        </nav>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="border-fd-border border-b p-2">
            <div className="relative">
              <Search className="text-fd-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
              <Input
                className="pl-9"
                onChange={handleSectionSearchChange}
                placeholder={desktopSectionPlaceholder}
                value={sectionSearch}
              />
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-2">
            {sectionItems.length === 0 ? (
              <p className="text-fd-muted-foreground px-2 py-4 text-sm">
                {translations.filters.emptySection}
              </p>
            ) : (
              <ul className="space-y-1">
                {sectionItems.map((item) => {
                  const key = typeof item === "string" ? item : String(item);
                  const rowLabel = labelForSectionItem(
                    activeSection,
                    key,
                    categoryLabels,
                    perkTypeLabels,
                  );
                  return (
                    <DesktopFilterCheckboxRow
                      checked={isInDraft(activeSection, key)}
                      itemKey={key}
                      key={key}
                      label={rowLabel}
                      onToggle={handleDesktopToggle}
                    />
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
      <div className="border-fd-border flex justify-end gap-2 border-t p-3">
        <Button onClick={resetDraft} type="button" variant="outline">
          {translations.filters.reset}
        </Button>
        <Button onClick={applyDraft} type="button">
          {translations.filters.apply}
        </Button>
      </div>
    </div>
  );

  const handleChipRemoveCategories = useCallback(
    (v: string) => {
      toggleDraftValue("categories", v, false);
    },
    [toggleDraftValue],
  );

  const handleChipRemoveTypes = useCallback(
    (v: string) => {
      toggleDraftValue("types", v, false);
    },
    [toggleDraftValue],
  );

  const handleChipRemoveTags = useCallback(
    (v: string) => {
      toggleDraftValue("tags", v, false);
    },
    [toggleDraftValue],
  );

  const openNestedCategories = useCallback(() => {
    openNested("categories");
  }, [openNested]);

  const openNestedTypes = useCallback(() => {
    openNested("types");
  }, [openNested]);

  const openNestedTags = useCallback(() => {
    openNested("tags");
  }, [openNested]);

  const renderDraftChips = () => (
    <div className="space-y-3 px-4 pb-2">
      <MobileFilterSectionRow
        categoryLabels={categoryLabels}
        emptyLabel={filterSectionAllLabel("categories", translations.filters)}
        onChipRemove={handleChipRemoveCategories}
        onOpen={openNestedCategories}
        perkTypeLabels={perkTypeLabels}
        removeChipAria={translations.filters.removeChip}
        sectionKey="categories"
        title={translations.filters.sectionCategories}
        values={draft.categories}
      />
      <MobileFilterSectionRow
        categoryLabels={categoryLabels}
        emptyLabel={filterSectionAllLabel("types", translations.filters)}
        onChipRemove={handleChipRemoveTypes}
        onOpen={openNestedTypes}
        perkTypeLabels={perkTypeLabels}
        removeChipAria={translations.filters.removeChip}
        sectionKey="types"
        title={translations.filters.sectionTypes}
        values={draft.types}
      />
      <MobileFilterSectionRow
        categoryLabels={categoryLabels}
        emptyLabel={filterSectionAllLabel("tags", translations.filters)}
        onChipRemove={handleChipRemoveTags}
        onOpen={openNestedTags}
        perkTypeLabels={perkTypeLabels}
        removeChipAria={translations.filters.removeChip}
        sectionKey="tags"
        title={translations.filters.sectionTags}
        values={draft.tags}
      />
    </div>
  );

  const nestedDrawerTitle = nestedDrawerSectionTitle(
    nestedSection,
    translations.filters,
  );

  const nestedSearchPlaceholder =
    nestedSection === null
      ? translations.filters.searchTags
      : filterSectionSearchPlaceholder(nestedSection, translations.filters);

  return (
    <>
      <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <div className="relative min-w-0 flex-1">
            <Search className="text-fd-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
            <Input
              aria-label={translations.listing.searchPlaceholder}
              className="pl-9"
              onChange={handleSearchChange}
              placeholder={translations.listing.searchPlaceholder}
              ref={inputRef}
              value={appliedQ}
            />
          </div>
          {hasActiveFilters ? (
            <Button
              className="shrink-0"
              onClick={resetAll}
              type="button"
              variant="outline"
            >
              {translations.listing.resetFilters}
            </Button>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select onValueChange={handleSortChange} value={appliedSort}>
            <SelectTrigger className="w-full min-w-[200px] lg:w-[240px]">
              <SelectValue placeholder={translations.listing.orderBy} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc">
                {translations.listing.sortNameAsc}
              </SelectItem>
              <SelectItem value="name-desc">
                {translations.listing.sortNameDesc}
              </SelectItem>
            </SelectContent>
          </Select>

          <div className="hidden md:block">
            <Popover onOpenChange={openDesktop} open={desktopOpen}>
              <PopoverTrigger
                render={
                  <Button className="shrink-0" type="button" variant="outline">
                    <ListFilter className="size-4" />
                    {filterTriggerLabel}
                  </Button>
                }
              />
              <PopoverContent
                align="end"
                className="gap-0 overflow-hidden p-0"
                side="bottom"
                sideOffset={8}
              >
                {desktopPanel}
              </PopoverContent>
            </Popover>
          </div>

          <div className="md:hidden">
            <Button
              className="shrink-0"
              onClick={openMobileDrawer}
              type="button"
              variant="outline"
            >
              <ListFilter className="size-4" />
              {filterTriggerLabel}
            </Button>
            <Drawer onOpenChange={openMobile} open={mobileOpen}>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>{translations.filters.filterButton}</DrawerTitle>
                </DrawerHeader>
                {renderDraftChips()}
                <DrawerFooter className="flex-row gap-2">
                  <Button
                    className="flex-1"
                    onClick={resetDraft}
                    type="button"
                    variant="outline"
                  >
                    {translations.filters.reset}
                  </Button>
                  <Button className="flex-1" onClick={applyDraft} type="button">
                    {translations.filters.apply}
                  </Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
            <Drawer
              nested
              onOpenChange={handleNestedDrawerOpenChange}
              open={nestedSection !== null}
            >
              <DrawerContent className="max-h-[85vh]">
                <DrawerHeader>
                  <DrawerTitle>{nestedDrawerTitle}</DrawerTitle>
                </DrawerHeader>
                <div className="border-fd-border border-b px-4 pb-2">
                  <div className="relative">
                    <Search className="text-fd-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
                    <Input
                      className="pl-9"
                      onChange={handleNestedSearchChange}
                      placeholder={nestedSearchPlaceholder}
                      value={nestedSearch}
                    />
                  </div>
                </div>
                <div className="max-h-[45vh] overflow-y-auto px-4 py-2">
                  <ul className="space-y-1">
                    {nestedItems.map((item) => {
                      const key = String(item);
                      const rowLabel = labelForSectionItem(
                        nestedSection ?? "tags",
                        key,
                        categoryLabels,
                        perkTypeLabels,
                      );
                      return (
                        <NestedFilterCheckboxRow
                          checked={nestedSelection.includes(key)}
                          itemKey={key}
                          key={key}
                          label={rowLabel}
                          onToggle={handleNestedToggle}
                        />
                      );
                    })}
                  </ul>
                </div>
                <DrawerFooter className="flex-row gap-2">
                  <Button
                    className="flex-1"
                    onClick={clearNestedSelection}
                    type="button"
                    variant="outline"
                  >
                    {translations.filters.clearAll}
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={commitNested}
                    type="button"
                  >
                    {translations.filters.select}
                  </Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>

      {filtered.length === programs.length ? null : (
        <p className="text-fd-muted-foreground mb-4 text-sm">
          {translations.filters.showingCount.replace(
            "{count}",
            String(filtered.length),
          )}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((program) => {
          const categoryLabel =
            categoryLabels[program.category] ?? program.category;
          const programHref = withLocalePrefix(
            lang,
            `/programs/${program.slug}` as `/${string}`,
          );
          return (
            <ProgramCard
              key={program.slug}
              categoryLabel={categoryLabel}
              learnMore={translations.learnMore}
              more={translations.more}
              program={program}
              programHref={programHref}
            />
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-fd-muted/30 rounded-lg border border-dashed p-12 text-center">
          <p className="text-fd-muted-foreground">
            {translations.filters.noMatches}
          </p>
        </div>
      ) : null}
    </>
  );
};
