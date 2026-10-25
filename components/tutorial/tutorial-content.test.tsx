import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { TutorialContent } from "@/components/tutorial/tutorial-content"

describe("TutorialContent", () => {
  it("explains the three ways to run MetriK", () => {
    render(<TutorialContent />)
    for (const mode of ["Local", "Docker", "Deploy"]) {
      expect(screen.getByRole("heading", { name: mode })).toBeInTheDocument()
    }
    expect(screen.getByText(/METRICS_DIR/)).toBeInTheDocument()
  })

  it("covers Python FastAPI, Node Fastify and Ruby on Rails, each with its own tools", async () => {
    const user = userEvent.setup()
    render(<TutorialContent />)

    const tabs = screen.getAllByRole("tab")
    expect(tabs.map((tab) => tab.textContent)).toEqual([
      "Python FastAPI",
      "Node Fastify",
      "Ruby on Rails",
    ])

    expect(screen.getByText("make metrics-install")).toBeInTheDocument()
    expect(screen.getByText(/radon/)).toBeInTheDocument()

    await user.click(screen.getByRole("tab", { name: "Node Fastify" }))
    expect(screen.getByText(/Biome/)).toBeInTheDocument()

    await user.click(screen.getByRole("tab", { name: "Ruby on Rails" }))
    expect(screen.getByText(/flog/)).toBeInTheDocument()
    expect(screen.getByText(/bundler-audit/)).toBeInTheDocument()
  })

  it("does not present scripts/metrics.py as the only report generator", () => {
    render(<TutorialContent />)
    expect(screen.queryByText(/scripts\/metrics\.py/)).not.toBeInTheDocument()
  })

  it("lists the six metrics with their thresholds", () => {
    render(<TutorialContent />)
    const metrics = screen.getByRole("region", { name: "Métricas" })
    for (const name of [
      "Complexidade ciclomática",
      "Índice de manutenibilidade",
      "Cobertura de testes",
      "Análise de linter",
      "Métricas de Halstead",
      "Segurança e auditoria",
    ]) {
      expect(within(metrics).getByRole("heading", { name })).toBeInTheDocument()
    }
    expect(within(metrics).getByText("≥ 80%")).toBeInTheDocument()
  })

  it("explains how to compare two reports", () => {
    render(<TutorialContent />)
    expect(screen.getByText(/Ver comparativo/)).toBeInTheDocument()
  })
})
