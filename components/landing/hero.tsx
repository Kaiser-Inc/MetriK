import { ArrowRightIcon } from "lucide-react"
import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { hero } from "@/content/landing"

function Hero() {
  return (
    <section id="o-que-e" aria-labelledby="hero-titulo" className="scroll-mt-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-20 sm:px-6 sm:py-28">
        <p className="text-xs font-medium tracking-[0.08em] text-primary-text">{hero.eyebrow}</p>
        <h1
          id="hero-titulo"
          className="max-w-[16ch] text-5xl leading-[1.05] font-semibold tracking-[-0.035em] text-balance sm:text-7xl"
        >
          {hero.title} <span className="text-primary-text">{hero.highlight}</span>
        </h1>
        <p className="max-w-[60ch] text-lg leading-relaxed text-muted-foreground">{hero.description}</p>
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/dashboard" className={buttonVariants()}>
            Abrir dashboard
          </Link>
          <a href="#como-usar" className={buttonVariants({ variant: "outline" })}>
            Como usar
            <ArrowRightIcon aria-hidden="true" data-icon="inline-end" strokeWidth={1.75} />
          </a>
        </div>
      </div>
    </section>
  )
}

export { Hero }
