# MetriK — Code Quality Dashboard

> Dashboard de qualidade de código multi-stack. Visualiza métricas geradas pelos boilerplates **[KaiserInc-Utils](https://github.com/Kaiser-Inc/Utils)** (Python FastAPI, Node Fastify, Next.js SaaS, Expo/RN, Ruby on Rails) em gráficos interativos, comparativos e exportáveis.

📄 **[Schema de relatório](docs/report-schema.md)** · 🐳 **[Rodar em Docker](docs/docker.md)**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Recharts](https://img.shields.io/badge/Recharts-2-orange)](https://recharts.org)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com)

---

## Funcionalidades

- **Multi-stack** — detecta automaticamente Python FastAPI, Node Fastify e Ruby on Rails pelo campo `project` do JSON
- **Ícones e filtro por stack** — barra de filtro com logos reais (Python, Node.js, Ruby); filtragem client-side com persistência em `sessionStorage`
- **Labels dinâmicos por stack** — linter (Pylint / Biome / RuboCop), segurança (Xenon / pnpm audit / bundler-audit) se adaptam ao projeto
- **6 StatCards** — CC Média, Manutenibilidade, Cobertura, Linter Score, Bugs Estimados, Segurança
- **4 gráficos interativos** com legendas fixas no bottom e export PNG (resolução 2×)
- **Fallbacks N/A** — quando uma métrica não está disponível para a stack (ex: Halstead no Ruby, MI no Ruby), a UI exibe estado informativo em vez de zeros
- **Comparativo side-by-side** entre 2 relatórios — deltas coloridos (↑↓), cards com N/A quando métrica indisponível, tabela diff por arquivo
- **Dois modos** — local (auto-discovery via `METRICS_DIR`) e deploy (File System Access API)
- **Tutorial integrado** — botão "Como usar" com explicação das métricas e modos de uso

---

## Início Rápido

### Modo Local (desenvolvimento)

```bash
git clone https://github.com/KaiserInc/KaiserInc-MetriKa
cd KaiserInc-MetriKa
pnpm install

cp .env.example .env.local
# Editar .env.local → definir METRICS_DIR=/caminho/absoluto/para/pasta/de/relatorios

pnpm dev
```

Relatórios da pasta configurada aparecem automaticamente. Botão **"Atualizar lista"** recarrega sem reiniciar.

### Modo Docker (LOCAL em container)

```bash
METRICS_HOST_DIR=/abs/path/para/projeto/metrics docker compose up --build
```

Dashboard em `http://localhost:3000`, lendo a pasta montada em `/metrics:ro`.
Detalhes e variantes em **[docs/docker.md](docs/docker.md)**.

### Modo Deploy (Vercel / qualquer host)

Sem variáveis de ambiente necessárias. O usuário seleciona a pasta no browser.

```bash
vercel --prod
```

| Browser | Comportamento |
|---------|--------------|
| Chrome / Edge | Botão "Selecionar pasta" — File System Access API nativa |
| Firefox / Safari | Botão "Selecionar arquivo(s)" — selecione os `.json` individualmente |

Botão **"Atualizar"** re-lê a pasta já selecionada. Dados persistem durante a sessão.

---

## Gerando relatórios

Os relatórios são gerados pelos scripts de métricas inclusos nos boilerplates **[KaiserInc-Utils](https://github.com/Kaiser-Inc/Utils)**. Todos exportam o mesmo schema JSON base com o campo `project` identificando a stack.

### Python FastAPI

```bash
make metrics-install   # instala radon, pylint, xenon, pytest-cov
make metrics           # gera report_YYYY-MM-DD_HHMMSS.json
```

### Node Fastify

```bash
make metrics           # vitest coverage + AST CC/MI + Biome + pnpm audit → JSON
```

### Ruby on Rails

```bash
make metrics           # rspec + flog + SimpleCov + RuboCop + Brakeman + bundler-audit → JSON
```

O MetriK lê o JSON gerado e detecta automaticamente a stack pelo campo `project`.

---

## As métricas por stack

| Métrica | Python FastAPI | Node Fastify | Ruby on Rails |
|---------|---------------|--------------|---------------|
| **Complexidade Ciclomática** | radon cc | AST customizado | flog |
| **Índice de Manutenibilidade** | radon mi | AST customizado | — (N/A) |
| **Cobertura de Testes** | pytest-cov | vitest --coverage | SimpleCov |
| **Análise de Linter** | pylint (+ ruff) | Biome | RuboCop |
| **Métricas de Halstead** | radon hal | — (N/A) | — (N/A) |
| **Segurança / Auditoria** | pip-audit (CVEs) | pnpm audit --prod | bundler-audit + Brakeman |
| **Limiares de Complexidade** | xenon | — | — |

Campos marcados como **N/A** exibem estado informativo na UI em vez de zeros.
Campos opcionais (`ruff`, `pip_audit`, `flog_score`, cobertura dupla) são
descritos em **[docs/report-schema.md](docs/report-schema.md)**. No Python o card
**Segurança** reflete o `pip_audit`; o `xenon` aparece como seção própria de
limiares de complexidade.

---

## Comparativo

1. Home → botão **"Comparar"**
2. Selecionar **2 relatórios** (checkboxes aparecem nos cards)
3. Clicar **"Ver comparativo"** na barra flutuante → `/compare`
4. Deltas coloridos por métrica, gráficos A|B lado a lado, tabela diff por arquivo

Comparativos entre stacks diferentes são suportados — métricas indisponíveis em um dos lados exibem **N/A** no resumo.

---

## Variáveis de ambiente

| Variável | Descrição | Obrigatória |
|----------|-----------|-------------|
| `METRICS_DIR` | Caminho absoluto para pasta com os JSONs. Ausente = modo deploy. | Apenas local |
| `METRICS_HOST_DIR` | (Docker) Caminho no host montado em `/metrics:ro`. | Apenas Docker |
| `METRIK_PORT` | (Docker) Porta exposta no host (padrão `3000`). | Não |

### Health check

`GET /api/health` → `{ ok, mode: 'local' \| 'deploy', metricsDir, reportCount, invalidCount }`.
`invalidCount` conta relatórios que falharam na validação em modo local.

---

## Stack técnica

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| Next.js | 16 (App Router) | Framework |
| TypeScript | 5 | Tipagem |
| @kaiserinc/react | 0.2.x | Design System |
| Recharts | 3 | Gráficos |
| html-to-image | latest | Export PNG |
| Tailwind CSS | 4 | Utilitários |
| Vitest | 3 | Testes unitários (`migrate()`) |
| Playwright | 1.60 | Testes e2e |

---

## Estrutura

```
app/
  page.tsx                  # Home (server component)
  api/reports/              # API route — lista relatórios (retorna { items, errors })
  api/health/               # GET /api/health — modo + contagens
  report/[slug]/            # Dashboard de relatório
  compare/                  # Comparativo side-by-side
components/
  icons/
    StackIcon.tsx           # Logos das stacks (+ fallback 'unknown')
  charts/
    CCChart.tsx             # Complexidade Ciclomática
    MIChart.tsx             # Índice de Manutenibilidade
    CoverageChart.tsx       # Cobertura de Testes
    LintChart.tsx           # Análise de Linter (multi-stack)
    ChartLegend.tsx         # Legenda compartilhada
    ChartCardWithLegend.tsx # Card container com legenda no bottom
    ChartUnavailable.tsx    # Placeholder quando métrica é N/A
  dashboard/
    SummaryCards.tsx        # StatCards com fallbacks N/A
    HalsteadSection.tsx     # Métricas Halstead (com estado N/A)
    SecurityBadge.tsx       # Segurança/Auditoria (+ limiares xenon)
    PipAuditSection.tsx     # Python — vulnerabilidades pip-audit
    RuffSection.tsx         # Python — issues Ruff por código
    FlogBadge.tsx           # Rails — flog score
    DeltaBadge.tsx          # Indicador de delta no comparativo
    ReportDashboard.tsx     # Layout do dashboard individual
    CompareContent.tsx      # Layout do comparativo
  HomeContent.tsx           # Home client (lista + banner de erros)
  StackFilter.tsx           # Barra de filtro por stack
  FilePicker.tsx            # File System Access API + fallback
  CompareBar.tsx            # Barra flutuante de comparação
  TutorialModal.tsx         # Modal "Como usar"
lib/
  parseReport.ts            # migrate() — validação + remaps + normalização
  parseReport.test.ts       # Testes vitest com fixtures por stack
  fileSystem.ts             # Parse JSONs (+ errors), sessionStorage
  metricAvailability.ts     # Helpers de detecção de métricas N/A
  chartTheme.ts             # Cores, estilos, legendas compartilhadas
  formatDate.ts             # Formatação de datas
types/
  metrics.ts                # Stack, STACK_META, MetricsReport, ReportLoadError…
  fsa.d.ts                  # Tipos File System Access API
docs/
  report-schema.md          # Schema completo + campos opcionais
  docker.md                 # Rodar em Docker (modo LOCAL)
e2e/
  home.spec.ts              # Testes: filtro de stack, badges, sessionStorage
  report-stacks.spec.ts     # Testes: labels dinâmicos por stack no dashboard
Dockerfile                  # Build multi-stage (standalone)
docker-compose.yml          # LOCAL mode (monta METRICS_HOST_DIR)
```