"use client"

import { Switch as SwitchPrimitive } from "@base-ui/react/switch"
import { cn } from "cn"

function Switch({
  className,
  size = "default",
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: "sm" | "default"
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer group/switch relative inline-flex shrink-0 items-center rounded-full border-2 border-transparent transition-[background-color,border-color] duration-250 ease-out outline-hidden after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring aria-invalid:border-destructive data-[size=default]:h-5 data-[size=default]:w-8 data-[size=default]:[--switch-inner:28px] data-[size=default]:[--switch-thumb-pressed:20px] data-[size=sm]:h-4 data-[size=sm]:w-6 data-[size=sm]:[--switch-inner:20px] data-[size=sm]:[--switch-thumb-pressed:15px] data-checked:bg-primary data-unchecked:bg-input data-disabled:cursor-not-allowed data-disabled:bg-muted data-disabled:text-subtle-foreground",
        className
      )}
      {...props}
    >
      {/* --switch-inner is the track width inside its 2px border. Positioning
          the checked thumb at inner width minus its own width keeps it flush
          while it widens on press, so it grows toward the center. */}
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block rounded-full bg-background transition-[translate,width] duration-250 ease-drawer group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3 data-checked:translate-x-[calc(var(--switch-inner)-100%)] data-unchecked:translate-x-0 motion-safe:group-[:active:not([data-disabled])]/switch:w-(--switch-thumb-pressed)"
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
