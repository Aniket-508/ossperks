const categories = {
  detail: {
    breadcrumb: "Categories",
    empty: "No programs in this category yet.",
    introCount: "{count} programs in this category.",
    noMatches: "No programs match your search.",
    orderBy: "Order by",
    resetFilters: "Zurücksetzen",
    searchPlaceholder: "Search {category} programs…",
    sortNameAsc: "Name (A–Z)",
    sortNameDesc: "Name (Z–A)",
  },
  listing: {
    breadcrumb: "Categories",
    heading: "Programs by category",
    intro: "Browse every category to find perks that fit your project.",
    programsCount: "{count} programs",
  },
  nav: "Categories",
} as const;

export type CategoriesTranslations = typeof categories;
export default categories;
