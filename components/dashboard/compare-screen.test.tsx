import { render, screen, within } from "@testing-library/react"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { CompareScreen } from "@/components/dashboard/compare-screen"
import { ThemeProvider } from "@/components/theme-provider"
import { migrate } from "@/lib/parseReport"

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }) }))

function load(slug: string) {
  const raw = JSON.parse(readFileSync(join(process.cwd(), "e2e", "fixtures", `${slug}.json`), "utf-8"))
  return migrate(raw, slug)
}

const python = load("report_2026-05-11_143026")
const node = load("report_2026-05-14_0556")
const rails = load("report_2026-05-14_025644")

beforeEach(() => {
  sessionStorage.clear()
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

function renderScreen(props: Partial<React.ComponentProps<typeof CompareScreen>> = {}) {
  return render(
    <ThemeProvider>
      <CompareScreen
        reportA={python}
        reportB={node}
        slugA="a"
        slugB="b"
        dateA="11 de maio de 2026"
        dateB="14 de maio de 2026"
        {...props}
      />
    </ThemeProvider>,
  )
}

describe("CompareScreen", () => {
  it("puts the two reports side by side under a Comparativo heading", async () => {
    renderScreen()
    expect(await screen.findByRole("heading", { level: 1, name: "Comparativo" })).toBeInTheDocument()
    const sides = screen.getByRole("region", { name: "Relatórios comparados" })
    expect(within(sides).getByText("python-fastapi-boilerplate")).toBeInTheDocument()
    expect(within(sides).getByText("node-fastify-boilerplate")).toBeInTheDocument()
    expect(within(sides).getByText("11 de maio de 2026")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /Voltar/ })).toHaveAttribute("href", "/dashboard")
  })

  it("summarizes the five metrics with their change", async () => {
    renderScreen()
    const summary = await screen.findByRole("region", { name: "Resumo" })
    for (const title of ["CC Médio", "MI Médio", "Cobertura", "Linter Score", "Bugs Estimados"]) {
      expect(within(summary).getByText(title)).toBeInTheDocument()
    }
    // coverage went from 83.5% to 88.0%: a 4.5 point improvement
    expect(within(summary).getByText("↑ 4.5%")).toHaveClass("text-success")
  })

  it("shows N/A on the side that lacks a metric, and N/A when neither has it", async () => {
    renderScreen({ reportA: node, reportB: rails })
    const summary = await screen.findByRole("region", { name: "Resumo" })
    expect(within(summary).getAllByText("N/A").length).toBeGreaterThanOrEqual(2)
  })

  it("compares the security of both reports, including the pip-audit scan", async () => {
    renderScreen()
    const security = await screen.findByRole("region", { name: "Segurança" })
    expect(within(security).getAllByText("Passou").length).toBeGreaterThan(0)
    expect(within(security).getByText("1 CVEs")).toBeInTheDocument()
    expect(within(security).getByText("GHSA-xxxx")).toBeInTheDocument()
  })

  it("compares the tests when at least one report has them", async () => {
    renderScreen({ reportA: python, reportB: rails })
    const tests = await screen.findByRole("region", { name: "Testes" })
    expect(within(tests).getByText("24/24")).toBeInTheDocument()
    expect(within(tests).getByText("18/19")).toBeInTheDocument()
    expect(within(tests).getByText("1 falhou")).toBeInTheDocument()
  })

  it("draws the charts of both reports and says when one is unavailable", async () => {
    renderScreen({ reportA: node, reportB: rails })
    const charts = await screen.findByRole("region", { name: "Gráficos" })
    expect(within(charts).getByRole("region", { name: "node-fastify-boilerplate · CC" })).toBeInTheDocument()
    expect(within(charts).getByRole("region", { name: "ruby-on-rails-monolith · CC" })).toBeInTheDocument()
    expect(within(charts).getByText("MI indisponível")).toBeInTheDocument()
    expect(within(charts).getByRole("region", { name: "ruby-on-rails-monolith · RuboCop" })).toBeInTheDocument()
  })

  it("lists the files with their complexity and coverage change", async () => {
    renderScreen({ reportA: python, reportB: python })
    const diff = await screen.findByRole("region", { name: "Diff por arquivo" })
    const headers = within(diff).getAllByRole("columnheader").map((h) => h.textContent)
    expect(headers).toEqual(["Arquivo", "CC (A)", "CC (B)", "Δ CC", "Cob. (A)", "Cob. (B)", "Δ Cob."])
    expect(within(diff).getByText("services.py")).toBeInTheDocument()
    expect(within(diff).getAllByText("= sem alteração").length).toBeGreaterThan(0)
  })

  it("explains what is missing when a report cannot be found", async () => {
    renderScreen({ reportA: null, reportB: null, slugA: "", slugB: "" })
    expect(await screen.findByText("Relatórios não encontrados")).toBeInTheDocument()
    expect(screen.getByText(/Parâmetros ausentes na URL/)).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /Voltar ao dashboard/ })).toHaveAttribute("href", "/dashboard")
  })

  it("restores both reports from the files chosen in the browser (deploy mode)", async () => {
    sessionStorage.setItem(
      "metrik-reports",
      JSON.stringify([
        { slug: "a", generated_at: python.generated_at, project: python.project, rawJson: python },
        { slug: "b", generated_at: node.generated_at, project: node.project, rawJson: node },
      ]),
    )
    renderScreen({ reportA: null, reportB: null })
    expect(await screen.findByRole("heading", { level: 1, name: "Comparativo" })).toBeInTheDocument()
    expect(screen.getByRole("region", { name: "Resumo" })).toBeInTheDocument()
  })

  it("tells the user to pick the reports again when the session has only one of them", async () => {
    sessionStorage.setItem(
      "metrik-reports",
      JSON.stringify([{ slug: "a", generated_at: python.generated_at, project: python.project, rawJson: python }]),
    )
    renderScreen({ reportA: null, reportB: null })
    expect(await screen.findByText(/não estão disponíveis na sessão atual/)).toBeInTheDocument()
  })
})
