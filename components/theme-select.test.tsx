import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { ThemeProvider } from "@/components/theme-provider"
import { ThemeSelect } from "@/components/theme-select"

beforeEach(() => {
  localStorage.clear()
  document.documentElement.className = ""
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    onchange: null,
    dispatchEvent: vi.fn(),
  }))
})

function renderSelect() {
  return render(
    <ThemeProvider>
      <ThemeSelect />
    </ThemeProvider>,
  )
}

describe("ThemeSelect", () => {
  it("shows Escuro as the default and offers Escuro, Claro and Sistema", async () => {
    const user = userEvent.setup()
    renderSelect()

    const trigger = screen.getByRole("combobox", { name: "Tema" })
    expect(trigger).toHaveTextContent("Escuro")

    await user.click(trigger)
    const options = await screen.findAllByRole("option")
    expect(options.map((o) => o.textContent)).toEqual(["Escuro", "Claro", "Sistema"])
  })

  it("applies the light theme, stores it and keeps it after a remount", async () => {
    const user = userEvent.setup()
    const { unmount } = renderSelect()

    await user.click(screen.getByRole("combobox", { name: "Tema" }))
    await user.click(await screen.findByRole("option", { name: "Claro" }))

    expect(localStorage.getItem("theme")).toBe("light")
    expect(document.documentElement).not.toHaveClass("dark")

    unmount()
    renderSelect()
    expect(screen.getByRole("combobox", { name: "Tema" })).toHaveTextContent("Claro")
  })
})
