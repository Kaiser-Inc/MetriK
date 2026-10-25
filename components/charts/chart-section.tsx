"use client";

import { useId, useRef, useState } from "react";
import { DownloadIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { exportElementAsPng, EXPORT_IGNORE_ATTRIBUTE } from "@/lib/exportChart";

import type { LegendItem } from "@/lib/chartTheme";
import { cn } from "@/lib/utils";

type ChartSectionProps = {
  title: React.ReactNode;
  /** Plain-text name of the section, used when `title` is not a string. */
  label?: string;
  icon: React.ReactNode;
  legend: LegendItem[];
  children: React.ReactNode;
  scrollable?: boolean;
  /** Adds an export button; the PNG is named after it. */
  exportName?: string;
};

// A chart sits directly on the page under a thin line, with its title and legend.
function ChartSection({
  title,
  label,
  icon,
  legend,
  children,
  scrollable = false,
  exportName,
}: ChartSectionProps) {
  const headingId = useId();
  const sectionRef = useRef<HTMLElement>(null);
  const [exporting, setExporting] = useState(false);
  const plainTitle = label ?? (typeof title === "string" ? title : "gráfico");

  const handleExport = async () => {
    if (!sectionRef.current || !exportName) return;
    setExporting(true);
    try {
      await exportElementAsPng(sectionRef.current, exportName);
    } catch {
      toast.error("Não foi possível exportar o gráfico.");
    } finally {
      setExporting(false);
    }
  };
  return (
    <section
      ref={sectionRef}
      aria-labelledby={label ? undefined : headingId}
      aria-label={label}
      className="flex min-h-96 flex-col gap-4 border-t border-border pt-4"
    >
      <div className="flex items-center justify-between gap-2">
        <h3 id={headingId} className="flex items-center gap-2 text-base font-medium">
          {icon && (
            <span aria-hidden="true" className="flex text-primary-text [&_svg]:size-4">
              {icon}
            </span>
          )}
          {title}
        </h3>
        {exportName && (
          <Button
            variant="ghost"
            size="icon"
            className="-my-1.5 -mr-2 text-muted-foreground"
            aria-label={`Exportar PNG: ${plainTitle}`}
            title="Exportar PNG"
            loading={exporting}
            onClick={handleExport}
            {...{ [EXPORT_IGNORE_ATTRIBUTE]: "" }}
          >
            <DownloadIcon strokeWidth={1.75} />
          </Button>
        )}
      </div>
      <div className={cn("flex min-h-0 flex-1 flex-col", scrollable && "max-h-[420px] overflow-x-hidden overflow-y-auto")}>
        {children}
      </div>
      {legend.length > 0 && (
        <ul className="mt-auto flex flex-wrap justify-center gap-x-4 gap-y-1.5 border-t border-border pt-3 text-xs text-muted-foreground">
          {legend.map(({ color, label: itemLabel, dash }) => (
            <li key={itemLabel} className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className={dash ? "h-0.5 w-[18px] shrink-0 rounded-sm" : "size-2 shrink-0 rounded-full"}
                style={{ background: color }}
              />
              {itemLabel}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export { ChartSection };
