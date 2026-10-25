import { render, screen, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ChartSection } from "@/components/charts/chart-section"
import { ChartUnavailable } from "@/components/charts/chart-unavailable"
import { LintChart } from "@/components/charts/lint-chart"

describe("ChartSection", () => {
  it("names the section, shows the chart and lists the legend", () => {
    render(
      <ChartSection
        title="Complexidade ciclomática"
        icon={<svg data-testid="icon" />}
        legend={[
          { color: "var(--success)", label: "≤ 5 — Simples (A)", dot: true },
          { color: "var(--destructive)", label: "> 10 — Complexo (C+)", dot: true },
        ]}
      >
        <p>gráfico</p>
      </ChartSection>,
    )

    const section = screen.getByRole("region", { name: "Complexidade ciclomática" })
    expect(within(section).getByRole("heading", { level: 3 })).toHaveTextContent("Complexidade ciclomática")
    expect(within(section).getByText("gráfico")).toBeInTheDocument()
    expect(within(section).getAllByRole("listitem").map((li) => li.textContent)).toEqual([
      "≤ 5 — Simples (A)",
      "> 10 — Complexo (C+)",
    ])
  })

  it("sits on the page with a thin line and no card surface", () => {
    render(
      <ChartSection title="Cobertura de testes" icon={null} legend={[]}>
        <p>x</p>
      </ChartSection>,
    )
    const section = screen.getByRole("region", { name: "Cobertura de testes" })
    expect(section).toHaveClass("border-t")
    expect(section.className).not.toMatch(/shadow|bg-card|bg-muted|rounded-(lg|xl)/)
  })
})

describe("ChartUnavailable", () => {
  it("explains why the chart is missing", () => {
    render(<ChartUnavailable message="Não disponível para esta stack" />)
    expect(screen.getByText("Não disponível para esta stack")).toBeInTheDocument()
  })
})

describe("LintChart", () => {
  it("celebrates a clean run with the score", () => {
    render(<LintChart byType={{}} score={9.5} lintLabel="Biome" />)
    expect(screen.getByText("Nenhum problema encontrado")).toBeInTheDocument()
    expect(screen.getByText("9.5/10")).toBeInTheDocument()
  })

  it("says the linter is not configured when there is no score", () => {
    render(<LintChart byType={{}} score={null} lintLabel="RuboCop" />)
    expect(screen.getByText("RuboCop não configurado — dados indisponíveis")).toBeInTheDocument()
  })
})
