import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import type { ReportListItem, ReportLoadError } from "@/types/metrics";
import { deriveStack } from "@/types/metrics";
import { migrate } from "@/lib/parseReport";
import { parseMetricsDate } from "@/lib/formatDate";

export async function GET() {
  const metricsDir = process.env.METRICS_DIR;

  if (!metricsDir) {
    return NextResponse.json(
      { error: "METRICS_DIR não configurado em .env.local" },
      { status: 404 }
    );
  }

  try {
    const files = await fs.readdir(metricsDir);
    const jsonFiles = files.filter((f) => f.endsWith(".json"));

    const items: ReportListItem[] = [];
    const errors: ReportLoadError[] = [];

    for (const file of jsonFiles) {
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
        });
      } catch (e) {
        errors.push({ file, reason: e instanceof Error ? e.message : String(e) });
      }
    }

    items.sort((a, b) =>
      parseMetricsDate(b.generated_at).getTime() - parseMetricsDate(a.generated_at).getTime()
    );

    return NextResponse.json({ items, errors });
  } catch {
    return NextResponse.json(
      { error: `Não foi possível ler METRICS_DIR: ${metricsDir}` },
      { status: 500 }
    );
  }
}
