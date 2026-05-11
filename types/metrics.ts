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
};
