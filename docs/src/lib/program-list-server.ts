import type { Program } from "@ossperks/core";

export type ProgramListSort = "name-asc" | "name-desc";

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
