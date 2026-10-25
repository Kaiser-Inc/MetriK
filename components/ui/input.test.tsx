import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Input } from "./input"

describe("Input", () => {
  it("uses the filled 32px field treatment and accessible state classes", () => {
    render(<Input aria-label="Project name" aria-invalid disabled />)

    const input = screen.getByRole("textbox", { name: "Project name" })
    expect(input).toHaveClass(
      "h-control",
      "rounded-md",
      "bg-input/50",
      "px-3",
      "hover:bg-input/80",
      "focus-visible:outline-2",
      "aria-invalid:border-destructive",
      "disabled:bg-muted",
      "disabled:text-subtle-foreground"
    )
    expect(input.className).not.toMatch(/opacity-|shadow-/)
  })
})
