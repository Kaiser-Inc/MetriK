"use client";

import { useState } from "react";
import {
  DialogRoot,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogClose,
} from "@kaiserinc/react";
import {
  GitBranch,
  Wrench,
  ShieldCheck,
  AlertTriangle,
  Binary,
  Zap,
  HelpCircle,
  X,
  Terminal,
  FolderOpen,
  Monitor,
} from "lucide-react";

const METRICS = [
  {
    icon: <GitBranch size={16} style={{ color: "var(--brand)" }} />,
    name: "Complexidade Ciclomática (CC)",
    desc: "Mede o número de caminhos independentes no código. Quanto menor, mais simples e testável.",
    thresholds: [
      { label: "≤ 5", badge: "A", color: "var(--success-500)" },
      { label: "≤ 10", badge: "B", color: "var(--warning-500)" },
      { label: "> 10", badge: "C+", color: "var(--danger-500)" },
    ],
  },
  {
    icon: <Wrench size={16} style={{ color: "var(--brand)" }} />,
    name: "Índice de Manutenibilidade (MI)",
    desc: "Score 0–100 que combina volume, complexidade e linhas de código. Maior = mais fácil manter.",
    thresholds: [
      { label: "≥ 20", badge: "Fácil", color: "var(--success-500)" },
      { label: "≥ 10", badge: "Moderado", color: "var(--warning-500)" },
      { label: "< 10", badge: "Crítico", color: "var(--danger-500)" },
    ],
  },
  {
    icon: <ShieldCheck size={16} style={{ color: "var(--brand)" }} />,
    name: "Cobertura de Testes",
    desc: "Percentual de linhas executadas pelos testes, gerada pela ferramenta de cobertura da stack.",
    thresholds: [
      { label: "≥ 80%", badge: "Meta", color: "var(--success-500)" },
      { label: "≥ 50%", badge: "Parcial", color: "var(--warning-500)" },
      { label: "< 50%", badge: "Crítico", color: "var(--danger-500)" },
    ],
  },
  {
    icon: <AlertTriangle size={16} style={{ color: "var(--brand)" }} />,
    name: "Análise de Linter",
    desc: "Issues estáticas categorizadas por severidade (error, warning, info). Score 0–10 quando disponível.",
    thresholds: [],
  },
  {
    icon: <Binary size={16} style={{ color: "var(--brand)" }} />,
    name: "Métricas de Halstead",
    desc: "Baseadas em operadores e operandos únicos: volume, dificuldade, esforço e bugs estimados. Disponível em stacks com análise AST configurada.",
    thresholds: [],
  },
  {
    icon: <Zap size={16} style={{ color: "var(--brand)" }} />,
    name: "Segurança / Auditoria",
    desc: "Verifica vulnerabilidades em dependências e problemas de segurança estáticos. Resultado: passou ou falhou.",
    thresholds: [],
  },
];

export function TutorialModal() {
  const [open, setOpen] = useState(false);

  return (
    <DialogRoot open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          title="Como usar"
          aria-label="Abrir tutorial"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 12px",
            borderRadius: 8,
            fontSize: "0.78rem",
            fontWeight: 600,
            cursor: "pointer",
            border: "1px solid var(--border-default)",
            background: "var(--bg-base)",
            color: "var(--fg-3)",
            transition: "color 0.2s, border-color 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--fg-1)";
            e.currentTarget.style.borderColor = "rgba(130,87,230,0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--fg-3)";
            e.currentTarget.style.borderColor = "var(--border-default)";
          }}
        >
          <HelpCircle size={13} />
          Como usar
        </button>
      </DialogTrigger>

      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>Como usar o MetriK</DialogTitle>
          <DialogClose asChild>
            <button
              aria-label="Fechar"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--fg-4)",
                display: "flex",
                alignItems: "center",
                padding: 4,
                borderRadius: 4,
                flexShrink: 0,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--fg-2)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--fg-4)")}
            >
              <X size={16} />
            </button>
          </DialogClose>
        </DialogHeader>

        <DialogBody>
          <div style={{ display: "flex", flexDirection: "column", gap: 28, maxHeight: "70vh", overflowY: "auto", paddingRight: 4 }}>

            <section>
              <p style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--brand)", marginBottom: 8 }}>
                O que é
              </p>
              <p style={{ fontSize: "0.875rem", color: "var(--fg-2)", lineHeight: 1.6 }}>
                <strong style={{ color: "var(--fg-1)" }}>MetriK</strong> é um dashboard de qualidade de código para projetos Python (FastAPI). Ele lê os JSONs gerados pelo script{" "}
                <code style={{ color: "var(--brand)", fontSize: "0.8rem" }}>scripts/metrics.py</code> do boilerplate{" "}
                <a
                  href="https://github.com/Kaiser-Inc/Utils"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--brand)", textDecoration: "underline", textUnderlineOffset: 2 }}
                >
                  KaiserInc-Utils
                </a>
                {" "}e os transforma em gráficos, comparativos e indicadores acionáveis.
              </p>
            </section>

            <section>
              <p style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--brand)", marginBottom: 12 }}>
                Modos de uso
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={{
                  padding: "14px 16px",
                  borderRadius: 10,
                  border: "1px solid var(--border-default)",
                  background: "var(--bg-elevated)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <Monitor size={14} style={{ color: "var(--brand)" }} />
                    <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--fg-1)" }}>Local</span>
                  </div>
                  <p style={{ fontSize: "0.78rem", color: "var(--fg-3)", lineHeight: 1.5, margin: 0 }}>
                    Configure <code style={{ color: "var(--brand)" }}>METRICS_DIR</code> no <code style={{ color: "var(--fg-2)" }}>.env.local</code> apontando para a pasta <code style={{ color: "var(--fg-2)" }}>metrics/</code>. Relatórios carregam automaticamente.
                  </p>
                </div>
                <div style={{
                  padding: "14px 16px",
                  borderRadius: 10,
                  border: "1px solid var(--border-default)",
                  background: "var(--bg-elevated)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <FolderOpen size={14} style={{ color: "var(--brand)" }} />
                    <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--fg-1)" }}>Deploy (Vercel)</span>
                  </div>
                  <p style={{ fontSize: "0.78rem", color: "var(--fg-3)", lineHeight: 1.5, margin: 0 }}>
                    Sem configuração necessária. Use o botão <strong style={{ color: "var(--fg-2)" }}>Selecionar pasta</strong> para carregar a pasta <code style={{ color: "var(--fg-2)" }}>metrics/</code> diretamente do seu computador.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <p style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--brand)", marginBottom: 12 }}>
                Gerando relatórios
              </p>
              <p style={{ fontSize: "0.8rem", color: "var(--fg-3)", marginBottom: 12, lineHeight: 1.5 }}>
                Os relatórios são gerados pelo script <code style={{ color: "var(--brand)" }}>scripts/metrics.py</code> incluso no boilerplate{" "}
                <a
                  href="https://github.com/Kaiser-Inc/Utils"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--brand)", textDecoration: "underline", textUnderlineOffset: 2 }}
                >
                  KaiserInc-Utils
                </a>
                {" "}(Python / FastAPI). Com o projeto configurado:
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{
                  background: "var(--bg-base)",
                  border: "1px solid var(--border-default)",
                  borderRadius: 8,
                  padding: "10px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}>
                  <Terminal size={14} style={{ color: "var(--brand)", flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: "0.7rem", color: "var(--fg-4)", marginBottom: 2 }}>1. Instalar ferramentas (uma vez)</div>
                    <code style={{ fontSize: "0.82rem", color: "var(--fg-2)", fontFamily: "monospace" }}>make metrics-install</code>
                  </div>
                </div>
                <div style={{
                  background: "var(--bg-base)",
                  border: "1px solid var(--border-default)",
                  borderRadius: 8,
                  padding: "10px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}>
                  <Terminal size={14} style={{ color: "var(--brand)", flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: "0.7rem", color: "var(--fg-4)", marginBottom: 2 }}>2. Coletar métricas</div>
                    <code style={{ fontSize: "0.82rem", color: "var(--fg-2)", fontFamily: "monospace" }}>make metrics</code>
                  </div>
                </div>
              </div>
              <p style={{ fontSize: "0.75rem", color: "var(--fg-4)", marginTop: 10, lineHeight: 1.5 }}>
                Gera <code style={{ color: "var(--fg-3)" }}>metrics/report_YYYY-MM-DD_HHMMSS.json</code> (lido pelo MetriK) e também{" "}
                <code style={{ color: "var(--fg-3)" }}>.md</code>, <code style={{ color: "var(--fg-3)" }}>.xlsx</code>, <code style={{ color: "var(--fg-3)" }}>.html</code> e 4 PNGs para uso offline.
              </p>
            </section>

            <section>
              <p style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--brand)", marginBottom: 12 }}>
                As 6 métricas
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {METRICS.map((m) => (
                  <div
                    key={m.name}
                    style={{
                      padding: "12px 14px",
                      borderRadius: 8,
                      border: "1px solid var(--border-default)",
                      background: "var(--bg-elevated)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      {m.icon}
                      <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--fg-1)" }}>{m.name}</span>
                    </div>
                    <p style={{ fontSize: "0.78rem", color: "var(--fg-3)", margin: 0, lineHeight: 1.5 }}>{m.desc}</p>
                    {m.thresholds.length > 0 && (
                      <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                        {m.thresholds.map((t) => (
                          <span
                            key={t.badge}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 5,
                              fontSize: "0.72rem",
                              color: "var(--fg-3)",
                            }}
                          >
                            <span style={{
                              display: "inline-block",
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              background: t.color,
                              flexShrink: 0,
                            }} />
                            {t.label} — {t.badge}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section>
              <p style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--brand)", marginBottom: 8 }}>
                Comparando relatórios
              </p>
              <p style={{ fontSize: "0.8rem", color: "var(--fg-3)", lineHeight: 1.5 }}>
                Na tela inicial, clique em <strong style={{ color: "var(--fg-2)" }}>Comparar</strong> para selecionar 2 relatórios. Uma barra flutuante aparecerá — clique em <strong style={{ color: "var(--fg-2)" }}>Ver comparativo</strong> para abrir a análise side-by-side com deltas coloridos entre as versões.
              </p>
            </section>

          </div>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
}
