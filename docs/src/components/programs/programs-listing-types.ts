/** Full programs listing facet + listing strings (mapped into generic `ListingFilters` by the page). */
export interface ProgramsListingFiltersCopy {
  allCategories: string;
  allTags: string;
  allTypes: string;
  apply: string;
  clearAll: string;
  emptySection: string;
  filterButton: string;
  noMatches: string;
  removeChip: string;
  reset: string;
  searchCategories: string;
  searchTags: string;
  searchTypes: string;
  sectionCategories: string;
  sectionTags: string;
  sectionTypes: string;
  select: string;
  showingCount: string;
}

export interface ProgramsListingCopy {
  filters: ProgramsListingFiltersCopy;
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
