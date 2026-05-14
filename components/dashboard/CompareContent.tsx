"use client";

import { useEffect, useState } from "react";
import { TopBar } from "@kaiserinc/react";
import { ArrowLeft, GitCompareArrows } from "lucide-react";
import Link from "next/link";
import { MetriKLogo } from "@/components/MetriKLogo";
import { Footer } from "@/components/Footer";
import { TutorialModal } from "@/components/TutorialModal";
import { DeltaBadge } from "./DeltaBadge";
import { CCChart } from "@/components/charts/CCChart";
import { MIChart } from "@/components/charts/MIChart";
import { CoverageChart } from "@/components/charts/CoverageChart";
import { PylintChart } from "@/components/charts/PylintChart";
import { ChartLegend } from "@/components/charts/ChartLegend";
import { CC_LEGEND, MI_LEGEND, COVERAGE_LEGEND, PYLINT_LEGEND } from "@/lib/chartTheme";
import { loadReportsFromSession } from "@/lib/fileSystem";
import { formatDate } from "@/lib/formatDate";
import type { MetricsReport } from "@/types/metrics";
import { STACK_META, deriveStack } from "@/types/metrics";
import { isCCAvailable, isMIAvailable, isCoverageAvailable } from "@/lib/metricAvailability";

interface Props {
  reportA: MetricsReport | null;
  reportB: MetricsReport | null;
  slugA: string;
  slugB: string;
  dateA?: string;
  dateB?: string;
}

export function CompareContent({ reportA: propA, reportB: propB, slugA, slugB, dateA, dateB }: Props) {
  const [reportA, setReportA] = useState<MetricsReport | null>(propA);
  const [reportB, setReportB] = useState<MetricsReport | null>(propB);
  const [dA, setDA] = useState(dateA ?? "");
  const [dB, setDB] = useState(dateB ?? "");
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
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
  const pylint = {
    a: reportA.pylint.summary.score,
    b: reportB.pylint.summary.score,
  };

  const stackMetaA = STACK_META[deriveStack(reportA.project)];
  const stackMetaB = STACK_META[deriveStack(reportB.project)];

  const ccFiles = new Set([
    ...Object.keys(reportA.cyclomatic_complexity.summary.per_file),
    ...Object.keys(reportB.cyclomatic_complexity.summary.per_file),
  ]);
  const covFiles = new Set([
    ...Object.keys(reportA.test_coverage.by_file),
    ...Object.keys(reportB.test_coverage.by_file),
  ]);
  const fileDiffs = Array.from(new Set([...ccFiles, ...covFiles])).map((f) => {
    const fname = f.split("/").pop() ?? f;
    const ccA = reportA.cyclomatic_complexity.summary.per_file[f] ?? null;
    const ccB = reportB.cyclomatic_complexity.summary.per_file[f] ?? null;
    const covA = reportA.test_coverage.by_file[f] ?? null;
    const covB = reportB.test_coverage.by_file[f] ?? null;
    return { fname, ccA, ccB, covA, covB };
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
        <div
          className="mk-dot-grid relative rounded-2xl overflow-hidden"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", padding: "28px 32px 24px" }}
        >
          <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 0%, rgba(130,87,230,0.12) 0%, transparent 65%)", pointerEvents: "none" }} />
          <div style={{ position: "relative" }}>
            <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.75rem", color: "var(--fg-4)", textDecoration: "none", marginBottom: 12 }}>
              <ArrowLeft size={12} /> Voltar
            </Link>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <GitCompareArrows size={20} style={{ color: "var(--brand)" }} />
              <h1 className="text-xl font-bold" style={{ color: "var(--fg-1)", letterSpacing: "-0.02em" }}>
                Comparativo
              </h1>
            </div>
            <div className="flex items-center gap-3 flex-wrap" style={{ fontSize: "0.82rem", color: "var(--fg-3)" }}>
              <span style={{ color: "var(--fg-1)", fontWeight: 600 }}>{reportA.project}</span>
              <span style={{ color: "var(--fg-4)" }}>·</span>
              <span style={{ fontSize: "0.75rem" }}>{dA}</span>
              <span style={{ color: "var(--brand)", fontWeight: 700, fontSize: "0.7rem" }}>VS</span>
              <span style={{ color: "var(--fg-1)", fontWeight: 600 }}>{reportB.project}</span>
              <span style={{ color: "var(--fg-4)" }}>·</span>
              <span style={{ fontSize: "0.75rem" }}>{dB}</span>
            </div>
          </div>
        </div>

        <section>
          <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--fg-2)" }}>Resumo</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {([
              { title: "CC Médio",     a: cc.a,     b: cc.b,     higherIsBetter: false, unit: ""    },
              { title: "MI Médio",     a: mi.a,     b: mi.b,     higherIsBetter: true,  unit: ""    },
              { title: "Cobertura",    a: cov.a,    b: cov.b,    higherIsBetter: true,  unit: "%"   },
              { title: "Linter Score", a: pylint.a, b: pylint.b, higherIsBetter: true,  unit: "/10", decimals: 2 },
            ] as { title: string; a: number | null; b: number | null; higherIsBetter: boolean; unit: string; decimals?: number }[])
            .map(({ title, a, b, higherIsBetter, unit, decimals }) => {
              const unavailable = a === null || b === null;
              const fmt = (v: number) => `${v.toFixed(decimals ?? 1)}${unit === "/10" ? "/10" : unit}`;
              return (
                <div key={title} style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: 12, padding: "16px 20px", display: "flex", flexDirection: "column", gap: 8 }}>
                  <p style={{ fontSize: "0.72rem", color: "var(--fg-4)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>{title}</p>
                  {unavailable ? (
                    <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--fg-3)" }}>N/A</span>
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

        <section>
          <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--fg-2)" }}>Gráficos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[reportA, reportB].map((r) => (
              <div key={r.generated_at + "-cc"} style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: 12, padding: 20, minHeight: 380, display: "flex", flexDirection: "column" }}>
                <p style={{ marginBottom: 8 }}>{label(r.project)} — CC</p>
                <div style={{ flex: 1, minHeight: 0, maxHeight: 320, overflowY: "auto", scrollbarWidth: "thin", scrollbarColor: "var(--border-default) transparent", display: "flex", flexDirection: "column" }}>
                  <CCChart perFile={r.cyclomatic_complexity.summary.per_file} />
                </div>
                <ChartLegend items={CC_LEGEND} />
              </div>
            ))}
            {[reportA, reportB].map((r) => (
              <div key={r.generated_at + "-cov"} style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: 12, padding: 20, minHeight: 380, display: "flex", flexDirection: "column" }}>
                <p style={{ marginBottom: 8 }}>{label(r.project)} — Cobertura</p>
                <div style={{ flex: 1, minHeight: 0, maxHeight: 320, overflowY: "auto", scrollbarWidth: "thin", scrollbarColor: "var(--border-default) transparent", display: "flex", flexDirection: "column" }}>
                  <CoverageChart byFile={r.test_coverage.by_file} />
                </div>
                <ChartLegend items={COVERAGE_LEGEND} />
              </div>
            ))}
            {[reportA, reportB].map((r) => (
              <div key={r.generated_at + "-mi"} style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: 12, padding: 20, minHeight: 380, display: "flex", flexDirection: "column" }}>
                <p style={{ marginBottom: 8 }}>{label(r.project)} — MI</p>
                <div style={{ flex: 1, minHeight: 0, maxHeight: 320, overflowY: "auto", scrollbarWidth: "thin", scrollbarColor: "var(--border-default) transparent", display: "flex", flexDirection: "column" }}>
                  <MIChart perFile={r.maintainability_index.summary.per_file} />
                </div>
                <ChartLegend items={MI_LEGEND} />
              </div>
            ))}
            {([
              { r: reportA, meta: stackMetaA },
              { r: reportB, meta: stackMetaB },
            ]).map(({ r, meta }) => (
              <div key={r.generated_at + "-pylint"} style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: 12, padding: 20, minHeight: 380, display: "flex", flexDirection: "column" }}>
                <p style={{ marginBottom: 8 }}>{label(r.project)} — {meta.lintLabel}</p>
                <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
                  <PylintChart byType={r.pylint.summary.by_type} score={r.pylint.summary.score} lintLabel={meta.lintLabel} />
                </div>
                <ChartLegend items={PYLINT_LEGEND} />
              </div>
            ))}
          </div>
        </section>

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
                {fileDiffs.map(({ fname, ccA, ccB, covA, covB }, i) => (
                  <tr key={fname} style={{ borderBottom: i < fileDiffs.length - 1 ? "1px solid var(--border-subtle)" : "none" }}>
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
      </main>

      <Footer />
    </div>
  );
}
