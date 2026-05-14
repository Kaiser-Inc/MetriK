export type Stack = 'python-fastapi' | 'node-fastify' | 'ruby-on-rails';

export const STACK_META: Record<Stack, {
  label: string;
  color: string;
  lintLabel: string;
  secLabel: string;
}> = {
  'python-fastapi': { label: 'Python', color: '#3776AB', lintLabel: 'Pylint',   secLabel: 'Xenon' },
  'node-fastify':   { label: 'Node',   color: '#339933', lintLabel: 'Biome',    secLabel: 'npm audit' },
  'ruby-on-rails':  { label: 'Ruby',   color: '#CC342D', lintLabel: 'RuboCop',  secLabel: 'bundler-audit' },
};

export function deriveStack(project: string): Stack {
  if (project === 'node-fastify') return 'node-fastify';
  if (project === 'ruby-on-rails') return 'ruby-on-rails';
  return 'python-fastapi';
}

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
  };
  pylint: {
    summary: {
      total_issues: number;
      by_type: Record<string, number>;
      score_line: string;
      score: number | null;
    };
  };
  xenon: {
    passed: boolean;
    output: string;
    thresholds: {
      max_absolute: string;
      max_modules: string;
      max_average: string;
    };
  };
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
  xenon_passed?: boolean;
  rawJson?: MetricsReport;
};
