"use client";

import type { RefObject } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TOOLTIP_STYLE, PYLINT_TYPE_COLORS } from "@/lib/chartTheme";

interface Props {
  byType: Record<string, number>;
  score: number | null;
  exportRef?: RefObject<HTMLDivElement | null>;
}

export function PylintChart({ byType, score, exportRef }: Props) {
  const data = Object.entries(byType)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value }));

  if (data.length === 0) {
    return (
      <div ref={exportRef} style={{
        height: 320,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
      }}>
        <svg width={56} height={56} viewBox="0 0 56 56" fill="none">
          <circle cx="28" cy="28" r="27" stroke="var(--success-500)" strokeWidth="2" strokeDasharray="4 3" opacity={0.5} />
          <path d="M18 28.5L24.5 35L38 21" stroke="var(--success-500)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--fg-1)", margin: 0 }}>
          Nenhum problema encontrado
        </p>
        <p style={{ fontSize: "0.78rem", color: "var(--fg-4)", margin: 0 }}>
          Score Pylint:{" "}
          <span style={{ color: "var(--success-500)", fontWeight: 700 }}>
            {score != null ? `${score}/10` : "10/10"}
          </span>
        </p>
      </div>
    );
  }

  return (
    <div ref={exportRef}>
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Tooltip contentStyle={TOOLTIP_STYLE} />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            iconSize={10}
            wrapperStyle={{ color: "var(--fg-2)", fontSize: 12 }}
          />
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={60}
            outerRadius={100}
            dataKey="value"
            paddingAngle={2}
          >
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={PYLINT_TYPE_COLORS[entry.name] ?? "var(--fg-3)"}
              />
            ))}
          </Pie>
          <text
            x="50%"
            y="45%"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="var(--fg-1)"
            fontSize={20}
            fontWeight={700}
          >
            {score != null ? `${score}/10` : "N/A"}
          </text>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
