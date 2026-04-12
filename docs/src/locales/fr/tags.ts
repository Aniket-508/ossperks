const tags = {
  nav: "Étiquettes",
  browse: {
    breadcrumb: "Étiquettes",
    heading: "Parcourir les étiquettes",
    intro: "{count} étiquettes dans les programmes d’avantages open source.",
    letterAll: "Tout",
    letterOther: "#",
    noMatches: "Aucune étiquette ne correspond à vos filtres.",
    orderBy: "Trier par",
    paginationNext: "Suivant",
    paginationPrevious: "Précédent",
    programsCount: "{count} programmes",
    resetFilters: "Réinitialiser",
    searchPlaceholder: "Rechercher des étiquettes…",
    sortCountAsc: "Nombre (croissant)",
    sortCountDesc: "Nombre (décroissant)",
    sortNameAsc: "Nom (A–Z)",
    sortNameDesc: "Nom (Z–A)",
  },
  detail: {
    breadcrumb: "Étiquettes",
    emptyTag: "Aucun programme n’utilise encore cette étiquette.",
    intro: "{count} programmes avec cette étiquette.",
    metaDescription:
      'Une collection sélectionnée des meilleurs programmes open source étiquetés « {tag} ». Chaque programme présente les avantages, les critères d’éligibilité et les étapes pour postuler.',
    metaTitle: 'Programmes open source étiquetés « {tag} »',
    noMatches: "Aucun programme ne correspond à votre recherche.",
    orderBy: "Trier par",
    resetFilters: "Réinitialiser",
    searchPlaceholder: "Rechercher des programmes « {tag} »…",
    sortNameAsc: "Nom (A–Z)",
    sortNameDesc: "Nom (Z–A)",
    titleSuffix: "Programmes",
  },
} as const;

export type TagsTranslations = typeof tags;
export default tags;
