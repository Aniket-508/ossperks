import type { Category, PerkType } from "@ossperks/core";
import { getAllPerkTypes, getCategories } from "@ossperks/core";
import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server";

const categoryList = getCategories();
const perkTypeList = getAllPerkTypes();

const categoryTuple = categoryList as [Category, ...Category[]];
const perkTypeTuple = perkTypeList as [PerkType, ...PerkType[]];

const programsIndexSortLiterals = ["name-asc", "name-desc"] as const;

/** Tags may contain commas; use a separator that does not appear in tag strings. */
const TAG_ARRAY_SEPARATOR = "|";

export const programsSearchParams = {
  categories: parseAsArrayOf(parseAsStringLiteral(categoryTuple)).withDefault(
    [],
  ),
  q: parseAsString,
  sort: parseAsStringLiteral(programsIndexSortLiterals),
  tags: parseAsArrayOf(parseAsString, TAG_ARRAY_SEPARATOR).withDefault([]),
  types: parseAsArrayOf(parseAsStringLiteral(perkTypeTuple)).withDefault([]),
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
