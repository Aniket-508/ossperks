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

const programsNameSortLiterals = ["name-asc", "name-desc"] as const;

const TAG_ARRAY_SEPARATOR = "|";

export const programsSearchParams = {
  categories: parseAsArrayOf(parseAsStringLiteral(categoryTuple)).withDefault(
    [],
  ),
  q: parseAsString.withDefault(""),
  sort: parseAsStringLiteral(programsNameSortLiterals),
  tags: parseAsArrayOf(parseAsString, TAG_ARRAY_SEPARATOR).withDefault([]),
  types: parseAsArrayOf(parseAsStringLiteral(perkTypeTuple)).withDefault([]),
};

export type ProgramsSortParser = (typeof programsSearchParams)["sort"];
export type ListingQParser = (typeof programsSearchParams)["q"];

export const programsParamsCache =
  createSearchParamsCache(programsSearchParams);

export const programsFacetParams = {
  categories: programsSearchParams.categories,
  tags: programsSearchParams.tags,
  types: programsSearchParams.types,
} as const;

export type ProgramsFacetParsers = typeof programsFacetParams;

const tagsSortLiterals = [
  "name-asc",
  "name-desc",
  "count-desc",
  "count-asc",
] as const;

export const tagsBrowseSearchParams = {
  letter: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
  q: parseAsString.withDefault(""),
  sort: parseAsStringLiteral(tagsSortLiterals),
};

export type TagsBrowseSortParser = (typeof tagsBrowseSearchParams)["sort"];

export const tagsBrowseParamsCache = createSearchParamsCache(
  tagsBrowseSearchParams,
);

export const tagsBrowsePaginationParams = {
  page: tagsBrowseSearchParams.page,
} as const;

export const tagsBrowseLetterParams = {
  letter: tagsBrowseSearchParams.letter,
} as const;

export type LetterFilterParsers = typeof tagsBrowseLetterParams;

export const programListSearchParams = {
  q: parseAsString.withDefault(""),
  sort: programsSearchParams.sort,
};

export const programListParamsCache = createSearchParamsCache(
  programListSearchParams,
);
