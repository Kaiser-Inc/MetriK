"use client";

import type { LegendItem } from "@/lib/chartTheme";

interface Props {
  items: LegendItem[];
}

export function ChartLegend({ items }: Props) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "6px 14px",
        marginTop: "auto",
        paddingTop: 10,
        borderTop: "1px solid var(--border-default)",
        fontSize: 11,
        color: "var(--fg-3)",
      }}
    >
      {items.map(({ color, label, dash }) => (
        <span key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
          {dash ? (
            <span style={{
              display: "inline-block",
              width: 18,
              height: 2,
              background: color,
              borderRadius: 1,
              flexShrink: 0,
            }} />
          ) : (
            <span style={{
              display: "inline-block",
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: color,
              flexShrink: 0,
            }} />
          )}
          {label}
        </span>
      ))}
    </div>
  );
}
