import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { Checkbox } from "./checkbox"

describe("Checkbox", () => {
  it("toggles by click and Space while exposing its checked state", async () => {
    const user = userEvent.setup()
    render(<Checkbox aria-label="Include archived projects" />)

    const checkbox = screen.getByRole("checkbox", {
      name: "Include archived projects",
    })
    expect(checkbox).toHaveAttribute("aria-checked", "false")

    await user.click(checkbox)
    expect(checkbox).toHaveAttribute("aria-checked", "true")
    expect(checkbox).toHaveAttribute("data-checked")

    await user.keyboard(" ")
    expect(checkbox).toHaveAttribute("aria-checked", "false")
  })

  it("uses a flat 16px square with KaiserInc Base state colors", () => {
    render(<Checkbox aria-label="Include archived projects" defaultChecked />)

    const checkbox = screen.getByRole("checkbox")
    expect(checkbox).toHaveClass(
      "size-4",
      "rounded-sm",
      "border-subtle-foreground",
      "data-checked:bg-primary",
      "data-checked:text-primary-foreground",
      "focus-visible:outline-2"
    )
    expect(checkbox.className).not.toMatch(/opacity-|shadow-/)
    expect(checkbox.querySelector("svg")).toHaveAttribute(
      "stroke-width",
      "1.75"
    )
  })

  it("draws the unchecked box with a border that meets 3:1", () => {
    render(<Checkbox aria-label="Aceito" />)
    const box = screen.getByRole("checkbox", { name: "Aceito" })
    expect(box).toHaveClass("border-subtle-foreground")
    expect(box.className).not.toMatch(/(^|\s)border-strong(\s|$)/)
  })

  it("keeps the check mounted and draws its stroke from the short arm, undrawing faster", async () => {
    const user = userEvent.setup()
    const { container } = render(<Checkbox aria-label="Include archived projects" />)

    const indicator = container.querySelector('[data-slot="checkbox-indicator"]')
    expect(indicator).toBeInTheDocument()
    expect(indicator?.querySelector("svg")).toBeInTheDocument()
    expect(indicator).toHaveClass(
      "[&_path]:[stroke-dasharray:24_40]",
      "[&_path]:transition-[stroke-dashoffset]",
      "[&_path]:duration-200",
      "[&_path]:ease-out",
      "data-unchecked:[&_path]:[stroke-dashoffset:-26]",
      "data-unchecked:[&_path]:duration-[120ms]"
    )
    expect(indicator).toHaveAttribute("data-unchecked")

    await user.click(screen.getByRole("checkbox"))
    expect(indicator).toHaveAttribute("data-checked")
  })
})
