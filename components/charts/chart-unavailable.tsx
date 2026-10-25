import type { RefObject } from "react";
import { InfoIcon } from "lucide-react";

type ChartUnavailableProps = {
  message?: string;
  minHeight?: number;
  exportRef?: RefObject<HTMLDivElement | null>;
};

function ChartUnavailable({
  message = "Métrica não disponível para esta stack",
  minHeight = 200,
  exportRef,
}: ChartUnavailableProps) {
  return (
    <div
      ref={exportRef}
      className="flex flex-1 items-center justify-center gap-3 rounded-md bg-muted px-6 text-muted-foreground"
      style={{ minHeight }}
    >
      <InfoIcon aria-hidden="true" className="size-4 shrink-0" strokeWidth={1.75} />
      <p className="text-sm">{message}</p>
    </div>
  );
}

export { ChartUnavailable };
