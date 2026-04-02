const tags = {
  nav: "标签",
  browse: {
    breadcrumb: "标签",
    heading: "浏览标签",
    intro: "开源福利计划中共有 {count} 个标签。",
    letterAll: "全部",
    letterOther: "#",
    noMatches: "没有符合筛选条件的标签。",
    orderBy: "排序",
    paginationNext: "下一页",
    paginationPrevious: "上一页",
    programsCount: "{count} 个项目",
    resetFilters: "重置",
    searchPlaceholder: "搜索标签…",
    sortCountAsc: "数量（从少到多）",
    sortCountDesc: "数量（从多到少）",
    sortNameAsc: "名称（A–Z）",
    sortNameDesc: "名称（Z–A）",
  },
  detail: {
    breadcrumb: "标签",
    emptyTag: "还没有项目使用此标签。",
    intro: "带有此标签的项目共 {count} 个。",
    noMatches: "没有符合搜索条件的项目。",
    orderBy: "排序",
    resetFilters: "重置",
    searchPlaceholder: "在「{tag}」相关项目中搜索…",
    sortNameAsc: "名称（A–Z）",
    sortNameDesc: "名称（Z–A）",
    titleSuffix: "项目",
  },
} as const;

export type TagsTranslations = typeof tags;
export default tags;
