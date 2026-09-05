import Reveal from "./Reveal";

/** Top-of-page chrome shared by every route below the home page. */
export default function PageHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <div className="relative overflow-hidden border-b border-[var(--color-border)]">
      <div className="dot-grid absolute inset-0" aria-hidden="true" />
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 60% 80% at 50% 0%, rgba(17,115,241,0.16), transparent 70%)",
        }}
      />
      <div className="shell relative py-16 sm:py-24">
        <Reveal>
          <p className="micro">{eyebrow}</p>
          <h1
            className="glow-text mt-4 text-balance"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontSize: "clamp(30px, 6vw, 64px)",
              lineHeight: 1.08,
              letterSpacing: "0.02em",
            }}
          >
            {title}
          </h1>
          {intro && (
            <p
              className="mt-6 max-w-2xl text-[var(--color-text-secondary)]"
              style={{ fontSize: "clamp(16px, 1.8vw, 19px)" }}
            >
              {intro}
            </p>
          )}
        </Reveal>
      </div>
    </div>
  );
}
