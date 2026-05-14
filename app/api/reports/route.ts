import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import type { ReportListItem } from "@/types/metrics";
import { deriveStack } from "@/types/metrics";

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

    for (const file of jsonFiles) {
      try {
        const raw = await fs.readFile(path.join(metricsDir, file), "utf-8");
        const json = JSON.parse(raw) as Record<string, unknown>;
        const slug = file.replace(/\.json$/, "");
        const project = (json.project as string) ?? slug;
        items.push({
          slug,
          generated_at: (json.generated_at as string) ?? "",
          project,
          stack: deriveStack(project),
        });
      } catch {
      }
    }

    items.sort((a, b) =>
      new Date(b.generated_at).getTime() - new Date(a.generated_at).getTime()
    );

    return NextResponse.json(items);
  } catch {
    return NextResponse.json(
      { error: `Não foi possível ler METRICS_DIR: ${metricsDir}` },
      { status: 500 }
    );
  }
}
