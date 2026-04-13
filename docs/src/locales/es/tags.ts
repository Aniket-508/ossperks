const tags = {
  nav: "Etiquetas",
  browse: {
    breadcrumb: "Etiquetas",
    heading: "Explorar etiquetas",
    intro: "{count} etiquetas en programas de beneficios para open source.",
    letterAll: "Todas",
    letterOther: "#",
    noMatches: "Ninguna etiqueta coincide con tus filtros.",
    orderBy: "Ordenar por",
    paginationNext: "Siguiente",
    paginationPrevious: "Anterior",
    programsCount: "{count} programas",
    resetFilters: "Restablecer",
    searchPlaceholder: "Buscar etiquetas…",
    sortCountAsc: "Cantidad (menor a mayor)",
    sortCountDesc: "Cantidad (mayor a menor)",
    sortNameAsc: "Nombre (A–Z)",
    sortNameDesc: "Nombre (Z–A)",
  },
  detail: {
    breadcrumb: "Etiquetas",
    emptyTag: "Aún no hay programas con esta etiqueta.",
    intro: "{count} programas con esta etiqueta.",
    metaDescription:
      'Una colección seleccionada de los mejores programas open source etiquetados como «{tag}». Cada programa incluye ventajas, criterios de elegibilidad y pasos para solicitarlos.',
    metaTitle: 'Programas open source etiquetados «{tag}»',
    noMatches: "Ningún programa coincide con tu búsqueda.",
    orderBy: "Ordenar por",
    resetFilters: "Restablecer",
    searchPlaceholder: "Buscar programas con la etiqueta {tag}…",
    sortNameAsc: "Nombre (A–Z)",
    sortNameDesc: "Nombre (Z–A)",
    titleSuffix: "Programas",
  },
} as const;

export type TagsTranslations = typeof tags;
export default tags;
