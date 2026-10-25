import { cn } from "@/lib/utils"

// Landing sections sit directly on the page and are separated by a thin line.
function Section({
  id,
  title,
  srOnlyTitle = false,
  className,
  children,
}: {
  id: string
  title: string
  srOnlyTitle?: boolean
  className?: string
  children: React.ReactNode
}) {
  const headingId = `${id}-titulo`
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className="scroll-mt-16 border-t border-border"
    >
      <div className={cn("mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-16 sm:px-6 sm:py-20", className)}>
        <h2
          id={headingId}
          className={cn(
            "text-3xl font-semibold tracking-[-0.03em] text-balance sm:text-4xl",
            srOnlyTitle && "sr-only"
          )}
        >
          {title}
        </h2>
        {children}
      </div>
    </section>
  )
}

export { Section }
