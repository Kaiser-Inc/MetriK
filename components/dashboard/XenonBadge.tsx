"use client";

import { Badge } from "@kaiserinc/react";
import { CheckCircle2, XCircle } from "lucide-react";
import type { MetricsReport } from "@/types/metrics";

interface Props {
  xenon: MetricsReport["xenon"];
  secLabel?: string;
}

export function XenonBadge({ xenon, secLabel = "Xenon" }: Props) {
  const passed = xenon.passed;
  const iconColor = passed ? "var(--success-500)" : "var(--danger-500)";
  const borderColor = passed ? "var(--success-500)" : "var(--danger-500)";

  return (
    <div
      className="flex items-start gap-4 rounded-lg p-5"
      style={{
        background: "var(--bg-surface)",
        border: `1px solid ${borderColor}`,
      }}
    >
      <div
        className="flex items-center justify-center rounded-full shrink-0"
        style={{
          width: 48,
          height: 48,
          background: "var(--bg-elevated)",
          border: `1px solid var(--border-default)`,
        }}
      >
        {passed ? (
          <CheckCircle2 size={28} style={{ color: iconColor }} />
        ) : (
          <XCircle size={28} style={{ color: iconColor }} />
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span
            className="text-xs uppercase tracking-wider"
            style={{ color: "var(--fg-3)" }}
          >
            {secLabel}
          </span>
          <Badge variant={passed ? "success" : "danger"}>
            {passed ? "Passou" : "Falhou"}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-2">
          <code
            className="text-xs px-2 py-0.5 rounded"
            style={{
              background: "var(--bg-elevated)",
              color: "var(--fg-2)",
              border: "1px solid var(--border-default)",
            }}
          >
            max-abs: {xenon.thresholds.max_absolute}
          </code>
          <code
            className="text-xs px-2 py-0.5 rounded"
            style={{
              background: "var(--bg-elevated)",
              color: "var(--fg-2)",
              border: "1px solid var(--border-default)",
            }}
          >
            max-modules: {xenon.thresholds.max_modules}
          </code>
          <code
            className="text-xs px-2 py-0.5 rounded"
            style={{
              background: "var(--bg-elevated)",
              color: "var(--fg-2)",
              border: "1px solid var(--border-default)",
            }}
          >
            max-avg: {xenon.thresholds.max_average}
          </code>
        </div>
      </div>
    </div>
  );
}
