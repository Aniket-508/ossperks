const people = {
  associatedWith: "Associado a",
  backToPeople: "Voltar para pessoas",
  description: "operadores/contatos por trás dos programas que apoiam projetos de código aberto.",
  detail: {
    about: "Sobre",
    noPrograms: "Nenhum programa associado encontrado."
  },
  empty: "Nenhum contato de programa foi adicionado ainda. Adicione um contato aos dados do programa para vê-los aqui.",
  heading: "Pessoas",
  roleAt: "{role} em {provider}",
  submit: {
    buttonText: "Enviar um contato",
    description: "Conhece alguém por trás de um programa? Envie os detalhes e nós o adicionaremos.",
    form: {
      nameLabel: "Nome",
      namePlaceholder: "ex., Maria Silva",
      programLabel: "Programa",
      programPlaceholder: "Selecione um programa",
      roleLabel: "Cargo",
      rolePlaceholder: "ex., Gerente de programas OSS",
      urlLabel: "URL (opcional)",
      urlPlaceholder: "https://..."
    },
    heading: "Enviar um contato",
    submitButton: "Enviar PR",
    submitError: "Falha ao enviar",
    submitting: "Enviando...",
    success: {
      close: "Fechar",
      heading: "PR criado!",
      message: "Seu pull request foi criado e será revisado.",
      viewPr: "Ver PR #{prNumber}"
    },
    validation: {
      invalidUrl: "Deve ser uma URL válida",
      nameRequired: "O nome é obrigatório",
      programRequired: "O programa é obrigatório",
      roleRequired: "O cargo é obrigatório"
    }
  }
};
export default people;
export type PeopleTranslations = typeof people;
