import { readdirSync, readFileSync, statSync } from "node:fs"
import { join, relative } from "node:path"
import { describe, expect, it } from "vitest"

const root = process.cwd()
const sourceDirs = ["app", "components", "content", "lib", "types"]
// The token file defines the colors; brand logos keep their own.
const allowedColors = new Set(["app/globals.css", "components/icons/stack-icon.tsx"])

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return walk(path)
    return /\.(ts|tsx|css)$/.test(name) && !/\.test\.(ts|tsx)$/.test(name) ? [path] : []
  })
}

const sources = sourceDirs
  .flatMap((dir) => walk(join(root, dir)))
  .map((path) => ({ path: relative(root, path), text: readFileSync(path, "utf-8") }))

function offenders(pattern: RegExp, skip: Set<string> = new Set()) {
  return sources.filter(({ path, text }) => !skip.has(path) && pattern.test(text)).map(({ path }) => path)
}

describe("KaiserInc Base migration", () => {
  it("no longer depends on the old design system", () => {
    const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf-8"))
    const deps = { ...pkg.dependencies, ...pkg.devDependencies }
    expect(Object.keys(deps).filter((name) => name.startsWith("@kaiserinc/"))).toEqual([])
    expect(pkg.scripts.postinstall).toBeUndefined()
  })

  it("does not import the old design system", () => {
    expect(offenders(/@kaiserinc\//)).toEqual([])
  })

  it("uses none of the old token names", () => {
    expect(offenders(/--(bg|fg)-[\w-]+|--brand\b|--brand-[\w-]+|--border-(default|subtle|focus)|--(success|warning|danger|error)-\d{3}/)).toEqual([])
  })

  it("hard-codes no colors outside brand logos", () => {
    expect(offenders(/#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b(?![\w-])/, allowedColors)).toEqual([])
    expect(offenders(/rgba?\(/, allowedColors)).toEqual([])
  })

  it("keeps the dark and light token sets in globals.css", () => {
    const css = readFileSync(join(root, "app/globals.css"), "utf-8")
    expect(css).toContain(":root {")
    expect(css).toContain(".dark {")
    expect(css).not.toMatch(/gradient/)
  })
})
