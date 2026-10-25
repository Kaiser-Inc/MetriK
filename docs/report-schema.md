# MetriK report schema

The JSON produced by the **KaiserInc-Utils** generators is the **source of truth**. MetriK accepts every field they emit, with no data loss and no silent failures. Validation and migration happen in [`lib/parseReport.ts`](../lib/parseReport.ts) (`migrate()`), and the availability of each metric is decided in [`lib/metricAvailability.ts`](../lib/metricAvailability.ts).

## Validation rule

- **Throws** only when a **required** key is missing. The message names the key and the file slug (for example `Missing required field "halstead" in slug "report_..."`).
- **Never throws** on extra or unknown keys. Unknown fields are ignored unless they are typed, and optional ones are kept.
- Empty summaries (`{}`) from tools that failed are normalized to a safe "unavailable" shape, so the UI shows **N/A** instead of breaking.

## Required fields

| Key | Type | Note |
|-----|------|------|
| `generated_at` | `string` | Timestamp (`YYYY-MM-DD_HHMMSS`) |
| `project` | `string` | Identifies the stack (substring match in `deriveStack`) |
| `cyclomatic_complexity` | `{ summary: {...} }` | radon cc, AST or flog |
| `maintainability_index` | `{ summary: {...} }` | radon mi (N/A on some stacks) |
| `halstead` | `{ summary: {...} }` | radon hal (N/A on some stacks) |
| `test_coverage` | `{ percent, by_file, ... }` | Coverage |
| `lint` | `{ summary: LintSummary }` | Main linter |
| `security` | `SecurityInfo` | Audit and thresholds |

## Legacy remaps (transparent)

| Legacy field | Canonical field |
|--------------|-----------------|
| `pylint` | `lint` |
| `xenon` | `security` |

Old reports stay valid. A warning is logged once per slug.

## Optional fields

All optional. Reports without them stay valid.

| Key | Stack | Shape | Where it shows up |
|-----|-------|-------|-------------------|
| `ruff` | Python | `{ raw?, summary: { total_issues, by_code, by_file } }` | **Ruff** section (issues by rule code) |
| `pip_audit` | Python | `{ passed, total_vulnerabilities, vulnerabilities[], error? }` | The security metric and the **Segurança · pip-audit** section |
| `flog_score` | Rails | `{ summary: { average, max, min, total_functions, grade, per_file } }` | **Flog** section |
| `test_coverage.reported_coverage` / `real_coverage` | Node, Next, Expo | `number` | Dual coverage note under the coverage chart |
| `test_coverage.tests_passed` / `tests_failed` / `tests_total` | All | `number` | **Testes** metric |
| `test_coverage.excluded_*` | All | — | Coverage metadata |

### Python note: `pip_audit` vs `xenon`

On Python, the security metric reflects `pip_audit`, which is a real CVE audit. `xenon` (complexity thresholds) is shown **separately** as "Xenon · Limiares de Complexidade", because it is not a security metric.

## Stacks (`deriveStack`)

The stack is detected by substring in `project`, and the order matters:
`expo` → `expo-mobile`, `next` → `next-saas`, `fastify` → `node-fastify`, `rails` or `ruby` → `ruby-on-rails`, `python` or `fastapi` → `python-fastapi`, `node` → `node-fastify`, anything else → `unknown` (neutral icon and label).
