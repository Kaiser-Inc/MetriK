import { render, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { DashboardScreen } from "@/components/dashboard/dashboard-screen"
import { ThemeProvider } from "@/components/theme-provider"
import type { EnrichedItem } from "@/types/metrics"

const push = vi.fn()
const refresh = vi.fn()
vi.mock("next/navigation", () => ({ useRouter: () => ({ push, refresh }) }))

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
    coverage_percent: 88,
    security_passed: true,
  },
  {
    slug: "report_rb",
    generated_at: "2026-05-14_025644",
    project: "ruby-on-rails-monolith",
    stack: "ruby-on-rails",
    cc_grade: "B",
    coverage_percent: 76,
    security_passed: true,
  },
]

beforeEach(() => {
  sessionStorage.clear()
  localStorage.clear()
  push.mockClear()
  refresh.mockClear()
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

function renderScreen(props: Partial<React.ComponentProps<typeof DashboardScreen>> = {}) {
  render(
    <ThemeProvider>
      <DashboardScreen items={items} {...props} />
    </ThemeProvider>,
  )
  return screen.queryByRole("table")
}

describe("DashboardScreen", () => {
  it("lists the reports in a table under a Relatórios heading with the total", () => {
    const table = renderScreen()!
    expect(screen.getByRole("heading", { level: 1, name: /^Relatórios/ })).toBeInTheDocument()
    expect(screen.getByText("3", { selector: "[data-slot=badge]" })).toBeInTheDocument()
    expect(within(table).getAllByRole("row")).toHaveLength(4)
  })

  it("filters by stack, shows the filtered fraction and remembers the choice", async () => {
    const user = userEvent.setup()
    renderScreen()

    await user.click(screen.getByRole("button", { name: "Node" }))
    const table = screen.getByRole("table")
    expect(within(table).getAllByRole("row")).toHaveLength(2)
    expect(within(table).getByText("node-fastify-boilerplate")).toBeInTheDocument()
    expect(screen.getByText("1 / 3")).toBeInTheDocument()
    expect(sessionStorage.getItem("metrik-stack-filter")).toBe("node-fastify")

    await user.click(screen.getByRole("button", { name: "Todas" }))
    expect(within(screen.getByRole("table")).getAllByRole("row")).toHaveLength(4)
    expect(screen.queryByText("1 / 3")).not.toBeInTheDocument()
  })

  it("applies the filter saved in the session after the first render", async () => {
    sessionStorage.setItem("metrik-stack-filter", "ruby-on-rails")
    renderScreen()

    await waitFor(() => expect(screen.getByRole("table").querySelectorAll("tbody tr")).toHaveLength(1))
    expect(screen.getByRole("button", { name: "Ruby" })).toHaveAttribute("aria-pressed", "true")
  })

  it("compares two selected reports", async () => {
    const user = userEvent.setup()
    const table = renderScreen()!
    expect(screen.queryByRole("region", { name: "Comparação" })).not.toBeInTheDocument()

    await user.click(within(table).getByRole("checkbox", { name: /python-fastapi-boilerplate/ }))
    expect(screen.getByText("1 selecionado, escolha mais 1")).toBeInTheDocument()
    await user.click(within(table).getByRole("checkbox", { name: /ruby-on-rails-monolith/ }))

    await user.click(screen.getByRole("button", { name: "Ver comparativo" }))
    expect(push).toHaveBeenCalledWith("/compare?a=report_py&b=report_rb")
  })

  it("keeps only the two latest selections", async () => {
    const user = userEvent.setup()
    const table = renderScreen()!
    for (const name of [/python-fastapi/, /node-fastify/, /ruby-on-rails/]) {
      await user.click(within(table).getByRole("checkbox", { name }))
    }
    expect(screen.getByText("2 selecionados")).toBeInTheDocument()
    expect(within(table).getByRole("checkbox", { name: /python-fastapi/ })).toHaveAttribute(
      "aria-checked",
      "false",
    )
  })

  it("lists the reports that failed to load and lets the user dismiss the notice", async () => {
    const user = userEvent.setup()
    renderScreen({ loadErrors: [{ file: "broken.json", reason: "campo halstead ausente" }] })

    const alert = screen.getByRole("alert")
    expect(within(alert).getByText("1 relatório não pôde ser carregado")).toBeInTheDocument()
    expect(within(alert).getByText("broken.json")).toBeInTheDocument()
    expect(within(alert).getByText(/campo halstead ausente/)).toBeInTheDocument()

    await user.click(within(alert).getByRole("button", { name: "Dispensar" }))
    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
  })

  it("explains how to configure METRICS_DIR when the folder is unreadable", () => {
    renderScreen({ items: [], error: "METRICS_DIR não configurado em .env.local" })
    expect(screen.getByText("METRICS_DIR não configurado")).toBeInTheDocument()
    expect(screen.queryByRole("table")).not.toBeInTheDocument()
  })

  it("shows an empty state when there are no reports", () => {
    renderScreen({ items: [] })
    expect(screen.getByText("Nenhum relatório encontrado")).toBeInTheDocument()
  })

  it("refreshes the list in local mode", async () => {
    const user = userEvent.setup()
    renderScreen()
    await user.click(screen.getByRole("button", { name: "Atualizar lista" }))
    expect(refresh).toHaveBeenCalled()
  })

  it("asks for the metrics folder in deploy mode and lists the files once they load", async () => {
    const user = userEvent.setup()
    renderScreen({ items: [], deployMode: true })

    expect(screen.getByText("Selecione a pasta de métricas")).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: "Atualizar lista" })).not.toBeInTheDocument()

    const file = new File(
      [readFileSync(join(process.cwd(), "e2e", "fixtures", "report_2026-05-14_0556.json"), "utf-8")],
      "report_2026-05-14_0556.json",
      { type: "application/json" },
    )
    const input = document.querySelector<HTMLInputElement>("input[type=file]:not([webkitdirectory])")!
    await user.upload(input, file)

    await waitFor(() => expect(screen.getByRole("table")).toBeInTheDocument())
    expect(within(screen.getByRole("table")).getByText("node-fastify-boilerplate")).toBeInTheDocument()
    expect(sessionStorage.getItem("metrik-reports")).toContain("report_2026-05-14_0556")
  })

  it("restores the reports of the session in deploy mode", async () => {
    sessionStorage.setItem("metrik-reports", JSON.stringify([items[0]]))
    renderScreen({ items: [], deployMode: true })
    expect(await screen.findByRole("table")).toBeInTheDocument()
  })
})
