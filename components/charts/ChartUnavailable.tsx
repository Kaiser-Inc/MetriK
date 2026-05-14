import type { RefObject } from "react";
import { Info } from "lucide-react";

interface Props {
  message?: string;
  minHeight?: number;
  exportRef?: RefObject<HTMLDivElement | null>;
}

export function ChartUnavailable({
  message = "Métrica não disponível para esta stack",
  minHeight = 200,
  exportRef,
}: Props) {
  return (
    <div
      ref={exportRef}
      className="flex items-center justify-center gap-3 rounded-lg px-6"
      style={{
        flex: 1,
        minHeight,
        background: "var(--bg-elevated)",
        border: "1px solid var(--border-default)",
      }}
    >
      <Info size={15} style={{ color: "var(--fg-3)", flexShrink: 0 }} />
      <p className="text-sm" style={{ color: "var(--fg-3)" }}>
        {message}
      </p>
    </div>
  );
}
