import { Section } from "@/components/landing/section"
import { InlineCode } from "@/components/tutorial/inline-code"
import { steps } from "@/content/landing"

function HowItWorks() {
  return (
    <Section id="como-funciona" title="Como funciona">
      <ol className="grid gap-8 sm:grid-cols-3">
        {steps.map((step, index) => (
          <li key={step.title} className="flex flex-col gap-3">
            <span className="font-mono text-5xl leading-none font-medium text-primary-text">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span aria-hidden="true" className="h-px w-8 bg-primary-text" />
            <h3 className="text-base font-medium">{step.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              <InlineCode text={step.description} />
            </p>
          </li>
        ))}
      </ol>
    </Section>
  )
}

export { HowItWorks }
