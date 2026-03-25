const check = {
  checkAnother: "다른 저장소 확인",
  checkFailed: "확인 실패",
  description: "GitHub, GitLab 또는 Codeberg 저장소 URL을 붙여넣어 프로젝트가 받을 수 있는 오픈소스 프로그램과 혜택을 즉시 확인하세요.",
  eligible: "대상",
  errors: {
    invalidRequest: "유효하지 않은 확인 요청입니다.",
    notFound: "저장소를 찾을 수 없습니다. URL을 확인한 뒤 다시 시도해 주세요.",
    rateLimit: "요청 한도를 초과했습니다. 1분 후 다시 시도해 주세요.",
    unknown: "문제가 발생했습니다. 다시 시도해 주세요.",
    upstream: "지금은 저장소 정보를 가져올 수 없습니다. 다시 시도해 주세요."
  },
  fetchError: "자격 결과를 가져올 수 없습니다. 다시 시도해 주세요.",
  fork: "포크",
  heading: "프로젝트 자격 확인",
  ineligible: "대상 외",
  input: {
    invalidUrl: "유효한 GitHub, GitLab 또는 Codeberg 저장소 URL을 입력해 주세요",
    placeholder: "GitHub, GitLab 또는 Codeberg 저장소 URL을 붙여넣으세요...",
    required: "저장소 URL을 붙여넣으세요"
  },
  lastPush: "마지막 푸시",
  needsReview: "검토 필요",
  perks: "혜택",
  private: "비공개",
  reasons: {
    codeOfConduct: "행동 강령은 자동 확인할 수 없습니다",
    communitySize: "커뮤니티 규모는 자동 확인할 수 없습니다",
    configFileMet: "설정 파일이 감지되었습니다 ({matched})",
    configFileUnknown: "호스팅 설정 파일이 감지되지 않았습니다",
    criteriaUnverifiable: "기준을 자동 확인할 수 없습니다",
    hostingPlatform: "호스팅 플랫폼 요구사항은 자동 확인할 수 없습니다",
    inactive: "마지막 커밋이 {days}일 전입니다 (프로젝트가 비활성 상태일 수 있음)",
    missionAlignment: "미션 정렬은 자동 확인할 수 없습니다",
    noOsiLicense: "OSI 승인 라이선스가 감지되지 않았습니다 (감지됨: {license})",
    nonCommercial: "비상업적 요구사항은 자동 확인할 수 없습니다",
    osiLicense: "OSI 승인 라이선스가 필요합니다 (감지됨: {license})",
    permissiveLicense: "허용적 라이선스가 필요합니다 (감지됨: {license})",
    popularityThreshold: "인기도 임계값은 제공업체가 결정합니다",
    procedural: "절차적 단계 — 수동으로 신청하세요",
    projectTooNew: "프로젝트는 최소 {required}일이 경과해야 합니다 (현재 {current}일)",
    repoFork: "저장소가 포크입니다",
    repoPrivate: "저장소가 비공개입니다",
    requiresGithub: "GitHub 저장소가 필요합니다",
    requiresGitlab: "GitLab 저장소가 필요합니다",
    role: "역할 요구사항은 자동 확인할 수 없습니다",
    starsBelow: "{threshold}+ 스타가 필요합니다 (현재 {current}개)",
    starsMet: "{current}개 스타가 {threshold}+ 임계값을 충족합니다",
    subjective: "주관적 기준은 자동 확인할 수 없습니다",
    techStackMet: "기술 종속성이 감지되었습니다 ({matched})",
    techStackMissing: "package.json에서 일치하는 기술 종속성을 찾을 수 없습니다",
    techStackUnknown: "프로젝트 종속성을 감지할 수 없습니다",
    usageRestriction: "사용 제한은 자동 확인할 수 없습니다"
  },
  checkProgram: "{program} 자격 확인",
  noResultFound: "이 프로그램에 대한 자격 결과를 찾을 수 없습니다.",
  programCheckDescription: "프로젝트가 이 프로그램 자격을 충족하는지 확인하려면 저장소 URL을 붙여넣으세요.",
  stars: "스타",
  time: {
    daysAgo: "{days}일 전",
    monthsAgo: "{months}개월 전",
    today: "오늘",
    yearsAgo: "{years}년 전",
    yesterday: "어제"
  }
};
export default check;
export type CheckTranslations = typeof check;
