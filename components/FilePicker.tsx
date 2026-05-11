"use client";

import { useRef, useState } from "react";
import { FolderOpen, Files, RefreshCw } from "lucide-react";
import {
  hasDirectoryPicker,
  parseDirectoryHandle,
  parseFilesToItems,
} from "@/lib/fileSystem";
import type { EnrichedItem } from "@/types/metrics";
import { formatDate } from "@/lib/formatDate";

interface Props {
  onLoad: (items: EnrichedItem[]) => void;
  /** Render only buttons, no status text — for inline use inside flex rows */
  compact?: boolean;
}

type Status = "idle" | "loading" | "loaded" | "error";

export function FilePicker({ onLoad, compact = false }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [count, setCount] = useState(0);
  const [lastDate, setLastDate] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [hasHandle, setHasHandle] = useState(false);

  const dirHandleRef = useRef<FileSystemDirectoryHandle | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dirInputRef = useRef<HTMLInputElement>(null);

  const finish = (items: EnrichedItem[]) => {
    setCount(items.length);
    setLastDate(items[0]?.generated_at ?? null);
    setStatus("loaded");
    onLoad(items);
  };

  const handleError = (msg: string) => {
    setErrorMsg(msg);
    setStatus("error");
  };

  const pickDirectory = async () => {
    setStatus("loading");
    try {
      if (hasDirectoryPicker()) {
        const handle = await window.showDirectoryPicker({ mode: "read" });
        dirHandleRef.current = handle;
        setHasHandle(true);
        const items = await parseDirectoryHandle(handle);
        finish(items);
      } else {
        dirInputRef.current?.click();
      }
    } catch (e: unknown) {
      if ((e as Error)?.name === "AbortError") {
        setStatus("idle");
      } else {
        handleError("Não foi possível abrir a pasta.");
      }
    }
  };

  const refresh = async () => {
    if (!dirHandleRef.current) return;
    setStatus("loading");
    try {
      const items = await parseDirectoryHandle(dirHandleRef.current);
      finish(items);
    } catch {
      handleError("Erro ao re-leer a pasta.");
    }
  };

  const onDirInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) { setStatus("idle"); return; }
    setStatus("loading");
    const items = await parseFilesToItems(files);
    finish(items);
    e.target.value = "";
  };

  const onFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) { setStatus("idle"); return; }
    setStatus("loading");
    const items = await parseFilesToItems(files);
    finish(items);
    e.target.value = "";
  };

  const btnBase: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 14px",
    borderRadius: 8,
    fontSize: "0.8rem",
    fontWeight: 600,
    cursor: "pointer",
    border: "1px solid var(--border-default)",
    background: "var(--bg-elevated)",
    color: "var(--fg-2)",
    transition: "all 0.2s",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: compact ? 0 : 12 }}>
      {/* Buttons row */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        <button style={btnBase} onClick={pickDirectory} disabled={status === "loading"}>
          <FolderOpen size={14} />
          Selecionar pasta
        </button>

        <button
          style={btnBase}
          onClick={() => fileInputRef.current?.click()}
          disabled={status === "loading"}
        >
          <Files size={14} />
          Selecionar arquivo(s)
        </button>

        {hasHandle && (
          <button style={{ ...btnBase, color: "var(--brand)", borderColor: "rgba(130,87,230,0.4)" }} onClick={refresh} disabled={status === "loading"}>
            <RefreshCw size={14} style={{ animation: status === "loading" ? "spin 1s linear infinite" : undefined }} />
            Atualizar
          </button>
        )}
      </div>

      {/* Status — hidden in compact mode */}
      {!compact && status === "loading" && (
        <p style={{ fontSize: "0.75rem", color: "var(--fg-3)", margin: 0 }}>
          Carregando arquivos…
        </p>
      )}
      {!compact && status === "loaded" && (
        <p style={{ fontSize: "0.75rem", color: "var(--fg-3)", margin: 0 }}>
          <span style={{ color: "var(--success-500)", fontWeight: 600 }}>{count}</span>
          {" "}relatório{count !== 1 ? "s" : ""} carregado{count !== 1 ? "s" : ""}
          {lastDate && (
            <> · mais recente: <span style={{ color: "var(--fg-2)" }}>{formatDate(lastDate)}</span></>
          )}
        </p>
      )}
      {!compact && status === "error" && (
        <p style={{ fontSize: "0.75rem", color: "var(--danger-500)", margin: 0 }}>{errorMsg}</p>
      )}

      {/* Hidden inputs */}
      <input
        ref={dirInputRef}
        type="file"
        // @ts-expect-error webkitdirectory is non-standard
        webkitdirectory=""
        multiple
        accept=".json"
        style={{ display: "none" }}
        onChange={onDirInputChange}
      />
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".json"
        style={{ display: "none" }}
        onChange={onFileInputChange}
      />
    </div>
  );
}
