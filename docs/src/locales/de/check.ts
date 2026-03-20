const check = {
  checkAnother: "Weiteres Repository prüfen",
  checkFailed: "Prüfung fehlgeschlagen",
  description:
    "Füge die URL eines GitHub-, GitLab- oder Codeberg-Repositorys ein, um sofort zu sehen, für welche Open-Source-Programme und Vorteile dein Projekt in Frage kommt.",
  eligible: "Berechtigt",
  errors: {
    invalidRequest: "Ungültige Prüfanfrage.",
    notFound:
      "Repository nicht gefunden. Bitte überprüfe die URL und versuche es erneut.",
    rateLimit: "Rate-Limit erreicht. Bitte versuche es in einer Minute erneut.",
    unknown: "Etwas ist schiefgelaufen. Bitte versuche es erneut.",
    upstream:
      "Repository-Details konnten gerade nicht abgerufen werden. Bitte versuche es erneut.",
  },
  fetchError:
    "Die Berechtigungsergebnisse konnten nicht abgerufen werden. Bitte versuche es erneut.",
  fork: "Fork",
  heading: "Prüfe die Berechtigung deines Projekts",
  ineligible: "Nicht berechtigt",
  input: {
    invalidUrl: "Bitte gib eine gültige GitHub-, GitLab- oder Codeberg-Repository-URL ein",
    placeholder: "GitHub-, GitLab- oder Codeberg-Repository-URL einfügen...",
    required: "Repository-URL einfügen",
  },
  lastPush: "Letzter Push",
  needsReview: "Überprüfung nötig",
  perks: "Vorteile",
  private: "Privat",
  reasons: {
    codeOfConduct: "Verhaltenskodex kann nicht automatisch überprüft werden",
    communitySize: "Communitygröße kann nicht automatisch überprüft werden",
    criteriaUnverifiable: "Kriterien können nicht automatisch überprüft werden",
    hostingPlatform:
      "Hosting-Plattform-Anforderung kann nicht automatisch überprüft werden",
    inactive:
      "letzter Commit: vor {days} T (Projekt ist möglicherweise inaktiv)",
    missionAlignment:
      "Missionsausrichtung kann nicht automatisch überprüft werden",
    noOsiLicense: "keine OSI-genehmigte Lizenz erkannt (erkannt: {license})",
    nonCommercial:
      "nicht-kommerzielle Anforderung kann nicht automatisch überprüft werden",
    osiLicense: "erfordert eine OSI-genehmigte Lizenz (erkannt: {license})",
    permissiveLicense: "erfordert eine permissive Lizenz (erkannt: {license})",
    popularityThreshold: "Popularitätsschwelle wird vom Anbieter bestimmt",
    procedural: "Verfahrensschritt — manuell bewerben",
    projectTooNew:
      "Projektalter muss mindestens {required} T betragen (aktuell: {current} T)",
    repoFork: "Repository ist ein Fork",
    repoPrivate: "Repository ist privat",
    requiresGithub: "erfordert ein GitHub-Repository",
    requiresGitlab: "erfordert ein GitLab-Repository",
    role: "Rollenanforderung kann nicht automatisch überprüft werden",
    starsBelow: "erfordert {threshold}+ Sterne (aktuell: {current})",
    starsMet: "Sterneschwelle erreicht ({current}/{threshold}+)",
    subjective:
      "subjektive Kriterien können nicht automatisch überprüft werden",
    usageRestriction:
      "Nutzungsbeschränkung kann nicht automatisch überprüft werden",
  },
  stars: "Sterne",
  time: {
    daysAgo: "vor {days}T",
    monthsAgo: "vor {months}M",
    today: "heute",
    yearsAgo: "vor {years}J",
    yesterday: "gestern",
  },
};

export default check;
export type { CheckTranslations } from "../en/check";
