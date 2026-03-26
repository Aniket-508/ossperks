const programs = {
  applyNow: "Jetzt bewerben",
  backToAll: "Alle Programme",
  by: "von",
  filters: {
    allCategories: "Alle Kategorien",
    allTypes: "Alle Typen"
  },
  learnMore: "mehr erfahren",
  listing: {
    countSuffix: "kuratierte Programme für Open-Source-Projekte.",
    description: "Kostenlose Tools, Guthaben und Dienste, die für Open-Source-Projekte verfügbar sind. Durchsuchen Sie nach Kategorie und finden Sie Programme, für die Ihr Projekt qualifiziert ist.",
    heading: "Programme"
  },
  more: "+{count} weitere",
  sections: {
    checkEligibility: "Berechtigung prüfen",
    eligibility: "Teilnahmeberechtigung",
    howToApply: "Bewerbungsverfahren",
    perks: "Vorteile",
    requirements: "Anforderungen",
    tags: "Tags"
  },
  submit: {
    backToAll: "Alle Programme",
    autofill: {
      button: "Automatisch ausfüllen",
      description: "Geben Sie einfach die Programm-URL ein, und wir füllen die Details automatisch für Sie aus!",
      error: "Die Programmdetails konnten von dieser URL nicht extrahiert werden. Bitte füllen Sie das Formular manuell aus.",
      heading: "Automatisch mit KI ausfüllen",
      loading: "Wird ausgefüllt...",
      placeholder: "https://...",
      success: "Wir haben die Details Ihres Projekts erfolgreich abgerufen!"
    },
    buttonText: "Programm einreichen",
    description: "Haben Sie ein Programm vorzuschlagen? Reichen Sie die Details ein und wir fügen es der Liste hinzu.",
    form: {
      addPerk: "Vorteil hinzufügen",
      addRequirement: "Weitere hinzufügen",
      addStep: "Schritt hinzufügen",
      applicationProcessHelp: "Beschreiben Sie jeden Schritt des Bewerbungsprozesses.",
      applicationProcessLabel: "Bewerbungsverfahren",
      applicationProcessPlaceholder: "z.B. Über die Programmwebsite bewerben",
      applicationUrlCheckbox: "Bewerbungs-URL unterscheidet sich von der Programm-URL",
      applicationUrlLabel: "Bewerbungs-URL",
      applicationUrlPlaceholder: "https://... or mailto:...",
      categoryLabel: "Kategorie",
      categoryPlaceholder: "Kategorie auswählen",
      descriptionLabel: "Beschreibung",
      descriptionPlaceholder: "Was bietet dieses Programm?",
      eligibilityHelp: "Fügen Sie pro Feld eine Anforderung hinzu (z.B. \"Open-Source-Projekte\", \"Öffentliches GitHub-Repository\").",
      eligibilityLabel: "Teilnahmeberechtigung",
      eligibilityPlaceholder: "z.B. Open-Source-Projekte",
      nameLabel: "Programmname",
      namePlaceholder: "z.B. Vercel",
      perkDescriptionPlaceholder: "Beschreibung (z.B. 100 $/Monat an Credits)",
      perkLabel: "Vorteil {index}",
      perkTitlePlaceholder: "Titel (z.B. Kostenlose Credits)",
      perksHelp: "Fügen Sie jeden Vorteil mit Titel und Beschreibung hinzu.",
      perksLabel: "Vorteile",
      providerLabel: "Anbieter",
      providerPlaceholder: "z.B. Vercel Inc.",
      requirementLabel: "Anforderung {index}",
      stepLabel: "Schritt {index}",
      tagsAddNew: "\"{value}\" hinzufügen",
      tagsHelp: "Wählen oder tippen Sie, um Tags hinzuzufügen, die dieses Programm beschreiben.",
      tagsLabel: "Tags",
      tagsNoResults: "Keine Tags gefunden.",
      tagsPlaceholder: "Tags suchen oder hinzufügen...",
      urlLabel: "URL",
      urlPlaceholder: "https://...",
      contactToggle: "Auch einen Programmkontakt hinzufügen?",
      contactNameLabel: "Name des Kontakts",
      contactNamePlaceholder: "z. B. Max Mustermann",
      contactRoleLabel: "Rolle",
      contactRolePlaceholder: "z. B. OSS-Programmmanager",
      contactUrlLabel: "Kontakt-URL (optional)",
      contactUrlPlaceholder: "https://..."
    },
    heading: "Programm einreichen",
    submitButton: "PR einreichen",
    submitError: "Einreichung fehlgeschlagen",
    submitting: "Wird eingereicht...",
    success: {
      close: "Schließen",
      heading: "PR erstellt!",
      message: "Ihr Pull Request wurde erstellt und wird überprüft.",
      viewPr: "PR #{prNumber} anzeigen"
    },
    validation: {
      categoryRequired: "Kategorie ist erforderlich",
      descriptionRequired: "Beschreibung ist erforderlich",
      eligibilityRequired: "Mindestens ein Teilnahmekriterium ist erforderlich",
      invalidApplicationUrl: "Muss eine gültige URL sein",
      invalidUrl: "Muss eine gültige URL sein",
      nameRequired: "Programmname ist erforderlich",
      perkRequired: "Mindestens ein Vorteil mit Titel und Beschreibung ist erforderlich",
      providerRequired: "Anbieter ist erforderlich"
    }
  }
};
export default programs;
export type ProgramsTranslations = typeof programs;
