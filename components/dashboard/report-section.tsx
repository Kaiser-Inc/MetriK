import { useId } from "react"

import { cn } from "@/lib/utils"

type ReportSectionProps = {
  title: string
  icon?: React.ReactNode
  /** Status shown next to the title, usually a Badge. */
  status?: React.ReactNode
  description?: string
  className?: string
  children?: React.ReactNode
}

// A block of the report: title, optional status and content straight on the page,
// separated from the next block by a thin line.
function ReportSection({ title, icon, status, description, className, children }: ReportSectionProps) {
  const headingId = useId()
  return (
    <section
      aria-labelledby={headingId}
      className={cn("flex flex-col gap-4 border-t border-border pt-4", className)}
    >
      <div className="flex flex-col gap-1">
        <div className="flex flex-wrap items-center gap-3">
          <h3 id={headingId} className="flex items-center gap-2 text-base font-medium">
            {icon && (
              <span aria-hidden="true" className="flex text-primary-text [&_svg]:size-4">
                {icon}
              </span>
            )}
            {title}
          </h3>
          {status}
        </div>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {children}
    </section>
  )
}

export { ReportSection }
