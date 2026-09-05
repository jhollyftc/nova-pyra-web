import Image from "next/image";
import type { Member } from "@/lib/content";

/**
 * A person, compact enough that a whole roster fits on one screen.
 *
 * The previous card stacked a square photo above a name, role, role description
 * and dream occupation — roughly 400px each, so fifteen students meant a long
 * scroll. Here the name and role sit ON the photo behind a scrim, which removes
 * the text block entirely and roughly halves the card. Fifteen students at five
 * across is three rows that fit a laptop screen.
 *
 * The fuller detail (role description, interests, dream occupation) is still in
 * the CMS and still worth showing — it just belongs in a per-person view rather
 * than multiplied fifteen times in a grid.
 */
export default function PersonCard({
  person,
  showAlumniDetail = false,
}: {
  person: Member;
  showAlumniDetail?: boolean;
}) {
  return (
    <article className="hud-frame group relative overflow-hidden">
      <div className="relative aspect-square w-full overflow-hidden bg-[var(--color-surface)]/20">
        {person.photo ? (
          <Image
            src={person.photo}
            alt={person.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 220px"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontSize: "28px",
              color: "var(--color-text-muted)",
            }}
            aria-hidden="true"
          >
            {person.name.charAt(0)}
          </div>
        )}

        {/* Scrim: the name has to stay readable over any photo behind it. */}
        <div
          className="absolute inset-x-0 bottom-0 flex flex-col gap-0.5 p-3"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.72) 45%, transparent 100%)",
          }}
        >
          <h3
            className="leading-tight"
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 700,
              fontSize: "clamp(14px, 1.3vw, 16px)",
              letterSpacing: "0.03em",
            }}
          >
            {person.name}
          </h3>
          <p
            className="leading-tight"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "clamp(11px, 0.95vw, 12.5px)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--color-accent)",
            }}
          >
            {person.role}
          </p>
        </div>
      </div>

      {showAlumniDetail && (person.classOf || person.yearsOnTeam || person.nowDoing) && (
        <div className="flex flex-col gap-1 border-t border-[var(--color-border)] p-3">
          {(person.classOf || person.yearsOnTeam) && (
            <p className="micro">
              {[person.classOf && `Class of ${person.classOf}`, person.yearsOnTeam]
                .filter(Boolean)
                .join(" · ")}
            </p>
          )}
          {person.nowDoing && (
            <p
              className="text-[var(--color-text-secondary)]"
              style={{ fontSize: "14px", lineHeight: 1.45 }}
            >
              {person.nowDoing}
            </p>
          )}
        </div>
      )}
    </article>
  );
}
