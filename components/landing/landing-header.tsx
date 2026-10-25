import Link from "next/link"

import { MetrikLogo } from "@/components/metrik-logo"
import { ThemeSelect } from "@/components/theme-select"
import { buttonVariants } from "@/components/ui/button"
import { navLinks } from "@/content/landing"

function LandingHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <MetrikLogo />
        <nav aria-label="Seções" className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-md text-sm text-muted-foreground outline-hidden transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeSelect className="w-32" />
          <Link href="/dashboard" className={buttonVariants()}>
            Abrir dashboard
          </Link>
        </div>
      </div>
    </header>
  )
}

export { LandingHeader }
