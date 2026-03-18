const programs = {
  applyNow: "今すぐ応募",
  backToAll: "すべてのプログラム",
  by: "提供元:",
  filters: {
    allCategories: "すべてのカテゴリー",
    allTypes: "すべてのタイプ"
  },
  learnMore: "詳細を見る",
  listing: {
    description: "オープンソースプロジェクト向けの無料ツール、クレジット、サービスをご紹介します。カテゴリー別に参照して、あなたのプロジェクトが対象となるプログラムを見つけましょう。",
    heading: "プログラム一覧"
  },
  more: "他{count}件",
  sections: {
    eligibility: "応募資格",
    howToApply: "応募方法",
    perks: "特典",
    requirements: "要件",
    tags: "タグ"
  },
  submit: {
    buttonText: "プログラムを提案",
    description: "提案したいプログラムはありますか?詳細を送信していただければ、リストに追加いたします。",
    form: {
      addPerk: "特典を追加",
      addRequirement: "追加する",
      addStep: "ステップを追加",
      applicationProcessHelp: "応募プロセスの各ステップを記述してください。",
      applicationProcessLabel: "応募方法",
      applicationProcessPlaceholder: "例: プログラムのウェブサイトから応募",
      applicationUrlCheckbox: "申請URLはプログラムURLと異なります",
      applicationUrlLabel: "申請URL",
      applicationUrlPlaceholder: "https://... or mailto:...",
      categoryLabel: "カテゴリー",
      categoryPlaceholder: "カテゴリーを選択",
      descriptionLabel: "説明",
      descriptionPlaceholder: "このプログラムは何を提供しますか?",
      eligibilityHelp: "各フィールドに1つの要件を追加してください（例:「オープンソースプロジェクト」「公開GitHubリポジトリ」）。",
      eligibilityLabel: "応募資格",
      eligibilityPlaceholder: "例: オープンソースプロジェクト",
      nameLabel: "プログラム名",
      namePlaceholder: "例: Vercel",
      perkDescriptionPlaceholder: "説明（例: 月額$100分のクレジット）",
      perkLabel: "特典 {index}",
      perkTitlePlaceholder: "タイトル（例: 無料クレジット）",
      perksHelp: "各特典にタイトルと説明を追加してください。",
      perksLabel: "特典",
      providerLabel: "提供元",
      providerPlaceholder: "例: Vercel Inc.",
      requirementLabel: "要件 {index}",
      stepLabel: "ステップ {index}",
      tagsAddNew: "「{value}」を追加",
      tagsHelp: "このプログラムを説明するタグを選択または入力してください。",
      tagsLabel: "タグ",
      tagsNoResults: "タグが見つかりません。",
      tagsPlaceholder: "タグを検索または追加...",
      urlLabel: "URL",
      urlPlaceholder: "https://..."
    },
    heading: "プログラムを提案",
    submitButton: "PRを送信",
    submitError: "送信に失敗しました",
    submitting: "送信中...",
    success: {
      close: "閉じる",
      heading: "PRが作成されました！",
      message: "プルリクエストが作成され、レビューされます。",
      viewPr: "PR #{prNumber} を表示"
    },
    validation: {
      categoryRequired: "カテゴリーは必須です",
      descriptionRequired: "説明は必須です",
      eligibilityRequired: "少なくとも1つの応募資格が必要です",
      invalidApplicationUrl: "有効なURLを入力してください",
      invalidUrl: "有効なURLを入力してください",
      nameRequired: "プログラム名は必須です",
      perkRequired: "タイトルと説明を含む特典が少なくとも1つ必要です",
      providerRequired: "提供元は必須です"
    }
  },
  viewDetails: "{provider}のプログラム詳細を見る"
};
export default programs;
export type ProgramsTranslations = typeof programs;
