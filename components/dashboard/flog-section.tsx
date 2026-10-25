import { ReportSection } from "@/components/dashboard/report-section"
import { Badge } from "@/components/ui/badge"
import type { MetricsReport } from "@/types/metrics"

function gradeVariant(grade: string) {
  if (grade === "A" || grade === "B") return "success" as const
  if (grade === "C" || grade === "D") return "warning" as const
  return "destructive" as const
}

// Rails only: the flog method complexity score.
function FlogSection({ flog }: { flog: NonNullable<MetricsReport["flog_score"]> }) {
  const { average, grade } = flog.summary
  return (
    <ReportSection title="Flog" status={<Badge variant={gradeVariant(grade)}>{grade}</Badge>}>
      <p className="text-sm text-muted-foreground">
        Score médio: <strong className="font-medium text-foreground tabular-nums">{average.toFixed(2)}</strong>
      </p>
      <p className="text-sm text-subtle-foreground">
        Complexidade de método no Rails. Menor é melhor (A ≤ média do projeto).
      </p>
    </ReportSection>
  )
}

export { FlogSection }
