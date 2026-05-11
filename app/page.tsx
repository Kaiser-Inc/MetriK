import { promises as fs } from "fs";
import path from "path";
import { parseMetricsDate } from "@/lib/formatDate";
import { HomeContent } from "@/components/HomeContent";
import type { ReportListItem } from "@/types/metrics";

type EnrichedItem = ReportListItem & {
  cc_grade?: string;
  coverage_percent?: number;
  xenon_passed?: boolean;
};

async function getReports(): Promise<{ items: EnrichedItem[]; error?: string }> {
  const metricsDir = process.env.METRICS_DIR;

  if (!metricsDir) {
    return { items: [], error: "METRICS_DIR não configurado em .env.local" };
  }

  try {
    const files = await fs.readdir(metricsDir);
    const items: EnrichedItem[] = [];

    for (const file of files.filter((f) => f.endsWith(".json"))) {
      try {
        const raw = await fs.readFile(path.join(metricsDir, file), "utf-8");
        const json = JSON.parse(raw) as Record<string, unknown>;
        const slug = file.replace(/\.json$/, "");
        const cc = (json.cyclomatic_complexity as Record<string, unknown> | undefined)
          ?.summary as Record<string, unknown> | undefined;

        items.push({
          slug,
          generated_at: (json.generated_at as string) ?? "",
          project: (json.project as string) ?? slug,
          cc_grade: cc?.grade as string | undefined,
          coverage_percent: (json.test_coverage as Record<string, unknown> | undefined)
            ?.percent as number | undefined,
          xenon_passed: (json.xenon as Record<string, unknown> | undefined)
            ?.passed as boolean | undefined,
        });
      } catch {
        // skip invalid
      }
    }

    items.sort(
      (a, b) =>
        parseMetricsDate(b.generated_at).getTime() -
        parseMetricsDate(a.generated_at).getTime()
    );

    return { items };
  } catch {
    return {
      items: [],
      error: `Não foi possível ler METRICS_DIR: ${metricsDir}`,
    };
  }
}

export default async function HomePage() {
  const { items, error } = await getReports();
  return <HomeContent items={items} error={error} />;
}
