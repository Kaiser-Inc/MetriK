"use client";

import { useState } from "react";
import { GitBranch, Wrench, Shield, ClipboardList, Bug, CheckCircle2, XCircle, FlaskConical, Info } from "lucide-react";
import { MetrikStatCard } from "./MetrikStatCard";
import {
  MetricInfoShell,
  CCInfo, MIInfo, CoverageInfo, LintInfo, HalsteadInfo, SecurityInfo, TestsInfo,
} from "./metric-info";
import type { MetricsReport } from "@/types/metrics";
import { STACK_META, deriveStack } from "@/types/metrics";
import {
  isMIAvailable, isHalsteadAvailable, isCCAvailable,
  isCoverageAvailable, isTestsAvailable, isPipAuditAvailable,
} from "@/lib/metricAvailability";

type MetricKey = "cc" | "mi" | "coverage" | "lint" | "halstead" | "security" | "tests";

interface Props {
  report: MetricsReport;
}

function InfoBtn({ metricKey, onClick }: { metricKey: MetricKey; onClick: (k: MetricKey) => void }) {
  return (
    <button
      onClick={() => onClick(metricKey)}
      aria-label="Saiba mais sobre esta métrica"
      title="Saiba mais"
      style={{
        background: "none", border: "none", cursor: "pointer", padding: 0,
        color: "var(--fg-4)", lineHeight: 0, display: "inline-flex",
      }}
    >
      <Info size={12} />
    </button>
  );
}

const MODAL_META: Record<MetricKey, { title: string; subtitle: string }> = {
  cc:       { title: "Complexidade Ciclomática", subtitle: "Conta os caminhos de execução independentes de uma função." },
  mi:       { title: "Índice de Manutenibilidade", subtitle: "Combina CC, Halstead e linhas de código em uma nota de 0 a 100." },
  coverage: { title: "Cobertura de Testes", subtitle: "Percentual de linhas executadas durante a rodada de testes." },
  lint:     { title: "Lint Score", subtitle: "Qualidade de estilo e boas práticas detectadas pelo linter da stack." },
  halstead: { title: "Bugs Estimados (Halstead)", subtitle: "Estimativa matemática de bugs baseada no vocabulário do código." },
  security: { title: "Segurança", subtitle: "Auditoria de vulnerabilidades conhecidas nas dependências do projeto." },
  tests:    { title: "Testes", subtitle: "Contagem de casos de teste executados e aprovados." },
};

export function SummaryCards({ report }: Props) {
  const [openModal, setOpenModal] = useState<MetricKey | null>(null);
  const open = (k: MetricKey) => setOpenModal(k);
  const close = () => setOpenModal(null);

  const cc       = report.cyclomatic_complexity.summary;
  const mi       = report.maintainability_index.summary;
  const coverage = report.test_coverage;
  const lint     = report.lint.summary;
  const halstead = report.halstead.summary;
  const security = report.security;

  const stackMeta = STACK_META[deriveStack(report.project)];

  const ccAvailable       = isCCAvailable(report);
  const miAvailable       = isMIAvailable(report);
  const halsteadAvailable = isHalsteadAvailable(report);
  const coverageAvailable = isCoverageAvailable(report);
  const testsAvailable    = isTestsAvailable(report);

  const ccDirection = !ccAvailable ? "neutral" as const
    : cc.grade.toLowerCase().includes("simples") || cc.grade.startsWith("A") ? "up" as const
    : cc.grade.startsWith("B") ? "neutral" as const : "down" as const;
  const miGrade = mi.grade.toLowerCase();
  const miDirection = !miAvailable ? "neutral" as const
    : (miGrade.includes("alta") || miGrade === "a" || miGrade === "b") ? "up" as const
    : (miGrade.includes("moderada") || miGrade === "c") ? "neutral" as const : "down" as const;
  const coverageDirection = !coverageAvailable ? "neutral" as const
    : coverage.percent >= 80 ? "up" as const : coverage.percent >= 50 ? "neutral" as const : "down" as const;
  const lintAvailable  = lint.score !== null;
  const lintDirection  = !lintAvailable ? "neutral" as const
    : lint.score! >= 8 ? "up" as const : lint.score! >= 6 ? "neutral" as const : "down" as const;

  // Python: pip_audit drives the security card; xenon thresholds rendered separately below.
  const pipAudit    = report.pip_audit;
  const usePipAudit = isPipAuditAvailable(report);
  const secLabel    = usePipAudit ? "pip-audit" : stackMeta.secLabel;
  const secPassed   = usePipAudit ? pipAudit!.passed : security.passed;
  const secTrend    = usePipAudit
    ? (pipAudit!.error
        ? "pip-audit indisponível"
        : `${pipAudit!.total_vulnerabilities} vulnerabilidade${pipAudit!.total_vulnerabilities !== 1 ? "s" : ""}`)
    : `max ${security.thresholds?.max_absolute ?? "?"} / avg ${security.thresholds?.max_average ?? "?"}`;

  const brandIcon = { color: "var(--brand)" };

  // Resolve which modal content to render
  const activeModal = openModal ? MODAL_META[openModal] : null;

  return (
    <>
      {/* ── Single modal shell for all metrics ── */}
      <MetricInfoShell
        open={openModal !== null}
        onClose={close}
        title={activeModal?.title ?? ""}
        subtitle={activeModal?.subtitle}
      >
        {openModal === "cc"       && <CCInfo />}
        {openModal === "mi"       && <MIInfo />}
        {openModal === "coverage" && <CoverageInfo />}
        {openModal === "lint"     && <LintInfo lintLabel={stackMeta.lintLabel} />}
        {openModal === "halstead" && <HalsteadInfo />}
        {openModal === "security" && <SecurityInfo secLabel={secLabel} isPipAudit={usePipAudit} />}
        {openModal === "tests"    && <TestsInfo />}
      </MetricInfoShell>

      {/* ── Cards grid ── */}
      {/* Row 1 — qualidade de código: CC | Manutenibilidade | Lint */}
      {/* Row 2 — testes: Cobertura | Testes | Halstead (Bugs estimados) */}
      {/* Row 3 — segurança: Security (full-width quando Testes está presente) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        {/* ── Linha 1: Qualidade de código ── */}
        <MetrikStatCard
          label="CC Média"
          value={ccAvailable ? cc.average.toFixed(1) : "N/A"}
          trend={ccAvailable
            ? { value: cc.grade, direction: ccDirection }
            : { value: "Não disponível para esta stack", direction: "neutral" }}
          description={ccAvailable ? `${cc.total_functions} funções analisadas` : undefined}
          icon={<GitBranch size={18} style={brandIcon} />}
          labelExtra={<InfoBtn metricKey="cc" onClick={open} />}
        />
        <MetrikStatCard
          label="Manutenibilidade"
          value={miAvailable ? mi.average.toFixed(1) : "N/A"}
          trend={miAvailable
            ? { value: mi.grade, direction: miDirection }
            : { value: "Não disponível para esta stack", direction: "neutral" }}
          icon={<Wrench size={18} style={brandIcon} />}
          labelExtra={<InfoBtn metricKey="mi" onClick={open} />}
        />
        <MetrikStatCard
          label={`${stackMeta.lintLabel} Score`}
          value={lintAvailable ? `${lint.score}/10` : "N/A"}
          trend={lintAvailable
            ? { value: `${lint.total_issues} issues`, direction: lintDirection }
            : { value: "Não disponível para esta stack", direction: "neutral" }}
          icon={<ClipboardList size={18} style={brandIcon} />}
          labelExtra={<InfoBtn metricKey="lint" onClick={open} />}
        />

        {/* ── Linha 2: Testes e complexidade ── */}
        <MetrikStatCard
          label="Cobertura"
          value={coverageAvailable ? `${coverage.percent.toFixed(1)}%` : "N/A"}
          trend={coverageAvailable
            ? { value: `${coverage.covered_lines} / ${coverage.num_statements} linhas`, direction: coverageDirection }
            : { value: "Não disponível para esta stack", direction: "neutral" }}
          icon={<Shield size={18} style={brandIcon} />}
          labelExtra={<InfoBtn metricKey="coverage" onClick={open} />}
        />
        {testsAvailable && (
          <MetrikStatCard
            label="Testes"
            value={`${coverage.tests_passed ?? 0}/${coverage.tests_total}`}
            trend={{
              value: coverage.tests_failed === 0 ? "Todos passaram" : `${coverage.tests_failed} falharam`,
              direction: coverage.tests_failed === 0 ? "up" : "down",
            }}
            icon={<FlaskConical size={18} style={brandIcon} />}
            labelExtra={<InfoBtn metricKey="tests" onClick={open} />}
          />
        )}
        <MetrikStatCard
          label="Bugs Estimados"
          value={halsteadAvailable ? halstead.estimated_bugs.toFixed(2) : "N/A"}
          trend={!halsteadAvailable ? { value: "Não disponível para esta stack", direction: "neutral" } : undefined}
          description={halsteadAvailable ? "Halstead — baseado em operadores/operandos" : undefined}
          icon={<Bug size={18} style={brandIcon} />}
          labelExtra={<InfoBtn metricKey="halstead" onClick={open} />}
        />

        {/* ── Linha 3: Segurança (full-width quando 7 cards presentes) ── */}
        <div style={testsAvailable ? { gridColumn: "1 / -1" } : undefined}>
          <MetrikStatCard
            label={secLabel}
            value={secPassed ? "Passou" : "Falhou"}
            trend={{ value: secTrend, direction: secPassed ? "up" : "down" }}
            icon={
              secPassed
                ? <CheckCircle2 size={18} style={brandIcon} />
                : <XCircle size={18} style={brandIcon} />
            }
            labelExtra={<InfoBtn metricKey="security" onClick={open} />}
          />
        </div>
      </div>
    </>
  );
}
