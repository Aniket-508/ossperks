const check = {
  checkAnother: "检查另一个仓库",
  checkFailed: "检查失败",
  description: "粘贴 GitHub、GitLab 或 Codeberg 仓库链接，即时查看您的项目可以获得哪些开源计划和福利。",
  eligible: "符合条件",
  errors: {
    invalidRequest: "检查请求无效。",
    notFound: "未找到该仓库。请检查链接后重试。",
    rateLimit: "请求过于频繁。请一分钟后再试。",
    unknown: "出现了一些问题。请重试。",
    upstream: "暂时无法获取仓库详情。请稍后再试。"
  },
  fetchError: "无法获取资格结果。请重试。",
  fork: "复刻",
  heading: "检查项目资格",
  ineligible: "不符合条件",
  input: {
    invalidUrl: "请输入有效的 GitHub、GitLab 或 Codeberg 仓库链接",
    placeholder: "粘贴 GitHub、GitLab 或 Codeberg 仓库链接...",
    required: "请粘贴仓库链接"
  },
  lastPush: "最近推送",
  needsReview: "需要审核",
  perks: "项福利",
  private: "私有",
  reasons: {
    codeOfConduct: "行为准则无法自动验证",
    communitySize: "社区规模无法自动验证",
    configFileMet: "检测到配置文件（{matched}）",
    configFileUnknown: "未检测到托管配置文件",
    criteriaUnverifiable: "标准无法自动验证",
    hostingPlatform: "托管平台要求无法自动验证",
    inactive: "最后一次提交是 {days} 天前（项目可能不活跃）",
    missionAlignment: "使命一致性无法自动验证",
    noOsiLicense: "未检测到 OSI 批准的许可证（检测到：{license}）",
    nonCommercial: "非商业要求无法自动验证",
    osiLicense: "需要 OSI 批准的许可证（检测到：{license}）",
    permissiveLicense: "需要宽松许可证（检测到：{license}）",
    popularityThreshold: "热度阈值由提供商决定",
    procedural: "程序性步骤 — 请手动申请",
    projectTooNew: "项目必须至少存在 {required} 天（您的项目为 {current} 天）",
    repoFork: "仓库是一个复刻",
    repoPrivate: "仓库是私有的",
    requiresGithub: "需要 GitHub 仓库",
    requiresGitlab: "需要 GitLab 仓库",
    role: "角色要求无法自动验证",
    starsBelow: "需要 {threshold}+ 星标（您有 {current} 个）",
    starsMet: "{current} 个星标达到了 {threshold}+ 的阈值",
    subjective: "主观标准无法自动验证",
    techStackMet: "检测到技术依赖（{matched}）",
    techStackMissing: "在 package.json 中未找到匹配的技术依赖",
    techStackUnknown: "无法检测项目依赖",
    usageRestriction: "使用限制无法自动验证"
  },
  checkProgram: "检查 {program} 资格",
  noResultFound: "未找到此项目的资格结果。",
  programCheckDescription: "粘贴仓库 URL 以检查您的项目是否符合此项目的资格。",
  stars: "星标",
  time: {
    daysAgo: "{days}天前",
    monthsAgo: "{months}个月前",
    today: "今天",
    yearsAgo: "{years}年前",
    yesterday: "昨天"
  }
};
export default check;
export type CheckTranslations = typeof check;
