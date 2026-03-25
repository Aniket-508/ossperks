const check = {
  checkAnother: "Verificar outro repositório",
  checkFailed: "Verificação falhou",
  description: "Cole a URL de um repositório do GitHub, GitLab ou Codeberg para ver instantaneamente quais programas e benefícios de código aberto seu projeto pode receber.",
  eligible: "Elegível",
  errors: {
    invalidRequest: "Solicitação de verificação inválida.",
    notFound: "Repositório não encontrado. Verifique a URL e tente novamente.",
    rateLimit: "Limite excedido. Tente novamente em um minuto.",
    unknown: "Algo deu errado. Tente novamente.",
    upstream: "Não foi possível buscar os detalhes do repositório agora. Tente novamente."
  },
  fetchError: "Não foi possível obter os resultados de elegibilidade. Tente novamente.",
  fork: "Fork",
  heading: "Verifique a elegibilidade do seu projeto",
  ineligible: "Não elegível",
  input: {
    invalidUrl: "Insira uma URL válida de um repositório do GitHub, GitLab ou Codeberg",
    placeholder: "Cole a URL de um repositório do GitHub, GitLab ou Codeberg...",
    required: "Cole a URL de um repositório"
  },
  lastPush: "Último push",
  needsReview: "Precisa de revisão",
  perks: "benefícios",
  private: "Privado",
  reasons: {
    codeOfConduct: "O Código de Conduta não pode ser verificado automaticamente",
    communitySize: "O tamanho da comunidade não pode ser verificado automaticamente",
    configFileMet: "Arquivo de configuração detectado ({matched})",
    configFileUnknown: "Nenhum arquivo de configuração de hospedagem detectado",
    criteriaUnverifiable: "Os critérios não podem ser verificados automaticamente",
    hostingPlatform: "O requisito de plataforma de hospedagem não pode ser verificado automaticamente",
    inactive: "Último commit: há {days} d (o projeto pode estar inativo)",
    missionAlignment: "O alinhamento com a missão não pode ser verificado automaticamente",
    noOsiLicense: "Nenhuma licença aprovada pela OSI detectada (detectada: {license})",
    nonCommercial: "O requisito não comercial não pode ser verificado automaticamente",
    osiLicense: "Requer uma licença aprovada pela OSI (detectada: {license})",
    permissiveLicense: "Requer uma licença permissiva (detectada: {license})",
    popularityThreshold: "O limite de popularidade é determinado pelo provedor",
    procedural: "Etapa processual — solicitar manualmente",
    projectTooNew: "O projeto deve ter pelo menos {required} d (atual: {current} d)",
    repoFork: "O repositório é um fork",
    repoPrivate: "O repositório é privado",
    requiresGithub: "Requer um repositório GitHub",
    requiresGitlab: "Requer um repositório GitLab",
    role: "O requisito de função não pode ser verificado automaticamente",
    starsBelow: "Requer {threshold}+ estrelas (atual: {current})",
    starsMet: "Limite de estrelas atingido ({current}/{threshold}+)",
    subjective: "Critérios subjetivos não podem ser verificados automaticamente",
    techStackMet: "Dependência tecnológica detectada ({matched})",
    techStackMissing: "Nenhuma dependência tecnológica correspondente encontrada no package.json",
    techStackUnknown: "Não foi possível detectar as dependências do projeto",
    usageRestriction: "A restrição de uso não pode ser verificada automaticamente"
  },
  checkProgram: "Verificar elegibilidade para {program}",
  noResultFound: "Nenhum resultado de elegibilidade encontrado para este programa.",
  programCheckDescription: "Cole a URL de um repositório para verificar se seu projeto se qualifica para este programa.",
  stars: "estrelas",
  time: {
    daysAgo: "há {days}d",
    monthsAgo: "há {months}m",
    today: "hoje",
    yearsAgo: "há {years}a",
    yesterday: "ontem"
  }
};
export default check;
export type CheckTranslations = typeof check;
