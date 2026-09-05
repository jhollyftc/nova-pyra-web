import Image from "next/image";
import Reveal from "@/components/Reveal";
import type { OutreachEvent } from "@/lib/content";

/**
 * Outreach events. Only two of the seven have a photo, so this is a card grid
 * rather than the photo mosaic the plan assumed — cards with an image get one,
 * the rest lead with the reach number. Adding a photo in the CMS later upgrades
 * a card automatically.
 */
export default function ImpactGrid({ events }: { events: OutreachEvent[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((e, i) => (
        <Reveal as="li" key={e.id} delay={i * 0.04} className="hud-frame flex flex-col">
          {e.photos?.[0] ? (
            <div className="scanlines relative aspect-[16/10] w-full overflow-hidden">
              <Image
                src={e.photos![0]}
                alt={e.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
          ) : (
            <div className="flex aspect-[16/10] w-full flex-col items-center justify-center">
              <span
                className="glow-text tabular-nums"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 900,
                  fontSize: "clamp(34px, 6vw, 52px)",
                  color: "var(--color-accent)",
                  lineHeight: 1,
                }}
              >
                {e.reached}
              </span>
              <span className="micro mt-2">People reached</span>
            </div>
          )}

          <div className="flex flex-1 flex-col gap-2 border-t border-[var(--color-border)] p-5">
            <h3
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 700,
                fontSize: "16px",
                letterSpacing: "0.04em",
              }}
            >
              {e.name}
            </h3>
            <p className="micro">
              {e.date} · {e.location}
            </p>
            <p
              className="mt-1 text-[var(--color-text-secondary)]"
              style={{ fontSize: "14px", lineHeight: 1.5 }}
            >
              {e.summary}
            </p>
            {e.photos?.[0] && (
              <p className="micro mt-auto pt-2" style={{ color: "var(--color-accent)" }}>
                {e.reached} people reached
              </p>
            )}
          </div>
        </Reveal>
      ))}
    </ul>
  );
}
