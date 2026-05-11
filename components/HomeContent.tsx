"use client";

import { TopBar, EmptyState, Badge } from "@kaiserinc/react";
import { FolderOpen, Settings } from "lucide-react";
import { ReportCard } from "@/components/ReportCard";
import { MetriKaLogo } from "@/components/MetriKaLogo";
import { Footer } from "@/components/Footer";
import type { ReportListItem } from "@/types/metrics";

type EnrichedItem = ReportListItem & {
  cc_grade?: string;
  coverage_percent?: number;
  xenon_passed?: boolean;
};

interface Props {
  items: EnrichedItem[];
  error?: string;
}

export function HomeContent({ items, error }: Props) {
  return (
    <div className="flex flex-col min-h-screen" style={{ background: "var(--bg-base)" }}>
      <TopBar logo={<MetriKaLogo />} />

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">
        {error ? (
          <div className="flex justify-center py-16">
            <EmptyState
              icon={<Settings size={40} style={{ color: "var(--fg-3)" }} />}
              title="METRICS_DIR não configurado"
              description="Configure METRICS_DIR em .env.local apontando para a pasta metrics/ do projeto."
              action={
                <pre
                  className="text-xs p-3 rounded-lg text-left mt-2"
                  style={{
                    background: "var(--bg-elevated)",
                    color: "var(--fg-2)",
                    border: "1px solid var(--border-default)",
                  }}
                >
                  {`METRICS_DIR=/caminho/absoluto/para/metrics`}
                </pre>
              }
            />
          </div>
        ) : items.length === 0 ? (
          <div className="flex justify-center py-16">
            <EmptyState
              icon={<FolderOpen size={40} style={{ color: "var(--fg-3)" }} />}
              title="Nenhum relatório encontrado"
              description="Execute python metrics.py no projeto alvo para gerar relatórios na pasta configurada."
            />
          </div>
        ) : (
          <>
            {/* Hero header — radial glow + dot grid */}
            <div
              className="mk-dot-grid relative mb-8 rounded-2xl overflow-hidden"
              style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-default)",
                padding: "32px 32px 28px",
              }}
            >
              {/* Radial brand glow overlay */}
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "radial-gradient(ellipse at 50% 0%, rgba(130,87,230,0.13) 0%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />
              <div style={{ position: "relative" }}>
                {/* Eyebrow */}
                <p style={{
                  fontSize: "0.7rem",
                  fontWeight: 500,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--brand)",
                  marginBottom: 10,
                }}>
                  Code Quality Dashboard
                </p>
                {/* Title row */}
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl font-bold" style={{ color: "var(--fg-1)", letterSpacing: "-0.02em" }}>
                    Relatórios
                  </h1>
                  <Badge variant="brand">{items.length}</Badge>
                </div>
                {/* Subtitle */}
                <p className="mt-1.5 text-sm" style={{ color: "var(--fg-3)" }}>
                  Análises ordenadas da mais recente à mais antiga
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {items.map((report) => (
                <ReportCard key={report.slug} report={report} />
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
