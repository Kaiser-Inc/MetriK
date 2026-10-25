import { describe, expect, it } from "vitest"

import * as theme from "@/lib/chartTheme"

const hex = /#[0-9a-f]{3,8}\b/i
const legacyToken = /--(success|warning|danger|brand|fg|bg|border)-(\d|subtle|default|elevated|surface|base)/

describe("chartTheme", () => {
  it("is built only from KaiserInc Base tokens, with no hard-coded colors", () => {
    const serialized = JSON.stringify(theme)
    expect(serialized).not.toMatch(hex)
    expect(serialized).not.toMatch(legacyToken)
    expect(serialized).not.toMatch(/rgba?\(/)
  })

  it("keeps the semantic scale for complexity, maintainability and coverage", () => {
    expect(theme.ccColor(3)).toBe("var(--success)")
    expect(theme.ccColor(8)).toBe("var(--warning)")
    expect(theme.ccColor(14)).toBe("var(--destructive)")
    expect(theme.miColor(40)).toBe("var(--success)")
    expect(theme.miColor(15)).toBe("var(--warning)")
    expect(theme.miColor(4)).toBe("var(--destructive)")
    expect(theme.coverageColor(90)).toBe("var(--success)")
    expect(theme.coverageColor(60)).toBe("var(--warning)")
    expect(theme.coverageColor(10)).toBe("var(--destructive)")
  })

  it("gives every lint category in the legend a color from the chart theme", () => {
    const colors = theme.PYLINT_LEGEND.map((item) => item.color)
    expect(new Set(colors).size).toBe(colors.length)
    for (const type of ["convention", "refactor", "warning", "error", "fatal"]) {
      expect(theme.PYLINT_TYPE_COLORS[type]).toBeDefined()
    }
  })
})
