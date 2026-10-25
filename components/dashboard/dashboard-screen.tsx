"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { FolderOpenIcon, RefreshCwIcon, SettingsIcon } from "lucide-react"

import { AppHeader } from "@/components/dashboard/app-header"
import { CompareBar } from "@/components/dashboard/compare-bar"
import { FilePicker } from "@/components/dashboard/file-picker"
import { LoadErrors } from "@/components/dashboard/load-errors"
import { ReportTable } from "@/components/dashboard/report-table"
import { StackFilter, type StackFilterValue } from "@/components/dashboard/stack-filter"
import { SiteFooter } from "@/components/site-footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { PageHeader } from "@/components/ui/page-header"
import { loadReportsFromSession, saveReportsToSession } from "@/lib/fileSystem"
import type { EnrichedItem, ReportListResponse, ReportLoadError } from "@/types/metrics"

const FILTER_KEY = "metrik-stack-filter"

type DashboardScreenProps = {
  items: EnrichedItem[]
  loadErrors?: ReportLoadError[]
  error?: string
  deployMode?: boolean
}

function DashboardScreen({
  items: initialItems,
  loadErrors = [],
  error,
  deployMode = false,
}: DashboardScreenProps) {
  const router = useRouter()

  const [pickedItems, setPickedItems] = useState<EnrichedItem[]>([])
  const [pickedErrors, setPickedErrors] = useState<ReportLoadError[]>([])
  const [picked, setPicked] = useState(false)
  const [errorsDismissed, setErrorsDismissed] = useState(false)
  const [selected, setSelected] = useState<string[]>([])

  // Starts as "all" so the server and the first client render match; the stored
  // filter is applied right after hydration.
  const [stackFilter, setStackFilter] = useState<StackFilterValue>("all")

  useEffect(() => {
    const stored = sessionStorage.getItem(FILTER_KEY) as StackFilterValue | null
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored) setStackFilter(stored)
  }, [])

  useEffect(() => {
    if (!deployMode) return
    const cached = loadReportsFromSession()
    if (cached?.length) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPickedItems(cached)
      setPicked(true)
    }
  }, [deployMode])

  const handleStackFilter = (value: StackFilterValue) => {
    setStackFilter(value)
    sessionStorage.setItem(FILTER_KEY, value)
  }

  const handlePicked = (result: ReportListResponse) => {
    setPickedItems(result.items)
    setPickedErrors(result.errors)
    setErrorsDismissed(false)
    setPicked(true)
    saveReportsToSession(result.items)
  }

  // Two reports at most: a third pick replaces the oldest one.
  const handleSelect = (slug: string, checked: boolean) => {
    setSelected((current) => {
      if (checked) return current.includes(slug) ? current : [...current, slug].slice(-2)
      return current.filter((s) => s !== slug)
    })
  }

  const allItems = deployMode || picked ? pickedItems : initialItems
  const activeErrors = deployMode || picked ? pickedErrors : loadErrors
  const showErrors = !errorsDismissed && activeErrors.length > 0
  const items = stackFilter === "all" ? allItems : allItems.filter((item) => item.stack === stackFilter)
  const showList = (!deployMode || picked) && !error

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />

      <main className="mx-auto flex w-full max-w-page flex-1 flex-col gap-6 px-4 py-8 sm:px-6">
        {showErrors && <LoadErrors errors={activeErrors} onDismiss={() => setErrorsDismissed(true)} />}

        {!deployMode && error && (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <SettingsIcon strokeWidth={1.75} />
              </EmptyMedia>
              <EmptyTitle>METRICS_DIR não configurado</EmptyTitle>
              <EmptyDescription>
                Aponte METRICS_DIR, no .env.local, para a pasta metrics/ do projeto.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <code className="rounded-md bg-muted px-3 py-1.5 font-mono text-sm">
                METRICS_DIR=/caminho/absoluto/para/metrics
              </code>
            </EmptyContent>
          </Empty>
        )}

        {deployMode && !picked && (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FolderOpenIcon strokeWidth={1.75} />
              </EmptyMedia>
              <EmptyTitle>Selecione a pasta de métricas</EmptyTitle>
              <EmptyDescription>
                Aponte para a pasta metrics/ gerada pelo KaiserInc-Utils. Os arquivos são lidos no seu
                navegador e não são enviados a nenhum servidor.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <FilePicker onLoad={handlePicked} />
              <p className="text-xs text-subtle-foreground">
                Chrome e Edge leem a pasta; Firefox e Safari pedem os arquivos .json.
              </p>
            </EmptyContent>
          </Empty>
        )}

        {showList && (
          <>
            <PageHeader
              headingLevel={1}
              title={
                <span className="inline-flex items-center gap-3">
                  Relatórios
                  <Badge variant="primary">
                    {stackFilter === "all" ? allItems.length : `${items.length} / ${allItems.length}`}
                  </Badge>
                </span>
              }
              description="Análises ordenadas da mais recente à mais antiga."
            />

            <div className="flex flex-wrap items-center justify-between gap-3">
              <StackFilter value={stackFilter} onChange={handleStackFilter} />
              <div className="flex flex-wrap items-center gap-2">
                <FilePicker onLoad={handlePicked} compact />
                {!deployMode && (
                  <Button variant="outline" onClick={() => router.refresh()}>
                    <RefreshCwIcon aria-hidden="true" data-icon="inline-start" strokeWidth={1.75} />
                    Atualizar lista
                  </Button>
                )}
              </div>
            </div>

            {items.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <FolderOpenIcon strokeWidth={1.75} />
                  </EmptyMedia>
                  <EmptyTitle>Nenhum relatório encontrado</EmptyTitle>
                  <EmptyDescription>
                    Rode make metrics no projeto para gerar relatórios na pasta configurada.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <ReportTable items={items} selected={selected} onSelect={handleSelect} />
            )}
          </>
        )}
      </main>

      <SiteFooter />

      {selected.length > 0 && (
        <CompareBar
          slugA={selected[0] ?? null}
          slugB={selected[1] ?? null}
          onClear={() => setSelected([])}
        />
      )}
    </div>
  )
}

export { DashboardScreen }
