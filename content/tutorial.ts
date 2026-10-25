// Single source for the "Como usar" copy. The landing page and the dashboard
// help sheet both render it, so the two never drift apart. Backticks mark inline code.

export type Tone = "success" | "warning" | "destructive"

export type RunMode = {
  id: "local" | "docker" | "deploy"
  title: string
  description: string
}

export type StackGuide = {
  id: "python" | "node" | "rails"
  label: string
  tools: string
  commands: { label: string; command: string }[]
  note?: string
}

export type MetricGuide = {
  id: string
  name: string
  description: string
  thresholds: { range: string; label: string; tone: Tone }[]
}

export const tutorialIntro =
  "O MetriK lê os relatórios JSON gerados pelos boilerplates KaiserInc-Utils e mostra as métricas de qualidade de código em gráficos que você compara."

export const runModes: RunMode[] = [
  {
    id: "local",
    title: "Local",
    description:
      "Defina `METRICS_DIR` no `.env.local` com o caminho absoluto da pasta de relatórios e rode `pnpm dev`. Os relatórios aparecem sozinhos; use Atualizar lista para recarregar.",
  },
  {
    id: "docker",
    title: "Docker",
    description:
      "Rode `METRICS_HOST_DIR=/caminho/para/metrics docker compose up --build`. O dashboard abre em `http://localhost:3000` e lê a pasta montada como somente leitura.",
  },
  {
    id: "deploy",
    title: "Deploy",
    description:
      "Não precisa de variáveis de ambiente. No Chrome e no Edge, use Selecionar pasta. No Firefox e no Safari, use Selecionar arquivo(s) e escolha os `.json`. Os arquivos são lidos no seu navegador.",
  },
]

export const stackGuides: StackGuide[] = [
  {
    id: "python",
    label: "Python FastAPI",
    tools: "radon, pylint, ruff, xenon, pytest-cov e pip-audit.",
    commands: [
      { label: "Instale as ferramentas (uma vez)", command: "make metrics-install" },
      { label: "Colete as métricas", command: "make metrics" },
    ],
    note: "Além do JSON, o comando gera `.md`, `.xlsx`, `.html` e PNGs para uso offline.",
  },
  {
    id: "node",
    label: "Node Fastify",
    tools: "vitest com cobertura, análise AST de complexidade, Biome e pnpm audit.",
    commands: [{ label: "Colete as métricas", command: "make metrics" }],
  },
  {
    id: "rails",
    label: "Ruby on Rails",
    tools: "rspec, flog, SimpleCov, RuboCop, Brakeman e bundler-audit.",
    commands: [{ label: "Colete as métricas", command: "make metrics" }],
    note: "O Rails não tem índice de manutenibilidade nem Halstead; esses campos aparecem como N/A.",
  },
]

export const reportFileNote =
  "Cada execução grava `metrics/report_AAAA-MM-DD_HHMMSS.json`, o arquivo que o MetriK lê. A stack é detectada pelo campo `project`."

export const compareSteps = [
  "No dashboard, marque dois relatórios na lista.",
  "Clique em Ver comparativo na barra que aparece.",
  "Veja os deltas por métrica, os gráficos lado a lado e a diferença por arquivo. Stacks diferentes podem ser comparadas, e a métrica que um dos lados não tem aparece como N/A.",
]

export const metricGuides: MetricGuide[] = [
  {
    id: "cc",
    name: "Complexidade ciclomática",
    description:
      "Conta os caminhos independentes do código. Quanto menor, mais simples e testável.",
    thresholds: [
      { range: "≤ 5", label: "A", tone: "success" },
      { range: "≤ 10", label: "B", tone: "warning" },
      { range: "> 10", label: "C ou pior", tone: "destructive" },
    ],
  },
  {
    id: "mi",
    name: "Índice de manutenibilidade",
    description:
      "Nota de 0 a 100 que combina volume, complexidade e linhas de código. Quanto maior, mais fácil de manter.",
    thresholds: [
      { range: "≥ 20", label: "Fácil", tone: "success" },
      { range: "≥ 10", label: "Moderado", tone: "warning" },
      { range: "< 10", label: "Crítico", tone: "destructive" },
    ],
  },
  {
    id: "coverage",
    name: "Cobertura de testes",
    description:
      "Percentual de linhas executadas pelos testes, medido pela ferramenta de cobertura da stack.",
    thresholds: [
      { range: "≥ 80%", label: "Meta", tone: "success" },
      { range: "≥ 50%", label: "Parcial", tone: "warning" },
      { range: "< 50%", label: "Crítico", tone: "destructive" },
    ],
  },
  {
    id: "lint",
    name: "Análise de linter",
    description:
      "Problemas estáticos agrupados por severidade, com nota de 0 a 10 quando a ferramenta calcula uma.",
    thresholds: [],
  },
  {
    id: "halstead",
    name: "Métricas de Halstead",
    description:
      "Calculadas a partir de operadores e operandos únicos: volume, dificuldade, esforço e bugs estimados. Só existem nas stacks com análise AST.",
    thresholds: [],
  },
  {
    id: "security",
    name: "Segurança e auditoria",
    description:
      "Procura vulnerabilidades nas dependências e problemas de segurança no código. O resultado é aprovado ou reprovado.",
    thresholds: [],
  },
]
