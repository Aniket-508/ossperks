const people = {
  associatedWith: "关联于",
  backToPeople: "返回人员列表",
  description: "支持开源项目的计划背后的运营者/联系人。",
  detail: {
    about: "关于",
    noPrograms: "未找到关联的项目。"
  },
  empty: "尚未添加任何计划联系人。将联系人添加到计划数据中即可在此处查看。",
  heading: "人员",
  roleAt: "{role},就职于 {provider}",
  submit: {
    buttonText: "提交联系人",
    description: "认识某个计划背后的人员?提交他们的详细信息,我们将添加他们。",
    form: {
      nameLabel: "姓名",
      namePlaceholder: "例如 张三",
      programLabel: "项目",
      programPlaceholder: "选择项目",
      roleLabel: "职位",
      rolePlaceholder: "例如 开源项目经理",
      urlLabel: "URL(可选)",
      urlPlaceholder: "https://..."
    },
    heading: "提交联系人",
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
      invalidUrl: "必须是有效的 URL",
      nameRequired: "姓名为必填项",
      programRequired: "项目为必填项",
      roleRequired: "职位为必填项"
    }
  }
};
export default people;
export type PeopleTranslations = typeof people;
