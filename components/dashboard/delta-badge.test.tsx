import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { DeltaBadge } from "@/components/dashboard/delta-badge"

describe("DeltaBadge", () => {
  it("marks a higher value as an improvement when higher is better", () => {
    render(<DeltaBadge valueA={80} valueB={84.5} unit="%" />)
    const badge = screen.getByText("↑ 4.5%")
    expect(badge).toHaveClass("text-success")
  })

  it("marks a lower value as a regression when higher is better", () => {
    render(<DeltaBadge valueA={90} valueB={85} unit="%" />)
    expect(screen.getByText("↓ 5.0%")).toHaveClass("text-destructive")
  })

  it("marks a lower value as an improvement when lower is better", () => {
    render(<DeltaBadge valueA={6} valueB={4} higherIsBetter={false} />)
    expect(screen.getByText("↓ 2.0")).toHaveClass("text-success")
  })

  it("marks a higher value as a regression when lower is better", () => {
    render(<DeltaBadge valueA={4} valueB={6} higherIsBetter={false} decimals={2} />)
    expect(screen.getByText("↑ 2.00")).toHaveClass("text-destructive")
  })

  it("says there was no change instead of coloring a zero delta", () => {
    render(<DeltaBadge valueA={3} valueB={3.0004} />)
    const badge = screen.getByText("= sem alteração")
    expect(badge).not.toHaveClass("text-success")
    expect(badge).not.toHaveClass("text-destructive")
  })
})
