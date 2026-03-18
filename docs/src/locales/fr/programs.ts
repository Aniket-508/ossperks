const programs = {
  applyNow: "Postuler maintenant",
  backToAll: "Tous les programmes",
  by: "par",
  filters: {
    allCategories: "Toutes les catégories",
    allTypes: "Tous les types"
  },
  learnMore: "en savoir plus",
  listing: {
    description: "Outils gratuits, crédits et services disponibles pour les projets open source. Parcourez par catégorie et trouvez les programmes auxquels votre projet est éligible.",
    heading: "Programmes"
  },
  more: "+{count} de plus",
  sections: {
    eligibility: "Éligibilité",
    howToApply: "Comment postuler",
    perks: "Avantages",
    requirements: "Exigences",
    tags: "Tags"
  },
  submit: {
    buttonText: "Soumettre un programme",
    description: "Vous avez un programme à suggérer ? Soumettez ses détails et nous l'ajouterons à la liste.",
    form: {
      addPerk: "Ajouter un avantage",
      addRequirement: "Ajouter une autre",
      addStep: "Ajouter une étape",
      applicationProcessHelp: "Décrivez chaque étape du processus de candidature.",
      applicationProcessLabel: "Comment postuler",
      applicationProcessPlaceholder: "ex., Postuler via le site web du programme",
      applicationUrlCheckbox: "L'URL de candidature est différente de l'URL du programme",
      applicationUrlLabel: "URL de candidature",
      applicationUrlPlaceholder: "https://... or mailto:...",
      categoryLabel: "Catégorie",
      categoryPlaceholder: "Sélectionnez une catégorie",
      descriptionLabel: "Description",
      descriptionPlaceholder: "Que propose ce programme ?",
      eligibilityHelp: "Ajoutez une condition par champ (ex. \"Projets open source\", \"Dépôt GitHub public\").",
      eligibilityLabel: "Éligibilité",
      eligibilityPlaceholder: "ex., Projets open source",
      nameLabel: "Nom du programme",
      namePlaceholder: "ex., Vercel",
      perkDescriptionPlaceholder: "Description (ex., 100 $/mois en crédits)",
      perkLabel: "Avantage {index}",
      perkTitlePlaceholder: "Titre (ex., Crédits gratuits)",
      perksHelp: "Ajoutez chaque avantage avec un titre et une description.",
      perksLabel: "Avantages",
      providerLabel: "Fournisseur",
      providerPlaceholder: "ex., Vercel Inc.",
      requirementLabel: "Condition {index}",
      stepLabel: "Étape {index}",
      tagsAddNew: "Ajouter \"{value}\"",
      tagsHelp: "Sélectionnez ou tapez pour ajouter des tags décrivant ce programme.",
      tagsLabel: "Tags",
      tagsNoResults: "Aucun tag trouvé.",
      tagsPlaceholder: "Rechercher ou ajouter des tags...",
      urlLabel: "URL",
      urlPlaceholder: "https://..."
    },
    heading: "Soumettre un programme",
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
      categoryRequired: "La catégorie est requise",
      descriptionRequired: "La description est requise",
      eligibilityRequired: "Au moins un critère d'éligibilité est requis",
      invalidApplicationUrl: "Doit être une URL valide",
      invalidUrl: "Doit être une URL valide",
      nameRequired: "Le nom du programme est requis",
      perkRequired: "Au moins un avantage avec titre et description est requis",
      providerRequired: "Le fournisseur est requis"
    }
  },
  viewDetails: "Voir les détails du programme {provider}"
};
export default programs;
export type ProgramsTranslations = typeof programs;
