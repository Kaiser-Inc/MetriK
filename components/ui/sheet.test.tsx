import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { Button } from "./button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet"

function SheetExample({ side }: { side?: "right" | "bottom" }) {
  return (
    <Sheet side={side}>
      <SheetTrigger render={<Button />}>Editar projeto</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Editar projeto</SheetTitle>
          <SheetDescription>As mudanças valem para todo o time.</SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <SheetClose render={<Button variant="outline" />}>Cancelar</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

async function open(side?: "right" | "bottom") {
  const user = userEvent.setup()
  render(<SheetExample side={side} />)
  await user.click(screen.getByRole("button", { name: "Editar projeto" }))
  const dialog = await screen.findByRole("dialog")
  return { user, dialog }
}

describe("Sheet", () => {
  it("opens as a named, described dialog on the right by default", async () => {
    const { dialog } = await open()
    expect(dialog).toHaveAccessibleName("Editar projeto")
    expect(dialog).toHaveAccessibleDescription("As mudanças valem para todo o time.")
    expect(dialog).toHaveAttribute("data-side", "right")
    expect(dialog).toHaveClass("w-[calc(400px+3rem)]", "max-w-screen")
    expect(document.querySelector('[data-slot="sheet-handle"]')).toBeNull()
  })

  it("closes with Escape", async () => {
    const { user } = await open()
    await user.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument())
  })

  it("closes with the pt-BR close button", async () => {
    const { user } = await open()
    await user.click(screen.getByRole("button", { name: "Fechar" }))
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument())
  })

  it("closes from a SheetClose in the footer", async () => {
    const { user } = await open()
    await user.click(screen.getByRole("button", { name: "Cancelar" }))
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument())
  })

  it("renders a bottom sheet with a drag handle capped at 80vh", async () => {
    const { dialog } = await open("bottom")
    expect(dialog).toHaveAttribute("data-side", "bottom")
    expect(dialog).toHaveClass("max-h-[calc(80vh+3rem)]")
    expect(document.querySelector('[data-slot="sheet-handle"]')).toBeInTheDocument()
  })

  it("slides with the drawer curve, follows the finger and never exits in 0s", async () => {
    const { dialog } = await open()
    expect(dialog).toHaveClass(
      "transition-transform",
      "duration-300",
      "ease-drawer",
      "data-swiping:duration-0",
      "data-ending-style:duration-[calc(min(var(--drawer-swipe-strength,1),0.75)*400ms)]"
    )
  })

  it.each([["right", "dark:border-l"], ["bottom", "dark:border-t"]] as const)(
    "follows the overlay surface rule on the %s side: shadow in light, border in dark",
    async (side, border) => {
      const { dialog } = await open(side)
      expect(dialog).toHaveClass("shadow-[var(--shadow-overlay)]", border, "dark:border-border")
      expect(dialog.className).not.toMatch(/(^|\s)border-[lt](\s|$)|dark:shadow-none/)
    }
  )
})
