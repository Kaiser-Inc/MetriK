"use client";

import type { RefObject } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CircleCheckIcon } from "lucide-react";
import { TOOLTIP_STYLE, PYLINT_TYPE_COLORS } from "@/lib/chartTheme";
import { ChartUnavailable } from "./chart-unavailable";

interface Props {
  byType: Record<string, number>;
  score: number | null;
  lintLabel?: string;
  exportRef?: RefObject<HTMLDivElement | null>;
}

export function LintChart({ byType, score, lintLabel = "Lint", exportRef }: Props) {
  const data = Object.entries(byType)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value }));

  if (score === null) {
    return <ChartUnavailable message={`${lintLabel} não configurado — dados indisponíveis`} minHeight={320} exportRef={exportRef} />;
  }

  if (data.length === 0) {
    return (
      <div ref={exportRef} className="flex flex-1 flex-col items-center justify-center gap-3 py-8">
        <CircleCheckIcon aria-hidden="true" className="size-12 text-success" strokeWidth={1.5} />
        <p className="text-base font-medium">Nenhum problema encontrado</p>
        <p className="text-sm text-muted-foreground">
          {`Score ${lintLabel}: `}
          <span className="font-medium text-success">{`${score ?? 10}/10`}</span>
        </p>
      </div>
    );
  }

  return (
    <div ref={exportRef}>
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Tooltip contentStyle={TOOLTIP_STYLE} />
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
                fill={PYLINT_TYPE_COLORS[entry.name] ?? "var(--muted-foreground)"}
              />
            ))}
          </Pie>
          <text
            x="50%"
            y="45%"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="var(--foreground)"
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
