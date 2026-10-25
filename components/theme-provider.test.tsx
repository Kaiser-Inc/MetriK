import { act, render, screen } from "@testing-library/react"
import { useTheme } from "next-themes"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { ThemeProvider } from "@/components/theme-provider"

function mockMatchMedia(prefersDark: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query.includes("dark") ? prefersDark : !prefersDark,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    onchange: null,
    dispatchEvent: vi.fn(),
  }))
}

function Probe() {
  const { theme, setTheme } = useTheme()
  return (
    <button onClick={() => setTheme("light")}>
      {theme}
    </button>
  )
}

describe("ThemeProvider", () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.className = ""
    document.documentElement.removeAttribute("data-theme")
    mockMatchMedia(false)
  })

  it("defaults to the dark theme when nothing is stored, even if the system is light", () => {
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    )
    expect(document.documentElement).toHaveClass("dark")
    expect(screen.getByRole("button")).toHaveTextContent("dark")
  })

  it("stores the choice under the `theme` key and removes the dark class for light", () => {
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    )
    act(() => screen.getByRole("button").click())
    expect(localStorage.getItem("theme")).toBe("light")
    expect(document.documentElement).not.toHaveClass("dark")
  })
})
