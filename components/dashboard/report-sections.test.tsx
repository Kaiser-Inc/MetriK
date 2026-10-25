import { render, screen, within } from "@testing-library/react"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

import { FlogSection } from "@/components/dashboard/flog-section"
import { HalsteadSection } from "@/components/dashboard/halstead-section"
import { PipAuditSection } from "@/components/dashboard/pip-audit-section"
import { RuffSection } from "@/components/dashboard/ruff-section"
import { SecuritySection } from "@/components/dashboard/security-section"
import { migrate } from "@/lib/parseReport"

function load(slug: string) {
  const raw = JSON.parse(readFileSync(join(process.cwd(), "e2e", "fixtures", `${slug}.json`), "utf-8"))
  return migrate(raw, slug)
}

const python = load("report_2026-05-11_143026")
const rails = load("report_2026-05-14_025644")

describe("HalsteadSection", () => {
  it("shows bugs, effort and analyzed files", () => {
    render(<HalsteadSection report={python} />)
    const section = screen.getByRole("region", { name: /Métricas de Halstead/ })
    expect(within(section).getByText("Bugs Estimados")).toBeInTheDocument()
    expect(within(section).getByText("0.180")).toBeInTheDocument()
    expect(within(section).getByText("Esforço Total")).toBeInTheDocument()
    expect(within(section).getByText("Arquivos Analisados")).toBeInTheDocument()
  })

  it("explains when the stack has no Halstead analysis", () => {
    render(<HalsteadSection report={rails} />)
    expect(screen.getByText(/não estão disponíveis para esta stack/)).toBeInTheDocument()
  })

  it("sits on the page with a thin line and no card surface", () => {
    render(<HalsteadSection report={python} />)
    const section = screen.getByRole("region", { name: /Métricas de Halstead/ })
    expect(section).toHaveClass("border-t")
    expect(section.className).not.toMatch(/shadow|bg-card|bg-muted|rounded-(lg|xl)/)
  })
})

describe("SecuritySection", () => {
  it("shows the audit label, the result and the Xenon thresholds", () => {
    render(<SecuritySection security={python.security} secLabel="Xenon · Limiares de Complexidade" />)
    const section = screen.getByRole("region", { name: "Xenon · Limiares de Complexidade" })
    expect(within(section).getByText("Passou")).toBeInTheDocument()
    expect(within(section).getByText("max-abs: B")).toBeInTheDocument()
    expect(within(section).getByText("max-modules: B")).toBeInTheDocument()
    expect(within(section).getByText("max-avg: A")).toBeInTheDocument()
  })

  it("flags a failed audit", () => {
    render(<SecuritySection security={{ ...python.security, passed: false }} secLabel="pnpm audit" />)
    expect(screen.getByText("Falhou")).toBeInTheDocument()
  })
})

describe("PipAuditSection", () => {
  it("lists each vulnerable package with its advisory and fix", () => {
    render(<PipAuditSection pipAudit={python.pip_audit!} />)
    expect(screen.getByRole("region", { name: "Segurança · pip-audit" })).toBeInTheDocument()
    expect(screen.getByText("1 vulnerabilidade")).toBeInTheDocument()
    expect(screen.getByText("requests@2.0.0")).toBeInTheDocument()
    expect(screen.getByText(/GHSA-xxxx/)).toBeInTheDocument()
    expect(screen.getByText(/fix: 2\.31\.0/)).toBeInTheDocument()
  })

  it("celebrates a clean scan", () => {
    render(
      <PipAuditSection pipAudit={{ passed: true, total_vulnerabilities: 0, vulnerabilities: [] }} />,
    )
    expect(screen.getByText("Sem vulnerabilidades")).toBeInTheDocument()
  })

  it("reports when pip-audit itself could not run", () => {
    render(
      <PipAuditSection
        pipAudit={{ passed: false, total_vulnerabilities: 0, vulnerabilities: [], error: "network down" }}
      />,
    )
    expect(screen.getByText(/pip-audit não pôde ser executado/)).toBeInTheDocument()
    expect(screen.getByText("network down")).toBeInTheDocument()
  })
})

describe("RuffSection", () => {
  it("shows the issue count and the most frequent rule codes", () => {
    render(<RuffSection ruff={python.ruff!.summary} />)
    expect(screen.getByText("5 issues")).toBeInTheDocument()
    expect(screen.getByText("E501: 3")).toBeInTheDocument()
    expect(screen.getByText("F401: 2")).toBeInTheDocument()
  })

  it("says so when there are no issues", () => {
    render(<RuffSection ruff={{ total_issues: 0, by_code: {}, by_file: {} }} />)
    expect(screen.getByText("Sem issues")).toBeInTheDocument()
  })
})

describe("FlogSection", () => {
  it("shows the grade and the average score", () => {
    render(<FlogSection flog={rails.flog_score!} />)
    expect(screen.getByRole("region", { name: "Flog" })).toBeInTheDocument()
    expect(screen.getByText("B")).toBeInTheDocument()
    expect(screen.getByText("17.50")).toBeInTheDocument()
  })
})
