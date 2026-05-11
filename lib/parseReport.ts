import type { MetricsReport } from "@/types/metrics";

export function parseReport(json: unknown): MetricsReport {
  if (!json || typeof json !== "object") {
    throw new Error("JSON inválido: não é um objeto");
  }

  const obj = json as Record<string, unknown>;

  if (!obj.generated_at || typeof obj.generated_at !== "string") {
    throw new Error("Campo 'generated_at' ausente ou inválido");
  }

  if (!obj.cyclomatic_complexity || typeof obj.cyclomatic_complexity !== "object") {
    throw new Error("Campo 'cyclomatic_complexity' ausente ou inválido");
  }

  return json as MetricsReport;
}
