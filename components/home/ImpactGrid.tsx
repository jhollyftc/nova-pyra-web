import Image from "next/image";
import Reveal from "@/components/Reveal";
import Countdown from "@/components/Countdown";
import { isUpcoming } from "@/lib/dates";
import type { OutreachEvent } from "@/lib/content";

/**
 * Outreach events. Only two of the seven have a photo, so this is a card grid
 * rather than the photo mosaic the plan assumed — cards with an image get one,
 * the rest lead with the reach number. Adding a photo in the CMS later upgrades
 * a card automatically.
 *
 * `upcoming` cards are deliberately different. An event that has not happened
 * cannot claim a reach figure — the number in the CMS is the team's estimate,
 * and printing it as though it were counted would be a small lie that inflates
 * the most load-bearing statistic on the site. Those cards lead with the
 * countdown instead, which is the honest and more interesting fact anyway.
 */
export default function ImpactGrid({ events }: { events: OutreachEvent[] }) {
  if (events.length === 0) return null;

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((e, i) => {
        // Derived per card, not passed in, so a grid can mix the two — the
        // home page shows what is next alongside what just happened.
        const upcoming = isUpcoming(e.date);
        return (
        <Reveal as="li" key={e.id} delay={i * 0.04} className="hud-frame flex flex-col">
          {e.photos?.[0] && !upcoming ? (
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
              {upcoming ? (
                <Countdown date={e.date} variant="display" />
              ) : (
                <>
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
                </>
              )}
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
              {[e.dateLabel, e.location].filter(Boolean).join(" · ")}
            </p>
            <p
              className="mt-1 text-[var(--color-text-secondary)]"
              style={{ fontSize: "15px", lineHeight: 1.5 }}
            >
              {e.summary}
            </p>
            {!upcoming && e.photos?.[0] && (
              <p className="micro mt-auto pt-2" style={{ color: "var(--color-accent)" }}>
                {e.reached} people reached
              </p>
            )}
            {upcoming && e.reached ? (
              <p className="micro mt-auto pt-2">Expecting around {e.reached} people</p>
            ) : null}
          </div>
        </Reveal>
        );
      })}
    </ul>
  );
}
