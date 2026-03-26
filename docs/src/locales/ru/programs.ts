const programs = {
  applyNow: "Подать заявку",
  backToAll: "Все программы",
  by: "от",
  filters: {
    allCategories: "Все категории",
    allTypes: "Все типы"
  },
  learnMore: "подробнее",
  listing: {
    countSuffix: "отобранных программ для проектов с открытым кодом.",
    description: "Бесплатные инструменты, кредиты и сервисы, доступные для проектов с открытым исходным кодом. Просматривайте по категориям и находите программы, для которых подходит ваш проект.",
    heading: "Программы"
  },
  more: "ещё {count}",
  sections: {
    checkEligibility: "Проверка соответствия",
    eligibility: "Условия участия",
    howToApply: "Как подать заявку",
    perks: "Преимущества",
    requirements: "Требования",
    tags: "Теги"
  },
  submit: {
    backToAll: "Все программы",
    autofill: {
      button: "Автозаполнение",
      description: "Просто введите URL программы, и мы автоматически заполним данные за вас!",
      error: "Не удалось извлечь данные программы из этого URL. Пожалуйста, заполните форму вручную.",
      heading: "Автозаполнение с ИИ",
      loading: "Заполнение...",
      placeholder: "https://...",
      success: "Мы успешно получили данные вашего проекта!"
    },
    buttonText: "Предложить программу",
    description: "Есть программа для предложения? Отправьте её описание, и мы добавим её в список.",
    form: {
      addPerk: "Добавить преимущество",
      addRequirement: "Добавить ещё",
      addStep: "Добавить шаг",
      applicationProcessHelp: "Опишите каждый шаг процесса подачи заявки.",
      applicationProcessLabel: "Как подать заявку",
      applicationProcessPlaceholder: "напр., Подать заявку через сайт программы",
      applicationUrlCheckbox: "URL заявки отличается от URL программы",
      applicationUrlLabel: "URL заявки",
      applicationUrlPlaceholder: "https://... or mailto:...",
      categoryLabel: "Категория",
      categoryPlaceholder: "Выберите категорию",
      descriptionLabel: "Описание",
      descriptionPlaceholder: "Что предлагает эта программа?",
      eligibilityHelp: "Добавьте одно требование на поле (напр. \"Проекты с открытым кодом\", \"Публичный репозиторий на GitHub\").",
      eligibilityLabel: "Условия участия",
      eligibilityPlaceholder: "напр., Проекты с открытым кодом",
      nameLabel: "Название программы",
      namePlaceholder: "напр., Vercel",
      perkDescriptionPlaceholder: "Описание (напр., $100/мес. в кредитах)",
      perkLabel: "Преимущество {index}",
      perkTitlePlaceholder: "Заголовок (напр., Бесплатные кредиты)",
      perksHelp: "Добавьте каждое преимущество с заголовком и описанием.",
      perksLabel: "Преимущества",
      providerLabel: "Провайдер",
      providerPlaceholder: "напр., Vercel Inc.",
      requirementLabel: "Требование {index}",
      stepLabel: "Шаг {index}",
      tagsAddNew: "Добавить \"{value}\"",
      tagsHelp: "Выберите или введите теги, описывающие эту программу.",
      tagsLabel: "Теги",
      tagsNoResults: "Теги не найдены.",
      tagsPlaceholder: "Поиск или добавление тегов...",
      urlLabel: "URL",
      urlPlaceholder: "https://...",
      contactToggle: "Добавить контактное лицо программы?",
      contactNameLabel: "Имя контактного лица",
      contactNamePlaceholder: "например, Иван Иванов",
      contactRoleLabel: "Должность",
      contactRolePlaceholder: "например, Менеджер программы OSS",
      contactUrlLabel: "URL контактного лица (необязательно)",
      contactUrlPlaceholder: "https://..."
    },
    heading: "Предложить программу",
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
      categoryRequired: "Категория обязательна",
      descriptionRequired: "Описание обязательно",
      eligibilityRequired: "Необходимо хотя бы одно условие участия",
      invalidApplicationUrl: "Должен быть действительный URL",
      invalidUrl: "Должен быть действительный URL",
      nameRequired: "Название программы обязательно",
      perkRequired: "Необходимо хотя бы одно преимущество с заголовком и описанием",
      providerRequired: "Провайдер обязателен"
    }
  }
};
export default programs;
export type ProgramsTranslations = typeof programs;
