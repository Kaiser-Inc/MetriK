import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

import { buildFileDiffs, buildSummaryRows } from "@/lib/compare"
import { migrate } from "@/lib/parseReport"

function load(slug: string) {
  const raw = JSON.parse(readFileSync(join(process.cwd(), "e2e", "fixtures", `${slug}.json`), "utf-8"))
  return migrate(raw, slug)
}

const python = load("report_2026-05-11_143026")
const node = load("report_2026-05-14_0556")
const rails = load("report_2026-05-14_025644")

describe("buildSummaryRows", () => {
  it("compares the five headline metrics in a fixed order with the right direction", () => {
    const rows = buildSummaryRows(python, node)
    expect(rows.map((row) => row.title)).toEqual([
      "CC Médio",
      "MI Médio",
      "Cobertura",
      "Linter Score",
      "Bugs Estimados",
    ])
    expect(rows.map((row) => row.higherIsBetter)).toEqual([false, true, true, true, false])
  })

  it("carries the values of both reports", () => {
    const [cc, , coverage, lint] = buildSummaryRows(python, node)
    expect(cc.a).toBeCloseTo(python.cyclomatic_complexity.summary.average)
    expect(cc.b).toBeCloseTo(node.cyclomatic_complexity.summary.average)
    expect(coverage).toMatchObject({ a: 83.5, b: 88, unit: "%" })
    expect(lint).toMatchObject({ a: 9.2, b: 9.6, unit: "/10" })
  })

  it("uses null where a stack has no such metric instead of zero", () => {
    const rows = buildSummaryRows(node, rails)
    const mi = rows.find((row) => row.title === "MI Médio")!
    const halstead = rows.find((row) => row.title === "Bugs Estimados")!
    expect(mi.a).not.toBeNull()
    expect(mi.b).toBeNull()
    expect(halstead.b).toBeNull()
  })
})

describe("buildFileDiffs", () => {
  it("lists every file of either report with its short name", () => {
    const diffs = buildFileDiffs(python, node)
    const names = diffs.map((diff) => diff.fname)
    expect(names).toContain("main.py")
    expect(names).toContain("app.ts")
    expect(diffs).toHaveLength(6)
  })

  it("leaves values missing on one side as null", () => {
    const diff = buildFileDiffs(python, node).find((d) => d.path === "app/main.py")!
    expect(diff.ccA).toBe(3)
    expect(diff.ccB).toBeNull()
    expect(diff.covA).toBe(95)
  })

  it("puts the files with the biggest complexity change first", () => {
    const older = structuredClone(node)
    older.cyclomatic_complexity.summary.per_file = { "src/a.ts": 2, "src/b.ts": 3 }
    const newer = structuredClone(node)
    newer.cyclomatic_complexity.summary.per_file = { "src/a.ts": 9, "src/b.ts": 4 }
    older.test_coverage.by_file = {}
    newer.test_coverage.by_file = {}

    const diffs = buildFileDiffs(older, newer)
    expect(diffs.map((diff) => diff.path)).toEqual(["src/a.ts", "src/b.ts"])
  })
})
