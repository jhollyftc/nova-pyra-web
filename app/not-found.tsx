import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative overflow-hidden">
      <div className="dot-grid absolute inset-0" aria-hidden="true" />
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 60% 70% at 50% 20%, rgba(17,115,241,0.16), transparent 70%)",
        }}
      />
      <div className="shell relative flex min-h-[60vh] flex-col items-start justify-center py-24">
        <p className="micro">Error 404 · No signal</p>
        <h1
          className="glow-text mt-4"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 900,
            fontSize: "clamp(36px, 9vw, 88px)",
            lineHeight: 1,
            letterSpacing: "0.04em",
          }}
        >
          PAGE NOT FOUND
        </h1>
        <p
          className="mt-6 max-w-md text-[var(--color-text-secondary)]"
          style={{ fontSize: "clamp(15px, 1.8vw, 18px)" }}
        >
          That page does not exist. It may have moved, or the link may be out of date.
        </p>
        <Link
          href="/"
          className="glow-box mt-9 border px-6 py-3"
          style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 700,
            fontSize: "14px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--color-accent)",
            borderColor: "var(--color-border-active)",
          }}
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
