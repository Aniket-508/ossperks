const tags = {
  nav: "Tags",
  browse: {
    breadcrumb: "Tags",
    heading: "Explorar tags",
    intro: "{count} tags em programas de benefícios para open source.",
    letterAll: "Todas",
    letterOther: "#",
    noMatches: "Nenhuma tag corresponde aos filtros.",
    orderBy: "Ordenar por",
    paginationNext: "Próxima",
    paginationPrevious: "Anterior",
    programsCount: "{count} programas",
    resetFilters: "Redefinir",
    searchPlaceholder: "Buscar tags…",
    sortCountAsc: "Quantidade (menor para maior)",
    sortCountDesc: "Quantidade (maior para menor)",
    sortNameAsc: "Nome (A–Z)",
    sortNameDesc: "Nome (Z–A)",
  },
  detail: {
    breadcrumb: "Tags",
    emptyTag: "Nenhum programa usa esta tag ainda.",
    intro: "{count} programas com esta tag.",
    noMatches: "Nenhum programa corresponde à busca.",
    orderBy: "Ordenar por",
    resetFilters: "Redefinir",
    searchPlaceholder: "Buscar programas com a tag {tag}…",
    sortNameAsc: "Nome (A–Z)",
    sortNameDesc: "Nome (Z–A)",
    titleSuffix: "Programas",
  },
} as const;

export type TagsTranslations = typeof tags;
export default tags;
