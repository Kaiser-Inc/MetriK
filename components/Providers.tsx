"use client";

import { ThemeProvider, Toaster } from "@kaiserinc/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark">
      {children}
      <Toaster position="bottom-right" richColors />
    </ThemeProvider>
  );
}
