export type Stack = 'python-fastapi' | 'node-fastify' | 'ruby-on-rails' | 'next-saas' | 'expo-mobile' | 'unknown';

export const STACK_META: Record<Stack, {
  label: string;
  color: string;
  lintLabel: string;
  secLabel: string;
}> = {
  'python-fastapi': { label: 'Python',      color: '#3776AB', lintLabel: 'Pylint',   secLabel: 'Xenon' },
  'node-fastify':   { label: 'Node',        color: '#339933', lintLabel: 'Biome',    secLabel: 'pnpm audit' },
  'ruby-on-rails':  { label: 'Ruby',        color: '#CC342D', lintLabel: 'RuboCop',  secLabel: 'bundler-audit' },
  'next-saas':      { label: 'Next.js',     color: '#0070F3', lintLabel: 'Biome',    secLabel: 'pnpm audit' },
  'expo-mobile':    { label: 'Expo/RN',     color: '#4630EB', lintLabel: 'Biome',    secLabel: 'pnpm audit' },
  'unknown':        { label: 'Desconhecido', color: '#6B7280', lintLabel: 'Lint',    secLabel: 'Security' },
};

/**
 * Maps a producer `project` string to a Stack via substring matching.
 * Producer project names are not canonical (e.g. "python-fastapi-boilerplate",
 * "legacy-monolith-app"), so exact-match would misclassify. Order matters:
 * the more specific Node variants (expo/next/fastify) are checked before the
 * generic "node" fallback.
 */
export function deriveStack(project: string): Stack {
  const p = (project ?? '').toLowerCase();
  if (p.includes('expo')) return 'expo-mobile';
  if (p.includes('next')) return 'next-saas';
  if (p.includes('fastify')) return 'node-fastify';
  if (p.includes('rails') || p.includes('ruby')) return 'ruby-on-rails';
  if (p.includes('python') || p.includes('fastapi')) return 'python-fastapi';
  if (p.includes('node')) return 'node-fastify';
  return 'unknown';
}

// Exported for reuse in parseReport.ts and components
export type LintSummary = {
  total_issues: number;
  by_type: Record<string, number>;
  score_line: string;
  score: number | null;
};

export type SecurityInfo = {
  passed: boolean;
  output: string;
  thresholds: {
    max_absolute: string;
    max_modules: string;
    max_average: string;
  };
};

/** Python `ruff` lint summary — distinct shape from LintSummary. */
export type RuffSummary = {
  total_issues: number;
  by_code: Record<string, number>;
  by_file: Record<string, number>;
};

/** Python `pip_audit` CVE audit (drives the "Segurança" card for Python). */
export type PipAuditVuln = {
  package: string | null;
  version: string | null;
  id: string | null;
  description: string;
  fix_versions: string[];
};

export type PipAuditInfo = {
  passed: boolean;
  total_vulnerabilities: number;
  vulnerabilities: PipAuditVuln[];
  /** Present when pip-audit itself failed to run. */
  error?: string;
};

export type MetricsReport = {
  generated_at: string;
  project: string;
  cyclomatic_complexity: {
    summary: {
      average: number;
      max: number;
      min: number;
      total_functions: number;
      grade: string;
      per_file: Record<string, number>;
    };
  };
  maintainability_index: {
    summary: {
      average: number;
      min: number;
      max: number;
      grade: string;
      per_file: Record<string, number>;
    };
  };
  halstead: {
    summary: {
      estimated_bugs: number;
      total_effort: number;
      files_analyzed: number;
    };
  };
  test_coverage: {
    percent: number;
    covered_lines: number;
    missing_lines: number;
    num_statements: number;
    by_file: Record<string, number>;
    // Optional extended fields (present in newer reports)
    tests_passed?: number;
    tests_failed?: number;
    tests_total?: number;
    reported_coverage?: number;
    real_coverage?: number;
    excluded_statements_estimate?: number;
    excluded_files?: string[];
    excluded_note?: string;
  };
  // Renamed from `pylint` — migrate() handles legacy JSON transparently
  lint: {
    summary: LintSummary;
  };
  // Renamed from `xenon` — migrate() handles legacy JSON transparently
  security: SecurityInfo;
  // Rails-only, optional
  flog_score?: {
    summary: {
      average: number;
      max: number;
      min: number;
      total_functions: number;
      grade: string;
      per_file: Record<string, number>;
    };
  };
  // Python-only, optional: Ruff lint (separate from `lint`/Pylint)
  ruff?: {
    raw?: unknown;
    summary: RuffSummary;
  };
  // Python-only, optional: pip-audit CVE scan (drives Segurança card)
  pip_audit?: PipAuditInfo;
};

/** A single report that failed to load/parse, surfaced to the UI. */
export type ReportLoadError = {
  file: string;
  reason: string;
};

/** Shape returned by the list route / file readers on partial success. */
export type ReportListResponse = {
  items: ReportListItem[];
  errors: ReportLoadError[];
};

export type ReportListItem = {
  slug: string;
  generated_at: string;
  project: string;
  stack: Stack;
};

export type EnrichedItem = ReportListItem & {
  cc_grade?: string;
  coverage_percent?: number;
  security_passed?: boolean;
  rawJson?: MetricsReport;
};
