import { BugIcon, FileCodeIcon, FlaskConicalIcon, InfoIcon, ZapIcon } from "lucide-react"

import { ReportSection } from "@/components/dashboard/report-section"
import { isHalsteadAvailable } from "@/lib/metricAvailability"
import type { MetricsReport } from "@/types/metrics"

function HalsteadItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string | number
}) {
  return (
    <div className="flex flex-col gap-2 border-l border-border pl-4">
      <span className="flex items-center gap-2 text-sm text-muted-foreground">
        <span aria-hidden="true" className="flex text-primary-text [&_svg]:size-4">
          {icon}
        </span>
        {label}
      </span>
      <span className="text-2xl font-semibold tabular-nums">{value}</span>
    </div>
  )
}

function HalsteadSection({ report }: { report: MetricsReport }) {
  const halstead = report.halstead.summary

  return (
    <ReportSection
      title="Métricas de Halstead"
      icon={<FlaskConicalIcon strokeWidth={1.75} />}
      description="Volume, esforço e complexidade do vocabulário."
    >
      {isHalsteadAvailable(report) ? (
        <div className="grid gap-6 sm:grid-cols-3">
          <HalsteadItem
            icon={<BugIcon strokeWidth={1.75} />}
            label="Bugs Estimados"
            value={halstead.estimated_bugs.toFixed(3)}
          />
          <HalsteadItem
            icon={<ZapIcon strokeWidth={1.75} />}
            label="Esforço Total"
            value={Math.round(halstead.total_effort).toLocaleString("pt-BR")}
          />
          <HalsteadItem
            icon={<FileCodeIcon strokeWidth={1.75} />}
            label="Arquivos Analisados"
            value={halstead.files_analyzed}
          />
        </div>
      ) : (
        <p className="flex items-start gap-3 rounded-md bg-muted px-4 py-3 text-sm text-muted-foreground">
          <InfoIcon aria-hidden="true" className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
          Métricas de Halstead não estão disponíveis para esta stack. Nenhuma ferramenta de análise de
          vocabulário AST foi configurada.
        </p>
      )}
    </ReportSection>
  )
}

export { HalsteadSection }
