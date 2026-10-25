import { Faq } from "@/components/landing/faq"
import { Features } from "@/components/landing/features"
import { Hero } from "@/components/landing/hero"
import { HowItWorks } from "@/components/landing/how-it-works"
import { HowToUse } from "@/components/landing/how-to-use"
import { LandingFooter } from "@/components/landing/landing-footer"
import { LandingHeader } from "@/components/landing/landing-header"
import { MetricsSection } from "@/components/landing/metrics-section"
import { Pillars } from "@/components/landing/pillars"

function LandingPage() {
  return (
    <>
      <LandingHeader />
      <main className="flex flex-1 flex-col">
        <Hero />
        <Pillars />
        <Features />
        <HowItWorks />
        <HowToUse />
        <MetricsSection />
        <Faq />
      </main>
      <LandingFooter />
    </>
  )
}

export { LandingPage }
