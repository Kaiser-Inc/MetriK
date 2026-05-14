"use client";

import { GitBranch, Wrench, Shield, ClipboardList, Bug, CheckCircle2, XCircle } from "lucide-react";
import { MetrikStatCard } from "./MetrikStatCard";
import type { MetricsReport } from "@/types/metrics";
import { STACK_META, deriveStack } from "@/types/metrics";
import { isMIAvailable, isHalsteadAvailable, isCCAvailable, isCoverageAvailable } from "@/lib/metricAvailability";

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

  const stackMeta = STACK_META[deriveStack(report.project)];

  const ccAvailable = isCCAvailable(report);
  const miAvailable = isMIAvailable(report);
  const halsteadAvailable = isHalsteadAvailable(report);
  const coverageAvailable = isCoverageAvailable(report);

  const ccDirection = !ccAvailable ? "neutral" as const
    : cc.grade.toLowerCase().includes("simples") || cc.grade.startsWith("A") ? "up" as const
    : cc.grade.startsWith("B") ? "neutral" as const : "down" as const;
  const miDirection = !miAvailable ? "neutral" as const
    : mi.grade.toLowerCase().includes("alta") ? "up" as const
    : mi.grade.toLowerCase().includes("moderada") ? "neutral" as const : "down" as const;
  const coverageDirection = !coverageAvailable ? "neutral" as const
    : coverage.percent >= 80 ? "up" as const : coverage.percent >= 50 ? "neutral" as const : "down" as const;
  const lintAvailable = pylint.score !== null;
  const pylintDirection = !lintAvailable ? "neutral" as const
    : pylint.score! >= 8 ? "up" as const : pylint.score! >= 6 ? "neutral" as const : "down" as const;

  const brandIcon = { color: "var(--brand)" };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
      <MetrikStatCard
        label="CC Média"
        value={ccAvailable ? cc.average.toFixed(1) : "N/A"}
        trend={ccAvailable
          ? { value: cc.grade, direction: ccDirection }
          : { value: "Não disponível para esta stack", direction: "neutral" }}
        description={ccAvailable ? `${cc.total_functions} funções analisadas` : undefined}
        icon={<GitBranch size={18} style={brandIcon} />}
      />
      <MetrikStatCard
        label="Manutenibilidade"
        value={miAvailable ? mi.average.toFixed(1) : "N/A"}
        trend={miAvailable ? { value: mi.grade, direction: miDirection } : { value: "Não disponível para esta stack", direction: "neutral" }}
        icon={<Wrench size={18} style={brandIcon} />}
      />
      <MetrikStatCard
        label="Cobertura"
        value={coverageAvailable ? `${coverage.percent.toFixed(1)}%` : "N/A"}
        trend={coverageAvailable
          ? { value: `${coverage.covered_lines} / ${coverage.num_statements} linhas`, direction: coverageDirection }
          : { value: "Não disponível para esta stack", direction: "neutral" }}
        icon={<Shield size={18} style={brandIcon} />}
      />
      <MetrikStatCard
        label={`${stackMeta.lintLabel} Score`}
        value={lintAvailable ? `${pylint.score}/10` : "N/A"}
        trend={lintAvailable
          ? { value: `${pylint.total_issues} issues`, direction: pylintDirection }
          : { value: "Não disponível para esta stack", direction: "neutral" }}
        icon={<ClipboardList size={18} style={brandIcon} />}
      />
      <MetrikStatCard
        label="Bugs Estimados"
        value={halsteadAvailable ? halstead.estimated_bugs.toFixed(2) : "N/A"}
        trend={!halsteadAvailable ? { value: "Não disponível para esta stack", direction: "neutral" } : undefined}
        description={halsteadAvailable ? "Halstead — baseado em operadores/operandos" : undefined}
        icon={<Bug size={18} style={brandIcon} />}
      />
      <MetrikStatCard
        label={stackMeta.secLabel}
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
