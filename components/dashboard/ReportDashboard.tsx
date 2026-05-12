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
import { MetriKaLogo } from "@/components/MetriKaLogo";
import { Footer } from "@/components/Footer";
import { TutorialModal } from "@/components/TutorialModal";
import { ChartCardWithLegend } from "@/components/charts/ChartCardWithLegend";
import { CC_LEGEND, MI_LEGEND, COVERAGE_LEGEND, PYLINT_LEGEND } from "@/lib/chartTheme";
import { SummaryCards } from "./SummaryCards";
import { HalsteadSection } from "./HalsteadSection";
import { XenonBadge } from "./XenonBadge";
import { CCChart } from "@/components/charts/CCChart";
import { MIChart } from "@/components/charts/MIChart";
import { CoverageChart } from "@/components/charts/CoverageChart";
import { PylintChart } from "@/components/charts/PylintChart";
import { loadReportsFromSession } from "@/lib/fileSystem";
import { formatDate } from "@/lib/formatDate";
import type { MetricsReport } from "@/types/metrics";

interface Props {
  report: MetricsReport | null;
  slug: string;
  formattedDate: string;
}

export function ReportDashboard({ report: serverReport, slug, formattedDate: serverDate }: Props) {
  const [report, setReport] = useState<MetricsReport | null>(serverReport);
  const [formattedDate, setFormattedDate] = useState(serverDate);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (serverReport) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    const items = loadReportsFromSession();
    const match = items?.find((i) => i.slug === slug);
    if (match?.rawJson) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setReport(match.rawJson);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormattedDate(formatDate(match.rawJson.generated_at, "long"));
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNotFound(true);
    }
  }, [serverReport, slug]);

  const topBar = (projectName?: string) => (
    <TopBar
      logo={<MetriKaLogo />}
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
            Relatório não encontrado
          </p>
          <p style={{ fontSize: "0.875rem", color: "var(--fg-4)", textAlign: "center", maxWidth: 380 }}>
            Selecione a pasta com os relatórios na página inicial para carregar este relatório.
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

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "var(--bg-base)" }}>
      {topBar(report.project)}

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8 flex flex-col gap-8">
        {/* Project eyebrow header */}
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
            <h1
              className="text-2xl font-bold"
              style={{ color: "var(--fg-1)", letterSpacing: "-0.02em" }}
            >
              {report.project}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <Clock size={12} style={{ color: "var(--fg-4)" }} />
              <span style={{ fontSize: "0.75rem", color: "var(--fg-3)" }}>
                Gerado em {formattedDate}
              </span>
            </div>
          </div>
        </div>

        {/* Summary stats */}
        <section>
          <SummaryCards report={report} />
        </section>

        {/* Charts */}
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
            <CoverageChart byFile={report.test_coverage.by_file} />
          </ChartCardWithLegend>

          <ChartCardWithLegend
            title={
              <>
                Issues Pylint{" "}
                <span style={{ color: "var(--fg-3)", fontWeight: 400 }}>
                  ({report.pylint.summary.total_issues})
                </span>
              </>
            }
            icon={<AlertTriangle size={16} style={{ color: "var(--brand)" }} />}
            legend={PYLINT_LEGEND}
          >
            <PylintChart
              byType={report.pylint.summary.by_type}
              score={report.pylint.summary.score}
            />
          </ChartCardWithLegend>
        </section>

        {/* Halstead */}
        <section>
          <HalsteadSection report={report} />
        </section>

        {/* Xenon */}
        <section>
          <XenonBadge xenon={report.xenon} />
        </section>
      </main>

      <Footer />
    </div>
  );
}
