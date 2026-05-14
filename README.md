# MetriK — Code Quality Dashboard

> Dashboard de qualidade de código multi-stack. Visualiza métricas geradas pelos boilerplates **[KaiserInc-Utils](https://github.com/Kaiser-Inc/Utils)** (Python FastAPI, Node Fastify, Ruby on Rails) em gráficos interativos, comparativos e exportáveis.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Recharts](https://img.shields.io/badge/Recharts-2-orange)](https://recharts.org)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com)

---

## Funcionalidades

- **Multi-stack** — detecta automaticamente Python FastAPI, Node Fastify e Ruby on Rails pelo campo `project` do JSON
- **Ícones e filtro por stack** — barra de filtro com logos reais (Python, Node.js, Ruby); filtragem client-side com persistência em `sessionStorage`
- **Labels dinâmicos por stack** — linter (Pylint / Biome / RuboCop), segurança (Xenon / npm audit / bundler-audit) se adaptam ao projeto
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
make metrics           # vitest coverage + AST CC/MI + Biome + npm audit → JSON
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
| **Análise de Linter** | pylint | Biome | RuboCop |
| **Métricas de Halstead** | radon hal | — (N/A) | — (N/A) |
| **Segurança / Auditoria** | xenon | npm audit | bundler-audit + Brakeman |

Campos marcados como **N/A** exibem estado informativo na UI em vez de zeros.

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

---

## Stack técnica

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| Next.js | 16 (App Router) | Framework |
| TypeScript | 5 | Tipagem |
| @kaiserinc/react | 0.2.x | Design System |
| Recharts | 2 | Gráficos |
| html-to-image | latest | Export PNG |
| Tailwind CSS | 4 | Utilitários |
| Playwright | 1.60 | Testes e2e |

---

## Estrutura

```
app/
  page.tsx                  # Home (server component)
  api/reports/              # API route — lista relatórios do METRICS_DIR
  report/[slug]/            # Dashboard de relatório
  compare/                  # Comparativo side-by-side
components/
  icons/
    StackIcon.tsx           # Logos SVG/img das 3 stacks
  charts/
    CCChart.tsx             # Complexidade Ciclomática
    MIChart.tsx             # Índice de Manutenibilidade
    CoverageChart.tsx       # Cobertura de Testes
    PylintChart.tsx         # Análise de Linter (multi-stack)
    ChartLegend.tsx         # Legenda compartilhada
    ChartCardWithLegend.tsx # Card container com legenda no bottom
    ChartUnavailable.tsx    # Placeholder quando métrica é N/A
  dashboard/
    SummaryCards.tsx        # 6 StatCards com fallbacks N/A
    HalsteadSection.tsx     # Métricas Halstead (com estado N/A)
    XenonBadge.tsx          # Segurança/Auditoria
    DeltaBadge.tsx          # Indicador de delta no comparativo
    ReportDashboard.tsx     # Layout do dashboard individual
    CompareContent.tsx      # Layout do comparativo
  StackFilter.tsx           # Barra de filtro por stack
  FilePicker.tsx            # File System Access API + fallback
  CompareBar.tsx            # Barra flutuante de comparação
  TutorialModal.tsx         # Modal "Como usar"
lib/
  fileSystem.ts             # Parse JSONs, sessionStorage
  metricAvailability.ts     # Helpers de detecção de métricas N/A
  chartTheme.ts             # Cores, estilos, legendas compartilhadas
  formatDate.ts             # Formatação de datas
types/
  metrics.ts                # Stack, STACK_META, MetricsReport, EnrichedItem
  fsa.d.ts                  # Tipos File System Access API
e2e/
  home.spec.ts              # Testes: filtro de stack, badges, sessionStorage
  report-stacks.spec.ts     # Testes: labels dinâmicos por stack no dashboard
```

---

## Tópicos sugeridos para o repositório

`code-quality` `metrics` `dashboard` `nextjs` `typescript` `recharts` `vercel` `kaiserinc` `multi-stack` `python` `nodejs` `ruby` `fastapi` `fastify` `rails` `coverage` `static-analysis`
