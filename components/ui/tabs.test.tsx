import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs"

function TabsExample() {
  return (
    <Tabs defaultValue="overview">
      <TabsList aria-label="Project sections">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="settings" disabled>
          Settings
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview">Project overview</TabsContent>
      <TabsContent value="activity">Recent activity</TabsContent>
      <TabsContent value="settings">Project settings</TabsContent>
    </Tabs>
  )
}

describe("Tabs", () => {
  it("moves selection with arrow keys and keeps aria-selected in sync", async () => {
    const user = userEvent.setup()
    render(<TabsExample />)

    const overview = screen.getByRole("tab", { name: "Overview" })
    const activity = screen.getByRole("tab", { name: "Activity" })
    expect(overview).toHaveAttribute("aria-selected", "true")
    expect(activity).toHaveAttribute("aria-selected", "false")

    await user.tab()
    await user.keyboard("{ArrowRight}")

    expect(overview).toHaveAttribute("aria-selected", "false")
    expect(activity).toHaveAttribute("aria-selected", "true")
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Recent activity")
  })

  it("slides one shared indicator instead of pills or per-tab underlines", () => {
    const { container } = render(<TabsExample />)

    const list = screen.getByRole("tablist")
    const overview = screen.getByRole("tab", { name: "Overview" })
    const settings = screen.getByRole("tab", { name: "Settings" })
    expect(list).toHaveClass("relative", "border-b", "border-border", "bg-transparent")
    expect(overview).toHaveClass("h-control", "text-muted-foreground", "data-active:text-foreground")
    expect(overview.className).not.toMatch(/after:/)
    expect(settings).toHaveClass("disabled:text-subtle-foreground")
    expect(overview.className).not.toMatch(/rounded-full|rounded-2xl|data-active:bg-/)

    const indicator = container.querySelector('[data-slot="tabs-indicator"]')
    expect(indicator).toBeInTheDocument()
    expect(indicator).toHaveClass(
      "bg-primary-text",
      "transition-[translate,width,height]",
      "duration-200",
      "ease-in-out",
      "group-data-horizontal/tabs:translate-x-(--active-tab-left)",
      "group-data-horizontal/tabs:w-(--active-tab-width)",
      "group-data-vertical/tabs:translate-y-(--active-tab-top)",
      "group-data-vertical/tabs:h-(--active-tab-height)"
    )
  })

  it("renders the indicator inside the tab list", () => {
    render(<TabsExample />)
    const indicator = screen.getByRole("tablist").querySelector('[data-slot="tabs-indicator"]')
    expect(indicator).toBeInTheDocument()
  })

  it("fades the panel in when it mounts", () => {
    render(<TabsExample />)
    expect(screen.getByRole("tabpanel")).toHaveClass("animate-in", "fade-in-0", "duration-150", "ease-out")
  })
})
