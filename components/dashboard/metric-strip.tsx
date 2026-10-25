"use client"

import { useState } from "react"
import { InfoIcon } from "lucide-react"

import { MetricInfoSheet } from "@/components/dashboard/metric-info-sheet"
import { Button } from "@/components/ui/button"
import { getMetricInfo, type MetricKey } from "@/content/metric-info"
import {
  isCCAvailable,
  isCoverageAvailable,
  isHalsteadAvailable,
  isMIAvailable,
  isPipAuditAvailable,
  isTestsAvailable,
} from "@/lib/metricAvailability"
import { cn } from "@/lib/utils"
import { deriveStack, STACK_META, type MetricsReport } from "@/types/metrics"

type Direction = "up" | "down" | "neutral"

const trendClass: Record<Direction, string> = {
  up: "text-success",
  down: "text-destructive",
  neutral: "text-warning",
}

const trendArrow: Record<Direction, string> = { up: "↑", down: "↓", neutral: "→" }

const UNAVAILABLE = "Não disponível para esta stack"

type Metric = {
  key: MetricKey
  label: string
  value: string
  trend?: { value: string; direction: Direction }
  description?: string
}

function MetricItem({ metric, onInfo }: { metric: Metric; onInfo: (key: MetricKey) => void }) {
  return (
    <li className="flex min-w-0 flex-col gap-2 border-l border-border pl-4">
      <div className="flex items-center justify-between gap-1">
        <span className="text-sm text-muted-foreground">{metric.label}</span>
        <Button
          variant="ghost"
          size="icon"
          className="-my-1.5 -mr-2 text-subtle-foreground"
          aria-label={`Saiba mais sobre ${metric.label}`}
          onClick={() => onInfo(metric.key)}
        >
          <InfoIcon strokeWidth={1.75} />
        </Button>
      </div>
      <span className="truncate text-3xl leading-none font-semibold tracking-[-0.02em] tabular-nums">
        {metric.value}
      </span>
      {metric.trend && (
        <span className={cn("text-sm leading-snug", trendClass[metric.trend.direction])}>
          {trendArrow[metric.trend.direction]} {metric.trend.value}
        </span>
      )}
      {metric.description && <p className="text-xs text-subtle-foreground">{metric.description}</p>}
    </li>
  )
}

function buildMetrics(report: MetricsReport) {
  const cc = report.cyclomatic_complexity.summary
  const mi = report.maintainability_index.summary
  const coverage = report.test_coverage
  const lint = report.lint.summary
  const halstead = report.halstead.summary
  const security = report.security
  const stackMeta = STACK_META[deriveStack(report.project)]

  const ccAvailable = isCCAvailable(report)
  const miAvailable = isMIAvailable(report)
  const coverageAvailable = isCoverageAvailable(report)
  const halsteadAvailable = isHalsteadAvailable(report)
  const lintAvailable = lint.score !== null
  const unavailable = { value: UNAVAILABLE, direction: "neutral" as const }

  const ccDirection: Direction = !ccAvailable
    ? "neutral"
    : cc.grade.toLowerCase().includes("simples") || cc.grade.startsWith("A")
      ? "up"
      : cc.grade.startsWith("B")
        ? "neutral"
        : "down"
  const miGrade = mi.grade.toLowerCase()
  const miDirection: Direction = !miAvailable
    ? "neutral"
    : miGrade.includes("alta") || miGrade === "a" || miGrade === "b"
      ? "up"
      : miGrade.includes("moderada") || miGrade === "c"
        ? "neutral"
        : "down"
  const coverageDirection: Direction = !coverageAvailable
    ? "neutral"
    : coverage.percent >= 80
      ? "up"
      : coverage.percent >= 50
        ? "neutral"
        : "down"
  const lintDirection: Direction = !lintAvailable
    ? "neutral"
    : lint.score! >= 8
      ? "up"
      : lint.score! >= 6
        ? "neutral"
        : "down"

  // Python: pip-audit drives the security metric; Xenon thresholds have their own section.
  const usePipAudit = isPipAuditAvailable(report)
  const pipAudit = report.pip_audit
  const secLabel = usePipAudit ? "pip-audit" : stackMeta.secLabel
  const secPassed = usePipAudit ? pipAudit!.passed : security.passed
  const secTrend = usePipAudit
    ? pipAudit!.error
      ? "pip-audit indisponível"
      : `${pipAudit!.total_vulnerabilities} vulnerabilidade${pipAudit!.total_vulnerabilities !== 1 ? "s" : ""}`
    : `max ${security.thresholds?.max_absolute ?? "?"} / avg ${security.thresholds?.max_average ?? "?"}`

  const metrics: Metric[] = [
    {
      key: "cc",
      label: "CC Média",
      value: ccAvailable ? cc.average.toFixed(1) : "N/A",
      trend: ccAvailable ? { value: cc.grade, direction: ccDirection } : unavailable,
      description: ccAvailable ? `${cc.total_functions} funções analisadas` : undefined,
    },
    {
      key: "mi",
      label: "Manutenibilidade",
      value: miAvailable ? mi.average.toFixed(1) : "N/A",
      trend: miAvailable ? { value: mi.grade, direction: miDirection } : unavailable,
    },
    {
      key: "lint",
      label: `${stackMeta.lintLabel} Score`,
      value: lintAvailable ? `${lint.score}/10` : "N/A",
      trend: lintAvailable ? { value: `${lint.total_issues} issues`, direction: lintDirection } : unavailable,
    },
    {
      key: "coverage",
      label: "Cobertura",
      value: coverageAvailable ? `${coverage.percent.toFixed(1)}%` : "N/A",
      trend: coverageAvailable
        ? { value: `${coverage.covered_lines} / ${coverage.num_statements} linhas`, direction: coverageDirection }
        : unavailable,
    },
  ]

  if (isTestsAvailable(report)) {
    metrics.push({
      key: "tests",
      label: "Testes",
      value: `${coverage.tests_passed ?? 0}/${coverage.tests_total}`,
      trend: {
        value: coverage.tests_failed === 0 ? "Todos passaram" : `${coverage.tests_failed} falharam`,
        direction: coverage.tests_failed === 0 ? "up" : "down",
      },
    })
  }

  metrics.push(
    {
      key: "halstead",
      label: "Bugs Estimados",
      value: halsteadAvailable ? halstead.estimated_bugs.toFixed(2) : "N/A",
      trend: halsteadAvailable ? undefined : unavailable,
      description: halsteadAvailable ? "Halstead, a partir de operadores e operandos" : undefined,
    },
    {
      key: "security",
      label: secLabel,
      value: secPassed ? "Passou" : "Falhou",
      trend: { value: secTrend, direction: secPassed ? "up" : "down" },
    }
  )

  return {
    metrics,
    context: { lintLabel: stackMeta.lintLabel, secLabel, isPipAudit: usePipAudit },
  }
}

// The report's headline numbers, side by side on the page and separated by thin lines.
function MetricStrip({ report }: { report: MetricsReport }) {
  const [panel, setPanel] = useState<{ key: MetricKey | null; open: boolean }>({ key: null, open: false })
  const { metrics, context } = buildMetrics(report)
  const info = panel.key ? getMetricInfo(panel.key, context) : null

  return (
    <section aria-label="Resumo das métricas" className="border-y border-border py-6">
      <ul className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <MetricItem key={metric.key} metric={metric} onInfo={(key) => setPanel({ key, open: true })} />
        ))}
      </ul>
      <MetricInfoSheet info={info} open={panel.open} onClose={() => setPanel((p) => ({ ...p, open: false }))} />
    </section>
  )
}

export { MetricStrip }
