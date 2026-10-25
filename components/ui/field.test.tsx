import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Field, FieldDescription, FieldError, FieldLabel } from "./field"
import { Input } from "./input"

describe("Field", () => {
  it("keeps an invalid control linked to its description and error", () => {
    render(
      <Field data-invalid>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input
          id="email"
          aria-invalid="true"
          aria-describedby="email-description email-error"
        />
        <FieldDescription id="email-description">
          Use your work email.
        </FieldDescription>
        <FieldError id="email-error">Enter a valid email.</FieldError>
      </Field>
    )

    const input = screen.getByRole("textbox", { name: "Email" })
    expect(input).toHaveAttribute("aria-invalid", "true")
    expect(input).toHaveAccessibleDescription(
      "Use your work email. Enter a valid email."
    )
    expect(screen.getByRole("alert")).toHaveClass("text-xs", "text-destructive")
  })

  it("uses six-pixel vertical spacing and colors only invalid labels and errors", () => {
    render(
      <Field data-invalid data-testid="field">
        <FieldLabel>Project</FieldLabel>
        <FieldDescription>Visible to the team.</FieldDescription>
        <FieldError>Project is required.</FieldError>
      </Field>
    )

    expect(screen.getByTestId("field")).toHaveClass("gap-1.5")
    expect(screen.getByText("Project").className).toContain(
      "group-data-[invalid=true]/field:text-destructive"
    )
    expect(screen.getByText("Visible to the team.")).toHaveClass(
      "text-muted-foreground"
    )
    expect(screen.getByText("Project").className).not.toMatch(/opacity-/)
  })

  it("fades the error in with a 4px drop", () => {
    render(<FieldError>Informe um email válido.</FieldError>)
    expect(screen.getByRole("alert")).toHaveClass(
      "animate-in",
      "fade-in-0",
      "slide-in-from-top-1",
      "duration-150",
      "ease-out"
    )
  })
})
