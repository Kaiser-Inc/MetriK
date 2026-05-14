"use client";

import type { ReactNode } from "react";

type Direction = "up" | "down" | "neutral";

const trendColor: Record<Direction, string> = {
  up: "var(--success-500)",
  down: "var(--danger-500)",
  neutral: "var(--warning-500)",
};

const trendIcon: Record<Direction, string> = {
  up: "↑",
  down: "↓",
  neutral: "→",
};

interface Props {
  label: string;
  value: string;
  trend?: { value: string; direction: Direction };
  description?: string;
  icon?: ReactNode;
}

export function MetrikStatCard({ label, value, trend, description, icon }: Props) {
  return (
    <div
      style={{
        borderRadius: "var(--radius-xl)",
        background: "var(--bg-surface)",
        border: "1px solid var(--border-subtle)",
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        minWidth: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--fg-3)" }}>
          {label}
        </span>
        {icon && (
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: 32,
              width: 32,
              borderRadius: "var(--radius-lg)",
              background: "var(--brand-subtle)",
              color: "var(--brand)",
              flexShrink: 0,
            }}
          >
            {icon}
          </span>
        )}
      </div>

      <span
        style={{
          fontSize: "1.875rem",
          fontWeight: 700,
          color: "var(--fg-1)",
          lineHeight: 1,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </span>

      {trend && (
        <span
          style={{
            fontSize: "0.8rem",
            fontWeight: 500,
            color: trendColor[trend.direction],
            lineHeight: 1.3,
          }}
        >
          {trendIcon[trend.direction]} {trend.value}
        </span>
      )}

      {description && (
        <p style={{ fontSize: "0.75rem", color: "var(--fg-4)", margin: 0, lineHeight: 1.4 }}>
          {description}
        </p>
      )}
    </div>
  );
}
