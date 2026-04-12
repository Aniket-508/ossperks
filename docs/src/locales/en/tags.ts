const tags = {
  nav: "Tags",
  browse: {
    breadcrumb: "Tags",
    heading: "Browse tags",
    intro: "{count} tags across open-source perk programs.",
    letterAll: "All",
    letterOther: "#",
    noMatches: "No tags match your filters.",
    orderBy: "Order by",
    paginationNext: "Next",
    paginationPrevious: "Previous",
    programsCount: "{count} programs",
    resetFilters: "Reset",
    searchPlaceholder: "Search tags…",
    sortCountAsc: "Count (low to high)",
    sortCountDesc: "Count (high to low)",
    sortNameAsc: "Name (A–Z)",
    sortNameDesc: "Name (Z–A)",
  },
  detail: {
    breadcrumb: "Tags",
    emptyTag: "No programs use this tag yet.",
    intro: "{count} programs tagged with this label.",
    metaDescription:
      'A curated collection of the best open source programs tagged "{tag}". Each program includes perks, eligibility criteria along with steps for how to apply.',
    metaTitle: 'Open Source Programs Tagged "{tag}"',
    noMatches: "No programs match your search.",
    orderBy: "Order by",
    resetFilters: "Reset",
    searchPlaceholder: "Search {tag} programs…",
    sortNameAsc: "Name (A–Z)",
    sortNameDesc: "Name (Z–A)",
    titleSuffix: "Programs",
  },
} as const;

export type TagsTranslations = typeof tags;
export default tags;
