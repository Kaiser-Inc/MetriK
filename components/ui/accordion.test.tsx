import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion"

function Example() {
  return (
    <Accordion>
      <AccordionItem value="stacks">
        <AccordionTrigger>Quais stacks são suportadas?</AccordionTrigger>
        <AccordionContent>Python, Node e Rails.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="json">
        <AccordionTrigger>Como gero o JSON?</AccordionTrigger>
        <AccordionContent>Rode make metrics.</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

describe("Accordion", () => {
  it("starts closed and toggles an item on click", async () => {
    const user = userEvent.setup()
    render(<Example />)

    const trigger = screen.getByRole("button", { name: "Quais stacks são suportadas?" })
    expect(trigger).toHaveAttribute("aria-expanded", "false")

    await user.click(trigger)
    expect(trigger).toHaveAttribute("aria-expanded", "true")
    expect(screen.getByText("Python, Node e Rails.")).toBeVisible()

    await user.click(trigger)
    expect(trigger).toHaveAttribute("aria-expanded", "false")
  })

  it.each([["Enter", "{Enter}"], ["Space", " "]])("opens an item with %s", async (_, key) => {
    const user = userEvent.setup()
    render(<Example />)

    await user.tab()
    expect(screen.getByRole("button", { name: "Quais stacks são suportadas?" })).toHaveFocus()
    await user.keyboard(key)
    expect(screen.getByRole("button", { name: "Quais stacks são suportadas?" })).toHaveAttribute(
      "aria-expanded",
      "true"
    )
  })

  it("keeps a paintable focus ring and separates items with a thin line, without a card", () => {
    render(<Example />)
    const trigger = screen.getByRole("button", { name: "Quais stacks são suportadas?" })
    expect(trigger).toHaveClass(
      "outline-hidden",
      "focus-visible:outline-2",
      "focus-visible:outline-solid",
      "focus-visible:outline-ring"
    )
    expect(trigger.className).not.toMatch(/(^|\s)outline-none(\s|$)/)
    const item = trigger.closest("[data-slot='accordion-item']")
    expect(item).toHaveClass("border-b")
    expect(item?.className).not.toMatch(/shadow-|bg-card/)
  })
})
