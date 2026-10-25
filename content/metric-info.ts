// Explanations shown in the "Saiba mais" panel of each metric. Backticks mark inline code.

export type Tone = "success" | "warning" | "destructive" | "neutral"

export type MetricKey = "cc" | "mi" | "coverage" | "lint" | "halstead" | "security" | "tests"

export type Band = { range: string; label: string; detail?: string; tone: Tone }

export type InfoSection = {
  title?: string
  bands?: Band[]
  items?: { title: string; detail: string }[]
  code?: { text: string; caption?: string }
  note?: string
}

export type MetricInfo = {
  title: string
  subtitle: string
  intro: string
  sections: InfoSection[]
  tip: string
}

export type MetricInfoContext = {
  lintLabel: string
  secLabel: string
  isPipAudit: boolean
}

const ccInfo: MetricInfo = {
  title: "Complexidade ciclomática",
  subtitle: "Conta os caminhos de execução independentes de uma função.",
  intro: "Cada `if`, `for`, `while`, `case`, `&&`, `||` e `?` adiciona 1 ao contador da função.",
  sections: [
    {
      bands: [
        { range: "1 – 5", label: "A · Simples", detail: "Risco baixo", tone: "success" },
        { range: "6 – 10", label: "B · Moderado", detail: "Risco baixo", tone: "success" },
        { range: "11 – 15", label: "C · Complexo", detail: "Risco médio", tone: "warning" },
        { range: "16 – 20", label: "D · Muito complexo", detail: "Risco alto", tone: "destructive" },
        { range: "21 – 25", label: "E · Extremamente complexo", detail: "Risco muito alto", tone: "destructive" },
        { range: "> 25", label: "F · Instável", detail: "Risco crítico", tone: "destructive" },
      ],
    },
  ],
  tip: "Mantenha funções com CC ≤ 10 (grau B ou melhor). Acima de C, são candidatas a refatoração.",
}

const miInfo: MetricInfo = {
  title: "Índice de manutenibilidade",
  subtitle: "Combina CC, Halstead e linhas de código em uma nota de 0 a 100.",
  intro:
    "A escala vai de 0 a 100 e usa uma fórmula logarítmica, então não funciona como nota escolar. A maioria dos projetos reais fica entre 65 e 95.",
  sections: [
    {
      bands: [
        { range: "≥ 85", label: "A · Alta", detail: "Fácil de ler, modificar e estender.", tone: "success" },
        { range: "65 – 84", label: "B · Boa", detail: "Saudável. Pequenas melhorias levam ao A.", tone: "success" },
        { range: "40 – 64", label: "C · Média", detail: "Funcional, mas mudanças ficam mais difíceis.", tone: "warning" },
        { range: "20 – 39", label: "D · Baixa", detail: "Código denso. Refatoração recomendada.", tone: "destructive" },
        { range: "< 20", label: "F · Crítica", detail: "Código frágil. Qualquer mudança tem risco alto.", tone: "destructive" },
      ],
      note: "Python (Radon) usa limiares próprios: A é ≥ 20, B é 10 a 19 e C é 0 a 9. Por isso os relatórios Python mostram o nome da faixa em vez da letra.",
    },
    {
      title: "O que reduz o índice",
      items: [
        { title: "Volume Halstead", detail: "Mais operadores e operandos tornam o código mais difícil de entender." },
        { title: "Complexidade ciclomática", detail: "Mais caminhos de execução tornam o código mais difícil de testar." },
        { title: "Linhas de código", detail: "Funções longas reduzem a manutenibilidade." },
      ],
    },
  ],
  tip: "Abaixo de 40 há dívida técnica acumulada. Refatore primeiro as funções mais longas e com maior CC.",
}

const coverageInfo: MetricInfo = {
  title: "Cobertura de testes",
  subtitle: "Percentual de linhas executadas durante a rodada de testes.",
  intro:
    "É calculada a partir do relatório de cobertura que o framework de testes de cada stack gera.",
  sections: [
    {
      bands: [
        { range: "≥ 90%", label: "Excelente", detail: "Quase todo caminho é validado por testes.", tone: "success" },
        { range: "80 – 89%", label: "Boa", detail: "Cobertura sólida, com lacunas de risco baixo.", tone: "success" },
        { range: "50 – 79%", label: "Aceitável", detail: "Partes críticas podem estar sem teste. Revise.", tone: "warning" },
        { range: "< 50%", label: "Insuficiente", detail: "Refatorações e bugs passam sem ser detectados.", tone: "destructive" },
      ],
      note: "Cobertura alta não garante código sem bugs: ela mostra se o código foi executado, não se o comportamento está correto. Asserções sólidas importam mais que a porcentagem.",
    },
  ],
  tip: "Cubra primeiro os caminhos críticos (autenticação, pagamentos, regras de negócio) antes de perseguir 100%.",
}

const halsteadInfo: MetricInfo = {
  title: "Bugs estimados (Halstead)",
  subtitle: "Estimativa matemática de bugs baseada no vocabulário do código.",
  intro:
    "Compara a quantidade de operadores (`+`, `=`, `()`) e operandos (variáveis e literais) únicos com o total usado no código.",
  sections: [
    {
      title: "Fórmula simplificada",
      code: {
        text: "Bugs ≈ Volume / 3000",
        caption: "Volume = total de tokens × log₂(vocabulário único)",
      },
    },
    {
      bands: [
        { range: "< 0,5", label: "Risco baixo", detail: "Código simples e bem organizado.", tone: "success" },
        { range: "0,5 – 1,0", label: "Risco moderado", detail: "Atenção ao tamanho das funções.", tone: "warning" },
        { range: "> 1,0", label: "Risco alto", detail: "Candidato a refatoração urgente.", tone: "destructive" },
      ],
      note: "É uma estimativa teórica, não uma contagem de bugs reais. Use como indicador de complexidade acumulada.",
    },
  ],
  tip: "Valores acima de 1,0 costumam indicar funções muito longas ou com lógica densa. Quebre em funções menores e mais coesas.",
}

const testsInfo: MetricInfo = {
  title: "Testes",
  subtitle: "Contagem de casos de teste executados e aprovados.",
  intro:
    "Mede a quantidade de testes, não quais linhas eles exercitam. Para isso existe a cobertura.",
  sections: [
    {
      items: [
        {
          title: "Testes não são cobertura",
          detail: "Poucos testes bem escritos podem cobrir mais código que muitos testes superficiais. Monitore os dois.",
        },
        {
          title: "Testes falhando",
          detail: "Qualquer falha indica comportamento inesperado. Não faça deploy com testes falhando.",
        },
        {
          title: "Zero testes",
          detail: "Sem testes, qualquer refatoração vira risco. Comece pelas rotas principais.",
        },
      ],
    },
  ],
  tip: "Priorize testes de integração (caminho feliz e casos de erro) para ganhar cobertura real mais rápido.",
}

const lintTools: Record<
  string,
  { title: string; intro: string; scoreTitle: string; bands: Band[]; categories?: InfoSection }
> = {
  Pylint: {
    title: "Pylint (Python)",
    intro:
      "Analisa estilo, erros e boas práticas. A nota vai de 0 a 10 conforme o número e a gravidade dos problemas.",
    scoreTitle: "Nota de 0 a 10",
    bands: [
      { range: "9 – 10", label: "Excelente", tone: "success" },
      { range: "7 – 8", label: "Bom", tone: "success" },
      { range: "5 – 6", label: "Aceitável", tone: "warning" },
      { range: "< 5", label: "Ruim", tone: "destructive" },
    ],
    categories: {
      title: "Categorias do Pylint",
      items: [
        { title: "E#### · Erro", detail: "Erro real de código, como import inválido ou variável não definida." },
        { title: "W#### · Aviso", detail: "Problema potencial que pode gerar comportamento inesperado." },
        { title: "C#### · Convenção", detail: "Violação de estilo, como PEP 8 e nomenclatura." },
        { title: "R#### · Refatoração", detail: "Sinal de código que pode ser simplificado." },
        { title: "I#### · Informação", detail: "Informações sobre módulos ou imports." },
      ],
    },
  },
  Biome: {
    title: "Biome (Node, Next e Expo)",
    intro:
      "Linter e formatter rápido para TypeScript e JavaScript. Reporta problemas de estilo, segurança e qualidade; a nota reflete a ausência de problemas.",
    scoreTitle: "Problemas encontrados",
    bands: [
      { range: "0 problemas", label: "Perfeito", tone: "success" },
      { range: "1 – 5", label: "Aceitável", tone: "warning" },
      { range: "> 5", label: "Atenção", tone: "destructive" },
    ],
  },
  RuboCop: {
    title: "RuboCop (Ruby)",
    intro:
      "Linter oficial do ecossistema Ruby. Verifica o Ruby Style Guide e detecta padrões problemáticos de design.",
    scoreTitle: "Infrações encontradas",
    bands: [
      { range: "0 infrações", label: "Perfeito", tone: "success" },
      { range: "1 – 10", label: "Aceitável", tone: "warning" },
      { range: "> 10", label: "Atenção", tone: "destructive" },
    ],
  },
}

function lintInfo(lintLabel: string): MetricInfo {
  const tool = lintTools[lintLabel] ?? lintTools.Biome
  return {
    title: `Nota do ${lintLabel}`,
    subtitle: "Estilo e boas práticas detectados pelo linter da stack.",
    intro: tool.intro,
    sections: [{ title: tool.scoreTitle, bands: tool.bands }, ...(tool.categories ? [tool.categories] : [])],
    tip:
      lintLabel === "Pylint"
        ? "Corrija os erros (E####) antes das convenções (C####). Nota abaixo de 7 indica dívida técnica relevante."
        : "Zero problemas é o ideal. Configure as regras no projeto para padronizar o estilo da equipe.",
  }
}

const severity: Band[] = [
  { range: "Crítico", label: "Corrija antes de qualquer deploy", detail: "Exploração remota imediata.", tone: "destructive" },
  { range: "Alto", label: "Atualize ou aplique contorno urgente", detail: "Risco grave.", tone: "destructive" },
  { range: "Moderado", label: "Planeje a correção no próximo ciclo", detail: "Risco controlado.", tone: "warning" },
  { range: "Baixo", label: "Monitore e corrija quando puder", detail: "Risco mínimo.", tone: "neutral" },
]

const securityTools: Record<string, { name: string; what: string }> = {
  "pip-audit": {
    name: "pip-audit",
    what: "Compara os pacotes instalados com as vulnerabilidades conhecidas (CVEs) do PyPA Advisory Database.",
  },
  "pnpm audit": {
    name: "pnpm audit",
    what: "Analisa o `pnpm-lock.yaml` (só dependências de produção) e confere cada pacote com o GitHub Advisory Database.",
  },
  "bundler-audit": {
    name: "bundler-audit",
    what: "Confere o `Gemfile.lock` com o Ruby Advisory Database e aponta gems com checksum inválido.",
  },
  Xenon: {
    name: "Xenon",
    what: "Não mede segurança: garante que a complexidade ciclomática não passe dos limites definidos (max-absolute, max-modules, max-average).",
  },
}

function securityInfo(secLabel: string, isPipAudit: boolean): MetricInfo {
  const tool = securityTools[secLabel] ?? securityTools["pnpm audit"]
  const sections: InfoSection[] = []
  if (secLabel !== "Xenon") sections.push({ title: "Níveis de severidade", bands: severity })
  if (isPipAudit) {
    sections.push({
      note: "O Python usa dois controles distintos: o pip-audit procura CVEs nas dependências (aqui) e o Xenon vigia os limiares de complexidade (seção separada, abaixo).",
    })
  }
  return {
    title: "Segurança",
    subtitle: "Auditoria de vulnerabilidades conhecidas nas dependências do projeto.",
    intro: `${tool.name}: ${tool.what}`,
    sections,
    tip: "Rode a auditoria no CI a cada pull request. Vulnerabilidades altas ou críticas nunca devem chegar à produção.",
  }
}

export function getMetricInfo(key: MetricKey, context: MetricInfoContext): MetricInfo {
  switch (key) {
    case "cc":
      return ccInfo
    case "mi":
      return miInfo
    case "coverage":
      return coverageInfo
    case "halstead":
      return halsteadInfo
    case "tests":
      return testsInfo
    case "lint":
      return lintInfo(context.lintLabel)
    case "security":
      return securityInfo(context.secLabel, context.isPipAudit)
  }
}
