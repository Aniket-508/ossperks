const people = {
  associatedWith: "연결됨",
  backToPeople: "사람 목록으로 돌아가기",
  description: "오픈소스 프로젝트를 지원하는 프로그램을 운영하는 운영자/담당자.",
  detail: {
    about: "소개",
    noPrograms: "연결된 프로그램이 없습니다."
  },
  empty: "아직 추가된 프로그램 연락처가 없습니다. 프로그램 데이터에 연락처를 추가하면 여기에 표시됩니다.",
  heading: "담당자",
  roleAt: "{provider}의 {role}",
  submit: {
    autofill: {
      button: "자동 입력",
      description: "프로필 URL을 입력하면 자동으로 세부 정보를 채워드립니다!",
      error: "이 URL에서 세부 정보를 추출할 수 없습니다. 양식을 수동으로 작성해 주세요.",
      heading: "AI로 자동 입력",
      loading: "자동 입력 중...",
      placeholder: "https://..."
    },
    buttonText: "연락처 제출하기",
    description: "프로그램 담당자를 알고 계신가요? 상세 정보를 제출해 주시면 추가하겠습니다.",
    form: {
      nameLabel: "이름",
      namePlaceholder: "예: 홍길동",
      programLabel: "프로그램",
      programPlaceholder: "프로그램 선택",
      roleLabel: "역할",
      rolePlaceholder: "예: OSS 프로그램 매니저",
      urlLabel: "URL (선택)",
      urlPlaceholder: "https://..."
    },
    heading: "연락처 제출하기",
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
      invalidUrl: "유효한 URL이어야 합니다",
      nameRequired: "이름은 필수입니다",
      programRequired: "프로그램은 필수입니다",
      roleRequired: "역할은 필수입니다"
    }
  }
};
export default people;
export type PeopleTranslations = typeof people;
