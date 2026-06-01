import { Bug, AlertTriangle } from "lucide-react";

const BANDS = [
  { range: "< 0.5",    label: "Baixo risco",    desc: "Código simples, vocabulário pequeno e bem organizado.",              color: "var(--success-500)", bg: "rgba(34,197,94,0.08)" },
  { range: "0.5 – 1.0",label: "Risco moderado", desc: "Complexidade crescente. Atenção ao tamanho das funções.",            color: "var(--warning-500)", bg: "rgba(234,179,8,0.08)" },
  { range: "> 1.0",    label: "Alto risco",      desc: "Muitos operadores e operandos. Candidato a refatoração urgente.",    color: "var(--danger-500)",  bg: "rgba(239,68,68,0.08)" },
];

export function HalsteadInfo() {
  return (
    <>
      <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--fg-4)", lineHeight: 1.5 }}>
        Estimativa matemática de bugs baseada no <strong style={{ color: "var(--fg-3)" }}>vocabulário do código</strong> —
        quantidade de operadores ({" "}
        <code style={{ background: "var(--bg-subtle)", padding: "1px 4px", borderRadius: 4, fontSize: "0.78rem" }}>+</code>,{" "}
        <code style={{ background: "var(--bg-subtle)", padding: "1px 4px", borderRadius: 4, fontSize: "0.78rem" }}>=</code>,{" "}
        <code style={{ background: "var(--bg-subtle)", padding: "1px 4px", borderRadius: 4, fontSize: "0.78rem" }}>()</code>{" "}
        ...) e operandos (variáveis e literais) únicos vs totais.
      </p>

      {/* Formula */}
      <div style={{
        padding: "12px 14px", borderRadius: "var(--radius-lg)",
        background: "var(--bg-subtle)", border: "1px solid var(--border-subtle)",
        display: "flex", flexDirection: "column", gap: 6,
      }}>
        <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--fg-3)", fontWeight: 600 }}>Fórmula simplificada</p>
        <code style={{ fontSize: "0.85rem", color: "var(--brand)" }}>
          Bugs ≈ Volume / 3000
        </code>
        <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--fg-4)" }}>
          Volume = (total de tokens) × log₂(vocabulário único)
        </p>
      </div>

      {/* Bands */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {BANDS.map(({ range, label, desc, color, bg }) => (
          <div key={range} style={{
            padding: "10px 14px", borderRadius: "var(--radius-lg)",
            background: bg, border: `1px solid ${color}22`,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <span style={{ fontWeight: 700, fontSize: "0.82rem", color }}>{label}</span>
              <span style={{ fontSize: "0.75rem", color: "var(--fg-3)", fontVariantNumeric: "tabular-nums" }}>{range}</span>
            </div>
            <span style={{ fontSize: "0.75rem", color: "var(--fg-4)" }}>{desc}</span>
          </div>
        ))}
      </div>

      {/* Caveat */}
      <div style={{
        padding: "10px 14px", borderRadius: "var(--radius-lg)",
        background: "var(--bg-subtle)", border: "1px solid var(--border-subtle)",
      }}>
        <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--fg-4)", lineHeight: 1.5, display: "flex", gap: 6, alignItems: "flex-start" }}>
          <AlertTriangle size={13} style={{ color: "var(--warning-500)", flexShrink: 0, marginTop: 2 }} />
          <span>
            <strong style={{ color: "var(--fg-3)" }}>É uma estimativa teórica, não bugs reais.</strong>{" "}
            Use como indicador de complexidade acumulada, não como contagem de defeitos.
            Um valor alto sugere que o código é difícil de entender e mais propenso a erros humanos.
          </span>
        </p>
      </div>

      <Tip icon={<Bug size={13} />}>
        Valores acima de 1.0 costumam indicar funções muito longas ou com lógica excessivamente densa.
        Quebre em funções menores e mais coesas.
      </Tip>
    </>
  );
}

function Tip({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <p style={{
      margin: 0, fontSize: "0.75rem", color: "var(--fg-4)", lineHeight: 1.5,
      borderTop: "1px solid var(--border-subtle)", paddingTop: 14,
      display: "flex", gap: 6, alignItems: "flex-start",
    }}>
      <span style={{ color: "var(--brand)", flexShrink: 0, paddingTop: 1 }}>{icon}</span>
      <span><strong style={{ color: "var(--fg-3)" }}>Boa prática: </strong>{children}</span>
    </p>
  );
}
