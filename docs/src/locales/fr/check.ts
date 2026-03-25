const check = {
  checkAnother: "Vérifier un autre dépôt",
  checkFailed: "Vérification échouée",
  description: "Collez l'URL d'un dépôt GitHub, GitLab ou Codeberg pour voir instantanément à quels programmes et avantages open source votre projet est éligible.",
  eligible: "Éligible",
  errors: {
    invalidRequest: "Requête de vérification invalide.",
    notFound: "Dépôt introuvable. Vérifiez l'URL puis réessayez.",
    rateLimit: "Limite atteinte. Réessayez dans une minute.",
    unknown: "Une erreur s'est produite. Veuillez réessayer.",
    upstream: "Impossible de récupérer les détails du dépôt pour le moment. Veuillez réessayer."
  },
  fetchError: "Impossible de récupérer les résultats d'éligibilité. Veuillez réessayer.",
  fork: "Fork",
  heading: "Vérifiez l'éligibilité de votre projet",
  ineligible: "Non éligible",
  input: {
    invalidUrl: "Veuillez entrer une URL valide de dépôt GitHub, GitLab ou Codeberg",
    placeholder: "Collez l'URL d'un dépôt GitHub, GitLab ou Codeberg...",
    required: "Collez l'URL d'un dépôt"
  },
  lastPush: "Dernier push",
  needsReview: "À vérifier",
  perks: "avantages",
  private: "Privé",
  reasons: {
    codeOfConduct: "Le Code de Conduite ne peut pas être vérifié automatiquement",
    communitySize: "La taille de la communauté ne peut pas être vérifiée automatiquement",
    configFileMet: "Fichier de configuration détecté ({matched})",
    configFileUnknown: "Aucun fichier de configuration d'hébergement détecté",
    criteriaUnverifiable: "Les critères ne peuvent pas être vérifiés automatiquement",
    hostingPlatform: "L'exigence de plateforme d'hébergement ne peut pas être vérifiée automatiquement",
    inactive: "Dernier commit : il y a {days} j (le projet est peut-être inactif)",
    missionAlignment: "L'alignement avec la mission ne peut pas être vérifié automatiquement",
    noOsiLicense: "Aucune licence approuvée par l'OSI détectée (détectée : {license})",
    nonCommercial: "L'exigence non commerciale ne peut pas être vérifiée automatiquement",
    osiLicense: "Nécessite une licence approuvée par l'OSI (détectée : {license})",
    permissiveLicense: "Nécessite une licence permissive (détectée : {license})",
    popularityThreshold: "Le seuil de popularité est déterminé par le fournisseur",
    procedural: "Étape procédurale — postuler manuellement",
    projectTooNew: "Le projet doit avoir au moins {required} j (actuel : {current} j)",
    repoFork: "Le dépôt est un fork",
    repoPrivate: "Le dépôt est privé",
    requiresGithub: "Nécessite un dépôt GitHub",
    requiresGitlab: "Nécessite un dépôt GitLab",
    role: "L'exigence de rôle ne peut pas être vérifiée automatiquement",
    starsBelow: "Nécessite {threshold}+ étoiles (actuel : {current})",
    starsMet: "Seuil d'étoiles atteint ({current}/{threshold}+)",
    subjective: "Les critères subjectifs ne peuvent pas être vérifiés automatiquement",
    techStackMet: "Dépendance technologique détectée ({matched})",
    techStackMissing: "Aucune dépendance technologique correspondante trouvée dans package.json",
    techStackUnknown: "Impossible de détecter les dépendances du projet",
    usageRestriction: "La restriction d'utilisation ne peut pas être vérifiée automatiquement"
  },
  checkProgram: "Vérifier l'éligibilité pour {program}",
  noResultFound: "Aucun résultat d'éligibilité trouvé pour ce programme.",
  programCheckDescription: "Collez l'URL d'un dépôt pour vérifier si votre projet est éligible à ce programme.",
  stars: "étoiles",
  time: {
    daysAgo: "il y a {days}j",
    monthsAgo: "il y a {months}m",
    today: "aujourd'hui",
    yearsAgo: "il y a {years}a",
    yesterday: "hier"
  }
};
export default check;
export type CheckTranslations = typeof check;
