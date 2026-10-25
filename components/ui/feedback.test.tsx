import { act, render, screen } from "@testing-library/react"
import { toast } from "sonner"
import { describe, expect, it } from "vitest"

import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "./empty"
import { Skeleton } from "./skeleton"
import { Toaster } from "./sonner"

describe("Skeleton", () => {
  it("uses the muted tone, the control radius and stops pulsing on reduced motion", () => {
    const { container } = render(<Skeleton className="h-4 w-40" />)
    const el = container.firstElementChild as HTMLElement
    expect(el).toHaveClass("bg-accent", "rounded-md", "motion-reduce:animate-none")
    expect(el).toHaveAttribute("aria-hidden", "true")
  })
})

describe("Empty", () => {
  it("renders what happened and the next action, without a dashed box", () => {
    const { container } = render(
      <Empty>
        <EmptyHeader>
          <EmptyTitle>Nenhum projeto ainda</EmptyTitle>
          <EmptyDescription>Crie o primeiro projeto para acompanhar entregas.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <button>Criar projeto</button>
        </EmptyContent>
      </Empty>
    )
    expect(screen.getByText("Nenhum projeto ainda")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Criar projeto" })).toBeInTheDocument()
    expect(container.innerHTML).not.toMatch(/border-dashed|rounded-3xl|rounded-xl/)
  })
})

describe("Toaster", () => {
  it("announces toasts in a pt-BR labelled live region", async () => {
    render(<Toaster />)
    act(() => {
      toast.success("Projeto salvo")
    })
    expect(await screen.findByText("Projeto salvo")).toBeInTheDocument()
    expect(screen.getByRole("region", { name: /Notificações/ })).toBeInTheDocument()
  })
})
