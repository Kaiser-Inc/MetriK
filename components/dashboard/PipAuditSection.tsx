"use client";

import { Badge } from "@kaiserinc/react";
import { ShieldCheck, ShieldAlert } from "lucide-react";
import type { PipAuditInfo } from "@/types/metrics";

interface Props {
  pipAudit: PipAuditInfo;
}

/** Python-only: renders the pip-audit CVE scan (vulnerabilities by package). */
export function PipAuditSection({ pipAudit }: Props) {
  const { passed, total_vulnerabilities, vulnerabilities, error } = pipAudit;
  const iconColor = passed ? "var(--success-500)" : "var(--danger-500)";

  return (
    <div
      className="flex flex-col gap-3 rounded-lg p-5"
      style={{
        background: "var(--bg-surface)",
        border: `1px solid ${passed ? "var(--success-500)" : "var(--danger-500)"}`,
      }}
    >
      <div className="flex items-center gap-2">
        {passed ? (
          <ShieldCheck size={18} style={{ color: iconColor }} />
        ) : (
          <ShieldAlert size={18} style={{ color: iconColor }} />
        )}
        <span className="text-xs uppercase tracking-wider" style={{ color: "var(--fg-3)" }}>
          Segurança · pip-audit
        </span>
        <Badge variant={passed ? "success" : "danger"}>
          {passed ? "Sem vulnerabilidades" : `${total_vulnerabilities} vulnerabilidade${total_vulnerabilities !== 1 ? "s" : ""}`}
        </Badge>
      </div>

      {error && (
        <p style={{ fontSize: "0.78rem", color: "var(--fg-4)", margin: 0 }}>
          pip-audit não pôde ser executado: <code style={{ color: "var(--fg-2)" }}>{error}</code>
        </p>
      )}

      {vulnerabilities.length > 0 && (
        <ul className="flex flex-col gap-1.5" style={{ margin: 0, padding: 0, listStyle: "none" }}>
          {vulnerabilities.map((v, i) => (
            <li
              key={`${v.id ?? "vuln"}-${i}`}
              className="text-xs"
              style={{ color: "var(--fg-2)" }}
            >
              <code style={{ color: "var(--fg-1)" }}>
                {v.package ?? "?"}@{v.version ?? "?"}
              </code>
              {v.id && <span style={{ color: "var(--danger-500)" }}> · {v.id}</span>}
              {v.fix_versions.length > 0 && (
                <span style={{ color: "var(--fg-4)" }}> · fix: {v.fix_versions.join(", ")}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
