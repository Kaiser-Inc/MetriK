"use client";

import { useRouter } from "next/navigation";
import { Card, CardBody } from "@kaiserinc/react";
import { GitBranch, Shield, CheckCircle2, XCircle, ChevronRight } from "lucide-react";
import type { ReportListItem } from "@/types/metrics";
import { formatDate } from "@/lib/formatDate";

interface Props {
  report: ReportListItem & {
    cc_grade?: string;
    coverage_percent?: number;
    xenon_passed?: boolean;
  };
}

export function ReportCard({ report }: Props) {
  const router = useRouter();

  const coverageColor =
    report.coverage_percent == null ? "var(--fg-3)"
    : report.coverage_percent >= 80 ? "var(--success-500)"
    : report.coverage_percent >= 50 ? "var(--warning-500)"
    : "var(--danger-500)";

  const xenonColor =
    report.xenon_passed == null ? "var(--fg-3)"
    : report.xenon_passed ? "var(--success-500)"
    : "var(--danger-500)";

  return (
    <Card
      hoverable
      className="cursor-pointer"
      onClick={() => router.push(`/report/${report.slug}`)}
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && router.push(`/report/${report.slug}`)}
      role="button"
      aria-label={`Ver relatório ${report.project}`}
    >
      <CardBody>
        <div className="flex flex-col gap-3">
          {/* Header — title + chevron */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
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
            <ChevronRight size={15} style={{ color: "var(--fg-4)", flexShrink: 0, marginTop: 2 }} />
          </div>

          {/* Divider */}
          <div style={{ borderTop: "1px solid var(--border-default)" }} />

          {/* Metrics row — compact */}
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center gap-0.5">
              <GitBranch size={14} style={{ color: "var(--brand)" }} />
              <span className="text-xs" style={{ color: "var(--fg-3)", fontSize: "0.65rem" }}>CC</span>
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
              <span style={{ color: "var(--fg-3)", fontSize: "0.65rem" }}>Xenon</span>
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
