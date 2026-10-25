// Copy for the landing page (pt-BR). Backticks mark inline code.

export const contactEmail = "kaiserinc.tech@gmail.com"
export const repositoryUrl = "https://github.com/Kaiser-Inc/MetriK"

export const navLinks = [
  { label: "O que é", href: "#o-que-e" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Como usar", href: "#como-usar" },
  { label: "Métricas", href: "#metricas" },
  { label: "Dúvidas", href: "#duvidas" },
]

export const hero = {
  eyebrow: "KAISERINC · CÓDIGO ABERTO",
  title: "Qualidade de código",
  highlight: "à vista",
  description:
    "O MetriK lê os relatórios gerados pelos boilerplates KaiserInc-Utils e mostra complexidade, manutenibilidade, cobertura, linter e segurança em gráficos que você compara e exporta.",
}

export const pillars = [
  {
    title: "Medir",
    description:
      "Seis métricas por relatório: complexidade, manutenibilidade, cobertura, linter, Halstead e segurança.",
  },
  {
    title: "Comparar",
    description: "Dois relatórios lado a lado, com a variação de cada métrica e a diferença por arquivo.",
  },
  {
    title: "Exportar",
    description: "Gráficos em PNG com resolução 2×, prontos para relatórios e apresentações.",
  },
]

export const features = [
  {
    title: "Multi-stack",
    description:
      "Python FastAPI, Node Fastify e Ruby on Rails, com o linter e a auditoria de segurança de cada stack.",
  },
  {
    title: "N/A explicado",
    description:
      "Quando a stack não gera uma métrica, o dashboard explica o motivo em vez de mostrar zero.",
  },
  {
    title: "Comparativo por arquivo",
    description: "Veja quais arquivos melhoraram ou pioraram entre dois relatórios.",
  },
  {
    title: "Local ou deploy",
    description: "Leia uma pasta do seu computador ou selecione os arquivos direto no navegador.",
  },
]

export const steps = [
  {
    title: "Gere o relatório",
    description: "Rode `make metrics` no projeto criado a partir de um boilerplate KaiserInc-Utils.",
  },
  {
    title: "Carregue no MetriK",
    description:
      "Aponte `METRICS_DIR` para a pasta ou selecione os arquivos no navegador, sem configurar nada.",
  },
  {
    title: "Analise e compare",
    description: "Veja os gráficos, compare dois relatórios e exporte o que precisar.",
  },
]

export const faq = [
  {
    question: "Quais stacks são suportadas?",
    answer:
      "Os cinco boilerplates do KaiserInc-Utils: Python FastAPI, Node Fastify, Next.js SaaS, Expo/React Native e Ruby on Rails. O MetriK detecta a stack pelo campo `project` do JSON.",
  },
  {
    question: "Meus relatórios saem do meu computador?",
    answer:
      "Não. No modo deploy, os arquivos são lidos no seu navegador e não são enviados a nenhum servidor. No modo local ou no Docker, o MetriK roda na sua máquina e lê só a pasta que você configurou.",
  },
  {
    question: "Por que uma métrica aparece como N/A?",
    answer:
      "Nem toda stack gera todas as métricas. O Rails, por exemplo, não tem índice de manutenibilidade nem Halstead. Em vez de mostrar zero, o MetriK mostra N/A.",
  },
  {
    question: "Funciona no Firefox e no Safari?",
    answer:
      "Funciona. Esses navegadores não leem pastas, então use Selecionar arquivo(s) e escolha os `.json`.",
  },
  {
    question: "Como gero o JSON?",
    answer:
      "Rode `make metrics` no projeto do boilerplate. O comando grava `metrics/report_AAAA-MM-DD_HHMMSS.json`. Na stack Python, rode `make metrics-install` uma vez antes.",
  },
  {
    question: "Como falo com a equipe?",
    answer: `Escreva para ${contactEmail}.`,
  },
]
