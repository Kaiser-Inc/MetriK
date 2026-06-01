import { Code2 } from "lucide-react";

const GRADES = [
  { grade: "A", range: "1 – 5",   label: "Simples",               risk: "Baixo",     color: "var(--success-500)", bg: "rgba(34,197,94,0.08)"  },
  { grade: "B", range: "6 – 10",  label: "Moderado",              risk: "Baixo",     color: "var(--success-500)", bg: "rgba(34,197,94,0.05)"  },
  { grade: "C", range: "11 – 15", label: "Complexo",              risk: "Médio",     color: "var(--warning-500)", bg: "rgba(234,179,8,0.08)"  },
  { grade: "D", range: "16 – 20", label: "Muito complexo",        risk: "Alto",      color: "var(--danger-500)",  bg: "rgba(239,68,68,0.07)"  },
  { grade: "E", range: "21 – 25", label: "Extremamente complexo", risk: "Muito alto",color: "var(--danger-500)",  bg: "rgba(239,68,68,0.10)"  },
  { grade: "F", range: "> 25",    label: "Instável",              risk: "Crítico",   color: "#dc2626",            bg: "rgba(220,38,38,0.15)"  },
];

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <code style={{ background: "var(--bg-subtle)", padding: "1px 4px", borderRadius: 4, fontSize: "0.78rem" }}>
      {children}
    </code>
  );
}

export function CCInfo() {
  return (
    <>
      {/* What adds complexity */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontSize: "0.8rem", color: "var(--fg-4)" }}>Cada</span>
        {["if", "for", "while", "case", "&&", "||", "?"].map((op) => (
          <Tag key={op}>{op}</Tag>
        ))}
        <span style={{ fontSize: "0.8rem", color: "var(--fg-4)" }}>adiciona +1 ao contador.</span>
      </div>

      {/* Grade table */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {GRADES.map(({ grade, range, label, risk, color, bg }) => (
          <div
            key={grade}
            style={{
              display: "grid",
              gridTemplateColumns: "28px 72px 1fr auto",
              alignItems: "center",
              gap: 10,
              padding: "8px 12px",
              borderRadius: "var(--radius-lg)",
              background: bg,
              border: `1px solid ${color}22`,
            }}
          >
            <span style={{ fontWeight: 800, fontSize: "1rem", color, textAlign: "center" }}>{grade}</span>
            <span style={{ fontSize: "0.78rem", color: "var(--fg-3)", fontVariantNumeric: "tabular-nums" }}>{range}</span>
            <span style={{ fontSize: "0.82rem", color: "var(--fg-2)" }}>{label}</span>
            <span style={{ fontSize: "0.75rem", color, fontWeight: 600, textAlign: "right", whiteSpace: "nowrap" }}>{risk}</span>
          </div>
        ))}
      </div>

      {/* Tip */}
      <Tip icon={<Code2 size={13} />}>
        Mantenha funções com CC ≤ 10 (grau B ou melhor). Acima de C são candidatas a refatoração.
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
