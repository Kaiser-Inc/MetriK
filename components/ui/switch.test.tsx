import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { Switch } from "./switch"

describe("Switch", () => {
  it("toggles by click and Space while exposing its checked state", async () => {
    const user = userEvent.setup()
    render(<Switch aria-label="Email notifications" />)

    const toggle = screen.getByRole("switch", { name: "Email notifications" })
    expect(toggle).toHaveAttribute("aria-checked", "false")

    await user.click(toggle)
    expect(toggle).toHaveAttribute("aria-checked", "true")
    expect(toggle).toHaveAttribute("data-checked")

    await user.keyboard(" ")
    expect(toggle).toHaveAttribute("aria-checked", "false")
  })

  it("uses token colors and a flat background thumb", () => {
    render(<Switch aria-label="Email notifications" />)

    const toggle = screen.getByRole("switch")
    expect(toggle).toHaveClass(
      "rounded-full",
      "data-unchecked:bg-input",
      "data-checked:bg-primary",
      "focus-visible:outline-2"
    )
    expect(toggle.className).not.toMatch(/opacity-|shadow-/)

    const thumb = toggle.querySelector('[data-slot="switch-thumb"]')
    expect(thumb).toHaveClass("rounded-full", "bg-background")
    expect(thumb?.className).not.toMatch(/shadow-/)
  })

  it("slides the thumb over 250ms with the drawer curve and widens it on press", () => {
    render(
      <>
        <Switch aria-label="Default" />
        <Switch aria-label="Small" size="sm" />
      </>
    )
    const toggle = screen.getByRole("switch", { name: "Default" })
    expect(toggle).toHaveClass(
      "transition-[background-color,border-color]",
      "duration-250",
      "data-[size=default]:[--switch-inner:28px]",
      "data-[size=default]:[--switch-thumb-pressed:20px]",
      "data-[size=sm]:[--switch-inner:20px]",
      "data-[size=sm]:[--switch-thumb-pressed:15px]"
    )
    const thumb = toggle.querySelector('[data-slot="switch-thumb"]')
    expect(thumb).toHaveClass(
      "transition-[translate,width]",
      "duration-250",
      "ease-drawer",
      "data-checked:translate-x-[calc(var(--switch-inner)-100%)]",
      "motion-safe:group-[:active:not([data-disabled])]/switch:w-(--switch-thumb-pressed)"
    )
  })
})
