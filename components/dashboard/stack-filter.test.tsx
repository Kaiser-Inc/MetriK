import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { StackFilter } from "@/components/dashboard/stack-filter"

describe("StackFilter", () => {
  it("offers Todas and one button per stack", () => {
    render(<StackFilter value="all" onChange={vi.fn()} />)
    for (const name of ["Todas", "Python", "Node", "Ruby", "Next.js", "Expo/RN"]) {
      expect(screen.getByRole("button", { name })).toBeInTheDocument()
    }
  })

  it("marks the active filter with aria-pressed", () => {
    render(<StackFilter value="node-fastify" onChange={vi.fn()} />)
    expect(screen.getByRole("button", { name: "Node" })).toHaveAttribute("aria-pressed", "true")
    expect(screen.getByRole("button", { name: "Todas" })).toHaveAttribute("aria-pressed", "false")
  })

  it("reports the chosen stack", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<StackFilter value="all" onChange={onChange} />)

    await user.click(screen.getByRole("button", { name: "Ruby" }))
    expect(onChange).toHaveBeenCalledWith("ruby-on-rails")
    await user.click(screen.getByRole("button", { name: "Todas" }))
    expect(onChange).toHaveBeenCalledWith("all")
  })
})
