const tags = {
  nav: "Tags",
  browse: {
    breadcrumb: "Tags",
    heading: "Tags durchsuchen",
    intro: "{count} Tags in Open-Source-Vorteilsprogrammen.",
    letterAll: "Alle",
    letterOther: "#",
    noMatches: "Keine Tags entsprechen deinen Filtern.",
    orderBy: "Sortieren nach",
    paginationNext: "Weiter",
    paginationPrevious: "Zurück",
    programsCount: "{count} Programme",
    resetFilters: "Zurücksetzen",
    searchPlaceholder: "Tags durchsuchen…",
    sortCountAsc: "Anzahl (aufsteigend)",
    sortCountDesc: "Anzahl (absteigend)",
    sortNameAsc: "Name (A–Z)",
    sortNameDesc: "Name (Z–A)",
  },
  detail: {
    breadcrumb: "Tags",
    emptyTag: "Noch keine Programme mit diesem Tag.",
    intro: "{count} Programme mit diesem Tag.",
    noMatches: "Keine Programme entsprechen deiner Suche.",
    orderBy: "Sortieren nach",
    resetFilters: "Zurücksetzen",
    searchPlaceholder: "Programme mit „{tag}“ durchsuchen…",
    sortNameAsc: "Name (A–Z)",
    sortNameDesc: "Name (Z–A)",
    titleSuffix: "Programme",
  },
} as const;

export type TagsTranslations = typeof tags;
export default tags;
