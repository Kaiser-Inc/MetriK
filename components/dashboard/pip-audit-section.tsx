import { ShieldAlertIcon, ShieldCheckIcon } from "lucide-react"

import { ReportSection } from "@/components/dashboard/report-section"
import { Badge } from "@/components/ui/badge"
import type { PipAuditInfo } from "@/types/metrics"

// Python only: the pip-audit CVE scan, listed by vulnerable package.
function PipAuditSection({ pipAudit }: { pipAudit: PipAuditInfo }) {
  const { passed, total_vulnerabilities, vulnerabilities, error } = pipAudit
  const count = `${total_vulnerabilities} vulnerabilidade${total_vulnerabilities !== 1 ? "s" : ""}`

  return (
    <ReportSection
      title="Segurança · pip-audit"
      icon={passed ? <ShieldCheckIcon strokeWidth={1.75} /> : <ShieldAlertIcon strokeWidth={1.75} />}
      status={
        <Badge variant={passed ? "success" : "destructive"}>{passed ? "Sem vulnerabilidades" : count}</Badge>
      }
    >
      {error && (
        <p className="text-sm text-muted-foreground">
          pip-audit não pôde ser executado: <code className="font-mono text-foreground">{error}</code>
        </p>
      )}
      {vulnerabilities.length > 0 && (
        <ul className="flex flex-col gap-2">
          {vulnerabilities.map((vulnerability, index) => (
            <li key={`${vulnerability.id ?? "vuln"}-${index}`} className="text-sm text-muted-foreground">
              <code className="font-mono text-foreground">
                {vulnerability.package ?? "?"}@{vulnerability.version ?? "?"}
              </code>
              {vulnerability.id && <span className="text-destructive"> · {vulnerability.id}</span>}
              {vulnerability.fix_versions.length > 0 && (
                <span> · fix: {vulnerability.fix_versions.join(", ")}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </ReportSection>
  )
}

export { PipAuditSection }
