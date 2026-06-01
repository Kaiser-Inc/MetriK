"use client";

import { Badge } from "@kaiserinc/react";
import type { MetricsReport } from "@/types/metrics";

interface Props {
  flog: NonNullable<MetricsReport["flog_score"]>;
}

export function FlogBadge({ flog }: Props) {
  const { average, grade } = flog.summary;

  const gradeVariant = (): "success" | "warning" | "danger" => {
    if (grade === "A" || grade === "B") return "success";
    if (grade === "C" || grade === "D") return "warning";
    return "danger";
  };

  return (
    <div
      className="flex items-start gap-4 rounded-lg p-5"
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-default)",
      }}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span
            className="text-xs uppercase tracking-wider"
            style={{ color: "var(--fg-3)" }}
          >
            Flog
          </span>
          <Badge variant={gradeVariant()}>
            {grade}
          </Badge>
        </div>
        <p style={{ fontSize: "0.875rem", color: "var(--fg-2)", margin: 0 }}>
          Score médio:{" "}
          <strong style={{ color: "var(--fg-1)" }}>{average.toFixed(2)}</strong>
        </p>
        <p style={{ fontSize: "0.75rem", color: "var(--fg-4)", margin: 0 }}>
          Complexidade de método Rails — menor é melhor (A ≤ média do projeto)
        </p>
      </div>
    </div>
  );
}
