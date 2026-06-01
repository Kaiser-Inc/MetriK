import { FlaskConical, GitCompare, XCircle, Zap } from "lucide-react";
import type { ReactNode } from "react";

interface InfoItem {
  icon: ReactNode;
  iconColor: string;
  title: string;
  desc: string;
  color: string;
  border: string;
}

const ITEMS: InfoItem[] = [
  {
    icon: <GitCompare size={14} />,
    iconColor: "rgba(99,102,241,0.9)",
    title: "Testes ≠ Cobertura",
    desc: "Poucos testes bem escritos podem cobrir mais código do que muitos testes superficiais. Monitore ambos.",
    color: "rgba(99,102,241,0.06)", border: "rgba(99,102,241,0.2)",
  },
  {
    icon: <XCircle size={14} />,
    iconColor: "var(--danger-500)",
    title: "Testes falhando",
    desc: "Qualquer falha indica comportamento inesperado. Não faça deploy com testes falhando.",
    color: "rgba(239,68,68,0.06)", border: "rgba(239,68,68,0.2)",
  },
  {
    icon: <Zap size={14} />,
    iconColor: "var(--warning-500)",
    title: "Zero testes",
    desc: "Sem testes, qualquer refactoring vira um risco. Comece por testes de integração das rotas principais.",
    color: "rgba(234,179,8,0.06)", border: "rgba(234,179,8,0.2)",
  },
];

export function TestsInfo() {
  return (
    <>
      <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--fg-4)", lineHeight: 1.5 }}>
        Contagem de <strong style={{ color: "var(--fg-3)" }}>casos de teste</strong> executados e aprovados na última rodada.
        Diferente da cobertura — mede a quantidade de testes, não quais linhas foram exercidas.
      </p>

      {/* Relationship */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {ITEMS.map(({ icon, iconColor, title, desc, color, border }) => (
          <div key={title} style={{
            padding: "10px 14px", borderRadius: "var(--radius-lg)",
            background: color, border: `1px solid ${border}`,
          }}>
            <p style={{ margin: "0 0 4px", fontWeight: 600, fontSize: "0.82rem", color: "var(--fg-2)", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ color: iconColor, lineHeight: 0, flexShrink: 0 }}>{icon}</span>
              {title}
            </p>
            <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--fg-4)", lineHeight: 1.4 }}>{desc}</p>
          </div>
        ))}
      </div>

      <Tip icon={<FlaskConical size={13} />}>
        Priorize testes de integração (caminho feliz + casos de erro) sobre unitários puros para ganhar cobertura real mais rápido.
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
