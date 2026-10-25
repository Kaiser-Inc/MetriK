import type { Metadata } from "next";
import { LandingPage } from "@/components/landing/landing-page";

export const metadata: Metadata = {
  title: "MetriK — Qualidade de código à vista",
  description:
    "Dashboard de qualidade de código multi-stack: complexidade, manutenibilidade, cobertura, linter e segurança em gráficos que você compara e exporta.",
};

export default function HomePage() {
  return <LandingPage />;
}
