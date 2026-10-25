import { contactEmail, repositoryUrl } from "@/content/landing"

const linkClass =
  "rounded-sm text-sm text-primary-text underline underline-offset-4 outline-hidden focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring"

function LandingFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-8 sm:px-6">
        <p className="text-sm text-muted-foreground">KaiserInc · Knowledge &amp; Tech</p>
        <div className="flex flex-wrap items-center gap-6">
          <a href={repositoryUrl} className={linkClass}>
            GitHub
          </a>
          <a href={`mailto:${contactEmail}`} className={linkClass}>
            {contactEmail}
          </a>
        </div>
      </div>
    </footer>
  )
}

export { LandingFooter }
