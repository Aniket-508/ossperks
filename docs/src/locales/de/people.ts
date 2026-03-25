const people = {
  associatedWith: "Verknüpft mit",
  backToPeople: "Zurück zu Personen",
  description: "Betreiber/Kontakte hinter den Programmen, die Open-Source-Projekte unterstützen.",
  detail: {
    about: "Über",
    noPrograms: "Keine verknüpften Programme gefunden."
  },
  empty: "Es wurden noch keine Programm-Ansprechpartner hinzugefügt. Fügen Sie einen Kontakt zu den Programmdaten hinzu, um ihn hier zu sehen.",
  heading: "Personen",
  roleAt: "{role} bei {provider}",
  submit: {
    autofill: {
      button: "Automatisch ausfüllen",
      description: "Geben Sie einfach die Profil-URL ein, und wir füllen die Details automatisch für Sie aus!",
      error: "Die Details konnten nicht aus dieser URL extrahiert werden. Bitte füllen Sie das Formular manuell aus.",
      heading: "Automatisch mit KI ausfüllen",
      loading: "Wird ausgefüllt...",
      placeholder: "https://..."
    },
    buttonText: "Kontakt einreichen",
    description: "Kennen Sie jemanden hinter einem Programm? Reichen Sie dessen Details ein und wir fügen sie hinzu.",
    form: {
      nameLabel: "Name",
      namePlaceholder: "z.B. Max Mustermann",
      programLabel: "Programm",
      programPlaceholder: "Programm auswählen",
      roleLabel: "Rolle",
      rolePlaceholder: "z.B. OSS-Programmmanager",
      urlLabel: "URL (optional)",
      urlPlaceholder: "https://..."
    },
    heading: "Kontakt einreichen",
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
      invalidUrl: "Muss eine gültige URL sein",
      nameRequired: "Name ist erforderlich",
      programRequired: "Programm ist erforderlich",
      roleRequired: "Rolle ist erforderlich"
    }
  }
};
export default people;
export type PeopleTranslations = typeof people;
