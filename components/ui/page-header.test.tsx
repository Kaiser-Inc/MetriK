import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { PageHeader } from "./page-header"

describe("PageHeader", () => {
  it("renders the page name as the only level-1 heading", () => {
    render(<PageHeader title="Projetos" />)
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1)
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Projetos")
  })

  it("renders the optional description and actions", () => {
    render(
      <PageHeader
        title="Projetos"
        description="Todos os produtos em um lugar."
        actions={<button>Criar projeto</button>}
      />
    )
    expect(screen.getByText("Todos os produtos em um lugar.")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Criar projeto" })).toBeInTheDocument()
  })

  it("omits the description element when none is given", () => {
    const { container } = render(<PageHeader title="Projetos" />)
    expect(container.querySelector("[data-slot=page-header-description]")).toBeNull()
  })

  it("renders a level-2 heading when nested in another page", () => {
    render(<PageHeader title="Projetos" headingLevel={2} />)
    expect(screen.queryByRole("heading", { level: 1 })).toBeNull()
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Projetos")
  })
})
