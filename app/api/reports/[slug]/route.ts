import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { migrate } from "@/lib/parseReport";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const metricsDir = process.env.METRICS_DIR;

  if (!metricsDir) {
    return NextResponse.json(
      { error: "METRICS_DIR não configurado em .env.local" },
      { status: 404 }
    );
  }

  const filePath = path.join(metricsDir, `${slug}.json`);

  try {
    const raw = await fs.readFile(filePath, "utf-8");
    const json: unknown = JSON.parse(raw);

    try {
      const report = migrate(json, slug);
      return NextResponse.json(report);
    } catch (err) {
      return NextResponse.json(
        { error: `Relatório inválido: ${(err as Error).message}` },
        { status: 422 }
      );
    }
  } catch {
    return NextResponse.json(
      { error: `Relatório '${slug}' não encontrado` },
      { status: 404 }
    );
  }
}
