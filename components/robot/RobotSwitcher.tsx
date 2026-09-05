import Link from "next/link";
import type { RobotSummary } from "@/lib/content";

/**
 * Season switcher across the team's robots.
 *
 * Hidden entirely while there is only one robot — a switcher with a single
 * option is noise. It appears by itself the moment a second season is added in
 * the Studio.
 */
export default function RobotSwitcher({
  robots,
  activeSlug,
}: {
  robots: RobotSummary[];
  activeSlug: string;
}) {
  if (robots.length < 2) return null;

  return (
    <nav aria-label="Choose a season" className="flex flex-wrap gap-2">
      {robots.map((r) => {
        const active = r.slug === activeSlug;
        return (
          <Link
            key={r.slug}
            href={r.isCurrent ? "/robot" : `/robot/${r.slug}`}
            aria-current={active ? "page" : undefined}
            className="border px-4 py-2.5 transition-colors"
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 700,
              fontSize: "14px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: active ? "var(--color-accent)" : "var(--color-text-secondary)",
              borderColor: active ? "var(--color-border-active)" : "var(--color-border)",
              background: active ? "rgba(17,115,241,0.08)" : "transparent",
            }}
          >
            {r.name}
            <span className="micro ml-2" style={{ letterSpacing: "0.1em" }}>
              {r.gameName}
              {r.status === "in-development" ? " · in build" : ""}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
