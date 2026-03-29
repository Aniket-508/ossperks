const tags = {
  nav: "Теги",
  browse: {
    breadcrumb: "Теги",
    heading: "Все теги",
    intro: "{count} тегов в программах льгот для open source.",
    letterAll: "Все",
    letterOther: "#",
    noMatches: "Нет тегов, подходящих под фильтры.",
    orderBy: "Сортировка",
    paginationNext: "Далее",
    paginationPrevious: "Назад",
    programsCount: "{count} программ",
    resetFilters: "Сбросить",
    searchPlaceholder: "Поиск по тегам…",
    sortCountAsc: "По количеству (по возрастанию)",
    sortCountDesc: "По количеству (по убыванию)",
    sortNameAsc: "По имени (А–Я)",
    sortNameDesc: "По имени (Я–А)",
  },
  detail: {
    breadcrumb: "Теги",
    emptyTag: "Пока ни одна программа не использует этот тег.",
    intro: "{count} программ с этим тегом.",
    noMatches: "Ни одна программа не подходит под поиск.",
    orderBy: "Сортировка",
    resetFilters: "Сбросить",
    searchPlaceholder: "Искать программы с тегом «{tag}»…",
    sortNameAsc: "По имени (А–Я)",
    sortNameDesc: "По имени (Я–А)",
    titleSuffix: "Программы",
  },
} as const;

export type TagsTranslations = typeof tags;
export default tags;
