"use client";

import { Badge } from "@kaiserinc/react";
import { Sparkles } from "lucide-react";
import type { RuffSummary } from "@/types/metrics";

interface Props {
  ruff: RuffSummary;
}

/** Python-only: renders the Ruff lint summary (issue counts by rule code). */
export function RuffSection({ ruff }: Props) {
  const { total_issues, by_code } = ruff;
  const clean = total_issues === 0;
  const topCodes = Object.entries(by_code)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12);

  return (
    <div
      className="flex flex-col gap-3 rounded-lg p-5"
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-default)",
      }}
    >
      <div className="flex items-center gap-2">
        <Sparkles size={18} style={{ color: "var(--brand)" }} />
        <span className="text-xs uppercase tracking-wider" style={{ color: "var(--fg-3)" }}>
          Ruff
        </span>
        <Badge variant={clean ? "success" : "warning"}>
          {clean ? "Sem issues" : `${total_issues} issue${total_issues !== 1 ? "s" : ""}`}
        </Badge>
      </div>

      {topCodes.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {topCodes.map(([code, count]) => (
            <code
              key={code}
              className="text-xs px-2 py-0.5 rounded"
              style={{
                background: "var(--bg-elevated)",
                color: "var(--fg-2)",
                border: "1px solid var(--border-default)",
              }}
            >
              {code}: {count}
            </code>
          ))}
        </div>
      )}
    </div>
  );
}
