"use client";

interface Props {
  valueA: number;
  valueB: number;
  higherIsBetter?: boolean;
  unit?: string;
  decimals?: number;
}

/**
 * Mostra delta entre relatório A e B.
 * higherIsBetter=true (padrão): subir é bom (cobertura, MI, score)
 * higherIsBetter=false: subir é ruim (CC, bugs Halstead)
 */
export function DeltaBadge({ valueA, valueB, higherIsBetter = true, unit = "", decimals = 1 }: Props) {
  const delta = valueB - valueA;
  if (Math.abs(delta) < 0.001) {
    return (
      <span style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 3,
        padding: "2px 8px",
        borderRadius: 20,
        fontSize: "0.72rem",
        fontWeight: 600,
        background: "var(--bg-elevated)",
        border: "1px solid var(--border-default)",
        color: "var(--fg-3)",
      }}>
        = sem alteração
      </span>
    );
  }

  const improved = higherIsBetter ? delta > 0 : delta < 0;
  const color = improved ? "var(--success-500)" : "var(--danger-500)";
  const bg = improved ? "rgba(72,199,116,0.1)" : "rgba(239,68,68,0.1)";
  const border = improved ? "rgba(72,199,116,0.3)" : "rgba(239,68,68,0.3)";
  const arrow = delta > 0 ? "↑" : "↓";
  const formatted = `${Math.abs(delta).toFixed(decimals)}${unit}`;

  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 3,
      padding: "2px 8px",
      borderRadius: 20,
      fontSize: "0.72rem",
      fontWeight: 600,
      background: bg,
      border: `1px solid ${border}`,
      color,
    }}>
      {arrow} {formatted}
    </span>
  );
}
