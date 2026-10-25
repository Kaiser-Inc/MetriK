import { CCChart } from "@/components/charts/cc-chart"
import { ChartSection } from "@/components/charts/chart-section"
import { ChartUnavailable } from "@/components/charts/chart-unavailable"
import { CoverageChart } from "@/components/charts/coverage-chart"
import { LintChart } from "@/components/charts/lint-chart"
import { MIChart } from "@/components/charts/mi-chart"
import { CC_LEGEND, COVERAGE_LEGEND, MI_LEGEND, PYLINT_LEGEND } from "@/lib/chartTheme"
import { isCCAvailable, isCoverageAvailable, isMIAvailable } from "@/lib/metricAvailability"
import { deriveStack, STACK_META, type MetricsReport } from "@/types/metrics"

function CompareCharts({ reports }: { reports: [MetricsReport, MetricsReport] }) {
  const lintLabel = (report: MetricsReport) => STACK_META[deriveStack(report.project)].lintLabel

  return (
    <div className="grid grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-2">
      {reports.map((report, index) => (
        <ChartSection
          key={`cc-${index}`}
          label={`${report.project} · CC`}
          title={`${report.project} · CC`}
          icon={null}
          legend={CC_LEGEND}
          scrollable
        >
          {isCCAvailable(report) ? (
            <CCChart perFile={report.cyclomatic_complexity.summary.per_file ?? {}} />
          ) : (
            <ChartUnavailable message="CC indisponível" minHeight={260} />
          )}
        </ChartSection>
      ))}

      {reports.map((report, index) => (
        <ChartSection
          key={`coverage-${index}`}
          label={`${report.project} · Cobertura`}
          title={`${report.project} · Cobertura`}
          icon={null}
          legend={COVERAGE_LEGEND}
          scrollable
        >
          {isCoverageAvailable(report) ? (
            <CoverageChart byFile={report.test_coverage.by_file ?? {}} />
          ) : (
            <ChartUnavailable message="Cobertura indisponível" minHeight={260} />
          )}
        </ChartSection>
      ))}

      {reports.map((report, index) => (
        <ChartSection
          key={`mi-${index}`}
          label={`${report.project} · MI`}
          title={`${report.project} · MI`}
          icon={null}
          legend={MI_LEGEND}
          scrollable
        >
          {isMIAvailable(report) ? (
            <MIChart perFile={report.maintainability_index.summary.per_file ?? {}} />
          ) : (
            <ChartUnavailable message="MI indisponível" minHeight={260} />
          )}
        </ChartSection>
      ))}

      {reports.map((report, index) => (
        <ChartSection
          key={`lint-${index}`}
          label={`${report.project} · ${lintLabel(report)}`}
          title={`${report.project} · ${lintLabel(report)}`}
          icon={null}
          legend={PYLINT_LEGEND}
        >
          <LintChart
            byType={report.lint.summary.by_type}
            score={report.lint.summary.score}
            lintLabel={lintLabel(report)}
          />
        </ChartSection>
      ))}
    </div>
  )
}

export { CompareCharts }
