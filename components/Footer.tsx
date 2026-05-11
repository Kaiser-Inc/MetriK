"use client";

export function Footer() {
  return (
    <footer style={{
      borderTop: "1px solid var(--border-default)",
      padding: "2rem 1.5rem",
      textAlign: "center",
      color: "var(--fg-4)",
      fontSize: "0.8rem",
    }}>
      KaiserInc — Knowledge &amp; Tech ·{" "}
      <span style={{ fontFamily: "Roboto Mono, monospace", color: "#8257E6" }}>
        @pHenrymelo
      </span>
    </footer>
  );
}
