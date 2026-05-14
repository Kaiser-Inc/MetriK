export function parseMetricsDate(value: string): Date {
  if (!value) return new Date(NaN);

  const custom = value.match(/^(\d{4}-\d{2}-\d{2})_(\d{2})(\d{2})(\d{2})$/);
  if (custom) {
    const [, date, hh, mm, ss] = custom;
    return new Date(`${date}T${hh}:${mm}:${ss}`);
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
