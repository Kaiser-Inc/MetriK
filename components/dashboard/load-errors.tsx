"use client"

import { AlertTriangleIcon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { ReportLoadError } from "@/types/metrics"

type LoadErrorsProps = {
  errors: ReportLoadError[]
  onDismiss: () => void
}

// An inline notice: state color on the icon and the title only, no filled box.
function LoadErrors({ errors, onDismiss }: LoadErrorsProps) {
  const plural = errors.length !== 1
  return (
    <div role="alert" className="flex items-start gap-3 border-y border-border py-4">
      <AlertTriangleIcon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-destructive" strokeWidth={1.75} />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <p className="text-sm font-medium text-destructive">
          {errors.length} relatório{plural ? "s" : ""} não pôde{plural ? "ram" : ""} ser carregado{plural ? "s" : ""}
        </p>
        <ul className="flex flex-col gap-1">
          {errors.map((error) => (
            <li key={error.file} className="text-sm text-muted-foreground">
              <code className="font-mono text-foreground">{error.file}</code> · {error.reason}
            </li>
          ))}
        </ul>
      </div>
      <Button variant="ghost" size="icon-sm" aria-label="Dispensar" onClick={onDismiss}>
        <XIcon strokeWidth={1.75} />
      </Button>
    </div>
  )
}

export { LoadErrors }
