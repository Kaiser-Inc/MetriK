import type { MetricsReport } from "@/types/metrics";

export function isCCAvailable(report: MetricsReport): boolean {
  const cc = report.cyclomatic_complexity.summary;
  return cc.total_functions > 0 || Object.keys(cc.per_file).length > 0;
}

export function isMIAvailable(report: MetricsReport): boolean {
  const mi = report.maintainability_index.summary;
  return mi.grade !== "N/A" && (mi.average > 0 || Object.keys(mi.per_file).length > 0);
}

export function isHalsteadAvailable(report: MetricsReport): boolean {
  return report.halstead.summary.files_analyzed > 0;
}

export function isCoverageAvailable(report: MetricsReport): boolean {
  const cov = report.test_coverage;
  return cov.num_statements > 0 || Object.keys(cov.by_file).length > 0;
}

export function isLintAvailable(report: MetricsReport): boolean {
  return report.pylint.summary.score !== null;
}
