import { FlaskConicalIcon, ShieldAlertIcon, ShieldCheckIcon } from "lucide-react"

import { isPipAuditAvailable, isTestsAvailable } from "@/lib/metricAvailability"
import { cn } from "@/lib/utils"
import type { MetricsReport } from "@/types/metrics"

function Status({
  ok,
  warn = false,
  children,
  hint,
}: {
  ok: boolean
  warn?: boolean
  children: React.ReactNode
  hint: string
}) {
  const Icon = ok ? ShieldCheckIcon : ShieldAlertIcon
  return (
    <div className="flex items-center gap-2 text-sm">
      <Icon
        aria-hidden="true"
        className={cn("size-4 shrink-0", warn ? "text-warning" : ok ? "text-success" : "text-destructive")}
        strokeWidth={1.75}
      />
      <span className={cn("font-medium", warn ? "text-warning" : ok ? "text-success" : "text-destructive")}>
        {children}
      </span>
      <span className="text-xs text-subtle-foreground">{hint}</span>
    </div>
  )
}

// The count of vulnerabilities is only available as text in the audit output.
function vulnerabilitiesIn(output?: string) {
  const match = output?.match(/(\d+)\s+vulnerabilit/i)
  return match ? parseInt(match[1], 10) : 0
}

function SecuritySide({ report }: { report: MetricsReport }) {
  const pip = report.pip_audit
  const passed = report.security?.passed ?? true
  const found = vulnerabilitiesIn(report.security?.output)

  return (
    <div className="flex flex-col gap-2">
      <Status ok={passed} hint="auditoria">
        {passed ? "Passou" : `Falhou${found > 0 ? ` (${found})` : ""}`}
      </Status>

      {isPipAuditAvailable(report) && (
        <Status ok={!!pip?.passed} warn={!!pip?.error} hint="pip-audit">
          {pip?.error ? "pip-audit indisponível" : pip?.passed ? "0 CVEs" : `${pip?.total_vulnerabilities ?? "?"} CVEs`}
        </Status>
      )}

      {isPipAuditAvailable(report) && !pip?.passed && !pip?.error && (pip?.vulnerabilities?.length ?? 0) > 0 && (
        <ul className="flex flex-wrap gap-2">
          {pip!.vulnerabilities.slice(0, 3).map((vulnerability) => (
            <li key={vulnerability.id ?? vulnerability.package}>
              <code className="rounded-sm bg-muted px-2 py-0.5 font-mono text-xs text-destructive">
                {vulnerability.id ?? vulnerability.package}
              </code>
            </li>
          ))}
          {pip!.vulnerabilities.length > 3 && (
            <li className="text-xs text-muted-foreground">+{pip!.vulnerabilities.length - 3}</li>
          )}
        </ul>
      )}
    </div>
  )
}

function TestsSide({ report }: { report: MetricsReport }) {
  if (!isTestsAvailable(report)) {
    return <span className="text-sm text-muted-foreground">Sem dados de testes</span>
  }
  const total = report.test_coverage?.tests_total ?? 0
  const passed = report.test_coverage?.tests_passed ?? 0
  const failed = total - passed
  const percent = total > 0 ? Math.round((passed / total) * 100) : 0

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <FlaskConicalIcon aria-hidden="true" className="size-4 shrink-0 text-primary-text" strokeWidth={1.75} />
        <span className="text-base font-semibold tabular-nums">
          {passed}/{total}
        </span>
        <span className="text-xs text-subtle-foreground">{percent}% ok</span>
      </div>
      {failed > 0 && <span className="pl-6 text-sm text-destructive">{failed} falhou</span>}
    </div>
  )
}

type Side = { report: MetricsReport }

// One column per report, with the project name above its content.
function SideBySide({
  sides,
  render,
}: {
  sides: [Side, Side]
  render: (report: MetricsReport) => React.ReactNode
}) {
  return (
    <div className="grid grid-cols-1 gap-x-10 gap-y-6 md:grid-cols-2">
      {sides.map(({ report }, index) => (
        <div key={`${report.project}-${index}`} className="flex flex-col gap-3 border-t border-border pt-4">
          <span className="text-xs font-medium tracking-[0.08em] text-primary-text uppercase">
            {report.project}
          </span>
          {render(report)}
        </div>
      ))}
    </div>
  )
}

export { SecuritySide, SideBySide, TestsSide }
