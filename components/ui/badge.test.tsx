import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Badge } from "./badge"

describe("Badge", () => {
  it("renders every semantic variant without a state-colored background", () => {
    render(
      <>
        <Badge variant="neutral">Neutral</Badge>
        <Badge variant="primary">Primary</Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="warning">Warning</Badge>
        <Badge variant="destructive">Destructive</Badge>
      </>
    )

    for (const name of [
      "Neutral",
      "Primary",
      "Success",
      "Warning",
      "Destructive",
    ]) {
      const badge = screen.getByText(name)
      expect(badge).toHaveClass(
        "h-5",
        "rounded-sm",
        "border",
        "px-1.5",
        "text-xs",
        "font-medium"
      )
      expect(badge.className).not.toMatch(
        /bg-(?:primary|success|warning|destructive)/
      )
    }
  })

  it("keeps default as an alias of neutral", () => {
    render(
      <>
        <Badge>Default</Badge>
        <Badge variant="neutral">Neutral</Badge>
      </>
    )

    const defaultBadge = screen.getByText("Default")
    const neutralBadge = screen.getByText("Neutral")
    expect(defaultBadge).toHaveClass("border-border", "text-muted-foreground")
    expect(neutralBadge).toHaveClass("border-border", "text-muted-foreground")
  })
})
