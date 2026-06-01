import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { migrate } from "@/lib/parseReport";

/**
 * GET /api/health
 * Liveness + ingestion summary. In LOCAL mode it counts how many reports in
 * METRICS_DIR parse cleanly vs. how many are invalid.
 */
export async function GET() {
  const metricsDir = process.env.METRICS_DIR;
  const mode: "local" | "deploy" = metricsDir ? "local" : "deploy";

  if (!metricsDir) {
    // Deploy mode: reports are loaded client-side, server has nothing to count.
    return NextResponse.json({ ok: true, mode, metricsDir: null, reportCount: 0, invalidCount: 0 });
  }

  let reportCount = 0;
  let invalidCount = 0;

  try {
    const files = (await fs.readdir(metricsDir)).filter((f) => f.endsWith(".json"));
    for (const file of files) {
      try {
        const raw = await fs.readFile(path.join(metricsDir, file), "utf-8");
        migrate(JSON.parse(raw), file.replace(/\.json$/, ""));
        reportCount += 1;
      } catch {
        invalidCount += 1;
      }
    }
  } catch {
    return NextResponse.json(
      { ok: false, mode, metricsDir, reportCount: 0, invalidCount: 0, error: "METRICS_DIR ilegível" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, mode, metricsDir, reportCount, invalidCount });
}
