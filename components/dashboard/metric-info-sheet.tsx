"use client"

import { InlineCode } from "@/components/tutorial/inline-code"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import type { Band, InfoSection, MetricInfo, Tone } from "@/content/metric-info"
import { cn } from "@/lib/utils"

const toneClass: Record<Tone, string> = {
  success: "text-success",
  warning: "text-warning",
  destructive: "text-destructive",
  neutral: "text-muted-foreground",
}

function Bands({ bands }: { bands: Band[] }) {
  return (
    <ul className="flex flex-col divide-y divide-border border-y border-border">
      {bands.map((band) => (
        <li key={band.range} className="grid grid-cols-[5.5rem_1fr] gap-x-3 gap-y-0.5 py-2.5 text-sm">
          <span className="font-mono text-muted-foreground tabular-nums">{band.range}</span>
          <span className={cn("font-medium", toneClass[band.tone])}>{band.label}</span>
          {band.detail && <span className="col-start-2 text-muted-foreground">{band.detail}</span>}
        </li>
      ))}
    </ul>
  )
}

function Section({ section }: { section: InfoSection }) {
  return (
    <div className="flex flex-col gap-3">
      {section.title && <h3 className="text-sm font-medium">{section.title}</h3>}
      {section.bands && <Bands bands={section.bands} />}
      {section.items && (
        <ul className="flex flex-col gap-3">
          {section.items.map((item) => (
            <li key={item.title} className="flex flex-col gap-0.5 text-sm">
              <span className="font-medium">{item.title}</span>
              <span className="text-muted-foreground">{item.detail}</span>
            </li>
          ))}
        </ul>
      )}
      {section.code && (
        <div className="flex flex-col gap-1">
          <code className="w-fit rounded-md bg-muted px-3 py-1.5 font-mono text-sm text-primary-text">
            {section.code.text}
          </code>
          {section.code.caption && <p className="text-sm text-muted-foreground">{section.code.caption}</p>}
        </div>
      )}
      {section.note && <p className="text-sm leading-relaxed text-muted-foreground">{section.note}</p>}
    </div>
  )
}

type MetricInfoSheetProps = {
  /** Kept after closing so the content does not go blank while the sheet slides out. */
  info: MetricInfo | null
  open: boolean
  onClose: () => void
}

function MetricInfoSheet({ info, open, onClose }: MetricInfoSheetProps) {
  return (
    <Sheet open={open} onOpenChange={(next) => !next && onClose()}>
      <SheetContent>
        {info && (
          <>
            <SheetHeader>
              <SheetTitle>{info.title}</SheetTitle>
              <SheetDescription>{info.subtitle}</SheetDescription>
            </SheetHeader>
            <p className="text-sm leading-relaxed text-muted-foreground">
              <InlineCode text={info.intro} />
            </p>
            {info.sections.map((section, index) => (
              <Section key={section.title ?? index} section={section} />
            ))}
            <p className="border-t border-border pt-4 text-sm leading-relaxed text-muted-foreground">
              <span className="font-medium text-foreground">Boa prática: </span>
              {info.tip}
            </p>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

export { MetricInfoSheet }
