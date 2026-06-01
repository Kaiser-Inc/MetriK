"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TopBar, EmptyState, Badge } from "@kaiserinc/react";
import { FolderOpen, Settings, RefreshCw, GitCompare, AlertTriangle, X } from "lucide-react";
import { ReportCard } from "@/components/ReportCard";
import { FilePicker } from "@/components/FilePicker";
import { CompareBar } from "@/components/CompareBar";
import { MetriKLogo } from "@/components/MetriKLogo";
import { Footer } from "@/components/Footer";
import { TutorialModal } from "@/components/TutorialModal";
import { saveReportsToSession, loadReportsFromSession } from "@/lib/fileSystem";
import type { EnrichedItem, ReportListResponse, ReportLoadError } from "@/types/metrics";
import { StackFilter, type StackFilterValue } from "@/components/StackFilter";

interface Props {
  items: EnrichedItem[];
  loadErrors?: ReportLoadError[];
  error?: string;
  deployMode?: boolean;
}

export function HomeContent({ items: initialItems, loadErrors = [], error, deployMode = false }: Props) {
  const router = useRouter();

  const [deployItems, setDeployItems] = useState<EnrichedItem[]>([]);
  const [deployErrors, setDeployErrors] = useState<ReportLoadError[]>([]);
  const [deployLoaded, setDeployLoaded] = useState(false);
  const [errorsDismissed, setErrorsDismissed] = useState(false);

  const [stackFilter, setStackFilter] = useState<StackFilterValue>(() => {
    if (typeof window !== "undefined") {
      return (sessionStorage.getItem("metrik-stack-filter") as StackFilterValue) ?? "all";
    }
    return "all";
  });

  const handleStackFilter = (value: StackFilterValue) => {
    setStackFilter(value);
    sessionStorage.setItem("metrik-stack-filter", value);
  };

  const [compareMode, setCompareMode] = useState(false);
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);

  useEffect(() => {
    if (!deployMode) return;
    const cached = loadReportsFromSession();
    if (cached?.length) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDeployItems(cached);
      setDeployLoaded(true);
    }
  }, [deployMode]);

  const handleDeployLoad = (result: ReportListResponse) => {
    setDeployItems(result.items);
    setDeployErrors(result.errors);
    setErrorsDismissed(false);
    setDeployLoaded(true);
    saveReportsToSession(result.items);
  };

  const handleSelect = (slug: string, checked: boolean) => {
    setSelectedSlugs((prev) => {
      if (checked) return prev.includes(slug) ? prev : [...prev, slug].slice(-2);
      return prev.filter((s) => s !== slug);
    });
  };

  const clearCompare = () => {
    setCompareMode(false);
    setSelectedSlugs([]);
  };

  const allItems = deployMode
    ? deployItems
    : deployLoaded ? deployItems : initialItems;

  // Errors come from whichever source is currently driving the list.
  const activeErrors = (deployMode || deployLoaded) ? deployErrors : loadErrors;
  const showErrorBanner = !errorsDismissed && activeErrors.length > 0;

  const items = stackFilter === "all"
    ? allItems
    : allItems.filter((item) => item.stack === stackFilter);

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "var(--bg-base)" }}>
      <TopBar logo={<MetriKLogo />} actions={<TutorialModal />} />

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">
        {showErrorBanner && (
          <div
            role="alert"
            className="mb-4 rounded-xl"
            style={{
              background: "rgba(220,38,38,0.08)",
              border: "1px solid var(--danger-500)",
              padding: "14px 16px",
            }}
          >
            <div className="flex items-start gap-3">
              <AlertTriangle size={18} style={{ color: "var(--danger-500)", flexShrink: 0, marginTop: 2 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p className="text-sm font-bold" style={{ color: "var(--danger-500)" }}>
                  {activeErrors.length} relatório{activeErrors.length !== 1 ? "s" : ""} não pôde ser carregado{activeErrors.length !== 1 ? "s" : ""}
                </p>
                <ul className="mt-2 flex flex-col gap-1">
                  {activeErrors.map((err) => (
                    <li key={err.file} className="text-xs" style={{ color: "var(--fg-2)" }}>
                      <code style={{ color: "var(--fg-1)" }}>{err.file}</code>
                      {" — "}
                      <span style={{ color: "var(--fg-3)" }}>{err.reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => setErrorsDismissed(true)}
                aria-label="Dispensar"
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--fg-3)", padding: 2 }}
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        {!deployMode && error && (
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
        )}

        {deployMode && !deployLoaded && (
          <div className="flex flex-col items-center justify-center py-20 gap-8">
            <div
              className="mk-dot-grid relative rounded-2xl overflow-hidden w-full max-w-lg"
              style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-default)",
                padding: "36px 32px",
                textAlign: "center",
              }}
            >
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
                <FolderOpen size={36} style={{ color: "var(--brand)", margin: "0 auto 16px" }} />
                <h2 className="text-lg font-bold mb-2" style={{ color: "var(--fg-1)" }}>
                  Selecione a pasta de métricas
                </h2>
                <p className="text-sm mb-6" style={{ color: "var(--fg-3)" }}>
                  Aponte para a pasta <code style={{ color: "var(--brand)" }}>metrics/</code> gerada pelo KaiserInc-Utils
                </p>
                <FilePicker onLoad={handleDeployLoad} />
              </div>
            </div>
            <p style={{ fontSize: "0.72rem", color: "var(--fg-4)" }}>
              Chrome/Edge: seleção de pasta nativa · Firefox/Safari: selecione os arquivos .json individualmente
            </p>
          </div>
        )}

        {(!deployMode || deployLoaded) && !error && (
          <>
            <div
              className="mk-dot-grid relative mb-4 rounded-2xl overflow-hidden"
              style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-default)",
                padding: "32px 32px 28px",
              }}
            >
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
                <div className="flex items-center gap-3 flex-wrap justify-between">
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold" style={{ color: "var(--fg-1)", letterSpacing: "-0.02em" }}>
                      Relatórios
                    </h1>
                    <Badge variant="brand">
                      {stackFilter === "all" ? allItems.length : `${items.length} / ${allItems.length}`}
                    </Badge>
                  </div>

                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                    {deployMode && deployLoaded && (
                      <FilePicker onLoad={handleDeployLoad} compact />
                    )}

                    {!deployMode && (
                      <>
                      <FilePicker onLoad={handleDeployLoad} compact />
                      <button
                        onClick={() => router.refresh()}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          padding: "7px 13px",
                          borderRadius: 8,
                          fontSize: "0.78rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          border: "1px solid var(--border-default)",
                          background: "var(--bg-base)",
                          color: "var(--fg-3)",
                        }}
                      >
                        <RefreshCw size={13} />
                        Atualizar lista
                      </button>
                      </>
                    )}

                    {items.length >= 2 && (
                      <button
                        onClick={() => compareMode ? clearCompare() : setCompareMode(true)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          padding: "7px 13px",
                          borderRadius: 8,
                          fontSize: "0.78rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          border: `1px solid ${compareMode ? "rgba(130,87,230,0.5)" : "var(--border-default)"}`,
                          background: compareMode ? "rgba(130,87,230,0.12)" : "var(--bg-base)",
                          color: compareMode ? "var(--brand)" : "var(--fg-3)",
                          transition: "all 0.2s",
                        }}
                      >
                        <GitCompare size={13} />
                        {compareMode ? "Cancelar" : "Comparar"}
                      </button>
                    )}
                  </div>
                </div>
                <p className="mt-1.5 text-sm" style={{ color: "var(--fg-3)" }}>
                  {compareMode
                    ? "Selecione 2 relatórios para comparar"
                    : "Análises ordenadas da mais recente à mais antiga"}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <StackFilter value={stackFilter} onChange={handleStackFilter} />
            </div>

            {items.length === 0 ? (
              <div className="flex justify-center py-16">
                <EmptyState
                  icon={<FolderOpen size={40} style={{ color: "var(--fg-3)" }} />}
                  title="Nenhum relatório encontrado"
                  description="Execute python metrics.py no projeto alvo para gerar relatórios na pasta configurada."
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {items.map((report) => (
                  <ReportCard
                    key={report.slug}
                    report={report}
                    compareMode={compareMode}
                    selected={selectedSlugs.includes(report.slug)}
                    onSelect={handleSelect}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <Footer />

      {compareMode && selectedSlugs.length > 0 && (
        <CompareBar
          slugA={selectedSlugs[0] ?? null}
          slugB={selectedSlugs[1] ?? null}
          onClear={clearCompare}
        />
      )}
    </div>
  );
}
