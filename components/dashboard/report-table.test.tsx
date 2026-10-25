import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { ReportTable } from "@/components/dashboard/report-table"
import type { EnrichedItem } from "@/types/metrics"

const items: EnrichedItem[] = [
  {
    slug: "report_py",
    generated_at: "2026-05-11_143026",
    project: "python-fastapi-boilerplate",
    stack: "python-fastapi",
    cc_grade: "A",
    coverage_percent: 83.5,
    security_passed: true,
  },
  {
    slug: "report_node",
    generated_at: "2026-05-14_0556",
    project: "node-fastify-boilerplate",
    stack: "node-fastify",
    cc_grade: "B",
    coverage_percent: 45,
    security_passed: false,
  },
  {
    slug: "report_rb",
    generated_at: "2026-05-14_025644",
    project: "ruby-on-rails-monolith",
    stack: "ruby-on-rails",
  },
]

function renderTable(selected: string[] = [], onSelect = vi.fn()) {
  render(<ReportTable items={items} selected={selected} onSelect={onSelect} />)
  return { onSelect, table: screen.getByRole("table") }
}

describe("ReportTable", () => {
  it("shows one row per report with the columns of the report summary", () => {
    const { table } = renderTable()
    const headers = within(table).getAllByRole("columnheader").map((h) => h.textContent)
    expect(headers).toEqual(["", "Projeto", "Stack", "Gerado em", "CC", "Cobertura", "Segurança"])
    expect(within(table).getAllByRole("row")).toHaveLength(items.length + 1)
  })

  it("links each project to its report", () => {
    const { table } = renderTable()
    expect(within(table).getByRole("link", { name: "node-fastify-boilerplate" })).toHaveAttribute(
      "href",
      "/report/report_node",
    )
  })

  it("encodes the slug in the report link", () => {
    render(
      <ReportTable
        items={[{ ...items[0], slug: "report #1", project: "odd-name" }]}
        selected={[]}
        onSelect={vi.fn()}
      />,
    )
    const table = screen.getByRole("table")
    expect(within(table).getByRole("link", { name: "odd-name" })).toHaveAttribute("href", "/report/report%20%231")
  })

  it("labels the security result with the audit tool of the stack", () => {
    const { table } = renderTable()
    const python = within(table).getByRole("row", { name: /python-fastapi-boilerplate/ })
    expect(within(python).getByText("Passou")).toBeInTheDocument()
    expect(within(python).getByText("Xenon")).toBeInTheDocument()

    const node = within(table).getByRole("row", { name: /node-fastify-boilerplate/ })
    expect(within(node).getByText("Falhou")).toBeInTheDocument()
    expect(within(node).getByText("pnpm audit")).toBeInTheDocument()
  })

  it("colors coverage by threshold and shows a dash when a value is missing", () => {
    const { table } = renderTable()
    expect(within(table).getByText("83.5%")).toHaveClass("text-success")
    expect(within(table).getByText("45.0%")).toHaveClass("text-destructive")

    const rails = within(table).getByRole("row", { name: /ruby-on-rails-monolith/ })
    expect(within(rails).getAllByText("—").length).toBeGreaterThanOrEqual(3)
  })

  it("reports a checkbox change with the slug of the row", async () => {
    const user = userEvent.setup()
    const { table, onSelect } = renderTable()

    await user.click(
      within(table).getByRole("checkbox", { name: "Selecionar node-fastify-boilerplate para comparar" }),
    )
    expect(onSelect).toHaveBeenCalledWith("report_node", true)
  })

  it("shows which rows are selected", () => {
    const { table } = renderTable(["report_py", "report_rb"])
    const checked = within(table)
      .getAllByRole("checkbox")
      .filter((box) => box.getAttribute("aria-checked") === "true")
    expect(checked).toHaveLength(2)
  })

  it("also renders a list for small screens", () => {
    renderTable()
    const list = screen.getByRole("list", { name: "Relatórios" })
    expect(within(list).getAllByRole("listitem")).toHaveLength(items.length)
  })
})
