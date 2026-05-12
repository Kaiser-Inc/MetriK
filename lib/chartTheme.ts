import type { CSSProperties } from "react";

export const CHART_COLORS = {
  good:    "var(--success-500)",
  warning: "var(--warning-500)",
  danger:  "var(--danger-500)",
  brand:   "var(--brand)",
  fg2:     "var(--fg-2)",
  border:  "var(--border-default)",
} as const;

export const TOOLTIP_STYLE: CSSProperties = {
  background: "#16161f",
  border: "1px solid rgba(130, 87, 230, 0.25)",
  color: "#e2e8f0",
  borderRadius: "6px",
  fontSize: "12px",
  padding: "8px 12px",
  boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
};

export const TOOLTIP_LABEL_STYLE: CSSProperties = {
  color: "#e2e8f0",
  fontWeight: 600,
  marginBottom: 2,
};

export const TOOLTIP_ITEM_STYLE: CSSProperties = {
  color: "#a0aec0",
};

export const REF_LINE_STYLE = {
  strokeWidth: 1.5,
  labelStyle: {
    fontSize: 11,
    fontWeight: 700,
    dy: -4,
    fill: "#cbd5e1",
  },
};

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
  convention: "#4472C4",
  refactor:   "var(--warning-500)",
  warning:    "#FFC000",
  error:      "var(--danger-500)",
  fatal:      "var(--brand)",
};

// ─── Shared chart legend ──────────────────────────────────────────────────────

export type LegendItem = {
  color: string;
  label: string;
  dash?: boolean; // linha tracejada (reference line)
  dot?: boolean;  // círculo (categoria)
};

export const CC_LEGEND: LegendItem[] = [
  { color: "var(--success-500)", label: "≤ 5 — Simples (A)", dot: true },
  { color: "var(--warning-500)", label: "≤ 10 — Moderado (B)", dot: true },
  { color: "var(--danger-500)",  label: "> 10 — Complexo (C+)", dot: true },
];

export const MI_LEGEND: LegendItem[] = [
  { color: "var(--success-500)", label: "≥ 20 — Fácil manutenção", dot: true },
  { color: "var(--warning-500)", label: "≥ 10 — Moderado", dot: true },
  { color: "var(--danger-500)",  label: "< 10 — Difícil manutenção", dot: true },
];

export const COVERAGE_LEGEND: LegendItem[] = [
  { color: "var(--success-500)", label: "≥ 80% — Meta atingida", dot: true },
  { color: "var(--warning-500)", label: "≥ 50% — Parcial", dot: true },
  { color: "var(--danger-500)",  label: "< 50% — Crítico", dot: true },
];

export const PYLINT_LEGEND: LegendItem[] = [
  { color: "#4472C4",              label: "Convention", dot: true },
  { color: "var(--warning-500)",   label: "Refactor",   dot: true },
  { color: "#FFC000",              label: "Warning",    dot: true },
  { color: "var(--danger-500)",    label: "Error",      dot: true },
  { color: "var(--brand)",         label: "Fatal",      dot: true },
];
