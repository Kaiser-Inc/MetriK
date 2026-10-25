import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Textarea } from "./textarea"

describe("Textarea", () => {
  it("uses the filled field treatment with a flexible 88px minimum height", () => {
    render(<Textarea aria-label="Project notes" aria-invalid disabled />)

    const textarea = screen.getByRole("textbox", { name: "Project notes" })
    expect(textarea).toHaveClass(
      "min-h-[88px]",
      "rounded-md",
      "bg-input/50",
      "px-3",
      "py-2",
      "hover:bg-input/80",
      "focus-visible:outline-2",
      "aria-invalid:border-destructive",
      "disabled:bg-muted",
      "disabled:text-subtle-foreground"
    )
    expect(textarea.className).not.toMatch(
      /(?:^|\s)h-(?!auto)|opacity-|shadow-/
    )
  })
})
