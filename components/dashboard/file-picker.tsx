"use client"

import { useRef, useState } from "react"
import { FilesIcon, FolderOpenIcon, RefreshCwIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/formatDate"
import { hasDirectoryPicker, parseDirectoryHandle, parseFilesToItems } from "@/lib/fileSystem"
import type { ReportListResponse } from "@/types/metrics"

type FilePickerProps = {
  onLoad: (result: ReportListResponse) => void
  /** Hides the status line, for use inside a toolbar. */
  compact?: boolean
}

type Status = "idle" | "loading" | "loaded" | "error"

function FilePicker({ onLoad, compact = false }: FilePickerProps) {
  const [status, setStatus] = useState<Status>("idle")
  const [count, setCount] = useState(0)
  const [lastDate, setLastDate] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [hasHandle, setHasHandle] = useState(false)

  const dirHandleRef = useRef<FileSystemDirectoryHandle | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dirInputRef = useRef<HTMLInputElement>(null)

  const finish = (result: ReportListResponse) => {
    setCount(result.items.length)
    setLastDate(result.items[0]?.generated_at ?? null)
    setStatus("loaded")
    onLoad(result)
  }

  const fail = (message: string) => {
    setErrorMsg(message)
    setStatus("error")
  }

  const pickDirectory = async () => {
    setStatus("loading")
    try {
      if (hasDirectoryPicker()) {
        const handle = await window.showDirectoryPicker({ mode: "read" })
        dirHandleRef.current = handle
        setHasHandle(true)
        finish(await parseDirectoryHandle(handle))
      } else {
        dirInputRef.current?.click()
      }
    } catch (e: unknown) {
      if ((e as Error)?.name === "AbortError") setStatus("idle")
      else fail("Não foi possível abrir a pasta.")
    }
  }

  const refresh = async () => {
    if (!dirHandleRef.current) return
    setStatus("loading")
    try {
      finish(await parseDirectoryHandle(dirHandleRef.current))
    } catch {
      fail("Erro ao ler a pasta de novo.")
    }
  }

  const onFilesChosen = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    event.target.value = ""
    if (!files.length) {
      setStatus("idle")
      return
    }
    setStatus("loading")
    finish(await parseFilesToItems(files))
  }

  const loading = status === "loading"

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={pickDirectory} loading={loading}>
          <FolderOpenIcon aria-hidden="true" data-icon="inline-start" strokeWidth={1.75} />
          Selecionar pasta
        </Button>
        <Button variant="outline" onClick={() => fileInputRef.current?.click()} loading={loading}>
          <FilesIcon aria-hidden="true" data-icon="inline-start" strokeWidth={1.75} />
          Selecionar arquivo(s)
        </Button>
        {hasHandle && (
          <Button variant="outline" onClick={refresh} loading={loading}>
            <RefreshCwIcon aria-hidden="true" data-icon="inline-start" strokeWidth={1.75} />
            Atualizar
          </Button>
        )}
      </div>

      {!compact && status === "loaded" && (
        <p className="text-sm text-muted-foreground">
          {`${count} ${count === 1 ? "relatório carregado" : "relatórios carregados"}`}
          {lastDate && ` · mais recente: ${formatDate(lastDate)}`}
        </p>
      )}
      {!compact && status === "error" && (
        <p role="alert" className="text-sm text-destructive">
          {errorMsg}
        </p>
      )}

      <input
        ref={dirInputRef}
        type="file"
        // @ts-expect-error webkitdirectory is non-standard
        webkitdirectory=""
        multiple
        accept=".json"
        className="hidden"
        aria-hidden="true"
        tabIndex={-1}
        onChange={onFilesChosen}
      />
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".json"
        className="hidden"
        aria-hidden="true"
        tabIndex={-1}
        onChange={onFilesChosen}
      />
    </div>
  )
}

export { FilePicker }
