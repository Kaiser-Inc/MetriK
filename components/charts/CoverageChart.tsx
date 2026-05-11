"use client";

import type { RefObject } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, Cell, ResponsiveContainer,
} from "recharts";
import { CHART_COLORS, TOOLTIP_STYLE, TOOLTIP_LABEL_STYLE, TOOLTIP_ITEM_STYLE, REF_LINE_STYLE, coverageColor } from "@/lib/chartTheme";

interface Props {
  byFile: Record<string, number>;
  exportRef?: RefObject<HTMLDivElement | null>;
}

const BAR_HEIGHT = 26;
const MIN_HEIGHT = 200;

export function CoverageChart({ byFile, exportRef }: Props) {
  const data = Object.entries(byFile)
    .sort(([, a], [, b]) => a - b)
    .map(([file, value]) => ({ file: file.split("/").pop() ?? file, value: Number(value.toFixed(1)) }));

  const height = Math.max(MIN_HEIGHT, data.length * BAR_HEIGHT);

  return (
    <div ref={exportRef}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart layout="vertical" data={data} margin={{ top: 4, right: 32, left: 8, bottom: 4 }}>
          <CartesianGrid horizontal={false} stroke={CHART_COLORS.border} strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, 100]} stroke={CHART_COLORS.fg2} fontSize={11} tickLine={false} tickFormatter={(v) => `${v}%`} />
          <YAxis
            type="category" dataKey="file" width={130}
            stroke={CHART_COLORS.fg2} fontSize={10} tickLine={false} interval={0}
          />
          <Tooltip contentStyle={TOOLTIP_STYLE} labelStyle={TOOLTIP_LABEL_STYLE} itemStyle={TOOLTIP_ITEM_STYLE} cursor={{ fill: "rgba(255,255,255,0.04)" }} formatter={(v) => [`${v}%`, "Cobertura"]} />
          <ReferenceLine x={80} stroke={CHART_COLORS.good} strokeWidth={REF_LINE_STYLE.strokeWidth} strokeDasharray="4 2" />
          <Bar dataKey="value" radius={[0, 3, 3, 0]}>
            {data.map((entry, i) => <Cell key={i} fill={coverageColor(entry.value)} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
