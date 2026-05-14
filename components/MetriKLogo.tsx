"use client";

import Image from "next/image";
import Link from "next/link";

export function MetriKLogo() {
  return (
    <Link
      href="/"
      style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}
    >
      <Image
        src="/kaiser-logo.png"
        alt="KaiserInc"
        width={44}
        height={44}
        style={{ objectFit: "contain" }}
        priority
      />

      <span style={{
        width: 1,
        height: 16,
        background: "var(--border-default)",
        display: "inline-block",
        flexShrink: 0,
        opacity: 0.6,
      }} />

      <span
        style={{
          fontFamily: "Roboto, sans-serif",
          fontWeight: 700,
          fontSize: "1.25rem",
          letterSpacing: "-0.02em",
          color: "var(--fg-1)",
          lineHeight: 1,
        }}
      >
        Metri<span style={{ color: "#8257E6" }}>K</span>
      </span>
    </Link>
  );
}
