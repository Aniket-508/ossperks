const people = {
  associatedWith: "関連付け",
  backToPeople: "人物一覧に戻る",
  description: "オープンソースプロジェクトを支援するプログラムの運営者/連絡先。",
  detail: {
    about: "概要",
    noPrograms: "関連するプログラムが見つかりません。"
  },
  empty: "プログラムの連絡先はまだ追加されていません。プログラムデータに連絡先を追加すると、ここに表示されます。",
  heading: "人物",
  roleAt: "{provider}の{role}",
  submit: {
    buttonText: "連絡先を送信",
    description: "プログラムに関わる人物をご存知ですか？詳細情報を送信していただければ、追加いたします。",
    form: {
      nameLabel: "名前",
      namePlaceholder: "例: 山田太郎",
      programLabel: "プログラム",
      programPlaceholder: "プログラムを選択",
      roleLabel: "役職",
      rolePlaceholder: "例: OSSプログラムマネージャー",
      urlLabel: "URL（任意）",
      urlPlaceholder: "https://..."
    },
    heading: "連絡先を送信",
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
      invalidUrl: "有効なURLを入力してください",
      nameRequired: "名前は必須です",
      programRequired: "プログラムは必須です",
      roleRequired: "役職は必須です"
    }
  }
};
export default people;
export type PeopleTranslations = typeof people;
