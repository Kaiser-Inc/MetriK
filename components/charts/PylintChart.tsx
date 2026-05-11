"use client";

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
}

export function PylintChart({ byType, score }: Props) {
  const data = Object.entries(byType)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value }));

  return (
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
        {/* Score central */}
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
  );
}
