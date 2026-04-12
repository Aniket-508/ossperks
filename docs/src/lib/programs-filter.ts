import type { Category, PerkType, Program } from "@ossperks/core";

export type ProgramListSort = "name-asc" | "name-desc";

export interface ProgramWithPerkTypes extends Program {
  perkTypes: PerkType[];
}

export interface ProgramsIndexFilterOptions {
  q: string;
  sort: ProgramListSort | null;
  categories: Category[];
  types: PerkType[];
  tags: string[];
}

const norm = (s: string) => s.trim().toLowerCase();

const tagsHaystack = (p: Program): string =>
  (p.tags ?? []).join(" ").toLowerCase();

export const filterProgramsIndex = (
  programs: ProgramWithPerkTypes[],
  options: ProgramsIndexFilterOptions,
): ProgramWithPerkTypes[] => {
  let list = [...programs];

  const q = norm(options.q);
  if (q) {
    list = list.filter(
      (p) =>
        norm(p.name).includes(q) ||
        norm(p.description).includes(q) ||
        tagsHaystack(p).includes(q),
    );
  }

  const catSet = new Set(options.categories);
  if (catSet.size > 0) {
    list = list.filter((p) => catSet.has(p.category));
  }

  const typeSet = new Set(options.types);
  if (typeSet.size > 0) {
    list = list.filter((p) => p.perkTypes.some((t) => typeSet.has(t)));
  }

  const tagSet = new Set(options.tags);
  if (tagSet.size > 0) {
    list = list.filter((p) => {
      const pts = p.tags ?? [];
      if (pts.length === 0) {
        return false;
      }
      return pts.some((t) => tagSet.has(t));
    });
  }

  if (options.sort === "name-desc") {
    list.sort((a, b) => b.name.localeCompare(a.name));
  } else if (options.sort === "name-asc") {
    list.sort((a, b) => a.name.localeCompare(b.name));
  }

  return list;
};

export const filterSortPrograms = (
  programs: Program[],
  options: { q: string; sort: ProgramListSort | null },
): Program[] => {
  let list = [...programs];
  const q = options.q.trim().toLowerCase();
  if (q) {
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
    );
  }
  if (options.sort === "name-desc") {
    list.sort((a, b) => b.name.localeCompare(a.name));
  } else if (options.sort === "name-asc") {
    list.sort((a, b) => a.name.localeCompare(b.name));
  }
  return list;
};

export const collectDistinctTags = (
  programs: ProgramWithPerkTypes[],
): string[] =>
  [...new Set(programs.flatMap((p) => p.tags ?? []))].toSorted((a, b) =>
    a.localeCompare(b),
  );
