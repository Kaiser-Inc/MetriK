import { Badge } from "@/components/ui/badge"

type DeltaBadgeProps = {
  valueA: number
  valueB: number
  higherIsBetter?: boolean
  unit?: string
  decimals?: number
}

// The change from report A to report B, colored by whether it is an improvement.
function DeltaBadge({ valueA, valueB, higherIsBetter = true, unit = "", decimals = 1 }: DeltaBadgeProps) {
  const delta = valueB - valueA

  if (Math.abs(delta) < 0.001) {
    return <Badge variant="neutral">= sem alteração</Badge>
  }

  const improved = higherIsBetter ? delta > 0 : delta < 0
  return (
    <Badge variant={improved ? "success" : "destructive"}>
      {delta > 0 ? "↑" : "↓"} {Math.abs(delta).toFixed(decimals)}
      {unit}
    </Badge>
  )
}

export { DeltaBadge }
