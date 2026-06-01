import { promises as fs } from "fs";
import path from "path";
import { migrate } from "@/lib/parseReport";
import { ReportDashboard } from "@/components/dashboard/ReportDashboard";
import { formatDate } from "@/lib/formatDate";
import type { MetricsReport } from "@/types/metrics";

type GetReportResult = { report: MetricsReport | null; loadError?: string };

async function getReport(slug: string): Promise<GetReportResult> {
  const metricsDir = process.env.METRICS_DIR;
  // No METRICS_DIR → deploy mode: the client hydrates from sessionStorage.
  if (!metricsDir) return { report: null };

  let raw: string;
  try {
    raw = await fs.readFile(path.join(metricsDir, `${slug}.json`), "utf-8");
  } catch {
    return { report: null, loadError: `Relatório '${slug}' não encontrado em METRICS_DIR.` };
  }

  try {
    return { report: migrate(JSON.parse(raw), slug) };
  } catch (e) {
    // Genuine parse/validation failure — surface the exact reason (names the key).
    return { report: null, loadError: e instanceof Error ? e.message : String(e) };
  }
}

export default async function ReportPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { report, loadError } = await getReport(slug);

  return (
    <ReportDashboard
      report={report}
      slug={slug}
      loadError={loadError}
      formattedDate={report ? formatDate(report.generated_at, "long") : ""}
    />
  );
}
