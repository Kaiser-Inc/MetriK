import {
  isCCAvailable,
  isCoverageAvailable,
  isHalsteadAvailable,
  isMIAvailable,
} from "@/lib/metricAvailability"
import type { MetricsReport } from "@/types/metrics"

export type SummaryRow = {
  title: string
  a: number | null
  b: number | null
  higherIsBetter: boolean
  unit: "" | "%" | "/10"
  decimals: number
}

export type FileDiff = {
  path: string
  fname: string
  ccA: number | null
  ccB: number | null
  covA: number | null
  covB: number | null
}

// A metric the stack does not produce comes back as null, never as zero.
export function buildSummaryRows(a: MetricsReport, b: MetricsReport): SummaryRow[] {
  const pick = (available: (r: MetricsReport) => boolean, read: (r: MetricsReport) => number | null) => ({
    a: available(a) ? read(a) : null,
    b: available(b) ? read(b) : null,
  })

  const cc = pick(isCCAvailable, (r) => r.cyclomatic_complexity.summary.average)
  const mi = pick(isMIAvailable, (r) => r.maintainability_index.summary.average)
  const coverage = pick(isCoverageAvailable, (r) => r.test_coverage.percent)
  const halstead = pick(isHalsteadAvailable, (r) => r.halstead?.summary?.estimated_bugs ?? null)

  return [
    { title: "CC Médio", ...cc, higherIsBetter: false, unit: "", decimals: 1 },
    { title: "MI Médio", ...mi, higherIsBetter: true, unit: "", decimals: 1 },
    { title: "Cobertura", ...coverage, higherIsBetter: true, unit: "%", decimals: 1 },
    {
      title: "Linter Score",
      a: a.lint.summary.score,
      b: b.lint.summary.score,
      higherIsBetter: true,
      unit: "/10",
      decimals: 2,
    },
    { title: "Bugs Estimados", ...halstead, higherIsBetter: false, unit: "", decimals: 2 },
  ]
}

export function buildFileDiffs(a: MetricsReport, b: MetricsReport): FileDiff[] {
  const ccA = isCCAvailable(a) ? (a.cyclomatic_complexity.summary.per_file ?? {}) : {}
  const ccB = isCCAvailable(b) ? (b.cyclomatic_complexity.summary.per_file ?? {}) : {}
  const covA = isCoverageAvailable(a) ? (a.test_coverage.by_file ?? {}) : {}
  const covB = isCoverageAvailable(b) ? (b.test_coverage.by_file ?? {}) : {}

  const paths = Array.from(
    new Set([...Object.keys(ccA), ...Object.keys(ccB), ...Object.keys(covA), ...Object.keys(covB)])
  )

  const complexityChange = (diff: FileDiff) =>
    diff.ccA != null && diff.ccB != null ? Math.abs(diff.ccB - diff.ccA) : 0

  return paths
    .map((path) => ({
      path,
      fname: path.split("/").pop() ?? path,
      ccA: ccA[path] ?? null,
      ccB: ccB[path] ?? null,
      covA: covA[path] ?? null,
      covB: covB[path] ?? null,
    }))
    .sort((x, y) => complexityChange(y) - complexityChange(x))
}
