const people = {
  associatedWith: "Asociado con",
  backToPeople: "Volver a personas",
  description: "operadores/contactos detrás de los programas que apoyan proyectos de código abierto.",
  detail: {
    about: "Acerca de",
    noPrograms: "No se encontraron programas asociados."
  },
  empty: "Aún no se han añadido contactos de programas. Agrega un contacto a los datos del programa para verlos aquí.",
  heading: "Personas",
  roleAt: "{role} en {provider}",
  submit: {
    buttonText: "Enviar un contacto",
    description: "¿Conoces a alguien detrás de un programa? Envía sus datos y los añadiremos.",
    form: {
      nameLabel: "Nombre",
      namePlaceholder: "ej., María García",
      programLabel: "Programa",
      programPlaceholder: "Selecciona un programa",
      roleLabel: "Rol",
      rolePlaceholder: "ej., Gerente de programas OSS",
      urlLabel: "URL (opcional)",
      urlPlaceholder: "https://..."
    },
    heading: "Enviar un contacto",
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
      invalidUrl: "Debe ser una URL válida",
      nameRequired: "El nombre es obligatorio",
      programRequired: "El programa es obligatorio",
      roleRequired: "El rol es obligatorio"
    }
  }
};
export default people;
export type PeopleTranslations = typeof people;
