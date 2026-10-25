import { toPng } from "html-to-image"

// Elements marked with this attribute (the export button itself) stay out of the image.
export const EXPORT_IGNORE_ATTRIBUTE = "data-export-ignore"

export function slugifyFilename(name: string): string {
  const slug = name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
  return slug || "grafico"
}

// Renders the element at 2x on the current page background and downloads it as a PNG.
export async function exportElementAsPng(element: HTMLElement, name: string): Promise<void> {
  const dataUrl = await toPng(element, {
    pixelRatio: 2,
    cacheBust: true,
    backgroundColor: getComputedStyle(document.body).backgroundColor,
    filter: (node) => !(node instanceof HTMLElement && node.hasAttribute(EXPORT_IGNORE_ATTRIBUTE)),
  })

  const link = document.createElement("a")
  link.download = `${slugifyFilename(name)}.png`
  link.href = dataUrl
  link.click()
}
