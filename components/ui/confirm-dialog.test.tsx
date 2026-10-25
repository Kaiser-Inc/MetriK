import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { Button } from "./button"
import { ConfirmDialog } from "./confirm-dialog"

function setup(props: Partial<React.ComponentProps<typeof ConfirmDialog>> = {}) {
  const onConfirm = props.onConfirm ?? vi.fn()
  render(
    <ConfirmDialog
      trigger={<Button>Excluir projeto</Button>}
      title="Excluir o projeto Levelify?"
      description="O projeto e o histórico somem para todos. Não dá para desfazer."
      confirmLabel="Excluir"
      variant="destructive"
      onConfirm={onConfirm}
      {...props}
    />
  )
  return { onConfirm, user: userEvent.setup() }
}

describe("ConfirmDialog", () => {
  it("opens from the keyboard and shows title and description", async () => {
    const { user } = setup()
    await user.tab()
    await user.keyboard("{Enter}")
    const dialog = await screen.findByRole("alertdialog")
    expect(dialog).toHaveAccessibleName("Excluir o projeto Levelify?")
    expect(dialog).toHaveAccessibleDescription(/Não dá para desfazer/)
  })

  it("cancel closes without confirming, with the pt-BR default label", async () => {
    const { user, onConfirm } = setup()
    await user.click(screen.getByRole("button", { name: "Excluir projeto" }))
    await user.click(await screen.findByRole("button", { name: "Cancelar" }))
    await waitFor(() => expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument())
    expect(onConfirm).not.toHaveBeenCalled()
  })

  it("Escape closes without confirming", async () => {
    const { user, onConfirm } = setup()
    await user.click(screen.getByRole("button", { name: "Excluir projeto" }))
    await screen.findByRole("alertdialog")
    await user.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument())
    expect(onConfirm).not.toHaveBeenCalled()
  })

  it("confirm calls onConfirm, shows loading while it runs, then closes", async () => {
    let finish!: () => void
    const onConfirm = vi.fn(() => new Promise<void>((resolve) => (finish = resolve)))
    const { user } = setup({ onConfirm })
    await user.click(screen.getByRole("button", { name: "Excluir projeto" }))
    const confirm = await screen.findByRole("button", { name: /^Excluir$/ })
    await user.click(confirm)
    expect(onConfirm).toHaveBeenCalledTimes(1)
    expect(confirm).toHaveAttribute("aria-busy", "true")
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeDisabled()
    finish()
    await waitFor(() => expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument())
  })

  it("stays open when onConfirm fails, so the caller can show the error", async () => {
    const onConfirm = vi.fn(() => Promise.reject(new Error("falhou")))
    const { user } = setup({ onConfirm })
    await user.click(screen.getByRole("button", { name: "Excluir projeto" }))
    await user.click(await screen.findByRole("button", { name: /^Excluir$/ }))
    await waitFor(() => expect(screen.getByRole("button", { name: /^Excluir$/ })).not.toHaveAttribute("aria-busy"))
    expect(screen.getByRole("alertdialog")).toBeInTheDocument()
  })

  it("keeps the dialog flat: no blur, no pure black overlay, 720px wide", async () => {
    const { user } = setup()
    await user.click(screen.getByRole("button", { name: "Excluir projeto" }))
    const dialog = await screen.findByRole("alertdialog")
    expect(dialog.className).toMatch(/max-w-\[720px\]/)
    expect(document.body.innerHTML).not.toMatch(/backdrop-blur|bg-black/)
  })

  it("animates with interruptible transitions instead of keyframes", async () => {
    const { user } = setup()
    await user.click(screen.getByRole("button", { name: "Excluir projeto" }))
    const dialog = await screen.findByRole("alertdialog")
    const overlay = document.querySelector('[data-slot="alert-dialog-overlay"]')!

    for (const el of [dialog, overlay]) {
      expect(el.className).not.toMatch(/animate-in|animate-out|fade-in-0|fade-out-0/)
      expect(el).toHaveClass("data-starting-style:opacity-0", "data-ending-style:opacity-0")
    }
    // Mobile: slides up from the bottom edge with the drawer curve.
    expect(dialog).toHaveClass(
      "data-starting-style:[transform:translateY(100%)]",
      "duration-300",
      "ease-drawer",
      "data-ending-style:duration-200"
    )
    // Desktop: fades and scales from 0.96, exits faster.
    expect(dialog).toHaveClass(
      "sm:data-starting-style:[transform:none]",
      "sm:data-starting-style:scale-96",
      "sm:duration-200",
      "sm:ease-out",
      "sm:data-ending-style:duration-150"
    )
  })
})
