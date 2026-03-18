const programs = {
  applyNow: "지금 신청하기",
  backToAll: "모든 프로그램",
  by: "제공",
  filters: {
    allCategories: "모든 카테고리",
    allTypes: "모든 유형"
  },
  learnMore: "자세히 알아보기",
  listing: {
    description: "오픈소스 프로젝트에 제공되는 무료 도구, 크레딧 및 서비스입니다. 카테고리별로 찾아보고 프로젝트에 적합한 프로그램을 찾아보세요.",
    heading: "프로그램"
  },
  more: "+{count}개 더보기",
  sections: {
    eligibility: "자격 요건",
    howToApply: "신청 방법",
    perks: "혜택",
    requirements: "요구 사항",
    tags: "태그"
  },
  submit: {
    buttonText: "프로그램 제출하기",
    description: "제안하고 싶은 프로그램이 있으신가요? 세부 정보를 제출해 주시면 목록에 추가하겠습니다.",
    form: {
      addPerk: "혜택 추가",
      addRequirement: "추가하기",
      addStep: "단계 추가",
      applicationProcessHelp: "신청 과정의 각 단계를 설명하세요.",
      applicationProcessLabel: "신청 방법",
      applicationProcessPlaceholder: "예: 프로그램 웹사이트를 통해 신청",
      applicationUrlCheckbox: "신청 URL이 프로그램 URL과 다릅니다",
      applicationUrlLabel: "신청 URL",
      applicationUrlPlaceholder: "https://... or mailto:...",
      categoryLabel: "카테고리",
      categoryPlaceholder: "카테고리 선택",
      descriptionLabel: "설명",
      descriptionPlaceholder: "이 프로그램은 무엇을 제공하나요?",
      eligibilityHelp: "필드당 하나의 요건을 추가하세요 (예: \"오픈소스 프로젝트\", \"공개 GitHub 저장소\").",
      eligibilityLabel: "자격 요건",
      eligibilityPlaceholder: "예: 오픈소스 프로젝트",
      nameLabel: "프로그램 이름",
      namePlaceholder: "예: Vercel",
      perkDescriptionPlaceholder: "설명 (예: 월 $100 크레딧)",
      perkLabel: "혜택 {index}",
      perkTitlePlaceholder: "제목 (예: 무료 크레딧)",
      perksHelp: "각 혜택에 제목과 설명을 추가하세요.",
      perksLabel: "혜택",
      providerLabel: "제공업체",
      providerPlaceholder: "예: Vercel Inc.",
      requirementLabel: "요건 {index}",
      stepLabel: "단계 {index}",
      tagsAddNew: "\"{value}\" 추가",
      tagsHelp: "이 프로그램을 설명하는 태그를 선택하거나 입력하세요.",
      tagsLabel: "태그",
      tagsNoResults: "태그를 찾을 수 없습니다.",
      tagsPlaceholder: "태그 검색 또는 추가...",
      urlLabel: "URL",
      urlPlaceholder: "https://..."
    },
    heading: "프로그램 제출",
    submitButton: "PR 제출",
    submitError: "제출에 실패했습니다",
    submitting: "제출 중...",
    success: {
      close: "닫기",
      heading: "PR이 생성되었습니다!",
      message: "풀 리퀘스트가 생성되었으며 검토될 예정입니다.",
      viewPr: "PR #{prNumber} 보기"
    },
    validation: {
      categoryRequired: "카테고리는 필수입니다",
      descriptionRequired: "설명은 필수입니다",
      eligibilityRequired: "최소 하나의 자격 요건이 필요합니다",
      invalidApplicationUrl: "유효한 URL이어야 합니다",
      invalidUrl: "유효한 URL이어야 합니다",
      nameRequired: "프로그램 이름은 필수입니다",
      perkRequired: "제목과 설명이 포함된 혜택이 최소 하나 필요합니다",
      providerRequired: "제공업체는 필수입니다"
    }
  },
  viewDetails: "{provider} 프로그램 세부정보 보기"
};
export default programs;
export type ProgramsTranslations = typeof programs;
