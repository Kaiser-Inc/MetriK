"use client"

import { HelpCircleIcon } from "lucide-react"

import { TutorialContent } from "@/components/tutorial/tutorial-content"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

// The same tutorial as the landing page, one click away from any dashboard screen.
function HelpSheet() {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" />}>
        <HelpCircleIcon aria-hidden="true" data-icon="inline-start" strokeWidth={1.75} />
        <span className="max-sm:sr-only">Como usar</span>
      </SheetTrigger>
      <SheetContent className="sm:w-[calc(520px+3rem)]">
        <SheetHeader>
          <SheetTitle>Como usar o MetriK</SheetTitle>
          <SheetDescription>
            Rodar, gerar relatórios, comparar e entender cada métrica.
          </SheetDescription>
        </SheetHeader>
        <TutorialContent />
      </SheetContent>
    </Sheet>
  )
}

export { HelpSheet }
