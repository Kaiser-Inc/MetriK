import { Section } from "@/components/landing/section"
import { InlineCode } from "@/components/tutorial/inline-code"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { contactEmail, faq } from "@/content/landing"

// Turns the contact e-mail inside an answer into a mailto link.
function Answer({ text }: { text: string }) {
  const [before, ...rest] = text.split(contactEmail)
  if (rest.length === 0) return <InlineCode text={text} />
  return (
    <>
      <InlineCode text={before} />
      <a
        href={`mailto:${contactEmail}`}
        className="rounded-sm text-primary-text underline underline-offset-4 outline-hidden focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        {contactEmail}
      </a>
      <InlineCode text={rest.join(contactEmail)} />
    </>
  )
}

function Faq() {
  return (
    <Section id="duvidas" title="Dúvidas">
      <Accordion className="max-w-3xl">
        {faq.map((item) => (
          <AccordionItem key={item.question} value={item.question}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>
              <Answer text={item.answer} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Section>
  )
}

export { Faq }
