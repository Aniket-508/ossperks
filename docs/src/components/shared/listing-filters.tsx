"use client";

import type { Category, PerkType } from "@ossperks/core";
import { ChevronRight, ListFilter, Search, XIcon } from "lucide-react";
import { useQueryStates } from "nuqs";
import { memo, useCallback, useMemo, useState, useTransition } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { trackEvent } from "@/lib/events";
import type { ProgramsFacetParsers } from "@/lib/search-params";
import { cn } from "@/lib/utils";

export interface ListingFilterSectionConfig {
  emptySelectionLabel: string;
  id: string;
  items: readonly unknown[];
  itemKey: (item: unknown) => string;
  itemLabel: (item: unknown) => string;
  searchPlaceholder: string;
  title: string;
}

export interface ListingFiltersLabels {
  apply: string;
  clearAll: string;
  emptySection: string;
  filterButton: string;
  removeChip: string;
  reset: string;
  select: string;
}

export interface ListingFiltersProps {
  labels: ListingFiltersLabels;
  parsers: ProgramsFacetParsers;
  sections: ListingFilterSectionConfig[];
  shallow?: boolean;
}

type Selection = Record<string, string[]>;

const emptySelection = (sections: ListingFilterSectionConfig[]): Selection =>
  Object.fromEntries(sections.map((s) => [s.id, [] as string[]]));

const selectionFromApplied = (
  sections: ListingFilterSectionConfig[],
  applied: Selection,
): Selection => {
  const out: Selection = {};
  for (const s of sections) {
    out[s.id] = [...(applied[s.id] ?? [])];
  }
  return out;
};

const DesktopFilterNavButton = memo(function DesktopFilterNavButton({
  active,
  id,
  label,
  onActivate,
}: {
  active: boolean;
  id: string;
  label: string;
  onActivate: (id: string) => void;
}) {
  const onClick = useCallback(() => {
    onActivate(id);
  }, [id, onActivate]);

  return (
    <button
      aria-pressed={active}
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

const FilterCheckboxRow = memo(function FilterCheckboxRow({
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

const MobileFilterDraftChip = memo(function MobileFilterDraftChip({
  chipKey,
  label,
  onRemoveDraftChip,
  removeAriaLabel,
  sectionId,
}: {
  chipKey: string;
  label: string;
  onRemoveDraftChip: (sectionId: string, key: string) => void;
  removeAriaLabel: string;
  sectionId: string;
}) {
  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onRemoveDraftChip(sectionId, chipKey);
    },
    [chipKey, onRemoveDraftChip, sectionId],
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

const MobileFilterSectionCard = memo(function MobileFilterSectionCard({
  onOpenSection,
  onRemoveDraftChip,
  removeChipAria,
  resolveChipLabelForSection,
  section,
  selectedKeys,
}: {
  onOpenSection: (sectionId: string) => void;
  onRemoveDraftChip: (sectionId: string, key: string) => void;
  removeChipAria: string;
  resolveChipLabelForSection: (sectionId: string, key: string) => string;
  section: ListingFilterSectionConfig;
  selectedKeys: readonly string[];
}) {
  const handleOpen = useCallback(() => {
    onOpenSection(section.id);
  }, [onOpenSection, section.id]);

  return (
    <div className="border-fd-border hover:bg-fd-muted/30 focus-within:ring-ring rounded-lg border p-3 text-left transition-colors focus-within:ring-2">
      <button
        aria-label={section.title}
        className="w-full text-left focus-visible:outline-none"
        onClick={handleOpen}
        type="button"
      >
        <div className="text-fd-muted-foreground flex items-center justify-between text-xs font-medium tracking-wide uppercase">
          <span>{section.title}</span>
          <ChevronRight className="size-4" />
        </div>
        {selectedKeys.length === 0 ? (
          <p className="text-fd-muted-foreground mt-2 text-sm">
            {section.emptySelectionLabel}
          </p>
        ) : null}
      </button>
      {selectedKeys.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {selectedKeys.map((key) => (
            <MobileFilterDraftChip
              chipKey={key}
              key={`${section.id}-${key}`}
              label={resolveChipLabelForSection(section.id, key)}
              onRemoveDraftChip={onRemoveDraftChip}
              removeAriaLabel={removeChipAria}
              sectionId={section.id}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
});

export const ListingFilters = ({
  labels: filters,
  parsers,
  sections,
  shallow = true,
}: ListingFiltersProps) => {
  const [, startTransition] = useTransition();
  const [facetState, setParams] = useQueryStates(parsers, {
    shallow,
    startTransition,
  });

  const applied = useMemo((): Selection => {
    const out = emptySelection(sections);
    for (const s of sections) {
      const key = s.id as keyof typeof facetState;
      const raw = facetState[key];
      if (Array.isArray(raw)) {
        out[s.id] = raw.map(String);
      }
    }
    return out;
  }, [facetState, sections]);

  const onApplyFacets = useCallback(
    async (next: Selection) => {
      const categories = next.categories as Category[];
      const tags = next.tags as string[];
      const types = next.types as PerkType[];
      if (categories.length > 0 || tags.length > 0 || types.length > 0) {
        trackEvent({
          name: "filter_programs",
          properties: {
            categories: categories.join(","),
            tags: tags.join(","),
            types: types.join(","),
          },
        });
      }
      await setParams({
        categories,
        tags,
        types,
      });
    },
    [setParams],
  );

  const [draft, setDraft] = useState<Selection>(() => emptySelection(sections));
  const [desktopOpen, setDesktopOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(() => sections[0]?.id);
  const [sectionSearch, setSectionSearch] = useState("");

  const [nestedSection, setNestedSection] = useState<string | null>(null);
  const [nestedSelection, setNestedSelection] = useState<string[]>([]);
  const [nestedSearch, setNestedSearch] = useState("");

  const sectionById = useMemo(() => {
    const m = new Map<string, ListingFilterSectionConfig>();
    for (const s of sections) {
      m.set(s.id, s);
    }
    return m;
  }, [sections]);

  const syncDraftFromUrl = useCallback(() => {
    setDraft(selectionFromApplied(sections, applied));
  }, [applied, sections]);

  const openDesktop = useCallback(
    (open: boolean) => {
      if (open) {
        syncDraftFromUrl();
        setSectionSearch("");
        setActiveSection(sections[0]?.id);
      }
      setDesktopOpen(open);
    },
    [sections, syncDraftFromUrl],
  );

  const openMobile = useCallback(
    (open: boolean) => {
      if (open) {
        syncDraftFromUrl();
      }
      setNestedSection(null);
      setMobileOpen(open);
    },
    [syncDraftFromUrl],
  );

  const applyDraft = useCallback(async () => {
    await onApplyFacets(draft);
    setDesktopOpen(false);
    setMobileOpen(false);
    setNestedSection(null);
  }, [draft, onApplyFacets]);

  const resetAll = useCallback(async () => {
    const empty = emptySelection(sections);
    setDraft(empty);
    setSectionSearch("");
    await onApplyFacets(empty);
    setDesktopOpen(false);
    setMobileOpen(false);
    setNestedSection(null);
  }, [onApplyFacets, sections]);

  const toggleDraftValue = useCallback(
    (sectionId: string, key: string, checked: boolean) => {
      setDraft((d) => {
        const prev = d[sectionId];
        const cur = prev ? new Set(prev) : new Set<string>();
        if (checked) {
          cur.add(key);
        } else {
          cur.delete(key);
        }
        return { ...d, [sectionId]: [...cur] };
      });
    },
    [],
  );

  const removeDraftChip = useCallback(
    (sectionId: string, key: string) => {
      toggleDraftValue(sectionId, key, false);
    },
    [toggleDraftValue],
  );

  const handleDesktopToggle = useCallback(
    (key: string, next: boolean) => {
      toggleDraftValue(activeSection, key, next);
    },
    [activeSection, toggleDraftValue],
  );

  const activateFilterSection = useCallback((id: string) => {
    setActiveSection(id);
    setSectionSearch("");
  }, []);

  const handleSectionSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSectionSearch(e.target.value);
    },
    [],
  );

  const isInDraft = (sectionId: string, key: string): boolean =>
    (draft[sectionId] ?? []).includes(key);

  const activeConfig = sectionById.get(activeSection);

  const sectionItems = useMemo(() => {
    if (!activeConfig) {
      return [] as unknown[];
    }
    const needle = sectionSearch.trim().toLowerCase();
    return activeConfig.items.filter((item) =>
      activeConfig.itemLabel(item).toLowerCase().includes(needle),
    );
  }, [activeConfig, sectionSearch]);

  const nestedConfig = nestedSection ? sectionById.get(nestedSection) : null;

  const nestedItems = useMemo(() => {
    if (!nestedConfig) {
      return [] as unknown[];
    }
    const needle = nestedSearch.trim().toLowerCase();
    return nestedConfig.items.filter((item) =>
      nestedConfig.itemLabel(item).toLowerCase().includes(needle),
    );
  }, [nestedConfig, nestedSearch]);

  const openNested = useCallback(
    (sectionId: string) => {
      setNestedSection(sectionId);
      setNestedSearch("");
      setNestedSelection([...(draft[sectionId] ?? [])]);
    },
    [draft],
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
    setDraft((d) => ({ ...d, [nestedSection]: [...nestedSelection] }));
    setNestedSection(null);
  }, [nestedSection, nestedSelection]);

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

  const resolveChipLabel = useCallback(
    (sectionId: string, key: string) => {
      const cfg = sectionById.get(sectionId);
      if (!cfg) {
        return key;
      }
      const found = cfg.items.find((item) => cfg.itemKey(item) === key);
      if (found === undefined) {
        return key;
      }
      return cfg.itemLabel(found);
    },
    [sectionById],
  );

  const appliedFilterCount = useMemo(
    () => sections.reduce((n, s) => n + (applied[s.id]?.length ?? 0), 0),
    [applied, sections],
  );

  const filterTriggerLabel = `${filters.filterButton}${appliedFilterCount > 0 ? ` (${appliedFilterCount})` : ""}`;

  const desktopSectionPlaceholder = activeConfig?.searchPlaceholder;

  const desktopPanel = (
    <div className="flex max-h-[min(80vh,500px)] w-[min(100vw-2rem,560px)] min-w-0 flex-col">
      <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden">
        <nav
          aria-label={filters.filterButton}
          className="border-fd-border flex w-36 shrink-0 flex-col border-r md:w-40"
        >
          {sections.map((s) => (
            <DesktopFilterNavButton
              active={activeSection === s.id}
              id={s.id}
              key={s.id}
              label={s.title}
              onActivate={activateFilterSection}
            />
          ))}
        </nav>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="border-fd-border border-b p-2">
            <div className="relative">
              <Search className="text-fd-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
              <Input
                aria-label={desktopSectionPlaceholder ?? filters.filterButton}
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
                {filters.emptySection}
              </p>
            ) : (
              <ul className="space-y-1">
                {sectionItems.map((item) => {
                  const cfg = activeConfig;
                  if (!cfg) {
                    return null;
                  }
                  const key = cfg.itemKey(item);
                  const rowLabel = cfg.itemLabel(item);
                  return (
                    <FilterCheckboxRow
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
        <Button onClick={resetAll} type="button" variant="outline">
          {filters.reset}
        </Button>
        <Button onClick={applyDraft} type="button">
          {filters.apply}
        </Button>
      </div>
    </div>
  );

  const nestedDrawerTitle = nestedConfig?.title;

  const nestedSearchPlaceholder =
    nestedConfig?.searchPlaceholder ?? sections[0]?.searchPlaceholder;

  if (sections.length === 0) {
    return null;
  }

  return (
    <>
      <div className="hidden md:block">
        <Popover onOpenChange={openDesktop} open={desktopOpen}>
          <PopoverTrigger
            render={
              <Button className="shrink-0" type="button" variant="outline">
                <ListFilter />
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
        <Drawer onOpenChange={openMobile} open={mobileOpen}>
          <DrawerTrigger asChild>
            <Button className="shrink-0" type="button" variant="outline">
              <ListFilter />
              {filterTriggerLabel}
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>{filters.filterButton}</DrawerTitle>
              <DrawerDescription className="sr-only">
                {filters.filterButton}
              </DrawerDescription>
            </DrawerHeader>
            <div className="space-y-3 px-4 pb-2">
              {sections.map((s) => (
                <MobileFilterSectionCard
                  key={s.id}
                  onOpenSection={openNested}
                  onRemoveDraftChip={removeDraftChip}
                  removeChipAria={filters.removeChip}
                  resolveChipLabelForSection={resolveChipLabel}
                  section={s}
                  selectedKeys={draft[s.id] ?? []}
                />
              ))}
            </div>
            <DrawerFooter className="flex-row gap-2">
              <Button
                className="flex-1"
                onClick={resetAll}
                type="button"
                variant="outline"
              >
                {filters.reset}
              </Button>
              <Button className="flex-1" onClick={applyDraft} type="button">
                {filters.apply}
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
              <DrawerDescription className="sr-only">
                {nestedDrawerTitle}
              </DrawerDescription>
            </DrawerHeader>
            <div className="border-fd-border border-b px-4 pb-2">
              <div className="relative">
                <Search className="text-fd-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
                <Input
                  aria-label={nestedSearchPlaceholder ?? filters.filterButton}
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
                  const cfg = nestedConfig;
                  if (!cfg) {
                    return null;
                  }
                  const key = cfg.itemKey(item);
                  const rowLabel = cfg.itemLabel(item);
                  return (
                    <FilterCheckboxRow
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
                {filters.clearAll}
              </Button>
              <Button className="flex-1" onClick={commitNested} type="button">
                {filters.select}
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </>
  );
};
