import { render, screen, within } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { AppHeader } from "@/components/dashboard/app-header"
import { ThemeProvider } from "@/components/theme-provider"

beforeEach(() => {
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

describe("AppHeader", () => {
  it("has the logo, the help sheet trigger and the theme select", () => {
    render(
      <ThemeProvider>
        <AppHeader />
      </ThemeProvider>,
    )
    const header = screen.getByRole("banner")
    expect(within(header).getByRole("link", { name: "MetriK" })).toHaveAttribute("href", "/")
    expect(within(header).getByRole("button", { name: "Como usar" })).toBeInTheDocument()
    expect(within(header).getByRole("combobox", { name: "Tema" })).toBeInTheDocument()
  })

  it("renders the page navigation passed as children", () => {
    render(
      <ThemeProvider>
        <AppHeader>
          <a href="/dashboard">Dashboard</a>
        </AppHeader>
      </ThemeProvider>,
    )
    expect(screen.getByRole("link", { name: "Dashboard" })).toBeInTheDocument()
  })
})
