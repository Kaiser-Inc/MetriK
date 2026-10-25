"use client"

import { GitCompareArrowsIcon, XIcon } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"

type CompareBarProps = {
  slugA: string | null
  slugB: string | null
  onClear: () => void
}

// Floats above the page like a toast: one of the few surfaces allowed to rise over it.
function CompareBar({ slugA, slugB, onClear }: CompareBarProps) {
  const router = useRouter()
  const count = [slugA, slugB].filter(Boolean).length

  return (
    <div
      role="region"
      aria-label="Comparação"
      className="fixed bottom-6 left-1/2 z-50 flex w-max max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center gap-3 rounded-lg border border-border bg-popover p-2 pl-4 text-popover-foreground shadow-[var(--shadow-overlay)]"
    >
      <span className="text-sm">{count === 1 ? "1 selecionado, escolha mais 1" : "2 selecionados"}</span>
      <Button
        disabled={count < 2}
        onClick={() => router.push(`/compare?a=${slugA}&b=${slugB}`)}
      >
        <GitCompareArrowsIcon aria-hidden="true" data-icon="inline-start" strokeWidth={1.75} />
        Ver comparativo
      </Button>
      <Button variant="ghost" size="icon" aria-label="Limpar seleção" onClick={onClear}>
        <XIcon strokeWidth={1.75} />
      </Button>
    </div>
  )
}

export { CompareBar }
