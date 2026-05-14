"use client";

import { useRouter } from "next/navigation";
import { Card, CardBody } from "@kaiserinc/react";
import { GitBranch, Shield, CheckCircle2, XCircle, ChevronRight } from "lucide-react";
import type { EnrichedItem } from "@/types/metrics";
import { STACK_META, deriveStack } from "@/types/metrics";
import { StackIcon } from "@/components/icons/StackIcon";
import { formatDate } from "@/lib/formatDate";

interface Props {
  report: EnrichedItem;
  compareMode?: boolean;
  selected?: boolean;
  onSelect?: (slug: string, checked: boolean) => void;
}

export function ReportCard({ report, compareMode = false, selected = false, onSelect }: Props) {
  const router = useRouter();

  const stack = report.stack ?? deriveStack(report.project);
  const stackMeta = STACK_META[stack];

  const coverageColor =
    report.coverage_percent == null ? "var(--fg-3)"
    : report.coverage_percent >= 80 ? "var(--success-500)"
    : report.coverage_percent >= 50 ? "var(--warning-500)"
    : "var(--danger-500)";

  const xenonColor =
    report.xenon_passed == null ? "var(--fg-3)"
    : report.xenon_passed ? "var(--success-500)"
    : "var(--danger-500)";

  const handleClick = () => {
    if (compareMode) {
      onSelect?.(report.slug, !selected);
    } else {
      router.push(`/report/${report.slug}`);
    }
  };

  return (
    <Card
      hoverable
      className="cursor-pointer"
      onClick={handleClick}
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
      role={compareMode ? "checkbox" : "button"}
      aria-checked={compareMode ? selected : undefined}
      aria-label={compareMode ? `Selecionar ${report.project} para comparar` : `Ver relatório ${report.project}`}
      style={selected ? { outline: "2px solid var(--brand)", outlineOffset: 2 } : undefined}
    >
      <CardBody>
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 mb-1">
                <StackIcon stack={stack} size={12} />
                <span
                  className="text-xs font-medium"
                  style={{ color: stackMeta.color, fontSize: "0.68rem" }}
                >
                  {stackMeta.label}
                </span>
              </div>
              <h2
                className="font-semibold text-sm leading-tight truncate"
                style={{ color: "var(--fg-1)" }}
              >
                {report.project}
              </h2>
              <p className="text-xs mt-0.5" style={{ color: "var(--fg-3)" }}>
                {formatDate(report.generated_at)}
              </p>
            </div>
            {compareMode ? (
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 4,
                  border: `2px solid ${selected ? "var(--brand)" : "var(--border-default)"}`,
                  background: selected ? "var(--brand)" : "transparent",
                  flexShrink: 0,
                  marginTop: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.15s",
                }}
              >
                {selected && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            ) : (
              <ChevronRight size={15} style={{ color: "var(--fg-4)", flexShrink: 0, marginTop: 2 }} />
            )}
          </div>

          <div style={{ borderTop: "1px solid var(--border-default)" }} />

          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center gap-0.5">
              <GitBranch size={14} style={{ color: "var(--brand)" }} />
              <span style={{ color: "var(--fg-3)", fontSize: "0.65rem" }}>CC</span>
              <span className="text-xs font-semibold" style={{ color: "var(--fg-1)" }}>
                {report.cc_grade ?? "—"}
              </span>
            </div>

            <div className="flex flex-col items-center gap-0.5">
              <Shield size={14} style={{ color: coverageColor }} />
              <span style={{ color: "var(--fg-3)", fontSize: "0.65rem" }}>Cobertura</span>
              <span className="text-xs font-semibold" style={{ color: coverageColor }}>
                {report.coverage_percent != null ? `${report.coverage_percent.toFixed(1)}%` : "—"}
              </span>
            </div>

            <div className="flex flex-col items-center gap-0.5">
              {report.xenon_passed == null
                ? <CheckCircle2 size={14} style={{ color: "var(--fg-3)" }} />
                : report.xenon_passed
                ? <CheckCircle2 size={14} style={{ color: "var(--success-500)" }} />
                : <XCircle size={14} style={{ color: "var(--danger-500)" }} />}
              <span style={{ color: "var(--fg-3)", fontSize: "0.65rem" }}>{stackMeta.secLabel}</span>
              <span className="text-xs font-semibold" style={{ color: xenonColor }}>
                {report.xenon_passed == null ? "—" : report.xenon_passed ? "Passou" : "Falhou"}
              </span>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
