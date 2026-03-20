const check = {
  checkAnother: "Vérifier un autre dépôt",
  checkFailed: "Vérification échouée",
  description:
    "Collez l'URL d'un dépôt GitHub, GitLab ou Codeberg pour voir instantanément à quels programmes et avantages open source votre projet est éligible.",
  eligible: "Éligible",
  errors: {
    invalidRequest: "Requête de vérification invalide.",
    notFound: "Dépôt introuvable. Vérifiez l'URL puis réessayez.",
    rateLimit: "Limite atteinte. Réessayez dans une minute.",
    unknown: "Une erreur s'est produite. Veuillez réessayer.",
    upstream:
      "Impossible de récupérer les détails du dépôt pour le moment. Veuillez réessayer.",
  },
  fetchError:
    "Impossible de récupérer les résultats d'éligibilité. Veuillez réessayer.",
  fork: "Fork",
  heading: "Vérifiez l'éligibilité de votre projet",
  ineligible: "Non éligible",
  input: {
    invalidUrl: "Veuillez entrer une URL valide de dépôt GitHub, GitLab ou Codeberg",
    placeholder: "Collez l'URL d'un dépôt GitHub, GitLab ou Codeberg...",
    required: "Collez l'URL d'un dépôt",
  },
  lastPush: "Dernier push",
  needsReview: "À vérifier",
  perks: "avantages",
  private: "Privé",
  reasons: {
    codeOfConduct:
      "le Code de Conduite ne peut pas être vérifié automatiquement",
    communitySize:
      "la taille de la communauté ne peut pas être vérifiée automatiquement",
    criteriaUnverifiable:
      "les critères ne peuvent pas être vérifiés automatiquement",
    hostingPlatform:
      "l'exigence de plateforme d'hébergement ne peut pas être vérifiée automatiquement",
    inactive:
      "dernier commit : il y a {days} j (le projet est peut-être inactif)",
    missionAlignment:
      "l'alignement avec la mission ne peut pas être vérifié automatiquement",
    noOsiLicense:
      "aucune licence approuvée par l'OSI détectée (détectée : {license})",
    nonCommercial:
      "l'exigence non commerciale ne peut pas être vérifiée automatiquement",
    osiLicense:
      "nécessite une licence approuvée par l'OSI (détectée : {license})",
    permissiveLicense:
      "nécessite une licence permissive (détectée : {license})",
    popularityThreshold:
      "le seuil de popularité est déterminé par le fournisseur",
    procedural: "étape procédurale — postuler manuellement",
    projectTooNew:
      "le projet doit avoir au moins {required} j (actuel : {current} j)",
    repoFork: "le dépôt est un fork",
    repoPrivate: "le dépôt est privé",
    requiresGithub: "nécessite un dépôt GitHub",
    requiresGitlab: "nécessite un dépôt GitLab",
    role: "l'exigence de rôle ne peut pas être vérifiée automatiquement",
    starsBelow: "nécessite {threshold}+ étoiles (actuel : {current})",
    starsMet: "seuil d'étoiles atteint ({current}/{threshold}+)",
    subjective:
      "les critères subjectifs ne peuvent pas être vérifiés automatiquement",
    usageRestriction:
      "la restriction d'utilisation ne peut pas être vérifiée automatiquement",
  },
  stars: "étoiles",
  time: {
    daysAgo: "il y a {days}j",
    monthsAgo: "il y a {months}m",
    today: "aujourd'hui",
    yearsAgo: "il y a {years}a",
    yesterday: "hier",
  },
};

export default check;
export type { CheckTranslations } from "../en/check";
