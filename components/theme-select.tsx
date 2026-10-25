"use client"

import { useSyncExternalStore } from "react"
import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const options = [
  { value: "dark", label: "Escuro", icon: MoonIcon },
  { value: "light", label: "Claro", icon: SunIcon },
  { value: "system", label: "Sistema", icon: MonitorIcon },
]

const items = options.map(({ value, label }) => ({ value, label }))

const subscribe = () => () => {}

function ThemeSelect({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  // The stored theme is only known on the client; render the default until then.
  const mounted = useSyncExternalStore(subscribe, () => true, () => false)
  const value = mounted ? (theme ?? "dark") : "dark"

  return (
    <Select items={items} value={value} onValueChange={(next) => next && setTheme(next)}>
      <SelectTrigger aria-label="Tema" className={className ?? "w-36"}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map(({ value: optionValue, label, icon: Icon }) => (
          <SelectItem key={optionValue} value={optionValue}>
            <Icon aria-hidden="true" className="size-4" strokeWidth={1.75} />
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export { ThemeSelect }
