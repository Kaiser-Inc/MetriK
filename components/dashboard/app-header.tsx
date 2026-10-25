import { MetrikLogo } from "@/components/metrik-logo"
import { ThemeSelect } from "@/components/theme-select"
import { HelpSheet } from "@/components/tutorial/help-sheet"

// Header shared by the dashboard, report and comparison screens.
function AppHeader({ children }: { children?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <div className="mx-auto flex h-16 w-full max-w-page items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-6">
          <MetrikLogo />
          {children}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <HelpSheet />
          <ThemeSelect className="w-32" />
        </div>
      </div>
    </header>
  )
}

export { AppHeader }
