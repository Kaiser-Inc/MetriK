import type { CSSProperties } from "react";

// Colors come from KaiserInc Base tokens, so charts follow the active theme.
export const CHART_COLORS = {
  good:    "var(--success)",
  warning: "var(--warning)",
  danger:  "var(--destructive)",
  brand:   "var(--primary-text)",
  fg2:     "var(--muted-foreground)",
  border:  "var(--border)",
} as const;

export const TOOLTIP_STYLE: CSSProperties = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  color: "var(--popover-foreground)",
  borderRadius: "6px",
  fontSize: "12px",
  padding: "8px 12px",
  boxShadow: "var(--shadow-overlay)",
};

export const TOOLTIP_LABEL_STYLE: CSSProperties = {
  color: "var(--popover-foreground)",
  fontWeight: 600,
  marginBottom: 2,
};

export const TOOLTIP_ITEM_STYLE: CSSProperties = {
  color: "var(--muted-foreground)",
};

export const REF_LINE_STYLE = {
  strokeWidth: 1.5,
  labelStyle: {
    fontSize: 11,
    fontWeight: 700,
    dy: -4,
    fill: "var(--muted-foreground)",
  },
};

// Hover highlight behind a bar: a neutral wash that reads on both themes.
export const BAR_CURSOR = { fill: "var(--muted)" };

export function ccColor(value: number): string {
  if (value <= 5) return CHART_COLORS.good;
  if (value <= 10) return CHART_COLORS.warning;
  return CHART_COLORS.danger;
}

export function miColor(value: number): string {
  if (value >= 20) return CHART_COLORS.good;
  if (value >= 10) return CHART_COLORS.warning;
  return CHART_COLORS.danger;
}

export function coverageColor(value: number): string {
  if (value >= 80) return CHART_COLORS.good;
  if (value >= 50) return CHART_COLORS.warning;
  return CHART_COLORS.danger;
}

export const PYLINT_TYPE_COLORS: Record<string, string> = {
  convention: "var(--chart-1)",
  refactor:   "var(--chart-3)",
  warning:    "var(--warning)",
  error:      "var(--destructive)",
  fatal:      "var(--chart-5)",
};

export type LegendItem = {
  color: string;
  label: string;
  dash?: boolean;
  dot?: boolean;
};

export const CC_LEGEND: LegendItem[] = [
  { color: "var(--success)", label: "≤ 5 — Simples (A)", dot: true },
  { color: "var(--warning)", label: "≤ 10 — Moderado (B)", dot: true },
  { color: "var(--destructive)",  label: "> 10 — Complexo (C+)", dot: true },
];

export const MI_LEGEND: LegendItem[] = [
  { color: "var(--success)", label: "≥ 20 — Fácil manutenção", dot: true },
  { color: "var(--warning)", label: "≥ 10 — Moderado", dot: true },
  { color: "var(--destructive)",  label: "< 10 — Difícil manutenção", dot: true },
];

export const COVERAGE_LEGEND: LegendItem[] = [
  { color: "var(--success)", label: "≥ 80% — Meta atingida", dot: true },
  { color: "var(--warning)", label: "≥ 50% — Parcial", dot: true },
  { color: "var(--destructive)",  label: "< 50% — Crítico", dot: true },
];

export const PYLINT_LEGEND: LegendItem[] = [
  { color: PYLINT_TYPE_COLORS.convention, label: "Convention", dot: true },
  { color: PYLINT_TYPE_COLORS.refactor,   label: "Refactor",   dot: true },
  { color: PYLINT_TYPE_COLORS.warning,    label: "Warning",    dot: true },
  { color: PYLINT_TYPE_COLORS.error,      label: "Error",      dot: true },
  { color: PYLINT_TYPE_COLORS.fatal,      label: "Fatal",      dot: true },
];
