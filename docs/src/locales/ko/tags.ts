const tags = {
  nav: "태그",
  browse: {
    breadcrumb: "태그",
    heading: "태그 찾기",
    intro: "오픈소스 혜택 프로그램에 쓰인 태그 {count}개.",
    letterAll: "전체",
    letterOther: "#",
    noMatches: "필터에 맞는 태그가 없습니다.",
    orderBy: "정렬",
    paginationNext: "다음",
    paginationPrevious: "이전",
    programsCount: "프로그램 {count}개",
    resetFilters: "초기화",
    searchPlaceholder: "태그 검색…",
    sortCountAsc: "개수 (적은 순)",
    sortCountDesc: "개수 (많은 순)",
    sortNameAsc: "이름 (오름차순)",
    sortNameDesc: "이름 (내림차순)",
  },
  detail: {
    breadcrumb: "태그",
    emptyTag: "이 태그를 쓰는 프로그램이 아직 없습니다.",
    intro: "이 태그가 달린 프로그램 {count}개.",
    noMatches: "검색 결과가 없습니다.",
    orderBy: "정렬",
    resetFilters: "초기화",
    searchPlaceholder: "「{tag}」 프로그램 검색…",
    sortNameAsc: "이름 (오름차순)",
    sortNameDesc: "이름 (내림차순)",
    titleSuffix: "프로그램",
  },
} as const;

export type TagsTranslations = typeof tags;
export default tags;
