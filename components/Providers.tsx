"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    // `data-theme` keeps the legacy tokens in sync until every screen is migrated.
    <ThemeProvider attribute={["class", "data-theme"]}>
      {children}
      <Toaster />
    </ThemeProvider>
  );
}
