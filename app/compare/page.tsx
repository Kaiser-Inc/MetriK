import { promises as fs } from "fs";
import path from "path";
import { parseReport } from "@/lib/parseReport";
import { CompareContent } from "@/components/dashboard/CompareContent";
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

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ a?: string; b?: string }>;
}) {
  const { a, b } = await searchParams;

  if (!process.env.METRICS_DIR) {
    return (
      <CompareContent
        reportA={null}
        reportB={null}
        slugA={a ?? ""}
        slugB={b ?? ""}
      />
    );
  }

  if (!a || !b) {
    return (
      <CompareContent
        reportA={null}
        reportB={null}
        slugA={a ?? ""}
        slugB={b ?? ""}
      />
    );
  }

  const [reportA, reportB] = await Promise.all([getReport(a), getReport(b)]);

  if (!reportA || !reportB) {
    return (
      <CompareContent
        reportA={null}
        reportB={null}
        slugA={a}
        slugB={b}
      />
    );
  }

  return (
    <CompareContent
      reportA={reportA}
      reportB={reportB}
      slugA={a}
      slugB={b}
      dateA={formatDate(reportA.generated_at, "long")}
      dateB={formatDate(reportB.generated_at, "long")}
    />
  );
}
