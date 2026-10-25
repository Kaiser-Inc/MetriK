"use client"

import { StackIcon } from "@/components/icons/StackIcon"
import { Button } from "@/components/ui/button"
import { STACK_META, type Stack } from "@/types/metrics"

export type StackFilterValue = Stack | "all"

const STACKS: Stack[] = ["python-fastapi", "node-fastify", "ruby-on-rails", "next-saas", "expo-mobile"]

type StackFilterProps = {
  value: StackFilterValue
  onChange: (value: StackFilterValue) => void
}

function StackFilter({ value, onChange }: StackFilterProps) {
  return (
    <div role="group" aria-label="Filtrar por stack" className="flex flex-wrap items-center gap-2">
      <Button
        variant={value === "all" ? "default" : "outline"}
        aria-pressed={value === "all"}
        onClick={() => onChange("all")}
      >
        Todas
      </Button>
      {STACKS.map((stack) => (
        <Button
          key={stack}
          variant={value === stack ? "default" : "outline"}
          aria-pressed={value === stack}
          onClick={() => onChange(stack)}
        >
          <span aria-hidden="true" className="flex">
            <StackIcon stack={stack} size={14} />
          </span>
          {STACK_META[stack].label}
        </Button>
      ))}
    </div>
  )
}

export { StackFilter }
