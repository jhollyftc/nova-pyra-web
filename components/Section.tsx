import Link from "next/link";
import type { ReactNode } from "react";
import Reveal from "./Reveal";

/**
 * Standard section chrome: a mono eyebrow, an Orbitron heading, and an optional
 * "more" link. Keeps every band on the front page reading as one system.
 */
export default function Section({
  eyebrow,
  title,
  intro,
  href,
  hrefLabel,
  children,
  id,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  href?: string;
  hrefLabel?: string;
  children: ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="shell py-[calc(var(--section-gap)/2)]">
      <Reveal>
        <div className="mb-10 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <div className="max-w-2xl">
            <p className="micro">{eyebrow}</p>
            <h2
              className="mt-3 text-balance"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                fontSize: "clamp(24px, 4vw, 42px)",
                lineHeight: 1.15,
                letterSpacing: "0.02em",
              }}
            >
              {title}
            </h2>
            {intro && (
              <p
                className="mt-4 text-[var(--color-text-secondary)]"
                style={{ fontSize: "clamp(15px, 1.6vw, 18px)" }}
              >
                {intro}
              </p>
            )}
          </div>

          {href && (
            <Link
              href={href}
              className="whitespace-nowrap border-b pb-1 transition-colors"
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
              {hrefLabel ?? "View all"} →
            </Link>
          )}
        </div>
      </Reveal>

      {children}
    </section>
  );
}
