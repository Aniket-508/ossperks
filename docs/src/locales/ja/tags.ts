const tags = {
  nav: "タグ",
  browse: {
    breadcrumb: "タグ",
    heading: "タグを探す",
    intro: "オープンソース向け特典プログラムのタグが {count} 件あります。",
    letterAll: "すべて",
    letterOther: "#",
    noMatches: "条件に一致するタグがありません。",
    orderBy: "並べ替え",
    paginationNext: "次へ",
    paginationPrevious: "前へ",
    programsCount: "{count} 件のプログラム",
    resetFilters: "リセット",
    searchPlaceholder: "タグを検索…",
    sortCountAsc: "件数（少ない順）",
    sortCountDesc: "件数（多い順）",
    sortNameAsc: "名前（あいうえお順）",
    sortNameDesc: "名前（逆順）",
  },
  detail: {
    breadcrumb: "タグ",
    emptyTag: "このタグのプログラムはまだありません。",
    intro: "このタグが付いたプログラムは {count} 件です。",
    noMatches: "検索に一致するプログラムがありません。",
    orderBy: "並べ替え",
    resetFilters: "リセット",
    searchPlaceholder: "「{tag}」のプログラムを検索…",
    sortNameAsc: "名前（あいうえお順）",
    sortNameDesc: "名前（逆順）",
    titleSuffix: "プログラム一覧",
  },
} as const;

export type TagsTranslations = typeof tags;
export default tags;
