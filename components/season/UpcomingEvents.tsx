import Reveal from "@/components/Reveal";
import Countdown from "@/components/Countdown";
import type { SeasonEvent } from "@/lib/content";

/**
 * Competitions the team has not been to yet.
 *
 * Kept visually distinct from the results below: no rank, no record, and a live
 * countdown instead. The point of the list is that something is coming, so the
 * date is the loudest thing in each row.
 */
export default function UpcomingEvents({ events }: { events: SeasonEvent[] }) {
  if (events.length === 0) return null;

  return (
    <ol className="flex flex-col gap-3">
      {events.map((e, i) => (
        <Reveal
          as="li"
          key={e.id}
          delay={i * 0.05}
          className="hud-frame flex flex-wrap items-center justify-between gap-x-6 gap-y-2 p-5"
        >
          <div className="min-w-0">
            <h3
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 700,
                fontSize: "18px",
                letterSpacing: "0.04em",
              }}
            >
              {e.name}
            </h3>
            <p className="micro mt-1">
              {[e.date, e.location].filter(Boolean).join(" · ")}
            </p>
          </div>
          <Countdown date={e.startDate} />
        </Reveal>
      ))}
    </ol>
  );
}
