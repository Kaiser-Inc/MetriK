import { promises as fs } from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { parseReport } from "@/lib/parseReport";
import { ReportDashboard } from "@/components/dashboard/ReportDashboard";
import { formatDate } from "@/lib/formatDate";
import type { MetricsReport } from "@/types/metrics";

async function getReport(slug: string): Promise<MetricsReport | null> {
  const metricsDir = process.env.METRICS_DIR;
  if (!metricsDir) return null;
  try {
    const raw = await fs.readFile(path.join(metricsDir, `${slug}.json`), "utf-8");
    return parseReport(JSON.parse(raw));
  } catch {
    return null;
  }
}

export default async function ReportPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const report = await getReport(slug);
  if (!report) notFound();

  return (
    <ReportDashboard
      report={report}
      formattedDate={formatDate(report.generated_at, "long")}
    />
  );
}
