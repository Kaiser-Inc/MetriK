import { useId } from "react"

// A titled block of the comparison, straight on the page.
function CompareSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  const headingId = useId()
  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-4">
      <h2 id={headingId} className="text-lg font-medium tracking-[-0.01em]">
        {title}
      </h2>
      {children}
    </section>
  )
}

export { CompareSection }
