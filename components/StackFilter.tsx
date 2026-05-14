"use client";

import { STACK_META, type Stack } from "@/types/metrics";
import { StackIcon } from "@/components/icons/StackIcon";

export type StackFilterValue = Stack | "all";

const STACKS: Stack[] = ["python-fastapi", "node-fastify", "ruby-on-rails"];

interface StackFilterProps {
  value: StackFilterValue;
  onChange: (value: StackFilterValue) => void;
}

export function StackFilter({ value, onChange }: StackFilterProps) {
  return (
    <div className="flex items-center justify-center gap-2 flex-wrap">
      <button
        onClick={() => onChange("all")}
        className={[
          "cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors",
          value === "all"
            ? "bg-[var(--brand)] text-white border-[var(--brand)]"
            : "border-[var(--border)] text-[var(--fg-muted)] hover:border-[var(--brand)] hover:text-[var(--brand)]",
        ].join(" ")}
      >
        Todas
      </button>

      {STACKS.map((stack) => {
        const meta = STACK_META[stack];
        const active = value === stack;
        return (
          <button
            key={stack}
            onClick={() => onChange(stack)}
            className={[
              "cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors",
              active
                ? "border-transparent"
                : "border-[var(--border)] text-[var(--fg-muted)]",
            ].join(" ")}
            style={
              active
                ? { backgroundColor: meta.color, borderColor: meta.color, color: "#ffffff" }
                : undefined
            }
            onMouseEnter={(e) => {
              if (!active) {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.borderColor = meta.color;
                el.style.color = meta.color;
              }
            }}
            onMouseLeave={(e) => {
              if (!active) {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.borderColor = "";
                el.style.color = "";
              }
            }}
          >
            <StackIcon stack={stack} size={14} />
            {meta.label}
          </button>
        );
      })}
    </div>
  );
}
