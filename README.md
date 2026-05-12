# MetriK — Code Quality Dashboard

> Dashboard de qualidade de código para projetos Python (FastAPI). Visualiza métricas geradas pelo script `scripts/metrics.py` do boilerplate **[KaiserInc-Utils](https://github.com/Kaiser-Inc/Utils)** em gráficos interativos, comparativos e exportáveis.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Recharts](https://img.shields.io/badge/Recharts-2-orange)](https://recharts.org)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com)

---

## Funcionalidades

- **6 StatCards** — Complexidade Ciclomática, Manutenibilidade, Cobertura, Pylint, Halstead, Xenon
- **4 gráficos interativos** com legendas sempre visíveis e export PNG (resolução 2×)
- **Comparativo side-by-side** entre 2 relatórios — deltas coloridos (↑↓) e tabela diff por arquivo
- **Dois modos** — local (auto-discovery via `METRICS_DIR`) e deploy (File System Access API)
- **Tutorial integrado** — botão "Como usar" com explicação das 6 métricas e modos de uso

---

## Início Rápido

### Modo Local (desenvolvimento)

```bash
git clone https://github.com/KaiserInc/KaiserInc-MetriKa
cd KaiserInc-MetriKa
pnpm install

cp .env.example .env.local
# Editar .env.local → definir METRICS_DIR=/caminho/absoluto/para/metrics

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

Os relatórios são gerados pelo script `scripts/metrics.py` incluso no boilerplate **[KaiserInc-Utils](https://github.com/Kaiser-Inc/Utils)** (Python / FastAPI). Com o projeto configurado:

```bash
# 1. Instalar ferramentas (uma vez)
make metrics-install

# 2. Coletar métricas
make metrics
```

O MetriK lê o `metrics/report_YYYY-MM-DD_HHMMSS.json`. O script também gera `.md`, `.xlsx`, `.html` e 4 PNGs para uso offline.

---

## As 6 métricas

| Métrica | Ferramenta | Thresholds |
|---------|-----------|-----------|
| **Complexidade Ciclomática (CC)** | `radon cc` | ≤5 A · ≤10 B · >10 C+ |
| **Índice de Manutenibilidade (MI)** | `radon mi` | ≥20 fácil · ≥10 moderado · <10 difícil |
| **Cobertura de Testes** | `pytest-cov` | ≥80% meta · ≥50% parcial · <50% crítico |
| **Análise Pylint** | `pylint` | Score 0–10, issues por categoria |
| **Métricas de Halstead** | `radon hal` | Volume, dificuldade, esforço, bugs estimados |
| **Xenon** | `xenon` | Passa/falha conforme thresholds A/B/C configurados |

---

## Comparativo

1. Home → botão **"Comparar"**
2. Selecionar **2 relatórios** (checkboxes aparecem nos cards)
3. Clicar **"Ver comparativo"** na barra flutuante → `/compare`
4. Deltas coloridos por métrica, gráficos A|B sobrepostos, tabela diff por arquivo

---

## Variáveis de ambiente

| Variável | Descrição | Obrigatória |
|----------|-----------|-------------|
| `METRICS_DIR` | Caminho absoluto para pasta `metrics/`. Ausente = modo deploy. | Apenas local |

---

## Stack

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| Next.js | 15 (App Router) | Framework |
| TypeScript | 5 | Tipagem |
| @kaiserinc/react | 0.2.1 | Design System |
| Recharts | 2 | Gráficos |
| html-to-image | latest | Export PNG |
| Tailwind CSS | 4 | Utilitários |

---

## Estrutura

```
app/
  page.tsx              # Home (server component)
  report/[slug]/        # Dashboard de relatório
  compare/              # Comparativo side-by-side
components/
  charts/               # CCChart, MIChart, CoverageChart, PylintChart, ChartLegend
  dashboard/            # SummaryCards, HalsteadSection, XenonBadge, DeltaBadge, CompareContent
  FilePicker.tsx        # File System Access API + fallback
  CompareBar.tsx        # Barra flutuante de comparação
  TutorialModal.tsx     # Modal "Como usar"
lib/
  fileSystem.ts         # Parse JSONs, sessionStorage
  chartTheme.ts         # Cores, estilos, legendas compartilhadas
types/
  metrics.ts            # MetricsReport, EnrichedItem
  fsa.d.ts              # Tipos File System Access API
```
