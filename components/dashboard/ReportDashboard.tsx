"use client";

import { TopBar, Card, CardHeader, CardBody, CardTitle } from "@kaiserinc/react";
import {
  GitBranch,
  Wrench,
  ShieldCheck,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { MetriKaLogo } from "@/components/MetriKaLogo";
import { Footer } from "@/components/Footer";
import { SummaryCards } from "./SummaryCards";
import { HalsteadSection } from "./HalsteadSection";
import { XenonBadge } from "./XenonBadge";
import { CCChart } from "@/components/charts/CCChart";
import { MIChart } from "@/components/charts/MIChart";
import { CoverageChart } from "@/components/charts/CoverageChart";
import { PylintChart } from "@/components/charts/PylintChart";
import type { MetricsReport } from "@/types/metrics";

interface Props {
  report: MetricsReport;
  formattedDate: string;
}

export function ReportDashboard({ report, formattedDate }: Props) {
  return (
    <div className="flex flex-col min-h-screen" style={{ background: "var(--bg-base)" }}>
      <TopBar
        logo={<MetriKaLogo />}
        className="relative"
        actions={
          <nav
            aria-label="Breadcrumb"
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              pointerEvents: "none",
            }}
          >
            <ol className="flex items-center gap-1.5 text-xs" style={{ color: "var(--fg-4)", pointerEvents: "auto" }}>
              <li>
                <a href="/" className="hover:text-[var(--fg-2)] transition-colors">MetriK</a>
              </li>
              <li className="flex items-center gap-1.5">
                <span aria-hidden>/</span>
                <span className="font-medium" style={{ color: "var(--fg-2)" }}>{report.project}</span>
              </li>
            </ol>
          </nav>
        }
      />

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
          <Card>
            <CardHeader>
              <CardTitle>
                <span className="flex items-center gap-2">
                  <GitBranch size={16} style={{ color: "var(--brand)" }} />
                  Complexidade Ciclomática
                </span>
              </CardTitle>
            </CardHeader>
            <CardBody>
              <div style={{ maxHeight: 420, overflowY: "auto", overflowX: "hidden", scrollbarWidth: "thin", scrollbarColor: "var(--border-default) transparent" }}>
                <CCChart perFile={report.cyclomatic_complexity.summary.per_file} />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                <span className="flex items-center gap-2">
                  <Wrench size={16} style={{ color: "var(--brand)" }} />
                  Índice de Manutenibilidade
                </span>
              </CardTitle>
            </CardHeader>
            <CardBody>
              <div style={{ maxHeight: 420, overflowY: "auto", overflowX: "hidden", scrollbarWidth: "thin", scrollbarColor: "var(--border-default) transparent" }}>
                <MIChart perFile={report.maintainability_index.summary.per_file} />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                <span className="flex items-center gap-2">
                  <ShieldCheck size={16} style={{ color: "var(--brand)" }} />
                  Cobertura de Testes
                </span>
              </CardTitle>
            </CardHeader>
            <CardBody>
              <div style={{ maxHeight: 420, overflowY: "auto", overflowX: "hidden", scrollbarWidth: "thin", scrollbarColor: "var(--border-default) transparent" }}>
                <CoverageChart byFile={report.test_coverage.by_file} />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                <span className="flex items-center gap-2">
                  <AlertTriangle size={16} style={{ color: "var(--brand)" }} />
                  Issues Pylint{" "}
                  <span style={{ color: "var(--fg-3)", fontWeight: 400 }}>
                    ({report.pylint.summary.total_issues})
                  </span>
                </span>
              </CardTitle>
            </CardHeader>
            <CardBody>
              <PylintChart
                byType={report.pylint.summary.by_type}
                score={report.pylint.summary.score}
              />
            </CardBody>
          </Card>
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
