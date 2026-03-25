const check = {
  checkAnother: "別のリポジトリを確認",
  checkFailed: "確認に失敗しました",
  description: "GitHub、GitLab、またはCodebergのリポジトリURLを貼り付けて、プロジェクトが対象となるオープンソースプログラムや特典を即座に確認できます。",
  eligible: "対象",
  errors: {
    invalidRequest: "無効な確認リクエストです。",
    notFound: "リポジトリが見つかりません。URLを確認してもう一度お試しください。",
    rateLimit: "レート制限に達しました。1分後にもう一度お試しください。",
    unknown: "問題が発生しました。もう一度お試しください。",
    upstream: "現在リポジトリの詳細を取得できません。もう一度お試しください。"
  },
  fetchError: "適格性の結果を取得できませんでした。もう一度お試しください。",
  fork: "フォーク",
  heading: "プロジェクトの適格性を確認",
  ineligible: "対象外",
  input: {
    invalidUrl: "有効なGitHub、GitLab、またはCodebergのリポジトリURLを入力してください",
    placeholder: "GitHub、GitLab、またはCodebergのリポジトリURLを貼り付け...",
    required: "リポジトリURLを貼り付けてください"
  },
  lastPush: "最終プッシュ",
  needsReview: "要確認",
  perks: "特典",
  private: "プライベート",
  reasons: {
    codeOfConduct: "行動規範は自動検証できません",
    communitySize: "コミュニティの規模は自動検証できません",
    configFileMet: "設定ファイルが検出されました（{matched}）",
    configFileUnknown: "ホスティング設定ファイルが検出されませんでした",
    criteriaUnverifiable: "基準は自動検証できません",
    hostingPlatform: "ホスティングプラットフォームの要件は自動検証できません",
    inactive: "最終コミットは{days}日前です（プロジェクトが非アクティブの可能性があります）",
    missionAlignment: "ミッションとの整合性は自動検証できません",
    noOsiLicense: "OSI承認ライセンスが検出されませんでした（検出: {license}）",
    nonCommercial: "非商用要件は自動検証できません",
    osiLicense: "OSI承認ライセンスが必要です（検出: {license}）",
    permissiveLicense: "寛容なライセンスが必要です（検出: {license}）",
    popularityThreshold: "人気度の閾値はプロバイダーによって決定されます",
    procedural: "手続き的なステップ — 手動で申請してください",
    projectTooNew: "プロジェクトは少なくとも{required}日経過している必要があります（あなたのプロジェクトは{current}日です）",
    repoFork: "リポジトリはフォークです",
    repoPrivate: "リポジトリはプライベートです",
    requiresGithub: "GitHubリポジトリが必要です",
    requiresGitlab: "GitLabリポジトリが必要です",
    role: "役割の要件は自動検証できません",
    starsBelow: "{threshold}+スターが必要です（現在{current}）",
    starsMet: "{current}スターが{threshold}+の閾値を満たしています",
    subjective: "主観的な基準は自動検証できません",
    techStackMet: "技術依存関係が検出されました（{matched}）",
    techStackMissing: "package.json に一致する技術依存関係が見つかりませんでした",
    techStackUnknown: "プロジェクトの依存関係を検出できませんでした",
    usageRestriction: "使用制限は自動検証できません"
  },
  checkProgram: "{program}の適格性を確認",
  noResultFound: "このプログラムの適格性結果が見つかりません。",
  programCheckDescription: "リポジトリのURLを貼り付けて、プロジェクトがこのプログラムの対象となるか確認してください。",
  stars: "スター",
  time: {
    daysAgo: "{days}日前",
    monthsAgo: "{months}か月前",
    today: "今日",
    yearsAgo: "{years}年前",
    yesterday: "昨日"
  }
};
export default check;
export type CheckTranslations = typeof check;
