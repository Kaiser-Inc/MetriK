"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"

import { AppHeader } from "@/components/dashboard/app-header"
import { CompareCharts } from "@/components/dashboard/compare-charts"
import { SecuritySide, SideBySide, TestsSide } from "@/components/dashboard/compare-details"
import { CompareSection } from "@/components/dashboard/compare-section"
import { CompareSummary } from "@/components/dashboard/compare-summary"
import { FileDiffTable } from "@/components/dashboard/file-diff-table"
import { StackIcon } from "@/components/icons/stack-icon"
import { SiteFooter } from "@/components/site-footer"
import { buttonVariants } from "@/components/ui/button"
import { PageHeader } from "@/components/ui/page-header"
import { buildFileDiffs, buildSummaryRows } from "@/lib/compare"
import { loadReportsFromSession } from "@/lib/fileSystem"
import { formatDate } from "@/lib/formatDate"
import { isTestsAvailable } from "@/lib/metricAvailability"
import { cn } from "@/lib/utils"
import { deriveStack, STACK_META, type MetricsReport } from "@/types/metrics"

type CompareScreenProps = {
  reportA: MetricsReport | null
  reportB: MetricsReport | null
  slugA: string
  slugB: string
  dateA?: string
  dateB?: string
}

function Breadcrumb() {
  return (
    <nav aria-label="Breadcrumb" className="hidden sm:block">
      <ol className="flex items-center gap-2 text-sm text-muted-foreground">
        <li>
          <Link
            href="/dashboard"
            className="rounded-sm outline-hidden hover:text-foreground focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Dashboard
          </Link>
        </li>
        <li className="flex items-center gap-2">
          <span aria-hidden="true">/</span>
          <span className="font-medium text-foreground">Comparativo</span>
        </li>
      </ol>
    </nav>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader>
        <Breadcrumb />
      </AppHeader>
      {children}
      <SiteFooter />
    </div>
  )
}

function ReportLabel({ report, date, align }: { report: MetricsReport; date: string; align: "start" | "end" }) {
  const stack = deriveStack(report.project)
  return (
    <div className={cn("flex min-w-0 flex-col gap-1", align === "end" && "sm:items-end sm:text-right")}>
      <span className="flex items-center gap-2 text-xs font-medium tracking-[0.08em] text-muted-foreground uppercase">
        <span aria-hidden="true" className="flex">
          <StackIcon stack={stack} size={14} />
        </span>
        {STACK_META[stack].label}
      </span>
      <span className="truncate text-base font-semibold">{report.project}</span>
      <span className="text-sm text-muted-foreground">{date || formatDate(report.generated_at, "long")}</span>
    </div>
  )
}

function CompareScreen({
  reportA: propA,
  reportB: propB,
  slugA,
  slugB,
  dateA,
  dateB,
}: CompareScreenProps) {
  const [reportA, setReportA] = useState<MetricsReport | null>(propA)
  const [reportB, setReportB] = useState<MetricsReport | null>(propB)
  const [dA, setDA] = useState(dateA ?? "")
  const [dB, setDB] = useState(dateB ?? "")
  const [sessionChecked, setSessionChecked] = useState(false)

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    if (propA && propB) {
      setSessionChecked(true)
      return
    }
    // Deploy mode: the files were chosen in this browser and kept in the session.
    const cached = loadReportsFromSession()
    const itemA = cached?.find((item) => item.slug === slugA)
    const itemB = cached?.find((item) => item.slug === slugB)
    if (itemA?.rawJson) {
      setReportA(itemA.rawJson)
      setDA(formatDate(itemA.generated_at, "long"))
    }
    if (itemB?.rawJson) {
      setReportB(itemB.rawJson)
      setDB(formatDate(itemB.generated_at, "long"))
    }
    setSessionChecked(true)
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [propA, propB, slugA, slugB])

  if (!sessionChecked) {
    return (
      <Shell>
        <main className="flex flex-1 items-center justify-center">
          <p className="text-sm text-muted-foreground">Carregando relatórios…</p>
        </main>
      </Shell>
    )
  }

  if (!reportA || !reportB) {
    return (
      <Shell>
        <main className="flex flex-1 flex-col items-center justify-center gap-3 px-4 text-center">
          <p className="text-base font-medium">Relatórios não encontrados</p>
          <p className="max-w-[60ch] text-sm text-muted-foreground">
            {!slugA || !slugB
              ? "Parâmetros ausentes na URL. Marque 2 relatórios no dashboard e clique em Ver comparativo."
              : "Os relatórios não estão disponíveis na sessão atual. Volte ao dashboard e selecione-os de novo."}
          </p>
          <Link href="/dashboard" className={cn(buttonVariants({ variant: "outline" }), "mt-2")}>
            <ArrowLeftIcon aria-hidden="true" data-icon="inline-start" strokeWidth={1.75} />
            Voltar ao dashboard
          </Link>
        </main>
      </Shell>
    )
  }

  const summary = buildSummaryRows(reportA, reportB)
  const diffs = buildFileDiffs(reportA, reportB)
  const sides: [{ report: MetricsReport }, { report: MetricsReport }] = [
    { report: reportA },
    { report: reportB },
  ]

  return (
    <Shell>
      <main className="mx-auto flex w-full max-w-page flex-1 flex-col gap-10 px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-4">
          <Link
            href="/dashboard"
            className="flex w-fit items-center gap-1.5 rounded-sm text-sm text-muted-foreground outline-hidden hover:text-foreground focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <ArrowLeftIcon aria-hidden="true" className="size-3.5" strokeWidth={1.75} />
            Voltar
          </Link>
          <PageHeader headingLevel={1} title="Comparativo" />
          <section
            aria-label="Relatórios comparados"
            className="grid grid-cols-1 items-center gap-4 sm:grid-cols-[1fr_auto_1fr]"
          >
            <ReportLabel report={reportA} date={dA} align="start" />
            <span aria-hidden="true" className="text-xs font-medium tracking-[0.12em] text-primary-text">
              VS
            </span>
            <ReportLabel report={reportB} date={dB} align="end" />
          </section>
        </div>

        <CompareSection title="Resumo">
          <CompareSummary rows={summary} />
        </CompareSection>

        <CompareSection title="Segurança">
          <SideBySide sides={sides} render={(report) => <SecuritySide report={report} />} />
        </CompareSection>

        {(isTestsAvailable(reportA) || isTestsAvailable(reportB)) && (
          <CompareSection title="Testes">
            <SideBySide sides={sides} render={(report) => <TestsSide report={report} />} />
          </CompareSection>
        )}

        <CompareSection title="Gráficos">
          <CompareCharts reports={[reportA, reportB]} />
        </CompareSection>

        {diffs.length > 0 && (
          <CompareSection title="Diff por arquivo">
            <FileDiffTable diffs={diffs} />
          </CompareSection>
        )}
      </main>
    </Shell>
  )
}

export { CompareScreen }
