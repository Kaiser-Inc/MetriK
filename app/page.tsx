import { promises as fs } from "fs";
import path from "path";
import { parseMetricsDate } from "@/lib/formatDate";
import { HomeContent } from "@/components/HomeContent";
import type { EnrichedItem, ReportLoadError } from "@/types/metrics";
import { deriveStack } from "@/types/metrics";
import { migrate } from "@/lib/parseReport";

type GetReportsResult = {
  items: EnrichedItem[];
  loadErrors: ReportLoadError[];
  error?: string;
};

async function getReports(): Promise<GetReportsResult> {
  const metricsDir = process.env.METRICS_DIR;

  if (!metricsDir) {
    return { items: [], loadErrors: [], error: "METRICS_DIR não configurado em .env.local" };
  }

  try {
    const files = await fs.readdir(metricsDir);
    const items: EnrichedItem[] = [];
    const loadErrors: ReportLoadError[] = [];

    for (const file of files.filter((f) => f.endsWith(".json"))) {
      try {
        const raw = await fs.readFile(path.join(metricsDir, file), "utf-8");
        const json = JSON.parse(raw) as Record<string, unknown>;
        const slug = file.replace(/\.json$/, "");
        const report = migrate(json, slug);
        items.push({
          slug,
          generated_at: report.generated_at,
          project: report.project,
          stack: deriveStack(report.project),
          cc_grade: report.cyclomatic_complexity.summary.grade,
          coverage_percent: report.test_coverage.percent,
          security_passed: report.security.passed,
        });
      } catch (e) {
        loadErrors.push({ file, reason: e instanceof Error ? e.message : String(e) });
      }
    }

    items.sort(
      (a, b) =>
        parseMetricsDate(b.generated_at).getTime() -
        parseMetricsDate(a.generated_at).getTime()
    );

    return { items, loadErrors };
  } catch {
    return {
      items: [],
      loadErrors: [],
      error: `Não foi possível ler METRICS_DIR: ${metricsDir}`,
    };
  }
}

export default async function HomePage() {
  const deployMode = !process.env.METRICS_DIR;

  if (deployMode) {
    return <HomeContent items={[]} deployMode />;
  }

  const { items, loadErrors, error } = await getReports();
  return <HomeContent items={items} loadErrors={loadErrors} error={error} />;
}
