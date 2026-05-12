"use client";

import { GitBranch, Wrench, Shield, ClipboardList, Bug, CheckCircle2, XCircle } from "lucide-react";
import { MetrikStatCard } from "./MetrikStatCard";
import type { MetricsReport } from "@/types/metrics";

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

  const ccDirection = cc.grade.toLowerCase().includes("simples") || cc.grade.startsWith("A") ? "up" as const
    : cc.grade.startsWith("B") ? "neutral" as const : "down" as const;
  const miDirection = mi.grade.toLowerCase().includes("alta") ? "up" as const
    : mi.grade.toLowerCase().includes("moderada") ? "neutral" as const : "down" as const;
  const coverageDirection = coverage.percent >= 80 ? "up" as const : coverage.percent >= 50 ? "neutral" as const : "down" as const;
  const pylintDirection = (pylint.score ?? 0) >= 8 ? "up" as const : (pylint.score ?? 0) >= 6 ? "neutral" as const : "down" as const;

  const brandIcon = { color: "var(--brand)" };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
      <MetrikStatCard
        label="CC Média"
        value={cc.average.toFixed(1)}
        trend={{ value: cc.grade, direction: ccDirection }}
        description={`${cc.total_functions} funções analisadas`}
        icon={<GitBranch size={18} style={brandIcon} />}
      />
      <MetrikStatCard
        label="Manutenibilidade"
        value={mi.average.toFixed(1)}
        trend={{ value: mi.grade, direction: miDirection }}
        icon={<Wrench size={18} style={brandIcon} />}
      />
      <MetrikStatCard
        label="Cobertura"
        value={`${coverage.percent.toFixed(1)}%`}
        trend={{
          value: `${coverage.covered_lines} / ${coverage.num_statements} linhas`,
          direction: coverageDirection,
        }}
        icon={<Shield size={18} style={brandIcon} />}
      />
      <MetrikStatCard
        label="Pylint Score"
        value={pylint.score != null ? `${pylint.score}/10` : "N/A"}
        trend={{ value: `${pylint.total_issues} issues`, direction: pylintDirection }}
        icon={<ClipboardList size={18} style={brandIcon} />}
      />
      <MetrikStatCard
        label="Bugs Estimados"
        value={halstead.estimated_bugs.toFixed(2)}
        description="Halstead — baseado em operadores/operandos"
        icon={<Bug size={18} style={brandIcon} />}
      />
      <MetrikStatCard
        label="Xenon"
        value={xenon.passed ? "Passou" : "Falhou"}
        trend={{ value: `max ${xenon.thresholds.max_absolute} / avg ${xenon.thresholds.max_average}`, direction: xenon.passed ? "up" : "down" }}
        icon={
          xenon.passed
            ? <CheckCircle2 size={18} style={brandIcon} />
            : <XCircle size={18} style={brandIcon} />
        }
      />
    </div>
  );
}
