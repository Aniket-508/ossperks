const people = {
  associatedWith: "Связано с",
  backToPeople: "Вернуться к людям",
  description: "операторы/контакты программ, которые поддерживают проекты с открытым исходным кодом.",
  detail: {
    about: "О программе",
    noPrograms: "Связанные программы не найдены."
  },
  empty: "Контакты программы еще не добавлены. Добавьте контакт в данные программы, чтобы увидеть их здесь.",
  heading: "Люди",
  roleAt: "{role} в {provider}",
  submit: {
    autofill: {
      button: "Автозаполнение",
      description: "Просто введите URL профиля, и мы автоматически заполним данные за вас!",
      error: "Не удалось извлечь данные из этого URL. Пожалуйста, заполните форму вручную.",
      heading: "Автозаполнение с ИИ",
      loading: "Заполнение...",
      placeholder: "https://..."
    },
    buttonText: "Отправить контакт",
    description: "Знаете кого-то из команды программы? Отправьте его данные, и мы добавим их.",
    form: {
      nameLabel: "Имя",
      namePlaceholder: "напр., Иван Петров",
      programLabel: "Программа",
      programPlaceholder: "Выберите программу",
      roleLabel: "Роль",
      rolePlaceholder: "напр., Менеджер OSS-программ",
      urlLabel: "URL (необязательно)",
      urlPlaceholder: "https://..."
    },
    heading: "Отправить контакт",
    submitButton: "Отправить PR",
    submitError: "Ошибка отправки",
    submitting: "Отправка...",
    success: {
      close: "Закрыть",
      heading: "PR создан!",
      message: "Ваш pull request создан и будет рассмотрен.",
      viewPr: "Просмотреть PR #{prNumber}"
    },
    validation: {
      invalidUrl: "Должен быть действительный URL",
      nameRequired: "Имя обязательно",
      programRequired: "Программа обязательна",
      roleRequired: "Роль обязательна"
    }
  }
};
export default people;
export type PeopleTranslations = typeof people;
