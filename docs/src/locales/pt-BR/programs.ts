const programs = {
  applyNow: "Inscrever-se agora",
  backToAll: "Todos os programas",
  by: "por",
  filters: {
    allCategories: "Todas as categorias",
    allTypes: "Todos os tipos"
  },
  learnMore: "saiba mais",
  listing: {
    description: "Ferramentas gratuitas, créditos e serviços disponíveis para projetos de código aberto. Navegue por categoria e encontre programas para os quais seu projeto se qualifica.",
    heading: "Programas"
  },
  more: "+{count} mais",
  sections: {
    eligibility: "Elegibilidade",
    howToApply: "Como se inscrever",
    perks: "Benefícios",
    requirements: "Requisitos",
    tags: "Tags"
  },
  submit: {
    buttonText: "Enviar um programa",
    description: "Tem um programa para sugerir? Envie os detalhes e nós o adicionaremos à lista.",
    form: {
      addPerk: "Adicionar benefício",
      addRequirement: "Adicionar outro",
      addStep: "Adicionar etapa",
      applicationProcessHelp: "Descreva cada etapa do processo de inscrição.",
      applicationProcessLabel: "Como se inscrever",
      applicationProcessPlaceholder: "ex., Inscrever-se pelo site do programa",
      applicationUrlCheckbox: "URL de inscrição é diferente da URL do programa",
      applicationUrlLabel: "URL de inscrição",
      applicationUrlPlaceholder: "https://... or mailto:...",
      categoryLabel: "Categoria",
      categoryPlaceholder: "Selecione uma categoria",
      descriptionLabel: "Descrição",
      descriptionPlaceholder: "O que este programa oferece?",
      eligibilityHelp: "Adicione um requisito por campo (ex. \"Projetos de código aberto\", \"Repositório público no GitHub\").",
      eligibilityLabel: "Elegibilidade",
      eligibilityPlaceholder: "ex., Projetos de código aberto",
      nameLabel: "Nome do programa",
      namePlaceholder: "ex., Vercel",
      perkDescriptionPlaceholder: "Descrição (ex., $100/mês em créditos)",
      perkLabel: "Benefício {index}",
      perkTitlePlaceholder: "Título (ex., Créditos gratuitos)",
      perksHelp: "Adicione cada benefício com um título e uma descrição.",
      perksLabel: "Benefícios",
      providerLabel: "Provedor",
      providerPlaceholder: "ex., Vercel Inc.",
      requirementLabel: "Requisito {index}",
      stepLabel: "Etapa {index}",
      tagsAddNew: "Adicionar \"{value}\"",
      tagsHelp: "Selecione ou digite para adicionar tags que descrevam este programa.",
      tagsLabel: "Tags",
      tagsNoResults: "Nenhuma tag encontrada.",
      tagsPlaceholder: "Pesquisar ou adicionar tags...",
      urlLabel: "URL",
      urlPlaceholder: "https://..."
    },
    heading: "Enviar um programa",
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
      categoryRequired: "A categoria é obrigatória",
      descriptionRequired: "A descrição é obrigatória",
      eligibilityRequired: "Pelo menos um critério de elegibilidade é necessário",
      invalidApplicationUrl: "Deve ser uma URL válida",
      invalidUrl: "Deve ser uma URL válida",
      nameRequired: "O nome do programa é obrigatório",
      perkRequired: "Pelo menos um benefício com título e descrição é necessário",
      providerRequired: "O provedor é obrigatório"
    }
  },
  viewDetails: "Ver detalhes do programa {provider}"
};
export default programs;
export type ProgramsTranslations = typeof programs;
