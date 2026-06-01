export function parseMetricsDate(value: string): Date {
  if (!value) return new Date(NaN);

  // Python/Ruby: YYYY-MM-DD_HHMMSS (6-digit)
  const custom6 = value.match(/^(\d{4}-\d{2}-\d{2})_(\d{2})(\d{2})(\d{2})$/);
  if (custom6) {
    const [, date, hh, mm, ss] = custom6;
    return new Date(`${date}T${hh}:${mm}:${ss}`);
  }

  // Node/Next/Expo: YYYY-MM-DD_HHMM (4-digit)
  const custom4 = value.match(/^(\d{4}-\d{2}-\d{2})_(\d{2})(\d{2})$/);
  if (custom4) {
    const [, date, hh, mm] = custom4;
    return new Date(`${date}T${hh}:${mm}:00`);
  }

  return new Date(value);
}

export function formatDate(value: string, style: "short" | "long" = "short"): string {
  if (!value) return "—";
  const d = parseMetricsDate(value);
  if (!isFinite(d.getTime())) return value;

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: style === "long" ? "long" : "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}
