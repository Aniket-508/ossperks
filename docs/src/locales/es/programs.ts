const programs = {
  applyNow: "Aplicar ahora",
  backToAll: "Todos los programas",
  by: "por",
  filters: {
    allCategories: "Todas las categorías",
    allTypes: "Todos los tipos"
  },
  learnMore: "más información",
  listing: {
    description: "Herramientas gratuitas, créditos y servicios disponibles para proyectos de código abierto. Explora por categoría y encuentra programas para los que tu proyecto cumple los requisitos.",
    heading: "Programas"
  },
  more: "+{count} más",
  sections: {
    eligibility: "Elegibilidad",
    howToApply: "Cómo aplicar",
    perks: "Beneficios",
    requirements: "Requisitos",
    tags: "Etiquetas"
  },
  submit: {
    buttonText: "Enviar un programa",
    description: "¿Tienes un programa para sugerir? Envía sus detalles y lo añadiremos a la lista.",
    form: {
      addPerk: "Añadir beneficio",
      addRequirement: "Añadir otro",
      addStep: "Añadir paso",
      applicationProcessHelp: "Describe cada paso del proceso de solicitud.",
      applicationProcessLabel: "Cómo aplicar",
      applicationProcessPlaceholder: "ej., Solicitar a través del sitio web del programa",
      applicationUrlCheckbox: "La URL de solicitud es diferente de la URL del programa",
      applicationUrlLabel: "URL de solicitud",
      applicationUrlPlaceholder: "https://... or mailto:...",
      categoryLabel: "Categoría",
      categoryPlaceholder: "Selecciona una categoría",
      descriptionLabel: "Descripción",
      descriptionPlaceholder: "¿Qué ofrece este programa?",
      eligibilityHelp: "Añade un requisito por campo (ej. \"Proyectos de código abierto\", \"Repositorio público en GitHub\").",
      eligibilityLabel: "Elegibilidad",
      eligibilityPlaceholder: "ej., Proyectos de código abierto",
      nameLabel: "Nombre del programa",
      namePlaceholder: "ej., Vercel",
      perkDescriptionPlaceholder: "Descripción (ej., $100/mes en créditos)",
      perkLabel: "Beneficio {index}",
      perkTitlePlaceholder: "Título (ej., Créditos gratuitos)",
      perksHelp: "Añade cada beneficio con un título y una descripción.",
      perksLabel: "Beneficios",
      providerLabel: "Proveedor",
      providerPlaceholder: "ej., Vercel Inc.",
      requirementLabel: "Requisito {index}",
      stepLabel: "Paso {index}",
      tagsAddNew: "Añadir \"{value}\"",
      tagsHelp: "Selecciona o escribe para añadir etiquetas que describan este programa.",
      tagsLabel: "Etiquetas",
      tagsNoResults: "No se encontraron etiquetas.",
      tagsPlaceholder: "Buscar o añadir etiquetas...",
      urlLabel: "URL",
      urlPlaceholder: "https://..."
    },
    heading: "Enviar un programa",
    submitButton: "Enviar PR",
    submitError: "Error al enviar",
    submitting: "Enviando...",
    success: {
      close: "Cerrar",
      heading: "¡PR creada!",
      message: "Tu pull request ha sido creada y será revisada.",
      viewPr: "Ver PR #{prNumber}"
    },
    validation: {
      categoryRequired: "La categoría es obligatoria",
      descriptionRequired: "La descripción es obligatoria",
      eligibilityRequired: "Se requiere al menos un criterio de elegibilidad",
      invalidApplicationUrl: "Debe ser una URL válida",
      invalidUrl: "Debe ser una URL válida",
      nameRequired: "El nombre del programa es obligatorio",
      perkRequired: "Se requiere al menos un beneficio con título y descripción",
      providerRequired: "El proveedor es obligatorio"
    }
  },
  viewDetails: "Ver detalles del programa de {provider}"
};
export default programs;
export type ProgramsTranslations = typeof programs;
