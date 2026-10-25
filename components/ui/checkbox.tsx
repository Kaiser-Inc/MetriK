"use client"

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import { cn } from "cn"
import { CheckIcon } from "lucide-react"

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer border-subtle-foreground relative flex size-4 shrink-0 items-center justify-center rounded-sm border bg-transparent transition-colors duration-[120ms] ease-out outline-hidden after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:border-border disabled:text-subtle-foreground aria-invalid:border-destructive data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground",
        className
      )}
      {...props}
    >
      {/* The check path (~22.6 long) sits inside a 24px dash with a 40px gap.
          A negative offset hides it in the gap and reveals it from the path's
          end, so the check draws from the short arm to the long one. */}
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        keepMounted
        className="grid place-content-center text-current [&>svg]:size-3.5 [&_path]:[stroke-dasharray:24_40] [&_path]:[stroke-dashoffset:0] [&_path]:transition-[stroke-dashoffset] [&_path]:duration-200 [&_path]:ease-out data-unchecked:[&_path]:[stroke-dashoffset:-26] data-unchecked:[&_path]:duration-[120ms]"
      >
        <CheckIcon strokeWidth={1.75} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
