const check = {
  checkAnother: "Verificar otro repositorio",
  checkFailed: "Verificación fallida",
  description: "Pega la URL de un repositorio de GitHub, GitLab o Codeberg para ver al instante a qué programas y beneficios de código abierto califica tu proyecto.",
  eligible: "Elegible",
  errors: {
    invalidRequest: "Solicitud de verificación inválida.",
    notFound: "No se encontró el repositorio. Verifica la URL e inténtalo de nuevo.",
    rateLimit: "Se excedió el límite. Inténtalo de nuevo en un minuto.",
    unknown: "Algo salió mal. Inténtalo de nuevo.",
    upstream: "No se pudieron obtener los detalles del repositorio en este momento. Inténtalo de nuevo."
  },
  fetchError: "No se pudieron obtener los resultados de elegibilidad. Inténtalo de nuevo.",
  fork: "Fork",
  heading: "Verifica la elegibilidad de tu proyecto",
  ineligible: "No elegible",
  input: {
    invalidUrl: "Ingresa una URL válida de un repositorio de GitHub, GitLab o Codeberg",
    placeholder: "Pega la URL de un repositorio de GitHub, GitLab o Codeberg...",
    required: "Pega la URL de un repositorio"
  },
  lastPush: "Último push",
  needsReview: "Necesita revisión",
  perks: "beneficios",
  private: "Privado",
  reasons: {
    codeOfConduct: "El Código de Conducta no se puede verificar automáticamente",
    communitySize: "El tamaño de la comunidad no se puede verificar automáticamente",
    configFileMet: "Archivo de configuración detectado ({matched})",
    configFileUnknown: "No se detectó archivo de configuración de hosting",
    criteriaUnverifiable: "Los criterios no se pueden verificar automáticamente",
    hostingPlatform: "El requisito de plataforma de alojamiento no se puede verificar automáticamente",
    inactive: "Último commit: hace {days} d (el proyecto puede estar inactivo)",
    missionAlignment: "La alineación con la misión no se puede verificar automáticamente",
    noOsiLicense: "No se detectó una licencia aprobada por la OSI (detectada: {license})",
    nonCommercial: "El requisito no comercial no se puede verificar automáticamente",
    osiLicense: "Requiere una licencia aprobada por la OSI (detectada: {license})",
    permissiveLicense: "Requiere una licencia permisiva (detectada: {license})",
    popularityThreshold: "El umbral de popularidad lo determina el proveedor",
    procedural: "Paso procedimental — solicitar manualmente",
    projectTooNew: "El proyecto debe tener al menos {required} d (actual: {current} d)",
    repoFork: "El repositorio es un fork",
    repoPrivate: "El repositorio es privado",
    requiresGithub: "Requiere un repositorio de GitHub",
    requiresGitlab: "Requiere un repositorio de GitLab",
    role: "El requisito de rol no se puede verificar automáticamente",
    starsBelow: "Requiere {threshold}+ estrellas (actual: {current})",
    starsMet: "Umbral de estrellas alcanzado ({current}/{threshold}+)",
    subjective: "Los criterios subjetivos no se pueden verificar automáticamente",
    techStackMet: "Dependencia tecnológica detectada ({matched})",
    techStackMissing: "No se encontró ninguna dependencia tecnológica en package.json",
    techStackUnknown: "No se pudieron detectar las dependencias del proyecto",
    usageRestriction: "La restricción de uso no se puede verificar automáticamente"
  },
  checkProgram: "Verificar elegibilidad para {program}",
  noResultFound: "No se encontró un resultado de elegibilidad para este programa.",
  programCheckDescription: "Pega la URL de un repositorio para comprobar si tu proyecto cumple los requisitos de este programa.",
  stars: "estrellas",
  time: {
    daysAgo: "hace {days}d",
    monthsAgo: "hace {months}m",
    today: "hoy",
    yearsAgo: "hace {years}a",
    yesterday: "ayer"
  }
};
export default check;
export type CheckTranslations = typeof check;
