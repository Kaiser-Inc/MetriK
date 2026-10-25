import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table"

describe("Table", () => {
  it("renders its header and project rows with the KaiserInc Base treatment", () => {
    render(
      <Table>
        <TableCaption>KaiserInc projects</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Project</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Levelify</TableCell>
            <TableCell>Active</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )

    expect(screen.getByRole("table")).toHaveClass("w-full")
    expect(screen.getAllByRole("rowgroup")).toHaveLength(2)
    expect(screen.getByRole("columnheader", { name: "Project" })).toHaveClass(
      "h-11",
      "text-xs",
      "text-muted-foreground"
    )
    expect(screen.getByRole("cell", { name: "Levelify" })).toHaveClass("h-11")
    expect(screen.getByText("KaiserInc projects")).toHaveClass(
      "text-muted-foreground"
    )
  })

  it("uses borders and accent hover without zebra-striping rows", () => {
    const { container } = render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>MetriK</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )

    const row = screen.getByRole("row")
    expect(row).toHaveClass("border-b", "border-border", "hover:bg-accent")
    expect(container.innerHTML).not.toMatch(/(?:odd|even):/)
  })
})
