"use client";

import { StatCard } from "@kaiserinc/react";
import { GitBranch, Wrench, Shield, ClipboardList, Bug, CheckCircle2, XCircle } from "lucide-react";
import type { MetricsReport } from "@/types/metrics";
import type { TrendDirection } from "@kaiserinc/react";

interface Props {
  report: MetricsReport;
}

export function SummaryCards({ report }: Props) {
  const cc = report.cyclomatic_complexity.summary;
  const mi = report.maintainability_index.summary;
  const coverage = report.test_coverage;
  const pylint = report.pylint.summary;
  const halstead = report.halstead.summary;
  const xenon = report.xenon;

  // Derivados do grade calculado pelo metrics.py — fonte da verdade
  const ccDirection: TrendDirection =
    cc.grade.toLowerCase().includes("simples") || cc.grade.startsWith("A") ? "up"
    : cc.grade.startsWith("B") ? "neutral"
    : "down";
  const miDirection: TrendDirection =
    mi.grade.toLowerCase().includes("alta") ? "up"
    : mi.grade.toLowerCase().includes("moderada") ? "neutral"
    : "down";
  const coverageDirection: TrendDirection =
    coverage.percent >= 80 ? "up" : coverage.percent >= 50 ? "neutral" : "down";
  const pylintDirection: TrendDirection =
    (pylint.score ?? 0) >= 8 ? "up" : (pylint.score ?? 0) >= 6 ? "neutral" : "down";

  const brandIcon = { color: "var(--brand)" };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <StatCard
        label="CC Média"
        value={cc.average.toFixed(1)}
        trend={{ value: cc.grade, direction: ccDirection }}
        description={`${cc.total_functions} funções analisadas`}
        icon={<GitBranch size={18} style={brandIcon} />}
      />
      <StatCard
        label="Manutenibilidade"
        value={mi.average.toFixed(1)}
        trend={{ value: mi.grade, direction: miDirection }}
        icon={<Wrench size={18} style={brandIcon} />}
      />
      <StatCard
        label="Cobertura"
        value={`${coverage.percent.toFixed(1)}%`}
        trend={{
          value: `${coverage.covered_lines} / ${coverage.num_statements} linhas`,
          direction: coverageDirection,
        }}
        icon={<Shield size={18} style={brandIcon} />}
      />
      <StatCard
        label="Pylint Score"
        value={pylint.score != null ? `${pylint.score}/10` : "N/A"}
        trend={{ value: `${pylint.total_issues} issues`, direction: pylintDirection }}
        icon={<ClipboardList size={18} style={brandIcon} />}
      />
      <StatCard
        label="Bugs Estimados"
        value={halstead.estimated_bugs.toFixed(2)}
        description="Halstead — baseado em operadores/operandos"
        icon={<Bug size={18} style={brandIcon} />}
      />
      <StatCard
        label="Xenon"
        value={xenon.passed ? "Passou" : "Falhou"}
        trend={{ value: `abs ${xenon.thresholds.max_absolute} · avg ${xenon.thresholds.max_average}`, direction: xenon.passed ? "up" : "down" }}
        icon={
          xenon.passed
            ? <CheckCircle2 size={18} style={brandIcon} />
            : <XCircle size={18} style={brandIcon} />
        }
      />
    </div>
  );
}
