import { getCategories, getAllPerkTypes } from "@ossperks/core";
import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server";

const categories = getCategories();
const perkTypes = getAllPerkTypes();

export const programsSearchParams = {
  category: parseAsStringLiteral(categories),
  type: parseAsStringLiteral(perkTypes),
};

export const programsParamsCache =
  createSearchParamsCache(programsSearchParams);

const tagsBrowseSortLiterals = [
  "name-asc",
  "name-desc",
  "count-desc",
  "count-asc",
] as const;

export const tagsBrowseSearchParams = {
  letter: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
  q: parseAsString.withDefault(""),
  sort: parseAsStringLiteral(tagsBrowseSortLiterals),
};

export const tagsBrowseParamsCache = createSearchParamsCache(
  tagsBrowseSearchParams,
);

const programListSortLiterals = ["name-asc", "name-desc"] as const;

export const programListSearchParams = {
  q: parseAsString.withDefault(""),
  sort: parseAsStringLiteral(programListSortLiterals),
};

export const programListParamsCache = createSearchParamsCache(
  programListSearchParams,
);
