import type { TagWithProgramCount } from "@ossperks/core";

export const TAGS_BROWSE_PAGE_SIZE = 48;

export type TagsBrowseSort =
  | "count-asc"
  | "count-desc"
  | "name-asc"
  | "name-desc";

export const filterSortPaginateTags = (
  rows: TagWithProgramCount[],
  options: {
    letter: string;
    page: number;
    q: string;
    sort: TagsBrowseSort | null;
  },
): { page: number; pageCount: number; rows: TagWithProgramCount[] } => {
  let list = [...rows];
  const q = options.q.trim().toLowerCase();
  if (q) {
    list = list.filter((row) => row.tag.toLowerCase().includes(q));
  }
  const letter = options.letter.trim().toLowerCase();
  if (letter === "other") {
    list = list.filter((row) => !/^[a-z]/.test(row.tag));
  } else if (letter && letter !== "all" && letter.length === 1) {
    list = list.filter((row) => row.tag.toLowerCase().startsWith(letter));
  }

  if (options.sort) {
    switch (options.sort) {
      case "name-desc": {
        list.sort((a, b) => b.tag.localeCompare(a.tag));
        break;
      }
      case "count-desc": {
        list.sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
        break;
      }
      case "count-asc": {
        list.sort((a, b) => a.count - b.count || a.tag.localeCompare(b.tag));
        break;
      }
      default: {
        list.sort((a, b) => a.tag.localeCompare(b.tag));
      }
    }
  }

  const pageCount = Math.max(1, Math.ceil(list.length / TAGS_BROWSE_PAGE_SIZE));
  const page = Math.min(Math.max(1, options.page), pageCount);
  const start = (page - 1) * TAGS_BROWSE_PAGE_SIZE;
  return {
    page,
    pageCount,
    rows: list.slice(start, start + TAGS_BROWSE_PAGE_SIZE),
  };
};
