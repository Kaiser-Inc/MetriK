import { Section } from "@/components/landing/section"
import {
  TutorialCompare,
  TutorialGroup,
  TutorialModes,
  TutorialStacks,
} from "@/components/tutorial/tutorial-content"
import { tutorialIntro } from "@/content/tutorial"

function HowToUse() {
  return (
    <Section id="como-usar" title="Como usar">
      <p className="max-w-[60ch] text-base leading-relaxed text-muted-foreground">{tutorialIntro}</p>
      <div className="grid gap-12 lg:grid-cols-2">
        <div className="flex flex-col gap-12">
          <TutorialGroup title="Como rodar">
            <TutorialModes />
          </TutorialGroup>
          <TutorialGroup title="Comparar e exportar">
            <TutorialCompare />
          </TutorialGroup>
        </div>
        <TutorialGroup title="Gerar relatórios">
          <TutorialStacks />
        </TutorialGroup>
      </div>
    </Section>
  )
}

export { HowToUse }
