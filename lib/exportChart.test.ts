import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const toPng = vi.fn()
vi.mock("html-to-image", () => ({ toPng: (...args: unknown[]) => toPng(...args) }))

import { exportElementAsPng, slugifyFilename } from "@/lib/exportChart"

describe("slugifyFilename", () => {
  it("makes a safe, readable file name", () => {
    expect(slugifyFilename("python-fastapi-boilerplate · Cobertura de testes")).toBe(
      "python-fastapi-boilerplate-cobertura-de-testes",
    )
    expect(slugifyFilename("  Índice de manutenibilidade  ")).toBe("indice-de-manutenibilidade")
  })

  it("falls back to a default when nothing usable is left", () => {
    expect(slugifyFilename("///")).toBe("grafico")
  })
})

describe("exportElementAsPng", () => {
  let click: ReturnType<typeof vi.fn>
  let anchor: HTMLAnchorElement

  beforeEach(() => {
    toPng.mockReset().mockResolvedValue("data:image/png;base64,AAAA")
    click = vi.fn()
    anchor = document.createElement("a")
    anchor.click = click
    vi.spyOn(document, "createElement").mockImplementation((tag: string) =>
      tag === "a" ? anchor : Document.prototype.createElement.call(document, tag),
    )
    document.documentElement.style.setProperty("--background", "rgb(24, 24, 27)")
    document.body.style.backgroundColor = "rgb(24, 24, 27)"
  })

  afterEach(() => vi.restoreAllMocks())

  it("renders the element at 2x on the page background and downloads it", async () => {
    const element = document.createElement("div")
    await exportElementAsPng(element, "Cobertura de testes")

    expect(toPng).toHaveBeenCalledTimes(1)
    const [target, options] = toPng.mock.calls[0]
    expect(target).toBe(element)
    expect(options).toMatchObject({ pixelRatio: 2, backgroundColor: "rgb(24, 24, 27)", cacheBust: true })
    expect(anchor.download).toBe("cobertura-de-testes.png")
    expect(anchor.href).toBe("data:image/png;base64,AAAA")
    expect(click).toHaveBeenCalledTimes(1)
  })

  it("leaves out anything marked as export-ignore, such as the export button", async () => {
    const element = document.createElement("div")
    await exportElementAsPng(element, "x")
    const { filter } = toPng.mock.calls[0][1]

    const button = document.createElement("button")
    button.setAttribute("data-export-ignore", "")
    expect(filter(button)).toBe(false)
    expect(filter(document.createElement("div"))).toBe(true)
    expect(filter(document.createTextNode("text"))).toBe(true)
  })

  it("lets the caller handle a rendering failure", async () => {
    toPng.mockRejectedValue(new Error("render failed"))
    await expect(exportElementAsPng(document.createElement("div"), "x")).rejects.toThrow("render failed")
    expect(click).not.toHaveBeenCalled()
  })
})
