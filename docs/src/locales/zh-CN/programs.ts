const programs = {
  applyNow: "立即申请",
  backToAll: "所有项目",
  by: "由",
  filters: {
    allCategories: "所有类别",
    allTypes: "所有类型"
  },
  learnMore: "了解更多",
  listing: {
    description: "为开源项目提供的免费工具、额度和服务。按类别浏览,找到您的项目符合条件的项目。",
    heading: "项目"
  },
  more: "还有 {count} 个",
  sections: {
    eligibility: "资格要求",
    howToApply: "如何申请",
    perks: "福利",
    requirements: "要求",
    tags: "标签"
  },
  submit: {
    buttonText: "提交项目",
    description: "有想推荐的项目?提交其详细信息,我们将把它添加到列表中。",
    form: {
      addPerk: "添加福利",
      addRequirement: "添加更多",
      addStep: "添加步骤",
      applicationProcessHelp: "描述申请流程的每个步骤。",
      applicationProcessLabel: "如何申请",
      applicationProcessPlaceholder: "例如 通过项目网站申请",
      applicationUrlCheckbox: "申请 URL 与项目 URL 不同",
      applicationUrlLabel: "申请 URL",
      applicationUrlPlaceholder: "https://... or mailto:...",
      categoryLabel: "类别",
      categoryPlaceholder: "选择类别",
      descriptionLabel: "描述",
      descriptionPlaceholder: "该项目提供什么?",
      eligibilityHelp: "每个字段添加一个要求(例如\"开源项目\"、\"公开的 GitHub 仓库\")。",
      eligibilityLabel: "资格要求",
      eligibilityPlaceholder: "例如 开源项目",
      nameLabel: "项目名称",
      namePlaceholder: "例如 Vercel",
      perkDescriptionPlaceholder: "描述(例如 每月 $100 额度)",
      perkLabel: "福利 {index}",
      perkTitlePlaceholder: "标题(例如 免费额度)",
      perksHelp: "为每个福利添加标题和描述。",
      perksLabel: "福利",
      providerLabel: "提供方",
      providerPlaceholder: "例如 Vercel Inc.",
      requirementLabel: "要求 {index}",
      stepLabel: "步骤 {index}",
      tagsAddNew: "添加 \"{value}\"",
      tagsHelp: "选择或输入标签来描述此项目。",
      tagsLabel: "标签",
      tagsNoResults: "未找到标签。",
      tagsPlaceholder: "搜索或添加标签...",
      urlLabel: "URL",
      urlPlaceholder: "https://..."
    },
    heading: "提交项目",
    submitButton: "提交 PR",
    submitError: "提交失败",
    submitting: "提交中...",
    success: {
      close: "关闭",
      heading: "PR 已创建!",
      message: "您的 Pull Request 已创建,将会被审核。",
      viewPr: "查看 PR #{prNumber}"
    },
    validation: {
      categoryRequired: "类别为必填项",
      descriptionRequired: "描述为必填项",
      eligibilityRequired: "至少需要一个资格要求",
      invalidApplicationUrl: "必须是有效的 URL",
      invalidUrl: "必须是有效的 URL",
      nameRequired: "项目名称为必填项",
      perkRequired: "至少需要一个包含标题和描述的福利",
      providerRequired: "提供方为必填项"
    }
  },
  viewDetails: "查看 {provider} 项目详情"
};
export default programs;
export type ProgramsTranslations = typeof programs;
