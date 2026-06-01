import { CheckCircle2 } from "lucide-react";

interface Props {
  secLabel: string;
  isPipAudit?: boolean;
}

const SEVERITY = [
  { level: "Crítico",  desc: "Exploração remota imediata. Corrija antes de qualquer deploy.",         color: "#dc2626", bg: "rgba(220,38,38,0.15)"   },
  { level: "Alto",     desc: "Risco grave. Atualize o pacote ou aplique workaround urgente.",         color: "var(--danger-500)",  bg: "rgba(239,68,68,0.08)"   },
  { level: "Moderado", desc: "Risco controlado. Planeje correção no próximo ciclo.",                  color: "var(--warning-500)", bg: "rgba(234,179,8,0.08)"   },
  { level: "Baixo",    desc: "Risco mínimo. Monitore e corrija oportunisticamente.",                  color: "var(--fg-4)",        bg: "var(--bg-subtle)"        },
];

const TOOLS: Record<string, { name: string; desc: string; what: string }> = {
  "pip-audit": {
    name: "pip-audit",
    desc: "Auditoria de dependências Python contra o banco de CVEs do PyPA.",
    what: "Compara os pacotes instalados com vulnerabilidades conhecidas (CVEs) reportadas no PyPA Advisory Database.",
  },
  "pnpm audit": {
    name: "pnpm audit",
    desc: "Auditoria do pnpm contra o banco de vulnerabilidades do GitHub Advisory Database.",
    what: "Analisa o pnpm-lock.yaml (apenas dependências de produção) e verifica cada pacote contra vulnerabilidades conhecidas.",
  },
  "bundler-audit": {
    name: "bundler-audit",
    desc: "Auditoria de gems Ruby contra o Ruby Advisory Database.",
    what: "Verifica o Gemfile.lock contra vulnerabilidades conhecidas e gems com checksum inválido.",
  },
  "Xenon": {
    name: "Xenon",
    desc: "Monitor de complexidade ciclomática para Python com thresholds configuráveis.",
    what: "Não verifica segurança em si — garante que a complexidade do código não ultrapassa limites definidos (max-absolute, max-modules, max-average).",
  },
};

export function SecurityInfo({ secLabel, isPipAudit }: Props) {
  const tool = TOOLS[secLabel] ?? TOOLS["pnpm audit"];

  return (
    <>
      {/* Tool description */}
      <div style={{
        padding: "12px 14px", borderRadius: "var(--radius-lg)",
        background: "var(--bg-subtle)", border: "1px solid var(--border-subtle)",
      }}>
        <p style={{ margin: "0 0 6px", fontWeight: 600, fontSize: "0.85rem", color: "var(--fg-2)" }}>
          {tool.name}
        </p>
        <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--fg-4)", lineHeight: 1.5 }}>
          {tool.what}
        </p>
      </div>

      {/* Severity levels — only for CVE-based tools */}
      {secLabel !== "Xenon" && (
        <div>
          <p style={{ margin: "0 0 8px", fontSize: "0.78rem", fontWeight: 600, color: "var(--fg-3)" }}>Níveis de severidade</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {SEVERITY.map(({ level, desc, color, bg }) => (
              <div key={level} style={{
                display: "grid", gridTemplateColumns: "80px 1fr",
                alignItems: "flex-start", gap: 10,
                padding: "8px 12px", borderRadius: "var(--radius-lg)",
                background: bg, border: `1px solid ${color}22`,
              }}>
                <span style={{ fontWeight: 700, fontSize: "0.82rem", color }}>{level}</span>
                <span style={{ fontSize: "0.75rem", color: "var(--fg-4)", lineHeight: 1.4 }}>{desc}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* pip-audit note: Xenon is separate */}
      {isPipAudit && (
        <div style={{
          padding: "10px 14px", borderRadius: "var(--radius-lg)",
          background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.2)",
        }}>
          <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--fg-4)", lineHeight: 1.5 }}>
            <strong style={{ color: "var(--brand)" }}>Python usa dois controles distintos:</strong>{" "}
            <strong>pip-audit</strong> verifica CVEs nas dependências (aqui), e{" "}
            <strong>Xenon</strong> monitora os limiares de complexidade ciclomática (seção separada abaixo).
          </p>
        </div>
      )}

      <Tip icon={<CheckCircle2 size={13} />}>
        Rode a auditoria em CI/CD a cada pull request. Vulnerabilidades alto/crítico nunca devem chegar à produção.
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
