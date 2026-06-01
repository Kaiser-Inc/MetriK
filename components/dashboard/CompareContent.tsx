"use client";

import { useEffect, useState } from "react";
import { TopBar } from "@kaiserinc/react";
import { ArrowLeft, GitCompareArrows, ShieldCheck, ShieldAlert, FlaskConical } from "lucide-react";
import Link from "next/link";
import { MetriKLogo } from "@/components/MetriKLogo";
import { Footer } from "@/components/Footer";
import { TutorialModal } from "@/components/TutorialModal";
import { DeltaBadge } from "./DeltaBadge";
import { CCChart } from "@/components/charts/CCChart";
import { MIChart } from "@/components/charts/MIChart";
import { CoverageChart } from "@/components/charts/CoverageChart";
import { LintChart } from "@/components/charts/LintChart";
import { ChartLegend } from "@/components/charts/ChartLegend";
import { StackIcon } from "@/components/icons/StackIcon";
import { CC_LEGEND, MI_LEGEND, COVERAGE_LEGEND, PYLINT_LEGEND } from "@/lib/chartTheme";
import { loadReportsFromSession } from "@/lib/fileSystem";
import { formatDate } from "@/lib/formatDate";
import type { MetricsReport } from "@/types/metrics";
import { STACK_META, deriveStack } from "@/types/metrics";
import {
  isCCAvailable,
  isMIAvailable,
  isCoverageAvailable,
  isHalsteadAvailable,
  isTestsAvailable,
  isPipAuditAvailable,
} from "@/lib/metricAvailability";

interface Props {
  reportA: MetricsReport | null;
  reportB: MetricsReport | null;
  slugA: string;
  slugB: string;
  dateA?: string;
  dateB?: string;
}

function NAPlaceholder({ label }: { label: string }) {
  return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 6, opacity: 0.45, minHeight: 260 }}>
      <span style={{ fontSize: "1.6rem", color: "var(--fg-4)" }}>—</span>
      <span style={{ fontSize: "0.72rem", color: "var(--fg-4)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label} indisponível</span>
    </div>
  );
}

function SecuritySide({ r }: { r: MetricsReport }) {
  const hasPipAudit = isPipAuditAvailable(r);
  const sec = r.security;
  const pip = r.pip_audit;

  const secPassed = sec?.passed ?? true;
  // Extract vuln count from output string ("X vulnerabilities found")
  const outputVulns = sec?.output ? (() => {
    const m = sec.output.match(/(\d+)\s+vulnerabilit/i);
    return m ? parseInt(m[1], 10) : 0;
  })() : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {/* Main security slot (pnpm audit --prod / xenon thresholds) */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {secPassed
          ? <ShieldCheck size={15} style={{ color: "var(--success-500)", flexShrink: 0 }} />
          : <ShieldAlert size={15} style={{ color: "var(--error-500)", flexShrink: 0 }} />
        }
        <span style={{ fontSize: "0.8rem", color: secPassed ? "var(--success-500)" : "var(--error-500)", fontWeight: 600 }}>
          {secPassed ? "Passou" : `Falhou${outputVulns > 0 ? ` (${outputVulns})` : ""}`}
        </span>
        <span style={{ fontSize: "0.7rem", color: "var(--fg-4)", marginLeft: 2 }}>
          auditoria
        </span>
      </div>

      {/* pip_audit — Python CVE */}
      {hasPipAudit && (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {pip?.error
            ? <ShieldAlert size={14} style={{ color: "var(--warning-500)", flexShrink: 0 }} />
            : pip?.passed
              ? <ShieldCheck size={14} style={{ color: "var(--success-500)", flexShrink: 0 }} />
              : <ShieldAlert size={14} style={{ color: "var(--error-500)", flexShrink: 0 }} />
          }
          <span style={{ fontSize: "0.78rem", color: pip?.error ? "var(--warning-500)" : pip?.passed ? "var(--success-500)" : "var(--error-500)", fontWeight: 500 }}>
            {pip?.error
              ? "pip-audit indisponível"
              : pip?.passed
                ? "0 CVEs"
                : `${pip?.total_vulnerabilities ?? "?"} CVEs`
            }
          </span>
          <span style={{ fontSize: "0.7rem", color: "var(--fg-4)" }}>pip-audit</span>
        </div>
      )}

      {/* CVE list if pip_audit has vulns */}
      {hasPipAudit && !pip?.passed && !pip?.error && (pip?.vulnerabilities?.length ?? 0) > 0 && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 2 }}>
          {pip!.vulnerabilities.slice(0, 3).map((v) => (
            <span key={v.id} style={{ fontSize: "0.68rem", fontWeight: 600, color: "var(--error-500)", background: "var(--bg-base)", border: "1px solid var(--error-500)", borderRadius: 4, padding: "1px 6px" }}>
              {v.id ?? v.package}
            </span>
          ))}
          {pip!.vulnerabilities.length > 3 && (
            <span style={{ fontSize: "0.68rem", color: "var(--fg-4)" }}>+{pip!.vulnerabilities.length - 3}</span>
          )}
        </div>
      )}
    </div>
  );
}

function TestsSide({ r }: { r: MetricsReport }) {
  const total = r.test_coverage?.tests_total ?? 0;
  const passed = r.test_coverage?.tests_passed ?? 0;
  const failed = total - passed;
  const pct = total > 0 ? Math.round((passed / total) * 100) : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <FlaskConical size={14} style={{ color: "var(--brand)", flexShrink: 0 }} />
        <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--fg-1)" }}>
          {passed}/{total}
        </span>
        <span style={{ fontSize: "0.72rem", color: "var(--fg-4)" }}>{pct}% ok</span>
      </div>
      {failed > 0 && (
        <span style={{ fontSize: "0.72rem", color: "var(--error-500)", marginLeft: 22 }}>
          {failed} falhou
        </span>
      )}
    </div>
  );
}

export function CompareContent({ reportA: propA, reportB: propB, slugA, slugB, dateA, dateB }: Props) {
  const [reportA, setReportA] = useState<MetricsReport | null>(propA);
  const [reportB, setReportB] = useState<MetricsReport | null>(propB);
  const [dA, setDA] = useState(dateA ?? "");
  const [dB, setDB] = useState(dateB ?? "");
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (propA && propB) { setSessionChecked(true); return; }
    const cached = loadReportsFromSession();
    if (cached) {
      const itemA = cached.find((i) => i.slug === slugA);
      const itemB = cached.find((i) => i.slug === slugB);

      if (itemA?.rawJson) { setReportA(itemA.rawJson); setDA(formatDate(itemA.generated_at, "long")); }
      if (itemB?.rawJson) { setReportB(itemB.rawJson); setDB(formatDate(itemB.generated_at, "long")); }
    }
    setSessionChecked(true);
  }, [propA, propB, slugA, slugB]);

  if (!sessionChecked) {
    return (
      <div className="flex flex-col min-h-screen" style={{ background: "var(--bg-base)" }}>
        <TopBar logo={<MetriKLogo />} />
        <main className="flex-1 flex items-center justify-center">
          <p style={{ color: "var(--fg-3)" }}>Carregando relatórios…</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!reportA || !reportB) {
    return (
      <div className="flex flex-col min-h-screen" style={{ background: "var(--bg-base)" }}>
        <TopBar logo={<MetriKLogo />} />
        <main className="flex-1 flex items-center justify-center flex-col gap-4">
          <p style={{ fontSize: "1rem", fontWeight: 600, color: "var(--fg-2)" }}>
            Relatórios não encontrados
          </p>
          <p style={{ fontSize: "0.82rem", color: "var(--fg-4)", maxWidth: 360, textAlign: "center" }}>
            {!slugA || !slugB
              ? "Parâmetros ausentes na URL. Selecione 2 relatórios na home e clique em Comparar."
              : "Os relatórios não estão disponíveis na sessão atual. Volte à home e selecione-os novamente."}
          </p>
          <Link href="/" style={{ fontSize: "0.82rem", color: "var(--brand)", textDecoration: "none", display: "flex", alignItems: "center", gap: 5 }}>
            <ArrowLeft size={13} /> Voltar à home
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const stackA = deriveStack(reportA.project);
  const stackB = deriveStack(reportB.project);
  const stackMetaA = STACK_META[stackA];
  const stackMetaB = STACK_META[stackB];

  const cc = {
    a: isCCAvailable(reportA) ? reportA.cyclomatic_complexity.summary.average : null,
    b: isCCAvailable(reportB) ? reportB.cyclomatic_complexity.summary.average : null,
  };
  const mi = {
    a: isMIAvailable(reportA) ? reportA.maintainability_index.summary.average : null,
    b: isMIAvailable(reportB) ? reportB.maintainability_index.summary.average : null,
  };
  const cov = {
    a: isCoverageAvailable(reportA) ? reportA.test_coverage.percent : null,
    b: isCoverageAvailable(reportB) ? reportB.test_coverage.percent : null,
  };
  const lint = {
    a: reportA.lint.summary.score,
    b: reportB.lint.summary.score,
  };
  const hal = {
    a: isHalsteadAvailable(reportA) ? (reportA.halstead?.summary?.estimated_bugs ?? null) : null,
    b: isHalsteadAvailable(reportB) ? (reportB.halstead?.summary?.estimated_bugs ?? null) : null,
  };

  const testsEither = isTestsAvailable(reportA) || isTestsAvailable(reportB);

  // Guard per_file access for diff table
  const ccFilesA = isCCAvailable(reportA) ? Object.keys(reportA.cyclomatic_complexity.summary.per_file ?? {}) : [];
  const ccFilesB = isCCAvailable(reportB) ? Object.keys(reportB.cyclomatic_complexity.summary.per_file ?? {}) : [];
  const covFilesA = isCoverageAvailable(reportA) ? Object.keys(reportA.test_coverage.by_file ?? {}) : [];
  const covFilesB = isCoverageAvailable(reportB) ? Object.keys(reportB.test_coverage.by_file ?? {}) : [];
  const allFiles = Array.from(new Set([...ccFilesA, ...ccFilesB, ...covFilesA, ...covFilesB]));

  const fileDiffs = allFiles.map((f) => {
    const fname = f.split("/").pop() ?? f;
    const ccA = isCCAvailable(reportA) ? (reportA.cyclomatic_complexity.summary.per_file?.[f] ?? null) : null;
    const ccB = isCCAvailable(reportB) ? (reportB.cyclomatic_complexity.summary.per_file?.[f] ?? null) : null;
    const covA = isCoverageAvailable(reportA) ? (reportA.test_coverage.by_file?.[f] ?? null) : null;
    const covB = isCoverageAvailable(reportB) ? (reportB.test_coverage.by_file?.[f] ?? null) : null;
    return { path: f, fname, ccA, ccB, covA, covB };
  }).sort((a, b) => {
    const dA2 = a.ccA != null && a.ccB != null ? Math.abs(a.ccB - a.ccA) : 0;
    const dB2 = b.ccA != null && b.ccB != null ? Math.abs(b.ccB - b.ccA) : 0;
    return dB2 - dA2;
  });

  const label = (v: string) => (
    <span style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--brand)" }}>
      {v}
    </span>
  );

  const summaryCards: {
    title: string;
    a: number | null;
    b: number | null;
    higherIsBetter: boolean;
    unit: string;
    decimals?: number;
  }[] = [
    { title: "CC Médio",      a: cc.a,   b: cc.b,   higherIsBetter: false, unit: ""     },
    { title: "MI Médio",      a: mi.a,   b: mi.b,   higherIsBetter: true,  unit: ""     },
    { title: "Cobertura",     a: cov.a,  b: cov.b,  higherIsBetter: true,  unit: "%"    },
    { title: "Linter Score",  a: lint.a, b: lint.b, higherIsBetter: true,  unit: "/10", decimals: 2 },
    { title: "Bugs Estimados",a: hal.a,  b: hal.b,  higherIsBetter: false, unit: "",    decimals: 2 },
  ];

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "var(--bg-base)" }}>
      <TopBar
        logo={<MetriKLogo />}
        className="relative"
        actions={
          <>
            <nav
              aria-label="Breadcrumb"
              className="hidden sm:block"
              style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", pointerEvents: "none" }}
            >
              <ol className="flex items-center gap-1.5 text-xs" style={{ color: "var(--fg-4)", pointerEvents: "auto" }}>
                <li>
                  <Link href="/" className="hover:text-[var(--fg-2)] transition-colors">MetriK</Link>
                </li>
                <li className="flex items-center gap-1.5">
                  <span aria-hidden>/</span>
                  <span className="font-medium" style={{ color: "var(--fg-2)" }}>Comparativo</span>
                </li>
              </ol>
            </nav>
            <TutorialModal />
          </>
        }
      />

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8 flex flex-col gap-8">

        {/* Hero / header */}
        <div
          className="mk-dot-grid relative rounded-2xl overflow-hidden"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", padding: "28px 32px 24px" }}
        >
          <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 0%, rgba(130,87,230,0.12) 0%, transparent 65%)", pointerEvents: "none" }} />
          <div style={{ position: "relative" }}>
            <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.75rem", color: "var(--fg-4)", textDecoration: "none", marginBottom: 12 }}>
              <ArrowLeft size={12} /> Voltar
            </Link>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <GitCompareArrows size={20} style={{ color: "var(--brand)" }} />
              <h1 className="text-xl font-bold" style={{ color: "var(--fg-1)", letterSpacing: "-0.02em" }}>
                Comparativo
              </h1>
            </div>

            {/* Side-by-side project labels */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 12, alignItems: "center" }}>
              {/* Report A */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <StackIcon stack={stackA} size={14} />
                  <span style={{ fontSize: "0.68rem", fontWeight: 600, color: stackMetaA.color, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                    {stackMetaA.label}
                  </span>
                </div>
                <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--fg-1)" }}>{reportA.project}</span>
                <span style={{ fontSize: "0.72rem", color: "var(--fg-4)" }}>{dA || formatDate(reportA.generated_at, "long")}</span>
              </div>

              {/* VS badge */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "var(--brand)", letterSpacing: "0.12em", background: "var(--bg-base)", border: "1px solid var(--border-default)", borderRadius: 6, padding: "3px 8px" }}>
                  VS
                </span>
              </div>

              {/* Report B */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: "0.68rem", fontWeight: 600, color: stackMetaB.color, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                    {stackMetaB.label}
                  </span>
                  <StackIcon stack={stackB} size={14} />
                </div>
                <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--fg-1)" }}>{reportB.project}</span>
                <span style={{ fontSize: "0.72rem", color: "var(--fg-4)" }}>{dB || formatDate(reportB.generated_at, "long")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Summary metrics */}
        <section>
          <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--fg-2)" }}>Resumo</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {summaryCards.map(({ title, a, b, higherIsBetter, unit, decimals }) => {
              const unavailable = a === null && b === null;
              const partial = (a === null) !== (b === null);
              const fmt = (v: number) => `${v.toFixed(decimals ?? 1)}${unit === "/10" ? "/10" : unit}`;
              return (
                <div key={title} style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: 12, padding: "16px 20px", display: "flex", flexDirection: "column", gap: 8 }}>
                  <p style={{ fontSize: "0.72rem", color: "var(--fg-4)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>{title}</p>
                  {unavailable ? (
                    <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--fg-3)" }}>N/A</span>
                  ) : partial ? (
                    <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ fontSize: "1rem", fontWeight: 700, color: "var(--fg-1)" }}>{a != null ? fmt(a) : "N/A"}</span>
                      <span style={{ color: "var(--fg-4)", fontSize: "0.8rem" }}>→</span>
                      <span style={{ fontSize: "1rem", fontWeight: 700, color: "var(--fg-1)" }}>{b != null ? fmt(b) : "N/A"}</span>
                    </div>
                  ) : (
                    <>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--fg-1)" }}>{fmt(a!)}</span>
                        <span style={{ color: "var(--fg-4)", fontSize: "0.8rem" }}>→</span>
                        <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--fg-1)" }}>{fmt(b!)}</span>
                      </div>
                      <DeltaBadge valueA={a!} valueB={b!} higherIsBetter={higherIsBetter} unit={unit === "/10" ? "" : unit} decimals={decimals ?? 1} />
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Security comparison */}
        <section>
          <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--fg-2)" }}>Segurança</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {([
              { r: reportA, meta: stackMetaA, label: reportA.project },
              { r: reportB, meta: stackMetaB, label: reportB.project },
            ] as { r: MetricsReport; meta: typeof stackMetaA; label: string }[]).map(({ r, meta, label: projLabel }) => (
              <div key={projLabel} style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: 12, padding: "16px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
                <p style={{ fontSize: "0.7rem", color: meta.color, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>{projLabel}</p>
                <SecuritySide r={r} />
              </div>
            ))}
          </div>
        </section>

        {/* Tests comparison (conditional) */}
        {testsEither && (
          <section>
            <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--fg-2)" }}>Testes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {([
                { r: reportA, meta: stackMetaA, projLabel: reportA.project },
                { r: reportB, meta: stackMetaB, projLabel: reportB.project },
              ] as { r: MetricsReport; meta: typeof stackMetaA; projLabel: string }[]).map(({ r, meta, projLabel }) => (
                <div key={projLabel} style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: 12, padding: "16px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
                  <p style={{ fontSize: "0.7rem", color: meta.color, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>{projLabel}</p>
                  {isTestsAvailable(r)
                    ? <TestsSide r={r} />
                    : <span style={{ fontSize: "0.78rem", color: "var(--fg-4)" }}>Sem dados de testes</span>
                  }
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Charts */}
        <section>
          <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--fg-2)" }}>Gráficos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* CC */}
            {[reportA, reportB].map((r) => (
              <div key={r.generated_at + "-cc"} style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: 12, padding: 20, minHeight: 380, display: "flex", flexDirection: "column" }}>
                <p style={{ marginBottom: 8 }}>{label(r.project)} — CC</p>
                {isCCAvailable(r) ? (
                  <>
                    <div style={{ flex: 1, minHeight: 0, maxHeight: 320, overflowY: "auto", scrollbarWidth: "thin", scrollbarColor: "var(--border-default) transparent", display: "flex", flexDirection: "column" }}>
                      <CCChart perFile={r.cyclomatic_complexity.summary.per_file ?? {}} />
                    </div>
                    <ChartLegend items={CC_LEGEND} />
                  </>
                ) : <NAPlaceholder label="CC" />}
              </div>
            ))}

            {/* Coverage */}
            {[reportA, reportB].map((r) => (
              <div key={r.generated_at + "-cov"} style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: 12, padding: 20, minHeight: 380, display: "flex", flexDirection: "column" }}>
                <p style={{ marginBottom: 8 }}>{label(r.project)} — Cobertura</p>
                {isCoverageAvailable(r) ? (
                  <>
                    <div style={{ flex: 1, minHeight: 0, maxHeight: 320, overflowY: "auto", scrollbarWidth: "thin", scrollbarColor: "var(--border-default) transparent", display: "flex", flexDirection: "column" }}>
                      <CoverageChart byFile={r.test_coverage.by_file ?? {}} />
                    </div>
                    <ChartLegend items={COVERAGE_LEGEND} />
                  </>
                ) : <NAPlaceholder label="Cobertura" />}
              </div>
            ))}

            {/* MI */}
            {[reportA, reportB].map((r) => (
              <div key={r.generated_at + "-mi"} style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: 12, padding: 20, minHeight: 380, display: "flex", flexDirection: "column" }}>
                <p style={{ marginBottom: 8 }}>{label(r.project)} — MI</p>
                {isMIAvailable(r) ? (
                  <>
                    <div style={{ flex: 1, minHeight: 0, maxHeight: 320, overflowY: "auto", scrollbarWidth: "thin", scrollbarColor: "var(--border-default) transparent", display: "flex", flexDirection: "column" }}>
                      <MIChart perFile={r.maintainability_index.summary.per_file ?? {}} />
                    </div>
                    <ChartLegend items={MI_LEGEND} />
                  </>
                ) : <NAPlaceholder label="MI" />}
              </div>
            ))}

            {/* Lint */}
            {([
              { r: reportA, meta: stackMetaA },
              { r: reportB, meta: stackMetaB },
            ] as { r: MetricsReport; meta: typeof stackMetaA }[]).map(({ r, meta }) => (
              <div key={r.generated_at + "-lint"} style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: 12, padding: 20, minHeight: 380, display: "flex", flexDirection: "column" }}>
                <p style={{ marginBottom: 8 }}>{label(r.project)} — {meta.lintLabel}</p>
                <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
                  <LintChart byType={r.lint.summary.by_type} score={r.lint.summary.score} lintLabel={meta.lintLabel} />
                </div>
                <ChartLegend items={PYLINT_LEGEND} />
              </div>
            ))}
          </div>
        </section>

        {/* Diff per file */}
        {fileDiffs.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--fg-2)" }}>Diff por Arquivo</h2>
            <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: 12, overflow: "hidden" }}>
              <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
                <table style={{ width: "100%", minWidth: 520, borderCollapse: "collapse", fontSize: "0.78rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--border-default)" }}>
                      {["Arquivo", "CC (A)", "CC (B)", "Δ CC", "Cob. (A)", "Cob. (B)", "Δ Cob."].map((h) => (
                        <th key={h} style={{ padding: "10px 16px", textAlign: "left", color: "var(--fg-4)", fontWeight: 600, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {fileDiffs.map(({ path, fname, ccA, ccB, covA, covB }, i) => (
                      <tr key={path} style={{ borderBottom: i < fileDiffs.length - 1 ? "1px solid var(--border-subtle)" : "none" }}>
                        <td style={{ padding: "9px 16px", color: "var(--fg-2)", fontFamily: "monospace", fontSize: "0.73rem" }}>{fname}</td>
                        <td style={{ padding: "9px 16px", color: "var(--fg-3)" }}>{ccA?.toFixed(1) ?? "—"}</td>
                        <td style={{ padding: "9px 16px", color: "var(--fg-3)" }}>{ccB?.toFixed(1) ?? "—"}</td>
                        <td style={{ padding: "9px 16px" }}>
                          {ccA != null && ccB != null
                            ? <DeltaBadge valueA={ccA} valueB={ccB} higherIsBetter={false} decimals={1} />
                            : <span style={{ color: "var(--fg-4)" }}>—</span>}
                        </td>
                        <td style={{ padding: "9px 16px", color: "var(--fg-3)" }}>{covA != null ? `${covA.toFixed(1)}%` : "—"}</td>
                        <td style={{ padding: "9px 16px", color: "var(--fg-3)" }}>{covB != null ? `${covB.toFixed(1)}%` : "—"}</td>
                        <td style={{ padding: "9px 16px" }}>
                          {covA != null && covB != null
                            ? <DeltaBadge valueA={covA} valueB={covB} higherIsBetter unit="%" decimals={1} />
                            : <span style={{ color: "var(--fg-4)" }}>—</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

      </main>

      <Footer />
    </div>
  );
}
