import { render, screen, within } from "@testing-library/react"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { ReportScreen } from "@/components/dashboard/report-screen"
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

function renderScreen(props: Partial<React.ComponentProps<typeof ReportScreen>>) {
  return render(
    <ThemeProvider>
      <ReportScreen slug="s" formattedDate="14 de maio de 2026, 05:56" report={node} {...props} />
    </ThemeProvider>,
  )
}

describe("ReportScreen", () => {
  it("introduces the report with its project, stack and date, and a way back", () => {
    renderScreen({})
    expect(screen.getByRole("heading", { level: 1, name: /^node-fastify-boilerplate/ })).toBeInTheDocument()
    expect(screen.getAllByText("Node").length).toBeGreaterThan(0)
    expect(screen.getByText(/Gerado em 14 de maio de 2026, 05:56/)).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /Voltar/ })).toHaveAttribute("href", "/dashboard")
  })

  it("shows the summary and the four charts under the labels of the stack", () => {
    renderScreen({})
    expect(screen.getByRole("region", { name: "Resumo das métricas" })).toBeInTheDocument()
    for (const name of [
      "Complexidade ciclomática",
      "Índice de manutenibilidade",
      "Cobertura de testes",
      "Issues Biome",
    ]) {
      expect(screen.getByRole("region", { name })).toBeInTheDocument()
    }
    expect(screen.getByRole("region", { name: "pnpm audit" })).toBeInTheDocument()
    expect(screen.queryByText("Pylint Score")).not.toBeInTheDocument()
  })

  it("adds the Python sections: pip-audit, Xenon thresholds and Ruff", () => {
    renderScreen({ report: python })
    expect(screen.getByRole("region", { name: "Segurança · pip-audit" })).toBeInTheDocument()
    expect(screen.getByRole("region", { name: "Xenon · Limiares de Complexidade" })).toBeInTheDocument()
    expect(screen.getByRole("region", { name: "Ruff" })).toBeInTheDocument()
    expect(screen.getByText("Pylint Score")).toBeInTheDocument()
    expect(screen.queryByText("Biome Score")).not.toBeInTheDocument()
  })

  it("adds the Rails section: Flog, with RuboCop and bundler-audit labels", () => {
    renderScreen({ report: rails })
    expect(screen.getByRole("region", { name: "Flog" })).toBeInTheDocument()
    expect(screen.getByText("RuboCop Score")).toBeInTheDocument()
    expect(screen.getByRole("region", { name: "bundler-audit" })).toBeInTheDocument()
    expect(screen.queryByRole("region", { name: "Ruff" })).not.toBeInTheDocument()
  })

  it("shows the exact reason when the report is invalid", () => {
    renderScreen({ report: null, loadError: "campo `halstead` ausente" })
    expect(screen.getByText("Relatório inválido")).toBeInTheDocument()
    expect(screen.getByText("campo `halstead` ausente")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /Voltar ao dashboard/ })).toHaveAttribute("href", "/dashboard")
  })

  it("says the report was not found when deploy mode has nothing in the session", () => {
    renderScreen({ report: null })
    expect(screen.getByText("Relatório não encontrado")).toBeInTheDocument()
  })

  it("restores the report from the files chosen in the browser (deploy mode)", async () => {
    sessionStorage.setItem(
      "metrik-reports",
      JSON.stringify([{ slug: "picked", generated_at: rails.generated_at, project: rails.project, rawJson: rails }]),
    )
    renderScreen({ report: null, slug: "picked", formattedDate: "" })
    expect(
      await screen.findByRole("heading", { level: 1, name: /^ruby-on-rails-monolith/ }),
    ).toBeInTheDocument()
    const main = screen.getByRole("main")
    expect(within(main).getByRole("region", { name: "Resumo das métricas" })).toBeInTheDocument()
  })
})
