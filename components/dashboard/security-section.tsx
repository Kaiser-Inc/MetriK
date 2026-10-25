import { CircleCheckIcon, CircleXIcon } from "lucide-react"

import { ReportSection } from "@/components/dashboard/report-section"
import { Badge } from "@/components/ui/badge"
import type { MetricsReport } from "@/types/metrics"

type SecuritySectionProps = {
  security: MetricsReport["security"]
  secLabel?: string
}

function SecuritySection({ security, secLabel = "Security" }: SecuritySectionProps) {
  const { passed, thresholds } = security
  return (
    <ReportSection
      title={secLabel}
      icon={passed ? <CircleCheckIcon strokeWidth={1.75} /> : <CircleXIcon strokeWidth={1.75} />}
      status={<Badge variant={passed ? "success" : "destructive"}>{passed ? "Passou" : "Falhou"}</Badge>}
    >
      {thresholds && (
        <ul className="flex flex-wrap gap-2">
          {[
            `max-abs: ${thresholds.max_absolute}`,
            `max-modules: ${thresholds.max_modules}`,
            `max-avg: ${thresholds.max_average}`,
          ].map((chip) => (
            <li key={chip}>
              <code className="rounded-sm bg-muted px-2 py-0.5 font-mono text-xs">{chip}</code>
            </li>
          ))}
        </ul>
      )}
    </ReportSection>
  )
}

export { SecuritySection }
