const check = {
  checkAnother: "Проверить другой репозиторий",
  checkFailed: "Проверка не удалась",
  description:
    "Вставьте URL репозитория GitHub, GitLab или Codeberg, чтобы мгновенно узнать, на какие программы и бонусы для открытого ПО может претендовать ваш проект.",
  eligible: "Подходит",
  errors: {
    invalidRequest: "Некорректный запрос на проверку.",
    notFound: "Репозиторий не найден. Проверьте URL и попробуйте снова.",
    rateLimit: "Превышен лимит запросов. Попробуйте снова через минуту.",
    unknown: "Что-то пошло не так. Попробуйте снова.",
    upstream:
      "Сейчас не удалось получить данные репозитория. Попробуйте снова.",
  },
  fetchError: "Не удалось получить результаты проверки. Попробуйте ещё раз.",
  fork: "Форк",
  heading: "Проверьте соответствие вашего проекта",
  ineligible: "Не подходит",
  input: {
    invalidUrl: "Введите корректный URL репозитория GitHub, GitLab или Codeberg",
    placeholder: "Вставьте URL репозитория GitHub, GitLab или Codeberg...",
    required: "Вставьте URL репозитория",
  },
  lastPush: "Последний пуш",
  needsReview: "Требует проверки",
  perks: "бонусы",
  private: "Приватный",
  reasons: {
    codeOfConduct: "Кодекс поведения невозможно проверить автоматически",
    communitySize: "размер сообщества невозможно проверить автоматически",
    criteriaUnverifiable: "критерии невозможно проверить автоматически",
    hostingPlatform:
      "требование к платформе хостинга невозможно проверить автоматически",
    inactive:
      "последний коммит: {days} дн. назад (проект может быть неактивен)",
    missionAlignment: "соответствие миссии невозможно проверить автоматически",
    noOsiLicense:
      "лицензия, одобренная OSI, не обнаружена (обнаружена: {license})",
    nonCommercial:
      "некоммерческое требование невозможно проверить автоматически",
    osiLicense: "требуется лицензия, одобренная OSI (обнаружена: {license})",
    permissiveLicense:
      "требуется пермиссивная лицензия (обнаружена: {license})",
    popularityThreshold: "порог популярности определяется провайдером",
    procedural: "процедурный шаг — подайте заявку вручную",
    projectTooNew:
      "проект должен существовать не менее {required} дн. (сейчас {current} дн.)",
    repoFork: "репозиторий является форком",
    repoPrivate: "репозиторий приватный",
    requiresGithub: "требуется репозиторий GitHub",
    requiresGitlab: "требуется репозиторий GitLab",
    role: "требование к роли невозможно проверить автоматически",
    starsBelow: "нужно {threshold}+ звёзд (сейчас {current})",
    starsMet: "порог {threshold}+ звёзд достигнут (сейчас {current})",
    subjective: "субъективные критерии невозможно проверить автоматически",
    usageRestriction:
      "ограничение использования невозможно проверить автоматически",
  },
  stars: "звёзды",
  time: {
    daysAgo: "{days}д назад",
    monthsAgo: "{months}мес назад",
    today: "сегодня",
    yearsAgo: "{years}г назад",
    yesterday: "вчера",
  },
};

export default check;
export type { CheckTranslations } from "../en/check";
