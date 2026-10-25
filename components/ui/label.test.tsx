import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Label } from "./label"

describe("Label", () => {
  it("uses the KaiserInc Base label typography without faded disabled text", () => {
    render(<Label htmlFor="project">Project name</Label>)

    const label = screen.getByText("Project name")
    expect(label).toHaveClass("text-sm", "font-medium")
    expect(label.className).not.toMatch(/opacity-/)
  })
})
