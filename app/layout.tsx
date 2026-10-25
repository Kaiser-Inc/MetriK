import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "MetriK — Code Quality Dashboard",
  description: "Visualização de métricas de qualidade de código",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={cn("h-full antialiased", GeistSans.variable, GeistMono.variable, "font-sans")}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
