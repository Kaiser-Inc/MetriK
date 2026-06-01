import type { MetricsReport } from "@/types/metrics";

export function isCCAvailable(report: MetricsReport): boolean {
  const cc = report.cyclomatic_complexity?.summary;
  if (!cc) return false;
  return (cc.total_functions ?? 0) > 0 || Object.keys(cc.per_file ?? {}).length > 0;
}

export function isMIAvailable(report: MetricsReport): boolean {
  const mi = report.maintainability_index?.summary;
  if (!mi) return false;
  return mi.grade !== "N/A" && ((mi.average ?? 0) > 0 || Object.keys(mi.per_file ?? {}).length > 0);
}

export function isHalsteadAvailable(report: MetricsReport): boolean {
  return (report.halstead?.summary?.files_analyzed ?? 0) > 0;
}

export function isCoverageAvailable(report: MetricsReport): boolean {
  const cov = report.test_coverage;
  if (!cov) return false;
  return (cov.num_statements ?? 0) > 0 || Object.keys(cov.by_file ?? {}).length > 0;
}

/** Reads from canonical `report.lint.summary.score` (was pylint). */
export function isLintAvailable(report: MetricsReport): boolean {
  return report.lint.summary.score !== null;
}

/** True if security info is present (always true when migrated). */
export function isSecurityAvailable(report: MetricsReport): boolean {
  return report.security.passed !== undefined;
}

/** True if flog_score is present (Rails-only). */
export function isFlogAvailable(report: MetricsReport): boolean {
  return report.flog_score !== undefined;
}

/** True if test count data is present and non-zero. */
export function isTestsAvailable(report: MetricsReport): boolean {
  const total = report.test_coverage?.tests_total;
  return total !== undefined && total > 0;
}

/** True if Python Ruff lint data is present (Python-only). */
export function isRuffAvailable(report: MetricsReport): boolean {
  return report.ruff?.summary?.total_issues !== undefined;
}

/** True if Python pip-audit data is present (Python-only). */
export function isPipAuditAvailable(report: MetricsReport): boolean {
  return report.pip_audit?.passed !== undefined;
}
