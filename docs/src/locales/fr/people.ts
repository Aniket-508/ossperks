const people = {
  associatedWith: "Associé à",
  backToPeople: "Retour aux personnes",
  description: "opérateurs/contacts derrière les programmes qui soutiennent les projets open source.",
  detail: {
    about: "À propos",
    noPrograms: "Aucun programme associé trouvé."
  },
  empty: "Aucun contact de programme n'a encore été ajouté. Ajoutez un contact aux données du programme pour les voir ici.",
  heading: "Personnes",
  roleAt: "{role} chez {provider}",
  submit: {
    buttonText: "Soumettre un contact",
    description: "Vous connaissez quelqu'un derrière un programme ? Soumettez ses coordonnées et nous les ajouterons.",
    form: {
      nameLabel: "Nom",
      namePlaceholder: "ex., Jean Dupont",
      programLabel: "Programme",
      programPlaceholder: "Sélectionnez un programme",
      roleLabel: "Rôle",
      rolePlaceholder: "ex., Responsable programmes OSS",
      urlLabel: "URL (optionnel)",
      urlPlaceholder: "https://..."
    },
    heading: "Soumettre un contact",
    submitButton: "Soumettre la PR",
    submitError: "Échec de l'envoi",
    submitting: "Envoi en cours...",
    success: {
      close: "Fermer",
      heading: "PR créée !",
      message: "Votre pull request a été créée et sera examinée.",
      viewPr: "Voir la PR #{prNumber}"
    },
    validation: {
      invalidUrl: "Doit être une URL valide",
      nameRequired: "Le nom est requis",
      programRequired: "Le programme est requis",
      roleRequired: "Le rôle est requis"
    }
  }
};
export default people;
export type PeopleTranslations = typeof people;
