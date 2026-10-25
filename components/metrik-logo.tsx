import Link from "next/link"

import { cn } from "@/lib/utils"

function MetrikLogo({ href = "/", className }: { href?: string; className?: string }) {
  return (
    <Link
      href={href}
      aria-label="MetriK"
      className={cn(
        "rounded-md text-xl font-semibold tracking-[-0.03em] text-foreground outline-hidden focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring",
        className
      )}
    >
      Metri<span className="text-primary-text">K</span>
    </Link>
  )
}

export { MetrikLogo }
