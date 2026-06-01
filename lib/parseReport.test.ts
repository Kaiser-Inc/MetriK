import { describe, it, expect } from "vitest";
import { migrate } from "@/lib/parseReport";
import {
  isCCAvailable,
  isRuffAvailable,
  isPipAuditAvailable,
  isFlogAvailable,
} from "@/lib/metricAvailability";

/**
 * Hand-built fixtures mirroring the exact shapes emitted by the 5 KaiserInc-Utils
 * producers (no real reports exist yet). Each test feeds raw JSON through
 * migrate() and asserts the canonical output.
 */

function baseReport(): Record<string, unknown> {
  return {
    generated_at: "2026-05-31_120000",
    project: "demo-app",
    cyclomatic_complexity: {
      summary: { average: 2.1, max: 6, min: 1, total_functions: 12, grade: "A", per_file: { "a.py": 2 } },
    },
    maintainability_index: {
      summary: { average: 78.4, min: 60, max: 95, grade: "Alta", per_file: { "a.py": 78 } },
    },
    halstead: {
      summary: { estimated_bugs: 0.12, total_effort: 4200, files_analyzed: 3 },
    },
    test_coverage: {
      percent: 84.2,
      covered_lines: 210,
      missing_lines: 39,
      num_statements: 249,
      by_file: { "a.py": 84.2 },
    },
    lint: { summary: { total_issues: 3, by_type: { convention: 3 }, score_line: "9.1/10", score: 9.1 } },
    security: {
      passed: true,
      output: "",
      thresholds: { max_absolute: "B", max_modules: "B", max_average: "A" },
    },
  };
}

describe("migrate() — valid reports per stack", () => {
  it("accepts a Python report with ruff + pip_audit (passed through, not dropped)", () => {
    const raw = {
      ...baseReport(),
      project: "python-fastapi-boilerplate",
      ruff: { raw: {}, summary: { total_issues: 5, by_code: { E501: 3, F401: 2 }, by_file: { "a.py": 5 } } },
      pip_audit: {
        passed: false,
        total_vulnerabilities: 1,
        vulnerabilities: [
          { package: "requests", version: "2.0.0", id: "GHSA-xxxx", description: "x", fix_versions: ["2.31.0"] },
        ],
      },
    };
    const report = migrate(raw, "py");
    expect(report.ruff?.summary.total_issues).toBe(5);
    expect(report.pip_audit?.total_vulnerabilities).toBe(1);
    expect(isRuffAvailable(report)).toBe(true);
    expect(isPipAuditAvailable(report)).toBe(true);
  });

  it("accepts a Node report with dual coverage (real_coverage / reported_coverage)", () => {
    const raw = {
      ...baseReport(),
      project: "node-fastify-boilerplate",
      test_coverage: {
        ...(baseReport().test_coverage as Record<string, unknown>),
        reported_coverage: 91.0,
        real_coverage: 84.2,
        tests_passed: 40,
        tests_failed: 0,
        tests_total: 40,
      },
    };
    const report = migrate(raw, "node");
    expect(report.test_coverage.real_coverage).toBe(84.2);
    expect(report.test_coverage.reported_coverage).toBe(91.0);
  });

  it("accepts a Rails report with optional flog_score", () => {
    const raw = {
      ...baseReport(),
      project: "ruby-on-rails-monolith",
      flog_score: {
        summary: { average: 12.4, max: 40, min: 2, total_functions: 30, grade: "B", per_file: { "x.rb": 12 } },
      },
    };
    const report = migrate(raw, "rails");
    expect(isFlogAvailable(report)).toBe(true);
    expect(report.flog_score?.summary.grade).toBe("B");
  });
});

describe("migrate() — legacy remaps", () => {
  it("remaps legacy pylint → lint and xenon → security", () => {
    const raw = baseReport();
    raw.pylint = raw.lint;
    raw.xenon = raw.security;
    delete raw.lint;
    delete raw.security;

    const report = migrate(raw, "legacy");
    expect(report.lint.summary.score).toBe(9.1);
    expect(report.security.passed).toBe(true);
  });
});

describe("migrate() — error handling", () => {
  it("throws naming `halstead` when it is missing", () => {
    const raw = baseReport();
    delete raw.halstead;
    expect(() => migrate(raw, "broken")).toThrow(/halstead/);
  });

  it("does NOT throw on unknown/extra keys", () => {
    const raw = { ...baseReport(), some_future_metric: { foo: "bar" } };
    expect(() => migrate(raw, "extra")).not.toThrow();
  });

  it("normalizes empty {} summaries instead of crashing availability guards", () => {
    const raw = { ...baseReport(), cyclomatic_complexity: {} };
    const report = migrate(raw, "empty");
    expect(() => isCCAvailable(report)).not.toThrow();
    expect(isCCAvailable(report)).toBe(false);
  });
});
