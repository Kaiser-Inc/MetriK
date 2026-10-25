import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

import { MetricStrip } from "@/components/dashboard/metric-strip"
import { migrate } from "@/lib/parseReport"

function load(slug: string) {
  const raw = JSON.parse(readFileSync(join(process.cwd(), "e2e", "fixtures", `${slug}.json`), "utf-8"))
  return migrate(raw, slug)
}

const python = load("report_2026-05-11_143026")
const node = load("report_2026-05-14_0556")
const rails = load("report_2026-05-14_025644")

describe("MetricStrip", () => {
  it("shows the metrics of a Node report with the labels of its tools", () => {
    render(<MetricStrip report={node} />)
    const strip = screen.getByRole("region", { name: "Resumo das métricas" })
    for (const label of [
      "CC Média",
      "Manutenibilidade",
      "Biome Score",
      "Cobertura",
      "Testes",
      "Bugs Estimados",
      "pnpm audit",
    ]) {
      expect(within(strip).getByText(label)).toBeInTheDocument()
    }
    expect(within(strip).getByText("88.0%")).toBeInTheDocument()
    expect(within(strip).getByText("40/40")).toBeInTheDocument()
    expect(within(strip).getByText(/Todos passaram/)).toBeInTheDocument()
  })

  it("explains N/A instead of showing zeros when the stack lacks a metric", () => {
    render(<MetricStrip report={rails} />)
    expect(screen.getByText("RuboCop Score")).toBeInTheDocument()
    expect(screen.getByText("bundler-audit")).toBeInTheDocument()
    expect(screen.getAllByText("N/A")).toHaveLength(2)
    expect(screen.getAllByText(/Não disponível para esta stack/)).toHaveLength(2)
    expect(screen.getByText(/1 falharam/)).toBeInTheDocument()
  })

  it("uses pip-audit as the security metric for Python", () => {
    render(<MetricStrip report={python} />)
    expect(screen.getByText("pip-audit")).toBeInTheDocument()
    expect(screen.getByText("Falhou")).toBeInTheDocument()
    expect(screen.getByText(/1 vulnerabilidade$/)).toBeInTheDocument()
    expect(screen.getByText("Pylint Score")).toBeInTheDocument()
  })

  it("opens the explanation of a metric in a panel", async () => {
    const user = userEvent.setup()
    render(<MetricStrip report={node} />)

    await user.click(screen.getByRole("button", { name: "Saiba mais sobre CC Média" }))
    const panel = await screen.findByRole("dialog", { name: "Complexidade ciclomática" })
    expect(within(panel).getByText("A · Simples")).toBeInTheDocument()
    expect(within(panel).getByText(/Boa prática/)).toBeInTheDocument()
  })

  it("adapts the panel to the linter and the audit tool of the stack", async () => {
    const user = userEvent.setup()
    render(<MetricStrip report={rails} />)

    await user.click(screen.getByRole("button", { name: "Saiba mais sobre RuboCop Score" }))
    const lint = await screen.findByRole("dialog", { name: "Nota do RuboCop" })
    expect(within(lint).getByText(/RuboCop \(Ruby\)|Ruby Style Guide/)).toBeInTheDocument()
  })

  it("sits on the page with thin lines and no card surface", () => {
    render(<MetricStrip report={node} />)
    const strip = screen.getByRole("region", { name: "Resumo das métricas" })
    expect(strip.className).not.toMatch(/shadow|bg-card|bg-muted|rounded-(lg|xl)/)
  })
})
