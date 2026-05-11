"use client";

import { useRouter } from "next/navigation";
import { GitCompareArrows, X } from "lucide-react";

interface Props {
  slugA: string | null;
  slugB: string | null;
  onClear: () => void;
}

export function CompareBar({ slugA, slugB, onClear }: Props) {
  const router = useRouter();
  const count = [slugA, slugB].filter(Boolean).length;

  const compare = () => {
    if (slugA && slugB) router.push(`/compare?a=${slugA}&b=${slugB}`);
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 28,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 20px",
        borderRadius: 40,
        background: "var(--bg-elevated)",
        border: "1px solid rgba(130,87,230,0.45)",
        boxShadow: "0 0 0 1px rgba(130,87,230,0.15), 0 8px 32px rgba(0,0,0,0.5)",
        backdropFilter: "blur(12px)",
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ fontSize: "0.8rem", color: "var(--fg-2)", fontWeight: 500 }}>
        {count === 1 ? "1 selecionado — escolha mais 1" : "2 selecionados"}
      </span>

      <button
        onClick={compare}
        disabled={count < 2}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "6px 14px",
          borderRadius: 20,
          fontSize: "0.8rem",
          fontWeight: 600,
          cursor: count < 2 ? "not-allowed" : "pointer",
          border: "none",
          background: count < 2 ? "var(--border-default)" : "var(--brand)",
          color: count < 2 ? "var(--fg-4)" : "white",
          transition: "all 0.2s",
          opacity: count < 2 ? 0.5 : 1,
        }}
      >
        <GitCompareArrows size={13} />
        Comparar
      </button>

      <button
        onClick={onClear}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "var(--fg-4)",
          padding: 2,
          display: "flex",
          alignItems: "center",
        }}
        title="Cancelar"
      >
        <X size={15} />
      </button>
    </div>
  );
}
