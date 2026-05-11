"use client";

import { Card, CardHeader, CardBody, CardTitle } from "@kaiserinc/react";
import { FlaskConical, Bug, Zap, FileCode } from "lucide-react";
import type { MetricsReport } from "@/types/metrics";

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
        <div className="grid grid-cols-3 gap-4">
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
      </CardBody>
    </Card>
  );
}
