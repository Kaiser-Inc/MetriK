import { Section } from "@/components/landing/section"
import { pillars } from "@/content/landing"

function Pillars() {
  return (
    <Section id="pilares" title="O que o MetriK faz" srOnlyTitle className="py-12 sm:py-16">
      <ul className="grid gap-8 sm:grid-cols-3">
        {pillars.map((pillar) => (
          <li key={pillar.title} className="flex flex-col gap-2 border-t border-border-strong pt-4">
            <h3 className="text-xl font-semibold tracking-[-0.02em]">{pillar.title}</h3>
            <p className="max-w-[40ch] text-sm leading-relaxed text-muted-foreground">
              {pillar.description}
            </p>
          </li>
        ))}
      </ul>
    </Section>
  )
}

export { Pillars }
