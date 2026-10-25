import { render, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { HelpSheet } from "@/components/tutorial/help-sheet"
import { TutorialContent } from "@/components/tutorial/tutorial-content"

describe("HelpSheet", () => {
  it("opens a named dialog with the same tutorial shown on the landing page", async () => {
    const user = userEvent.setup()
    render(<HelpSheet />)

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: "Como usar" }))

    const dialog = await screen.findByRole("dialog", { name: "Como usar o MetriK" })
    expect(within(dialog).getByRole("tab", { name: "Node Fastify" })).toBeInTheDocument()
    expect(within(dialog).getByRole("region", { name: "Métricas" })).toBeInTheDocument()
  })

  it("renders exactly the content of TutorialContent", async () => {
    const user = userEvent.setup()
    const { container } = render(<TutorialContent />)
    const expected = container.textContent
    document.body.innerHTML = ""

    render(<HelpSheet />)
    await user.click(screen.getByRole("button", { name: "Como usar" }))
    const dialog = await screen.findByRole("dialog")
    expect(dialog.textContent).toContain(expected)
  })

  it("closes with Escape", async () => {
    const user = userEvent.setup()
    render(<HelpSheet />)
    await user.click(screen.getByRole("button", { name: "Como usar" }))
    await screen.findByRole("dialog")

    await user.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument())
  })
})

