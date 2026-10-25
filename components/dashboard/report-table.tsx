import Link from "next/link"

import { StackIcon } from "@/components/icons/stack-icon"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDate } from "@/lib/formatDate"
import { cn } from "@/lib/utils"
import { deriveStack, STACK_META, type EnrichedItem } from "@/types/metrics"

type ReportTableProps = {
  items: EnrichedItem[]
  /** Slugs picked for comparison. */
  selected: string[]
  onSelect: (slug: string, checked: boolean) => void
}

const linkClass =
  "rounded-sm font-medium outline-hidden hover:text-primary-text focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring"

function coverageClass(percent?: number) {
  if (percent == null) return "text-muted-foreground"
  if (percent >= 80) return "text-success"
  if (percent >= 50) return "text-warning"
  return "text-destructive"
}

function Coverage({ percent }: { percent?: number }) {
  return (
    <span className={cn("tabular-nums", coverageClass(percent))}>
      {percent != null ? `${percent.toFixed(1)}%` : "—"}
    </span>
  )
}

function Security({ passed, label }: { passed?: boolean; label: string }) {
  if (passed == null) return <span className="text-muted-foreground">—</span>
  return (
    <span className="inline-flex items-center gap-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      <Badge variant={passed ? "success" : "destructive"}>{passed ? "Passou" : "Falhou"}</Badge>
    </span>
  )
}

function ReportTable({ items, selected, onSelect }: ReportTableProps) {
  return (
    <>
      <div className="hidden sm:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10" aria-label="Selecionar para comparar" />
              <TableHead>Projeto</TableHead>
              <TableHead>Stack</TableHead>
              <TableHead>Gerado em</TableHead>
              <TableHead>CC</TableHead>
              <TableHead>Cobertura</TableHead>
              <TableHead>Segurança</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((report) => {
              const stack = report.stack ?? deriveStack(report.project)
              const meta = STACK_META[stack]
              return (
                <TableRow key={report.slug} data-state={selected.includes(report.slug) ? "selected" : undefined}>
                  <TableCell>
                    <Checkbox
                      aria-label={`Selecionar ${report.project} para comparar`}
                      checked={selected.includes(report.slug)}
                      onCheckedChange={(checked) => onSelect(report.slug, checked)}
                    />
                  </TableCell>
                  <TableCell>
                    <Link href={`/report/${report.slug}`} className={linkClass}>
                      {report.project}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-2">
                      <span aria-hidden="true" className="flex">
                        <StackIcon stack={stack} size={14} />
                      </span>
                      {meta.label}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground tabular-nums">
                    {formatDate(report.generated_at)}
                  </TableCell>
                  <TableCell>{report.cc_grade ?? "—"}</TableCell>
                  <TableCell>
                    <Coverage percent={report.coverage_percent} />
                  </TableCell>
                  <TableCell>
                    <Security passed={report.security_passed} label={meta.secLabel} />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <ul className="flex flex-col sm:hidden" aria-label="Relatórios">
        {items.map((report) => {
          const stack = report.stack ?? deriveStack(report.project)
          const meta = STACK_META[stack]
          return (
            <li key={report.slug} className="flex items-start gap-3 border-b border-border py-3">
              <Checkbox
                className="mt-1"
                aria-label={`Selecionar ${report.project} para comparar`}
                checked={selected.includes(report.slug)}
                onCheckedChange={(checked) => onSelect(report.slug, checked)}
              />
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <Link href={`/report/${report.slug}`} className={cn(linkClass, "truncate")}>
                  {report.project}
                </Link>
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span aria-hidden="true" className="flex">
                    <StackIcon stack={stack} size={12} />
                  </span>
                  {meta.label} · {formatDate(report.generated_at)}
                </span>
                <span className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                  <span>CC {report.cc_grade ?? "—"}</span>
                  <Coverage percent={report.coverage_percent} />
                  <Security passed={report.security_passed} label={meta.secLabel} />
                </span>
              </div>
            </li>
          )
        })}
      </ul>
    </>
  )
}

export { ReportTable }
