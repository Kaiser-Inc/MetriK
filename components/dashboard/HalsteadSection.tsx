"use client";

import { Card, CardHeader, CardBody, CardTitle } from "@kaiserinc/react";
import { FlaskConical, Bug, Zap, FileCode, Info } from "lucide-react";
import type { MetricsReport } from "@/types/metrics";
import { isHalsteadAvailable } from "@/lib/metricAvailability";

interface Props {
  report: MetricsReport;
}

interface MetricItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

function MetricItem({ icon, label, value }: MetricItemProps) {
  return (
    <div
      className="flex flex-col gap-3 p-4 rounded-lg"
      style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)" }}
    >
      <div className="flex items-center gap-2">
        {icon}
        <span
          className="text-xs uppercase tracking-wider"
          style={{ color: "var(--fg-3)" }}
        >
          {label}
        </span>
      </div>
      <span className="text-2xl font-bold" style={{ color: "var(--fg-1)" }}>
        {value}
      </span>
    </div>
  );
}

export function HalsteadSection({ report }: Props) {
  const h = report.halstead.summary;
  const brandIcon = { color: "var(--brand)" };
  const available = isHalsteadAvailable(report);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <span className="flex items-center gap-2">
            <FlaskConical size={16} style={brandIcon} />
            Métricas de Halstead
          </span>
        </CardTitle>
        <p className="text-xs mt-1" style={{ color: "var(--fg-3)" }}>
          Volume, esforço e complexidade do vocabulário
        </p>
      </CardHeader>
      <CardBody>
        {!available ? (
          <div
            className="flex items-center gap-3 rounded-lg px-4 py-5"
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)" }}
          >
            <Info size={16} style={{ color: "var(--fg-3)", flexShrink: 0 }} />
            <p className="text-sm" style={{ color: "var(--fg-3)" }}>
              Métricas de Halstead não estão disponíveis para esta stack. Nenhuma ferramenta de análise de vocabulário AST foi configurada.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(160px, 1fr))", gap: 16 }}>
              <MetricItem
                icon={<Bug size={15} style={brandIcon} />}
                label="Bugs Estimados"
                value={h.estimated_bugs.toFixed(3)}
              />
              <MetricItem
                icon={<Zap size={15} style={brandIcon} />}
                label="Esforço Total"
                value={Math.round(h.total_effort).toLocaleString("pt-BR")}
              />
              <MetricItem
                icon={<FileCode size={15} style={brandIcon} />}
                label="Arquivos Analisados"
                value={h.files_analyzed}
              />
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
