import { ClipboardList } from "lucide-react";

interface Props {
  lintLabel: string;
}

const PYLINT_BANDS = [
  { range: "9 – 10", label: "Excelente", color: "var(--success-500)", bg: "rgba(34,197,94,0.08)"  },
  { range: "7 – 8",  label: "Bom",       color: "var(--success-500)", bg: "rgba(34,197,94,0.05)"  },
  { range: "5 – 6",  label: "Aceitável", color: "var(--warning-500)", bg: "rgba(234,179,8,0.08)"  },
  { range: "< 5",    label: "Ruim",      color: "var(--danger-500)",  bg: "rgba(239,68,68,0.08)"  },
];

const BIOME_BANDS = [
  { range: "0 problemas", label: "Perfeito",  color: "var(--success-500)", bg: "rgba(34,197,94,0.08)" },
  { range: "1 – 5",       label: "Aceitável", color: "var(--warning-500)", bg: "rgba(234,179,8,0.08)" },
  { range: "> 5",         label: "Atenção",   color: "var(--danger-500)",  bg: "rgba(239,68,68,0.08)" },
];

const RUBOCOP_BANDS = [
  { range: "0 infrações", label: "Perfeito",  color: "var(--success-500)", bg: "rgba(34,197,94,0.08)" },
  { range: "1 – 10",      label: "Aceitável", color: "var(--warning-500)", bg: "rgba(234,179,8,0.08)" },
  { range: "> 10",        label: "Atenção",   color: "var(--danger-500)",  bg: "rgba(239,68,68,0.08)" },
];

const LINTER_INFO: Record<string, { title: string; desc: string; bands: typeof PYLINT_BANDS; scoreType: string }> = {
  Pylint: {
    title: "Pylint (Python)",
    desc: "Analisa estilo, erros e boas práticas. Score de 0 a 10 calculado com base no número e severidade dos problemas encontrados.",
    bands: PYLINT_BANDS,
    scoreType: "Score 0–10",
  },
  Biome: {
    title: "Biome (Node / Next / Expo)",
    desc: "Linter e formatter ultrarrápido para TypeScript e JavaScript. Reporta problemas de estilo, segurança e qualidade. Score calculado pela ausência de problemas.",
    bands: BIOME_BANDS,
    scoreType: "Problemas encontrados",
  },
  RuboCop: {
    title: "RuboCop (Ruby)",
    desc: "Linter oficial do ecossistema Ruby. Verifica conformidade com o Ruby Style Guide e detecta padrões problemáticos de design.",
    bands: RUBOCOP_BANDS,
    scoreType: "Infrações encontradas",
  },
};

const PYLINT_CATEGORIES = [
  { code: "E####", name: "Erro",         desc: "Erro real de código (ex: import inválido, variável não definida)", color: "var(--danger-500)"  },
  { code: "W####", name: "Aviso",        desc: "Potencial problema que pode gerar comportamento inesperado",       color: "var(--warning-500)" },
  { code: "C####", name: "Convenção",    desc: "Violação de estilo (PEP 8, nomenclatura)",                        color: "var(--warning-500)" },
  { code: "R####", name: "Refatoração",  desc: "Sinal de código que pode ser simplificado",                       color: "var(--fg-4)"        },
  { code: "I####", name: "Informação",   desc: "Informações sobre módulos ou imports",                            color: "var(--fg-4)"        },
];

export function LintInfo({ lintLabel }: Props) {
  const info = LINTER_INFO[lintLabel] ?? LINTER_INFO["Biome"];

  return (
    <>
      <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--fg-4)", lineHeight: 1.5 }}>
        {info.desc}
      </p>

      {/* Score bands */}
      <div>
        <p style={{ margin: "0 0 8px", fontSize: "0.78rem", fontWeight: 600, color: "var(--fg-3)" }}>{info.scoreType}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {info.bands.map(({ range, label, color, bg }) => (
            <div key={range} style={{
              display: "grid", gridTemplateColumns: "90px 1fr",
              alignItems: "center", gap: 10,
              padding: "7px 12px",
              borderRadius: "var(--radius-lg)",
              background: bg, border: `1px solid ${color}22`,
            }}>
              <span style={{ fontSize: "0.78rem", color: "var(--fg-3)", fontVariantNumeric: "tabular-nums" }}>{range}</span>
              <span style={{ fontWeight: 700, fontSize: "0.82rem", color }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pylint-specific category breakdown */}
      {lintLabel === "Pylint" && (
        <div>
          <p style={{ margin: "0 0 8px", fontSize: "0.78rem", fontWeight: 600, color: "var(--fg-3)" }}>Categorias Pylint</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {PYLINT_CATEGORIES.map(({ code, name, desc, color }) => (
              <div key={code} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <code style={{ background: "var(--bg-subtle)", padding: "1px 4px", borderRadius: 4, fontSize: "0.72rem", flexShrink: 0, color }}>
                  {code}
                </code>
                <span style={{ fontSize: "0.75rem", color: "var(--fg-4)" }}>
                  <strong style={{ color }}>{name}</strong> — {desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <Tip icon={<ClipboardList size={13} />}>
        {lintLabel === "Pylint"
          ? "Priorize corrigir erros (E####) antes de convenções (C####). Score abaixo de 7 indica dívida técnica significativa."
          : "Zero issues é o ideal. Configure regras no projeto para padronizar o estilo de toda a equipe."}
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
