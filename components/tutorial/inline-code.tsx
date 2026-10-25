import { Fragment } from "react"

// Renders `backtick` spans from the tutorial content as <code>.
function InlineCode({ text }: { text: string }) {
  return (
    <>
      {text.split("`").map((part, index) =>
        index % 2 === 1 ? (
          <code
            key={index}
            className="rounded-sm bg-muted px-1 py-0.5 font-mono text-[0.85em] text-foreground"
          >
            {part}
          </code>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        )
      )}
    </>
  )
}

export { InlineCode }
