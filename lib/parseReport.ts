import type { MetricsReport } from "@/types/metrics";

// Track slugs already warned to avoid log spam
const _warned = new Set<string>();

/**
 * Radon/coverage tooling can emit an empty `{}` (or a summary-less object) when
 * a sub-tool fails. Downstream availability guards index `summary.per_file` /
 * `summary.files_analyzed`, so coerce empties into a safe, "unavailable" shape
 * instead of letting the UI crash on `Object.keys(undefined)`.
 */
function normalizeCC(raw: unknown): MetricsReport["cyclomatic_complexity"] {
  const s = (raw as { summary?: Record<string, unknown> })?.summary;
  if (s && typeof s === "object" && "per_file" in s) {
    return raw as MetricsReport["cyclomatic_complexity"];
  }
  return { summary: { average: 0, max: 0, min: 0, total_functions: 0, grade: "N/A", per_file: {} } };
}

function normalizeMI(raw: unknown): MetricsReport["maintainability_index"] {
  const s = (raw as { summary?: Record<string, unknown> })?.summary;
  if (s && typeof s === "object" && "per_file" in s) {
    return raw as MetricsReport["maintainability_index"];
  }
  return { summary: { average: 0, min: 0, max: 0, grade: "N/A", per_file: {} } };
}

function normalizeHalstead(raw: unknown): MetricsReport["halstead"] {
  const s = (raw as { summary?: Record<string, unknown> })?.summary;
  if (s && typeof s === "object" && "files_analyzed" in s) {
    return raw as MetricsReport["halstead"];
  }
  return { summary: { estimated_bugs: 0, total_effort: 0, files_analyzed: 0 } };
}

/**
 * migrate() accepts raw JSON (unknown), maps legacy field names to canonical
 * ones, and returns a fully-typed MetricsReport.
 *
 * Legacy renames handled transparently:
 *   pylint  → lint
 *   xenon   → security
 */
export function migrate(raw: unknown, slug = "<unknown>"): MetricsReport {
  if (typeof raw !== "object" || raw === null) {
    throw new Error(`[parseReport] Invalid report for slug "${slug}": not an object`);
  }

  const r = raw as Record<string, unknown>;

  // -- Required top-level fields --
  if (typeof r.generated_at !== "string") {
    throw new Error(`[parseReport] Missing required field "generated_at" in slug "${slug}"`);
  }
  if (typeof r.project !== "string") {
    throw new Error(`[parseReport] Missing required field "project" in slug "${slug}"`);
  }
  if (typeof r.cyclomatic_complexity !== "object" || r.cyclomatic_complexity === null) {
    throw new Error(`[parseReport] Missing required field "cyclomatic_complexity" in slug "${slug}"`);
  }
  if (typeof r.maintainability_index !== "object" || r.maintainability_index === null) {
    throw new Error(`[parseReport] Missing required field "maintainability_index" in slug "${slug}"`);
  }
  if (typeof r.halstead !== "object" || r.halstead === null) {
    throw new Error(`[parseReport] Missing required field "halstead" in slug "${slug}"`);
  }
  if (typeof r.test_coverage !== "object" || r.test_coverage === null) {
    throw new Error(`[parseReport] Missing required field "test_coverage" in slug "${slug}"`);
  }

  // -- Migration: pylint → lint --
  let lint = r.lint;
  if (lint === undefined && r.pylint !== undefined) {
    if (!_warned.has(`${slug}:pylint`)) {
      console.warn(
        `[parseReport] slug "${slug}": legacy "pylint" field migrated to "lint". ` +
        `Update the JSON source to suppress this warning.`
      );
      _warned.add(`${slug}:pylint`);
    }
    lint = r.pylint;
  }
  if (typeof lint !== "object" || lint === null) {
    throw new Error(`[parseReport] Missing required field "lint" (or legacy "pylint") in slug "${slug}"`);
  }

  // -- Migration: xenon → security --
  let security = r.security;
  if (security === undefined && r.xenon !== undefined) {
    if (!_warned.has(`${slug}:xenon`)) {
      console.warn(
        `[parseReport] slug "${slug}": legacy "xenon" field migrated to "security". ` +
        `Update the JSON source to suppress this warning.`
      );
      _warned.add(`${slug}:xenon`);
    }
    security = r.xenon;
  }
  if (typeof security !== "object" || security === null) {
    throw new Error(`[parseReport] Missing required field "security" (or legacy "xenon") in slug "${slug}"`);
  }

  return {
    generated_at: r.generated_at as string,
    project: r.project as string,
    cyclomatic_complexity: normalizeCC(r.cyclomatic_complexity),
    maintainability_index: normalizeMI(r.maintainability_index),
    halstead: normalizeHalstead(r.halstead),
    test_coverage: r.test_coverage as MetricsReport["test_coverage"],
    lint: lint as MetricsReport["lint"],
    security: security as MetricsReport["security"],
    // Optional, stack-specific extras — passed through untouched, never dropped.
    ...(r.flog_score !== undefined ? { flog_score: r.flog_score as MetricsReport["flog_score"] } : {}),
    ...(r.ruff !== undefined ? { ruff: r.ruff as MetricsReport["ruff"] } : {}),
    ...(r.pip_audit !== undefined ? { pip_audit: r.pip_audit as MetricsReport["pip_audit"] } : {}),
  };
}
