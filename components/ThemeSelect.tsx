"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@kaiserinc/react";
import { Moon, Monitor } from "lucide-react";

type Mode = "dark" | "system";
const CYCLE: Mode[] = ["dark", "system"];
const LS_KEY = "metrika-theme";

function getSystemTheme(): "dark" | "light" {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function readStoredMode(): Mode {
  if (typeof window === "undefined") return "dark";
  const v = localStorage.getItem(LS_KEY);
  return v === "system" ? "system" : "dark";
}

export function ThemeSelect() {
  const { setTheme } = useTheme();
  const [mode, setMode] = useState<Mode>("dark");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMode(readStoredMode());
  }, []);

  useEffect(() => {
    localStorage.setItem(LS_KEY, mode);
    const apply = (resolved: "dark" | "light") => {
      setTheme(resolved);
      document.documentElement.setAttribute("data-theme", resolved);
    };
    if (mode === "system") {
      apply(getSystemTheme());
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = (e: MediaQueryListEvent) => apply(e.matches ? "dark" : "light");
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    } else {
      apply("dark");
    }
  }, [mode, setTheme]);

  const next = CYCLE[(CYCLE.indexOf(mode) + 1) % CYCLE.length];
  const CONFIG: Record<Mode, { icon: React.ReactNode; label: string }> = {
    dark:   { icon: <Moon size={14} />,    label: "Escuro" },
    system: { icon: <Monitor size={14} />, label: "Sistema" },
  };
  const { icon, label } = CONFIG[mode];

  return (
    <button
      onClick={() => setMode(next)}
      title={`Tema: ${label} — clique para alternar`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "5px 12px",
        borderRadius: 8,
        border: "1px solid var(--border-default)",
        background: "var(--bg-elevated)",
        color: "var(--fg-2)",
        fontSize: 12,
        fontWeight: 500,
        fontFamily: "Roboto, sans-serif",
        cursor: "pointer",
        outline: "none",
        letterSpacing: "0.01em",
        userSelect: "none",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--brand)";
        e.currentTarget.style.color = "var(--fg-1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border-default)";
        e.currentTarget.style.color = "var(--fg-2)";
      }}
    >
      {icon}
      {label}
    </button>
  );
}
