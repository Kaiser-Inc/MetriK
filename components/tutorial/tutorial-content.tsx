import { InlineCode } from "@/components/tutorial/inline-code"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  compareSteps,
  metricGuides,
  reportFileNote,
  runModes,
  stackGuides,
  tutorialIntro,
} from "@/content/tutorial"

type ItemHeading = "h3" | "h4"

function TutorialGroup({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section aria-label={title} className="flex flex-col gap-4">
      <h3 className="text-base font-medium text-foreground">{title}</h3>
      {children}
    </section>
  )
}

function TutorialModes({ itemHeading: Heading = "h4" }: { itemHeading?: ItemHeading }) {
  return (
    <div className="flex flex-col gap-5">
      {runModes.map((mode) => (
        <div key={mode.id} className="flex flex-col gap-1">
          <Heading className="text-sm font-medium text-foreground">{mode.title}</Heading>
          <p className="text-sm leading-relaxed text-muted-foreground">
            <InlineCode text={mode.description} />
          </p>
        </div>
      ))}
    </div>
  )
}

function TutorialStacks() {
  return (
    <div className="flex flex-col gap-4">
      <Tabs defaultValue={stackGuides[0].id}>
        <TabsList aria-label="Stack">
          {stackGuides.map((stack) => (
            <TabsTrigger key={stack.id} value={stack.id}>
              {stack.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {stackGuides.map((stack) => (
          <TabsContent key={stack.id} value={stack.id} className="flex flex-col gap-4 pt-2">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Ferramentas: {stack.tools}
            </p>
            <ol className="flex flex-col gap-3">
              {stack.commands.map((step) => (
                <li key={step.command} className="flex flex-col gap-1">
                  <span className="text-xs text-subtle-foreground">{step.label}</span>
                  <code className="w-fit rounded-md bg-muted px-3 py-1.5 font-mono text-sm text-foreground">
                    {step.command}
                  </code>
                </li>
              ))}
            </ol>
            {stack.note && (
              <p className="text-sm leading-relaxed text-muted-foreground">
                <InlineCode text={stack.note} />
              </p>
            )}
          </TabsContent>
        ))}
      </Tabs>
      <p className="text-sm leading-relaxed text-muted-foreground">
        <InlineCode text={reportFileNote} />
      </p>
    </div>
  )
}

function TutorialCompare() {
  return (
    <ol className="flex flex-col gap-2">
      {compareSteps.map((step, index) => (
        <li key={step} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
          <span className="w-4 shrink-0 font-mono text-primary-text">{index + 1}</span>
          <span>{step}</span>
        </li>
      ))}
    </ol>
  )
}

const toneVariant = {
  success: "success",
  warning: "warning",
  destructive: "destructive",
} as const

function TutorialMetrics({ itemHeading: Heading = "h4" }: { itemHeading?: ItemHeading }) {
  return (
    <div className="flex flex-col divide-y divide-border">
      {metricGuides.map((metric) => (
        <div key={metric.id} className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0">
          <Heading className="text-sm font-medium text-foreground">{metric.name}</Heading>
          <p className="text-sm leading-relaxed text-muted-foreground">{metric.description}</p>
          {metric.thresholds.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {metric.thresholds.map((threshold) => (
                <li key={threshold.range} className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{threshold.range}</span>
                  <Badge variant={toneVariant[threshold.tone]}>{threshold.label}</Badge>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  )
}

// The whole tutorial in one column, as shown in the dashboard help sheet.
function TutorialContent() {
  return (
    <div className="flex flex-col gap-8">
      <p className="text-sm leading-relaxed text-muted-foreground">{tutorialIntro}</p>
      <TutorialGroup title="Como rodar">
        <TutorialModes />
      </TutorialGroup>
      <TutorialGroup title="Gerar relatórios">
        <TutorialStacks />
      </TutorialGroup>
      <TutorialGroup title="Comparar relatórios">
        <TutorialCompare />
      </TutorialGroup>
      <TutorialGroup title="Métricas">
        <TutorialMetrics />
      </TutorialGroup>
    </div>
  )
}

export {
  TutorialCompare,
  TutorialContent,
  TutorialGroup,
  TutorialMetrics,
  TutorialModes,
  TutorialStacks,
}
