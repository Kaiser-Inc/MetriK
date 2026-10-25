"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { AlertTriangleIcon, ArrowLeftIcon, ShieldCheckIcon, WrenchIcon } from "lucide-react"
import { GitBranchIcon } from "lucide-react"

import { AppHeader } from "@/components/dashboard/app-header"
import { FlogSection } from "@/components/dashboard/flog-section"
import { HalsteadSection } from "@/components/dashboard/halstead-section"
import { MetricStrip } from "@/components/dashboard/metric-strip"
import { PipAuditSection } from "@/components/dashboard/pip-audit-section"
import { RuffSection } from "@/components/dashboard/ruff-section"
import { SecuritySection } from "@/components/dashboard/security-section"
import { CCChart } from "@/components/charts/cc-chart"
import { ChartSection } from "@/components/charts/chart-section"
import { CoverageChart } from "@/components/charts/coverage-chart"
import { LintChart } from "@/components/charts/lint-chart"
import { MIChart } from "@/components/charts/mi-chart"
import { StackIcon } from "@/components/icons/StackIcon"
import { SiteFooter } from "@/components/site-footer"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { PageHeader } from "@/components/ui/page-header"
import { CC_LEGEND, COVERAGE_LEGEND, MI_LEGEND, PYLINT_LEGEND } from "@/lib/chartTheme"
import { loadReportsFromSession } from "@/lib/fileSystem"
import { formatDate } from "@/lib/formatDate"
import { isFlogAvailable, isPipAuditAvailable, isRuffAvailable } from "@/lib/metricAvailability"
import { cn } from "@/lib/utils"
import { deriveStack, STACK_META, type MetricsReport } from "@/types/metrics"

type ReportScreenProps = {
  report: MetricsReport | null
  slug: string
  formattedDate: string
  loadError?: string
}

function Breadcrumb({ projectName }: { projectName?: string }) {
  return (
    <nav aria-label="Breadcrumb" className="hidden min-w-0 sm:block">
      <ol className="flex items-center gap-2 text-sm text-muted-foreground">
        <li>
          <Link
            href="/dashboard"
            className="rounded-sm outline-hidden hover:text-foreground focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Dashboard
          </Link>
        </li>
        {projectName && (
          <li className="flex min-w-0 items-center gap-2">
            <span aria-hidden="true">/</span>
            <span className="truncate font-medium text-foreground">{projectName}</span>
          </li>
        )}
      </ol>
    </nav>
  )
}

function Message({
  title,
  description,
  projectName,
}: {
  title: string
  description?: string
  projectName?: string
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader>
        <Breadcrumb projectName={projectName} />
      </AppHeader>
      <main className="flex flex-1 flex-col items-center justify-center gap-3 px-4 text-center">
        <p className="text-base font-medium">{title}</p>
        {description && <p className="max-w-[60ch] text-sm text-muted-foreground">{description}</p>}
        <Link href="/dashboard" className={cn(buttonVariants({ variant: "outline" }), "mt-2")}>
          <ArrowLeftIcon aria-hidden="true" data-icon="inline-start" strokeWidth={1.75} />
          Voltar ao dashboard
        </Link>
      </main>
      <SiteFooter />
    </div>
  )
}

function ReportScreen({
  report: serverReport,
  slug,
  formattedDate: serverDate,
  loadError,
}: ReportScreenProps) {
  const [report, setReport] = useState<MetricsReport | null>(serverReport)
  const [formattedDate, setFormattedDate] = useState(serverDate)
  // loadError comes from the server and does not change after mount.
  const [notFound, setNotFound] = useState(() => !serverReport && !!loadError)

  useEffect(() => {
    if (serverReport || loadError) return
    // Deploy mode: the files were chosen in this browser and kept in the session.
    const match = loadReportsFromSession()?.find((item) => item.slug === slug)
    if (match?.rawJson) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setReport(match.rawJson)
      setFormattedDate(formatDate(match.rawJson.generated_at, "long"))
    } else {
      setNotFound(true)
    }
  }, [serverReport, slug, loadError])

  if (notFound) {
    return loadError ? (
      <Message title="Relatório inválido" description={loadError} />
    ) : (
      <Message
        title="Relatório não encontrado"
        description="Selecione a pasta com os relatórios no dashboard para carregar este relatório."
      />
    )
  }

  if (!report) {
    return (
      <div className="flex min-h-screen flex-col">
        <AppHeader />
        <main className="flex flex-1 items-center justify-center">
          <p className="text-sm text-muted-foreground">Carregando…</p>
        </main>
        <SiteFooter />
      </div>
    )
  }

  const stack = deriveStack(report.project)
  const stackMeta = STACK_META[stack]
  const { real_coverage, reported_coverage } = report.test_coverage
  const lint = report.lint.summary

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader>
        <Breadcrumb projectName={report.project} />
      </AppHeader>

      <main className="mx-auto flex w-full max-w-page flex-1 flex-col gap-10 px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-4">
          <Link
            href="/dashboard"
            className="flex w-fit items-center gap-1.5 rounded-sm text-sm text-muted-foreground outline-hidden hover:text-foreground focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <ArrowLeftIcon aria-hidden="true" className="size-3.5" strokeWidth={1.75} />
            Voltar
          </Link>
          <PageHeader
            headingLevel={1}
            title={
              <span className="flex flex-wrap items-center gap-3">
                {report.project}
                <Badge variant="neutral">
                  <span aria-hidden="true" className="flex">
                    <StackIcon stack={stack} size={12} />
                  </span>
                  {stackMeta.label}
                </Badge>
              </span>
            }
            description={`Gerado em ${formattedDate}`}
          />
        </div>

        <MetricStrip report={report} />

        <div className="grid grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-2">
          <ChartSection
            title="Complexidade ciclomática"
            icon={<GitBranchIcon strokeWidth={1.75} />}
            legend={CC_LEGEND}
            scrollable
          >
            <CCChart perFile={report.cyclomatic_complexity.summary.per_file} />
          </ChartSection>

          <ChartSection
            title="Índice de manutenibilidade"
            icon={<WrenchIcon strokeWidth={1.75} />}
            legend={MI_LEGEND}
            scrollable
          >
            <MIChart perFile={report.maintainability_index.summary.per_file} />
          </ChartSection>

          <ChartSection
            title="Cobertura de testes"
            icon={<ShieldCheckIcon strokeWidth={1.75} />}
            legend={COVERAGE_LEGEND}
            scrollable
          >
            <CoverageChart byFile={report.test_coverage.by_file} />
            {real_coverage !== undefined && reported_coverage !== undefined && (
              <p className="mt-2 text-sm text-muted-foreground">
                Cobertura real:{" "}
                <strong className="font-medium text-foreground">{real_coverage.toFixed(1)}%</strong>{" "}
                <span className="text-subtle-foreground">(reportada: {reported_coverage.toFixed(1)}%)</span>
              </p>
            )}
          </ChartSection>

          <ChartSection
            label={`Issues ${stackMeta.lintLabel}`}
            title={
              <>
                {`Issues ${stackMeta.lintLabel}`}{" "}
                <span className="font-normal text-muted-foreground">
                  {lint.score !== null ? `(${lint.total_issues})` : "(N/A)"}
                </span>
              </>
            }
            icon={<AlertTriangleIcon strokeWidth={1.75} />}
            legend={PYLINT_LEGEND}
          >
            <LintChart byType={lint.by_type} score={lint.score} lintLabel={stackMeta.lintLabel} />
          </ChartSection>
        </div>

        <HalsteadSection report={report} />

        {/* Python: pip-audit drives the security section and Xenon becomes the
            complexity thresholds. Other stacks keep the audit framing. */}
        {isPipAuditAvailable(report) && <PipAuditSection pipAudit={report.pip_audit!} />}

        <SecuritySection
          security={report.security}
          secLabel={
            stack === "python-fastapi"
              ? isPipAuditAvailable(report)
                ? "Xenon · Limiares de Complexidade"
                : "Xenon · Segurança / Complexidade"
              : stackMeta.secLabel
          }
        />

        {isRuffAvailable(report) && <RuffSection ruff={report.ruff!.summary} />}
        {isFlogAvailable(report) && <FlogSection flog={report.flog_score!} />}
      </main>

      <SiteFooter />
    </div>
  )
}

export { ReportScreen }
