import { DeltaBadge } from "@/components/dashboard/delta-badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { FileDiff } from "@/lib/compare"

const muted = <span className="text-subtle-foreground">—</span>

function FileDiffTable({ diffs }: { diffs: FileDiff[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {["Arquivo", "CC (A)", "CC (B)", "Δ CC", "Cob. (A)", "Cob. (B)", "Δ Cob."].map((heading) => (
            <TableHead key={heading}>{heading}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {diffs.map(({ path, fname, ccA, ccB, covA, covB }) => (
          <TableRow key={path}>
            <TableCell className="font-mono text-xs" title={path}>
              {fname}
            </TableCell>
            <TableCell className="text-muted-foreground tabular-nums">{ccA?.toFixed(1) ?? "—"}</TableCell>
            <TableCell className="text-muted-foreground tabular-nums">{ccB?.toFixed(1) ?? "—"}</TableCell>
            <TableCell>
              {ccA != null && ccB != null ? (
                <DeltaBadge valueA={ccA} valueB={ccB} higherIsBetter={false} decimals={1} />
              ) : (
                muted
              )}
            </TableCell>
            <TableCell className="text-muted-foreground tabular-nums">
              {covA != null ? `${covA.toFixed(1)}%` : "—"}
            </TableCell>
            <TableCell className="text-muted-foreground tabular-nums">
              {covB != null ? `${covB.toFixed(1)}%` : "—"}
            </TableCell>
            <TableCell>
              {covA != null && covB != null ? (
                <DeltaBadge valueA={covA} valueB={covB} higherIsBetter unit="%" decimals={1} />
              ) : (
                muted
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export { FileDiffTable }
