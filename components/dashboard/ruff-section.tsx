import { SparklesIcon } from "lucide-react"

import { ReportSection } from "@/components/dashboard/report-section"
import { Badge } from "@/components/ui/badge"
import type { RuffSummary } from "@/types/metrics"

// Python only: the Ruff lint summary, with issue counts by rule code.
function RuffSection({ ruff }: { ruff: RuffSummary }) {
  const { total_issues, by_code } = ruff
  const clean = total_issues === 0
  const topCodes = Object.entries(by_code)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)

  return (
    <ReportSection
      title="Ruff"
      icon={<SparklesIcon strokeWidth={1.75} />}
      status={
        <Badge variant={clean ? "success" : "warning"}>
          {clean ? "Sem issues" : `${total_issues} issue${total_issues !== 1 ? "s" : ""}`}
        </Badge>
      }
    >
      {topCodes.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {topCodes.map(([code, count]) => (
            <li key={code}>
              <code className="rounded-sm bg-muted px-2 py-0.5 font-mono text-xs">
                {code}: {count}
              </code>
            </li>
          ))}
        </ul>
      )}
    </ReportSection>
  )
}

export { RuffSection }
