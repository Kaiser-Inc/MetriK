import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it, vi } from "vitest"

import { FilePicker } from "@/components/dashboard/file-picker"

function fixture(name: string) {
  const text = readFileSync(join(process.cwd(), "e2e", "fixtures", name), "utf-8")
  return new File([text], name, { type: "application/json" })
}

describe("FilePicker", () => {
  it("offers the folder and the file pickers", () => {
    render(<FilePicker onLoad={vi.fn()} />)
    expect(screen.getByRole("button", { name: "Selecionar pasta" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Selecionar arquivo(s)" })).toBeInTheDocument()
  })

  it("loads the selected .json files and reports the result", async () => {
    const user = userEvent.setup()
    const onLoad = vi.fn()
    const { container } = render(<FilePicker onLoad={onLoad} />)

    const input = container.querySelector<HTMLInputElement>("input[type=file]:not([webkitdirectory])")!
    await user.upload(input, [fixture("report_2026-05-14_0556.json"), fixture("report_2026-05-11_143026.json")])

    await waitFor(() => expect(onLoad).toHaveBeenCalled())
    const result = onLoad.mock.calls[0][0]
    expect(result.items.map((item: { slug: string }) => item.slug)).toEqual([
      "report_2026-05-14_0556",
      "report_2026-05-11_143026",
    ])
    expect(result.errors).toEqual([])
    expect(await screen.findByText(/2 relatórios carregados/)).toBeInTheDocument()
  })

  it("reports a file that is not a valid report instead of dropping it", async () => {
    const user = userEvent.setup()
    const onLoad = vi.fn()
    const { container } = render(<FilePicker onLoad={onLoad} />)

    const input = container.querySelector<HTMLInputElement>("input[type=file]:not([webkitdirectory])")!
    await user.upload(input, new File(["{}"], "broken.json", { type: "application/json" }))

    await waitFor(() => expect(onLoad).toHaveBeenCalled())
    expect(onLoad.mock.calls[0][0].errors[0].file).toBe("broken.json")
  })
})
