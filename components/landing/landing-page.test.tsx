import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { LandingPage } from "@/components/landing/landing-page"
import { ThemeProvider } from "@/components/theme-provider"

const EMAIL = "kaiserinc.tech@gmail.com"

beforeEach(() => {
  localStorage.clear()
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

function renderLanding() {
  return render(
    <ThemeProvider>
      <LandingPage />
    </ThemeProvider>,
  )
}

describe("LandingPage", () => {
  it("opens with the product proposal in the hero", () => {
    renderLanding()
    expect(
      screen.getByRole("heading", { level: 1, name: "Qualidade de código à vista" }),
    ).toBeInTheDocument()
    expect(screen.getByText("KAISERINC · CÓDIGO ABERTO")).toBeInTheDocument()
  })

  it("lists its sections in order", () => {
    renderLanding()
    const headings = screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent)
    expect(headings).toEqual([
      "O que o MetriK faz",
      "Recursos",
      "Como funciona",
      "Como usar",
      "Métricas",
      "Dúvidas",
    ])
  })

  it("shows the three pillars and the 01, 02, 03 steps", () => {
    renderLanding()
    for (const name of ["Medir", "Comparar", "Entender"]) {
      expect(screen.getByRole("heading", { level: 3, name })).toBeInTheDocument()
    }
    const steps = screen.getByRole("region", { name: "Como funciona" })
    expect(within(steps).getAllByRole("listitem").map((li) => li.textContent?.slice(0, 2))).toEqual([
      "01",
      "02",
      "03",
    ])
  })

  it("sends every Abrir dashboard link to /dashboard", () => {
    renderLanding()
    const links = screen.getAllByRole("link", { name: /Abrir dashboard/ })
    expect(links.length).toBeGreaterThanOrEqual(2)
    for (const link of links) expect(link).toHaveAttribute("href", "/dashboard")
  })

  it("scrolls to the tutorial from the hero and the header navigation", () => {
    renderLanding()
    const links = screen.getAllByRole("link", { name: /Como usar/ })
    expect(links.length).toBeGreaterThanOrEqual(2)
    for (const link of links) expect(link).toHaveAttribute("href", "#como-usar")
    expect(document.getElementById("como-usar")).toBeInTheDocument()
  })

  it("embeds the multi-stack tutorial and the six metrics", () => {
    renderLanding()
    const tutorial = screen.getByRole("region", { name: "Como usar" })
    expect(within(tutorial).getByRole("tab", { name: "Node Fastify" })).toBeInTheDocument()
    const metrics = screen.getByRole("region", { name: "Métricas" })
    expect(within(metrics).getAllByRole("heading", { level: 3 })).toHaveLength(6)
  })

  it("answers the questions in the FAQ, including how to reach the team", async () => {
    const user = userEvent.setup()
    renderLanding()
    const faq = screen.getByRole("region", { name: "Dúvidas" })
    const questions = within(faq).getAllByRole("button").map((b) => b.textContent)
    expect(questions).toEqual([
      "Quais stacks são suportadas?",
      "Meus relatórios saem do meu computador?",
      "Por que uma métrica aparece como N/A?",
      "Funciona no Firefox e no Safari?",
      "Como gero o JSON?",
      "Como falo com a equipe?",
    ])

    await user.click(within(faq).getByRole("button", { name: "Como falo com a equipe?" }))
    expect(within(faq).getByRole("link", { name: EMAIL })).toHaveAttribute("href", `mailto:${EMAIL}`)
  })

  it("repeats the contact e-mail and the GitHub link in the footer", () => {
    renderLanding()
    const footer = screen.getByRole("contentinfo")
    expect(within(footer).getByRole("link", { name: EMAIL })).toHaveAttribute("href", `mailto:${EMAIL}`)
    expect(within(footer).getByRole("link", { name: /GitHub/ })).toHaveAttribute(
      "href",
      "https://github.com/Kaiser-Inc/MetriK",
    )
  })

  it("offers the theme select in the header", () => {
    renderLanding()
    const header = screen.getByRole("banner")
    expect(within(header).getByRole("combobox", { name: "Tema" })).toBeInTheDocument()
  })
})
