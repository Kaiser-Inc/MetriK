"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { TopBar } from "@kaiserinc/react";
import {
  GitBranch,
  Wrench,
  ShieldCheck,
  AlertTriangle,
  Clock,
  ArrowLeft,
} from "lucide-react";
import { MetriKLogo } from "@/components/MetriKLogo";
import { Footer } from "@/components/Footer";
import { TutorialModal } from "@/components/TutorialModal";
import { ChartCardWithLegend } from "@/components/charts/ChartCardWithLegend";
import { CC_LEGEND, MI_LEGEND, COVERAGE_LEGEND, PYLINT_LEGEND } from "@/lib/chartTheme";
import { SummaryCards } from "./SummaryCards";
import { HalsteadSection } from "./HalsteadSection";
import { SecurityBadge } from "./SecurityBadge";
import { FlogBadge } from "./FlogBadge";
import { PipAuditSection } from "./PipAuditSection";
import { RuffSection } from "./RuffSection";
import { CCChart } from "@/components/charts/CCChart";
import { MIChart } from "@/components/charts/MIChart";
import { CoverageChart } from "@/components/charts/CoverageChart";
import { LintChart } from "@/components/charts/LintChart";
import { loadReportsFromSession } from "@/lib/fileSystem";
import { formatDate } from "@/lib/formatDate";
import type { MetricsReport } from "@/types/metrics";
import { STACK_META, deriveStack } from "@/types/metrics";
import { StackIcon } from "@/components/icons/StackIcon";
import { isFlogAvailable, isPipAuditAvailable, isRuffAvailable } from "@/lib/metricAvailability";

interface Props {
  report: MetricsReport | null;
  slug: string;
  formattedDate: string;
  loadError?: string;
}

export function ReportDashboard({ report: serverReport, slug, formattedDate: serverDate, loadError }: Props) {
  const [report, setReport] = useState<MetricsReport | null>(serverReport);
  const [formattedDate, setFormattedDate] = useState(serverDate);
  // Initialise notFound from loadError so no setState is needed inside the effect.
  // loadError is a server-rendered prop and will not change after mount.
  const [notFound, setNotFound] = useState(() => !serverReport && !!loadError);

  useEffect(() => {
    if (serverReport) return;
    // loadError already handled by lazy initial state — skip sessionStorage lookup.
    if (loadError) return;
    const items = loadReportsFromSession();
    const match = items?.find((i) => i.slug === slug);
    if (match?.rawJson) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setReport(match.rawJson);
      setFormattedDate(formatDate(match.rawJson.generated_at, "long"));
    } else {
      setNotFound(true);
    }
  }, [serverReport, slug, loadError]);

  const topBar = (projectName?: string) => (
    <TopBar
      logo={<MetriKLogo />}
      className="relative"
      actions={
        <>
          <nav
            aria-label="Breadcrumb"
            className="hidden sm:block"
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              pointerEvents: "none",
            }}
          >
            <ol className="flex items-center gap-1.5 text-xs" style={{ color: "var(--fg-4)", pointerEvents: "auto" }}>
              <li>
                <Link href="/" className="hover:text-[var(--fg-2)] transition-colors">MetriK</Link>
              </li>
              {projectName && (
                <li className="flex items-center gap-1.5">
                  <span aria-hidden>/</span>
                  <span className="font-medium" style={{ color: "var(--fg-2)" }}>{projectName}</span>
                </li>
              )}
            </ol>
          </nav>
          <TutorialModal />
        </>
      }
    />
  );

  if (notFound) {
    return (
      <div className="flex flex-col min-h-screen" style={{ background: "var(--bg-base)" }}>
        {topBar()}
        <main className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
          <p style={{ fontSize: "1rem", color: "var(--fg-2)", fontWeight: 600 }}>
            {loadError ? "Relatório inválido" : "Relatório não encontrado"}
          </p>
          <p style={{ fontSize: "0.875rem", color: "var(--fg-4)", textAlign: "center", maxWidth: 460 }}>
            {loadError
              ? loadError
              : "Selecione a pasta com os relatórios na página inicial para carregar este relatório."}
          </p>
          <Link
            href="/"
            style={{
              marginTop: 8,
              fontSize: "0.875rem",
              color: "var(--brand)",
              textDecoration: "underline",
              textUnderlineOffset: 3,
            }}
          >
            ← Voltar ao início
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex flex-col min-h-screen" style={{ background: "var(--bg-base)" }}>
        {topBar()}
        <main className="flex-1 flex items-center justify-center">
          <p style={{ fontSize: "0.875rem", color: "var(--fg-4)" }}>Carregando...</p>
        </main>
        <Footer />
      </div>
    );
  }

  const stack = deriveStack(report.project);
  const stackMeta = STACK_META[stack];
  const { real_coverage, reported_coverage } = report.test_coverage;

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "var(--bg-base)" }}>
      {topBar(report.project)}

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8 flex flex-col gap-8">
        <div
          className="mk-dot-grid relative rounded-2xl overflow-hidden -mt-4"
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-default)",
            padding: "28px 32px 24px",
          }}
        >
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(ellipse at 50% 0%, rgba(130,87,230,0.12) 0%, transparent 65%)",
              pointerEvents: "none",
            }}
          />
          <div style={{ position: "relative" }}>
            <Link
              href="/"
              style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.75rem", color: "var(--fg-4)", textDecoration: "none", marginBottom: 12 }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--fg-2)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--fg-4)"; }}
            >
              <ArrowLeft size={12} /> Voltar
            </Link>
            <p style={{
              fontSize: "0.7rem",
              fontWeight: 500,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--brand)",
              marginBottom: 8,
            }}>
              Análise de Qualidade
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <h1
                className="text-2xl font-bold"
                style={{ color: "var(--fg-1)", letterSpacing: "-0.02em" }}
              >
                {report.project}
              </h1>
              <span
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                style={{
                  background: `${stackMeta.color}22`,
                  color: stackMeta.color,
                  border: `1px solid ${stackMeta.color}44`,
                }}
              >
                <StackIcon stack={stack} size={13} />
                {stackMeta.label}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Clock size={12} style={{ color: "var(--fg-4)" }} />
              <span style={{ fontSize: "0.75rem", color: "var(--fg-3)" }}>
                Gerado em {formattedDate}
              </span>
            </div>
          </div>
        </div>

        <section>
          <SummaryCards report={report} />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ChartCardWithLegend
            title="Complexidade Ciclomática"
            icon={<GitBranch size={16} style={{ color: "var(--brand)" }} />}
            legend={CC_LEGEND}
            scrollable
          >
            <CCChart perFile={report.cyclomatic_complexity.summary.per_file} />
          </ChartCardWithLegend>

          <ChartCardWithLegend
            title="Índice de Manutenibilidade"
            icon={<Wrench size={16} style={{ color: "var(--brand)" }} />}
            legend={MI_LEGEND}
            scrollable
          >
            <MIChart perFile={report.maintainability_index.summary.per_file} />
          </ChartCardWithLegend>

          <ChartCardWithLegend
            title="Cobertura de Testes"
            icon={<ShieldCheck size={16} style={{ color: "var(--brand)" }} />}
            legend={COVERAGE_LEGEND}
            scrollable
          >
            <>
              <CoverageChart byFile={report.test_coverage.by_file} />
              {real_coverage !== undefined && reported_coverage !== undefined && (
                <p style={{ fontSize: "0.78rem", color: "var(--fg-3)", margin: "8px 0 0", lineHeight: 1.5 }}>
                  Cobertura real: <strong style={{ color: "var(--fg-1)" }}>{real_coverage.toFixed(1)}%</strong>{" "}
                  <span style={{ color: "var(--fg-4)" }}>(reportada: {reported_coverage.toFixed(1)}%)</span>
                </p>
              )}
            </>
          </ChartCardWithLegend>

          <ChartCardWithLegend
            title={
              <>
                {`Issues ${stackMeta.lintLabel}`}{" "}
                <span style={{ color: "var(--fg-3)", fontWeight: 400 }}>
                  {report.lint.summary.score !== null
                    ? `(${report.lint.summary.total_issues})`
                    : "(N/A)"}
                </span>
              </>
            }
            icon={<AlertTriangle size={16} style={{ color: "var(--brand)" }} />}
            legend={PYLINT_LEGEND}
          >
            <LintChart
              byType={report.lint.summary.by_type}
              score={report.lint.summary.score}
              lintLabel={stackMeta.lintLabel}
            />
          </ChartCardWithLegend>
        </section>

        <section>
          <HalsteadSection report={report} />
        </section>

        {/* Python: pip-audit drives the security card; xenon below is relabeled
            as complexity thresholds. Other stacks keep the audit framing. */}
        {isPipAuditAvailable(report) && (
          <section>
            <PipAuditSection pipAudit={report.pip_audit!} />
          </section>
        )}

        <section>
          <SecurityBadge
            security={report.security}
            secLabel={
              stack === 'python-fastapi'
                ? (isPipAuditAvailable(report)
                    ? "Xenon · Limiares de Complexidade"
                    : "Xenon · Segurança / Complexidade")
                : stackMeta.secLabel
            }
          />
        </section>

        {isRuffAvailable(report) && (
          <section>
            <RuffSection ruff={report.ruff!.summary} />
          </section>
        )}

        {isFlogAvailable(report) && (
          <section>
            <FlogBadge flog={report.flog_score!} />
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
