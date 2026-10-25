import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Separator } from "./separator"

describe("Separator", () => {
  it("uses a one-pixel border token in both orientations", () => {
    render(
      <>
        <Separator aria-label="Horizontal divider" />
        <Separator aria-label="Vertical divider" orientation="vertical" />
      </>
    )

    expect(screen.getByLabelText("Horizontal divider")).toHaveClass(
      "border-t",
      "border-border"
    )
    expect(screen.getByLabelText("Vertical divider")).toHaveClass(
      "border-l",
      "border-border"
    )
  })
})
