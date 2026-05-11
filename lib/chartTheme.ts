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

// Estilos para label e item do Tooltip (forçam cor no Recharts)
export const TOOLTIP_LABEL_STYLE: CSSProperties = {
  color: "#e2e8f0",
  fontWeight: 600,
  marginBottom: 2,
};

export const TOOLTIP_ITEM_STYLE: CSSProperties = {
  color: "#a0aec0",
};

// Largura da linha de referência e estilo do label
export const REF_LINE_STYLE = {
  strokeWidth: 1.5,
  labelStyle: {
    fontSize: 11,
    fontWeight: 700,
    dy: -4,
    fill: "#cbd5e1", // cinza claro — legível em qualquer cor de barra
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
