import { Section } from "@/components/landing/section"
import { features } from "@/content/landing"

function Features() {
  return (
    <Section id="recursos" title="Recursos">
      <ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <li key={feature.title} className="flex flex-col gap-2 border-t border-border pt-4">
            <h3 className="text-base font-medium">{feature.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}

export { Features }
