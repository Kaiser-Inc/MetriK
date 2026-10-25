import { useState } from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select"

function SelectExample() {
  const [value, setValue] = useState<string | null>(null)

  return (
    <>
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger aria-label="Project status">
          <SelectValue placeholder="Choose a status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="paused">Paused</SelectItem>
        </SelectContent>
      </Select>
      <output>{value ?? "none"}</output>
    </>
  )
}

describe("Select", () => {
  it("opens and selects an item from the keyboard", async () => {
    const user = userEvent.setup()
    render(<SelectExample />)

    await user.tab()
    await user.keyboard("{Enter}")
    expect(await screen.findByRole("listbox")).toBeInTheDocument()
    await user.keyboard("{ArrowDown}{Enter}")

    expect(
      screen.getByText("paused", { selector: "output" })
    ).toBeInTheDocument()
  })

  it("uses the filled 32px trigger without opacity or control shadows", () => {
    render(<SelectExample />)

    const trigger = screen.getByRole("combobox", { name: "Project status" })
    expect(trigger).toHaveClass(
      "h-control",
      "rounded-md",
      "bg-input/50",
      "hover:bg-input/80",
      "focus-visible:outline-2"
    )
    expect(trigger.className).not.toMatch(/opacity-|shadow-/)
    expect(trigger.querySelector("svg")).toHaveAttribute("stroke-width", "1.75")
  })

  it("fades when aligned to the trigger and scales from the trigger otherwise", async () => {
    const user = userEvent.setup()
    render(
      <Select items={[{ value: "active", label: "Ativo" }]} defaultValue="active">
        <SelectTrigger aria-label="Status">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="active">Ativo</SelectItem>
        </SelectContent>
      </Select>
    )
    await user.click(screen.getByRole("combobox", { name: "Status" }))
    const popup = document.querySelector('[data-slot="select-content"]')!

    expect(popup.className).not.toMatch(/animate-in|animate-out|animate-none|fade-in-0/)
    expect(popup).toHaveClass(
      "origin-(--transform-origin)",
      "transition-[opacity,scale]",
      "duration-150",
      "ease-out",
      "data-starting-style:opacity-0",
      "data-ending-style:opacity-0",
      "data-starting-style:scale-96",
      "data-ending-style:scale-96",
      "data-[side=none]:duration-[120ms]",
      "data-[side=none]:data-starting-style:scale-100",
      "data-[side=none]:data-ending-style:scale-100"
    )
  })

  it("opens below the trigger by default instead of over it", async () => {
    const user = userEvent.setup()
    render(
      <Select items={[{ value: "active", label: "Ativo" }]} defaultValue="active">
        <SelectTrigger aria-label="Status">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="active">Ativo</SelectItem>
        </SelectContent>
      </Select>
    )
    await user.click(screen.getByRole("combobox", { name: "Status" }))
    const popup = document.querySelector('[data-slot="select-content"]')!
    expect(popup).toHaveAttribute("data-align-trigger", "false")
  })

  it("lines item text and the check up with the trigger's text and chevron", async () => {
    const user = userEvent.setup()
    render(
      <Select items={[{ value: "active", label: "Ativo" }]} defaultValue="active">
        <SelectTrigger aria-label="Status">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="active">Ativo</SelectItem>
        </SelectContent>
      </Select>
    )
    expect(screen.getByRole("combobox", { name: "Status" })).toHaveClass("px-3")
    await user.click(screen.getByRole("combobox", { name: "Status" }))
    const item = await screen.findByRole("option", { name: "Ativo" })
    expect(item).toHaveClass("pl-3", "pr-9")
    expect(item.querySelector("span.absolute")).toHaveClass("right-3")
  })
})

describe("Select value label", () => {
  it("shows the item label in the trigger when the items map is given", () => {
    render(
      <Select
        defaultValue="paused"
        items={[
          { value: "active", label: "Ativo" },
          { value: "paused", label: "Pausado" },
        ]}
      >
        <SelectTrigger aria-label="Status do projeto">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="active">Ativo</SelectItem>
          <SelectItem value="paused">Pausado</SelectItem>
        </SelectContent>
      </Select>
    )
    expect(screen.getByRole("combobox", { name: "Status do projeto" })).toHaveTextContent("Pausado")
    expect(screen.getByRole("combobox", { name: "Status do projeto" })).not.toHaveTextContent("paused")
  })
})
