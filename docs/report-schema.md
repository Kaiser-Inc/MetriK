# Schema de relatório MetriK

O JSON gerado pelos produtores **KaiserInc-Utils** é a **fonte de verdade**. O
MetriK aceita todo campo emitido — sem perda de dados e sem falhas silenciosas.
A migração/validação acontece em [`lib/parseReport.ts`](../lib/parseReport.ts)
(`migrate()`), e a disponibilidade de cada métrica em
[`lib/metricAvailability.ts`](../lib/metricAvailability.ts).

## Regra de validação

- **Falha (throw)** apenas quando uma chave **obrigatória** está ausente. A
  mensagem nomeia a chave e o slug do arquivo (ex.: `Missing required field
  "halstead" in slug "report_..."`).
- **Nunca falha** em chaves extras/desconhecidas — campos novos são ignorados se
  não tipados e preservados quando opcionais.
- Sumários vazios (`{}`) de ferramentas que falharam são normalizados para um
  shape seguro "indisponível" (a UI mostra **N/A** em vez de quebrar).

## Campos obrigatórios

| Chave | Tipo | Observação |
|-------|------|-----------|
| `generated_at` | `string` | Timestamp (`YYYY-MM-DD_HHMMSS`) |
| `project` | `string` | Identifica a stack (substring match em `deriveStack`) |
| `cyclomatic_complexity` | `{ summary: {...} }` | radon cc / AST / flog |
| `maintainability_index` | `{ summary: {...} }` | radon mi (N/A em algumas stacks) |
| `halstead` | `{ summary: {...} }` | radon hal (N/A em algumas stacks) |
| `test_coverage` | `{ percent, by_file, ... }` | cobertura |
| `lint` | `{ summary: LintSummary }` | linter principal |
| `security` | `SecurityInfo` | auditoria / limiares |

## Remaps de legado (transparentes)

| Campo legado | Campo canônico |
|--------------|----------------|
| `pylint` | `lint` |
| `xenon` | `security` |

Relatórios antigos continuam válidos; um aviso (uma vez por slug) é logado.

## Campos opcionais (novos)

Todos opcionais — relatórios sem eles permanecem válidos.

| Chave | Stack | Shape | Uso na UI |
|-------|-------|-------|-----------|
| `ruff` | Python | `{ raw?, summary: { total_issues, by_code, by_file } }` | Seção **Ruff** (issues por código) |
| `pip_audit` | Python | `{ passed, total_vulnerabilities, vulnerabilities[], error? }` | Card **Segurança** + seção pip-audit |
| `flog_score` | Rails | `{ summary: { average, max, min, total_functions, grade, per_file } }` | Badge **Flog** |
| `test_coverage.reported_coverage` / `real_coverage` | Node/Next/Expo | `number` | Nota de cobertura dupla |
| `test_coverage.tests_passed` / `tests_failed` / `tests_total` | Todos | `number` | Card **Testes** |
| `test_coverage.excluded_*` | Todos | — | Metadados de cobertura |

### Nota sobre Python: `pip_audit` vs `xenon`

No Python o card **Segurança** reflete o `pip_audit` (auditoria real de CVEs). O
`xenon` (limiares de complexidade) é exibido **separadamente** como
"Xenon · Limiares de Complexidade" — ele não é uma métrica de segurança.

## Stacks (`deriveStack`)

Detecção por substring no `project` (ordem importa):
`expo` → `expo-mobile`, `next` → `next-saas`, `fastify` → `node-fastify`,
`rails`/`ruby` → `ruby-on-rails`, `python`/`fastapi` → `python-fastapi`,
`node` → `node-fastify`, senão → `unknown` (ícone e label neutros).
