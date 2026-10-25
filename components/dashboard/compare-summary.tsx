import { DeltaBadge } from "@/components/dashboard/delta-badge"
import type { SummaryRow } from "@/lib/compare"

function format(value: number, row: SummaryRow) {
  return `${value.toFixed(row.decimals)}${row.unit}`
}

function Values({ row }: { row: SummaryRow }) {
  if (row.a === null && row.b === null) {
    return <span className="text-xl font-semibold text-muted-foreground">N/A</span>
  }
  return (
    <div className="flex flex-wrap items-baseline gap-2 text-xl font-semibold tabular-nums">
      <span>{row.a !== null ? format(row.a, row) : "N/A"}</span>
      <span aria-hidden="true" className="text-sm font-normal text-subtle-foreground">
        →
      </span>
      <span>{row.b !== null ? format(row.b, row) : "N/A"}</span>
    </div>
  )
}

function CompareSummary({ rows }: { rows: SummaryRow[] }) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-8 border-y border-border py-6 md:grid-cols-3 lg:grid-cols-5">
      {rows.map((row) => (
        <li key={row.title} className="flex min-w-0 flex-col gap-2 border-l border-border pl-4">
          <span className="text-sm text-muted-foreground">{row.title}</span>
          <Values row={row} />
          {row.a !== null && row.b !== null && (
            <span>
              <DeltaBadge
                valueA={row.a}
                valueB={row.b}
                higherIsBetter={row.higherIsBetter}
                unit={row.unit === "/10" ? "" : row.unit}
                decimals={row.decimals}
              />
            </span>
          )}
        </li>
      ))}
    </ul>
  )
}

export { CompareSummary }
