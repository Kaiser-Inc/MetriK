import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { CompareBar } from "@/components/dashboard/compare-bar"

const push = vi.fn()
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }))

beforeEach(() => push.mockClear())

describe("CompareBar", () => {
  it("asks for one more report while only one is selected and blocks the comparison", () => {
    render(<CompareBar slugA="a" slugB={null} onClear={vi.fn()} />)
    expect(screen.getByText("1 selecionado, escolha mais 1")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Ver comparativo" })).toBeDisabled()
  })

  it("opens the comparison once two reports are selected", async () => {
    const user = userEvent.setup()
    render(<CompareBar slugA="a" slugB="b" onClear={vi.fn()} />)
    expect(screen.getByText("2 selecionados")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Ver comparativo" }))
    expect(push).toHaveBeenCalledWith("/compare?a=a&b=b")
  })

  it("encodes slugs that contain URL-reserved characters", async () => {
    const user = userEvent.setup()
    render(<CompareBar slugA="report #1" slugB="a&b" onClear={vi.fn()} />)

    await user.click(screen.getByRole("button", { name: "Ver comparativo" }))
    expect(push).toHaveBeenCalledWith("/compare?a=report%20%231&b=a%26b")
  })

  it("clears the selection", async () => {
    const user = userEvent.setup()
    const onClear = vi.fn()
    render(<CompareBar slugA="a" slugB="b" onClear={onClear} />)

    await user.click(screen.getByRole("button", { name: "Limpar seleção" }))
    expect(onClear).toHaveBeenCalled()
  })
})
