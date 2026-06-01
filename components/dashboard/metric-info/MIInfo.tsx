import { Wrench } from "lucide-react";

// Scale used by Node/Next/Expo TypeScript metrics scripts (4 of 5 stacks)
const GRADES = [
  { letter: "A", range: "≥ 85",  label: "Alta manutenibilidade",  desc: "Código fácil de ler, modificar e estender.",         color: "var(--success-500)", bg: "rgba(34,197,94,0.08)"  },
  { letter: "B", range: "65–84", label: "Boa manutenibilidade",   desc: "Saudável. Pequenas melhorias podem subir para A.",    color: "var(--success-500)", bg: "rgba(34,197,94,0.05)"  },
  { letter: "C", range: "40–64", label: "Manutenibilidade média", desc: "Funcional, mas mudanças futuras ficam mais difíceis.", color: "var(--warning-500)", bg: "rgba(234,179,8,0.08)"  },
  { letter: "D", range: "20–39", label: "Baixa manutenibilidade", desc: "Código complexo e denso. Refatoração recomendada.",   color: "var(--danger-500)",  bg: "rgba(239,68,68,0.07)"  },
  { letter: "F", range: "< 20",  label: "Crítico",               desc: "Código frágil. Qualquer mudança tem alto risco.",     color: "#dc2626",            bg: "rgba(220,38,38,0.12)"  },
];

const FACTORS = [
  { label: "Volume Halstead",          desc: "Mais operadores/operandos = mais difícil de entender" },
  { label: "Complexidade Ciclomática", desc: "Mais caminhos de execução = mais difícil de testar"  },
  { label: "Linhas de código",         desc: "Funções longas reduzem a manutenibilidade"            },
];

export function MIInfo() {
  return (
    <>
      <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--fg-4)", lineHeight: 1.5 }}>
        Escala de <strong style={{ color: "var(--fg-3)" }}>0 a 100</strong> baseada em fórmula logarítmica —
        não é uma nota escolar linear. Combina CC, volume Halstead e linhas de código em uma única nota.
        A maioria dos projetos reais fica entre <strong style={{ color: "var(--fg-3)" }}>65–95</strong>.
      </p>

      {/* Grade table */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {GRADES.map(({ letter, range, label, desc, color, bg }) => (
          <div key={letter} style={{
            display: "grid", gridTemplateColumns: "28px 1fr auto",
            alignItems: "center", gap: 10,
            padding: "10px 12px",
            borderRadius: "var(--radius-lg)",
            background: bg, border: `1px solid ${color}22`,
          }}>
            <span style={{ fontWeight: 800, fontSize: "1rem", color, textAlign: "center" }}>{letter}</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.85rem", color, marginBottom: 2 }}>{label}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--fg-4)" }}>{desc}</div>
            </div>
            <span style={{ fontSize: "0.75rem", color: "var(--fg-3)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{range}</span>
          </div>
        ))}
      </div>

      {/* Python note */}
      <div style={{
        padding: "9px 12px", borderRadius: "var(--radius-lg)",
        background: "var(--bg-subtle)", border: "1px solid var(--border-subtle)",
        fontSize: "0.75rem", color: "var(--fg-4)", lineHeight: 1.5,
      }}>
        <strong style={{ color: "var(--fg-3)" }}>Python (Radon): </strong>
        usa limiares diferentes — A = ≥ 20, B = 10–19, C = 0–9. Por isso relatórios Python
        exibem o nome da faixa (<em>Alta manutenibilidade</em>) em vez da letra.
      </div>

      {/* What impacts MI */}
      <div>
        <p style={{ margin: "0 0 8px", fontSize: "0.8rem", fontWeight: 600, color: "var(--fg-3)" }}>O que reduz o MI:</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {FACTORS.map(({ label, desc }) => (
            <div key={label} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <span style={{ color: "var(--danger-500)", fontSize: "0.78rem", flexShrink: 0, paddingTop: 1 }}>↓</span>
              <span style={{ fontSize: "0.78rem", color: "var(--fg-4)" }}>
                <strong style={{ color: "var(--fg-3)" }}>{label}</strong> — {desc}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Tip icon={<Wrench size={13} />}>
        Abaixo de C (40) é sinal de dívida técnica acumulada. Priorize refatorar as funções mais longas e com maior CC.
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
