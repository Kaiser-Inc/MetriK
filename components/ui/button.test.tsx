import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { Button } from "./button"

describe("Button", () => {
  it("uses the single control height by default and the dense one for sm", () => {
    render(
      <>
        <Button>Save</Button>
        <Button size="sm">Open</Button>
      </>
    )
    expect(screen.getByRole("button", { name: "Save" })).toHaveClass("h-control")
    expect(screen.getByRole("button", { name: "Open" })).toHaveClass("h-control-sm")
  })

  it("blocks clicks and announces progress while loading, without the disabled look", async () => {
    const onClick = vi.fn()
    render(
      <Button variant="destructive" loading onClick={onClick}>
        Excluir
      </Button>
    )
    const button = screen.getByRole("button", { name: /excluir/i })
    expect(button).toHaveAttribute("aria-busy", "true")
    expect(button).toHaveAttribute("aria-disabled", "true")
    expect(button).not.toHaveAttribute("disabled")
    expect(button).toHaveClass("text-destructive")
    expect(screen.getByRole("status")).toBeInTheDocument()
    await userEvent.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })

  it("never fades the disabled state with opacity", () => {
    render(<Button disabled>Save</Button>)
    expect(screen.getByRole("button", { name: "Save" }).className).not.toMatch(/opacity-/)
  })

  it("scales down on press for every variant except link, and not while loading", () => {
    render(
      <>
        <Button>Save</Button>
        <Button variant="outline">Cancel</Button>
        <Button variant="secondary">Copy</Button>
        <Button variant="ghost">More</Button>
        <Button variant="destructive">Delete</Button>
        <Button variant="link">Docs</Button>
      </>
    )
    for (const name of ["Save", "Cancel", "Copy", "More", "Delete"]) {
      const button = screen.getByRole("button", { name })
      expect(button).toHaveClass("motion-safe:active:not-aria-disabled:scale-[0.97]")
      expect(button.className).toMatch(/transition-\[[^\]]*scale[^\]]*\]/)
    }
    expect(screen.getByRole("button", { name: "Docs" }).className).not.toMatch(/active:[^\s]*scale/)
  })

  it("fades the spinner in when loading starts", () => {
    const { container } = render(<Button loading>Saving</Button>)
    const wrapper = container.querySelector('[data-slot="button-spinner"]')
    expect(wrapper).toHaveClass("animate-in", "fade-in-0", "zoom-in-75", "duration-150")
    expect(wrapper?.querySelector('[data-slot="spinner"]')).toBeInTheDocument()
  })
})
