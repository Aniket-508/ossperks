const check = {
  checkAnother: "Weiteres Repository prüfen",
  checkFailed: "Prüfung fehlgeschlagen",
  description: "Füge die URL eines GitHub-, GitLab- oder Codeberg-Repositorys ein, um sofort zu sehen, für welche Open-Source-Programme und Vorteile dein Projekt in Frage kommt.",
  eligible: "Berechtigt",
  errors: {
    invalidRequest: "Ungültige Prüfanfrage.",
    notFound: "Repository nicht gefunden. Bitte überprüfe die URL und versuche es erneut.",
    rateLimit: "Rate-Limit erreicht. Bitte versuche es in einer Minute erneut.",
    unknown: "Etwas ist schiefgelaufen. Bitte versuche es erneut.",
    upstream: "Repository-Details konnten gerade nicht abgerufen werden. Bitte versuche es erneut."
  },
  fetchError: "Die Berechtigungsergebnisse konnten nicht abgerufen werden. Bitte versuche es erneut.",
  fork: "Fork",
  heading: "Prüfe die Berechtigung deines Projekts",
  ineligible: "Nicht berechtigt",
  input: {
    invalidUrl: "Bitte gib eine gültige GitHub-, GitLab- oder Codeberg-Repository-URL ein",
    placeholder: "GitHub-, GitLab- oder Codeberg-Repository-URL einfügen...",
    required: "Repository-URL einfügen"
  },
  lastPush: "Letzter Push",
  needsReview: "Überprüfung nötig",
  perks: "Vorteile",
  private: "Privat",
  reasons: {
    codeOfConduct: "Verhaltenskodex kann nicht automatisch überprüft werden",
    communitySize: "Communitygröße kann nicht automatisch überprüft werden",
    configFileMet: "Konfigurationsdatei erkannt ({matched})",
    configFileUnknown: "Keine Hosting-Konfigurationsdatei erkannt",
    criteriaUnverifiable: "Kriterien können nicht automatisch überprüft werden",
    hostingPlatform: "Hosting-Plattform-Anforderung kann nicht automatisch überprüft werden",
    inactive: "Letzter Commit: vor {days} T (Projekt ist möglicherweise inaktiv)",
    missionAlignment: "Missionsausrichtung kann nicht automatisch überprüft werden",
    noOsiLicense: "Keine OSI-genehmigte Lizenz erkannt (erkannt: {license})",
    nonCommercial: "Nicht-kommerzielle Anforderung kann nicht automatisch überprüft werden",
    osiLicense: "Erfordert eine OSI-genehmigte Lizenz (erkannt: {license})",
    permissiveLicense: "Erfordert eine permissive Lizenz (erkannt: {license})",
    popularityThreshold: "Popularitätsschwelle wird vom Anbieter bestimmt",
    procedural: "Verfahrensschritt — manuell bewerben",
    projectTooNew: "Projektalter muss mindestens {required} T betragen (aktuell: {current} T)",
    repoFork: "Repository ist ein Fork",
    repoPrivate: "Repository ist privat",
    requiresGithub: "Erfordert ein GitHub-Repository",
    requiresGitlab: "Erfordert ein GitLab-Repository",
    role: "Rollenanforderung kann nicht automatisch überprüft werden",
    starsBelow: "Erfordert {threshold}+ Sterne (aktuell: {current})",
    starsMet: "Sterneschwelle erreicht ({current}/{threshold}+)",
    subjective: "Subjektive Kriterien können nicht automatisch überprüft werden",
    techStackMet: "Technologie-Abhängigkeit erkannt ({matched})",
    techStackMissing: "Keine passende Technologie-Abhängigkeit in package.json gefunden",
    techStackUnknown: "Projektabhängigkeiten konnten nicht erkannt werden",
    usageRestriction: "Nutzungsbeschränkung kann nicht automatisch überprüft werden"
  },
  checkProgram: "Eignungsprüfung für {program}",
  noResultFound: "Kein Eignungsergebnis für dieses Programm gefunden.",
  programCheckDescription: "Fügen Sie eine Repository-URL ein, um zu prüfen, ob Ihr Projekt für dieses Programm qualifiziert ist.",
  stars: "Sterne",
  time: {
    daysAgo: "vor {days}T",
    monthsAgo: "vor {months}M",
    today: "heute",
    yearsAgo: "vor {years}J",
    yesterday: "gestern"
  }
};
export default check;
export type CheckTranslations = typeof check;
