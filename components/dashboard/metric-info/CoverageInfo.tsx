import { Shield, AlertTriangle } from "lucide-react";

const BANDS = [
  { range: "≥ 90%",    label: "Excelente",    desc: "Quase todo caminho de código é validado por testes.",      color: "var(--success-500)", bg: "rgba(34,197,94,0.08)"  },
  { range: "80 – 89%", label: "Boa",          desc: "Cobertura sólida. Pequenos gaps de risco baixo.",           color: "var(--success-500)", bg: "rgba(34,197,94,0.05)"  },
  { range: "50 – 79%", label: "Aceitável",    desc: "Partes críticas podem estar sem cobertura. Revisar.",       color: "var(--warning-500)", bg: "rgba(234,179,8,0.08)"  },
  { range: "< 50%",    label: "Insuficiente", desc: "Alto risco. Refatorações e bugs passam sem ser detectados.", color: "var(--danger-500)",  bg: "rgba(239,68,68,0.08)"  },
];

export function CoverageInfo() {
  return (
    <>
      <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--fg-4)", lineHeight: 1.5 }}>
        Percentual de <strong style={{ color: "var(--fg-3)" }}>linhas de código executadas</strong> durante a rodada de testes.
        Calculada com base no relatório de cobertura gerado pelo framework de testes de cada stack.
      </p>

      {/* Bands */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {BANDS.map(({ range, label, desc, color, bg }) => (
          <div key={range} style={{
            display: "grid", gridTemplateColumns: "80px 90px 1fr",
            alignItems: "center", gap: 10,
            padding: "8px 12px",
            borderRadius: "var(--radius-lg)",
            background: bg, border: `1px solid ${color}22`,
          }}>
            <span style={{ fontSize: "0.78rem", color: "var(--fg-3)", fontVariantNumeric: "tabular-nums" }}>{range}</span>
            <span style={{ fontWeight: 700, fontSize: "0.82rem", color }}>{label}</span>
            <span style={{ fontSize: "0.75rem", color: "var(--fg-4)" }}>{desc}</span>
          </div>
        ))}
      </div>

      {/* Caveat */}
      <div style={{
        padding: "10px 14px", borderRadius: "var(--radius-lg)",
        background: "var(--bg-subtle)", border: "1px solid var(--border-subtle)",
      }}>
        <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--fg-4)", lineHeight: 1.5 }}>
          <strong style={{ color: "var(--fg-3)", display: "inline-flex", alignItems: "center", gap: 4 }}>
            <AlertTriangle size={13} style={{ color: "var(--warning-500)", flexShrink: 0 }} />
            Cobertura alta ≠ código sem bugs.
          </strong>{" "}
          Testa se o código foi executado, não se o comportamento está correto.
          Testes bem escritos com asserções sólidas importam mais do que a porcentagem.
        </p>
      </div>

      <Tip icon={<Shield size={13} />}>
        Foco em cobrir caminhos críticos (autenticação, pagamentos, regras de negócio) antes de perseguir 100%.
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
