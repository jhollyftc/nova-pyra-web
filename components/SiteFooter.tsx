import Link from "next/link";
import type { Settings } from "@/lib/content";

/**
 * The pit app's /connect route was a grid of QR codes — right for a kiosk,
 * pointless in a browser. Those links live here instead, and are now editable
 * in the Studio under Site settings rather than hard-coded.
 */
const EXPLORE = [
  { href: "/robot", label: "The Robot" },
  { href: "/engineering", label: "Engineering" },
  { href: "/team", label: "Team" },
  { href: "/impact", label: "Impact" },
  { href: "/season", label: "Season" },
  { href: "/awards", label: "Awards" },
];

const linkStyle = {
  fontFamily: "var(--font-body)",
  fontSize: "15px",
  color: "var(--color-text-secondary)",
} as const;

export default function SiteFooter({ settings }: { settings: Settings }) {
  const socials = [
    { href: settings.socials?.instagram, label: "Instagram" },
    { href: settings.socials?.youtube, label: "YouTube" },
    { href: settings.socials?.facebook, label: "Facebook" },
    { href: settings.socials?.github, label: "GitHub" },
    { href: settings.socials?.cad, label: "CAD (Onshape)" },
  ].filter((l): l is { href: string; label: string } => Boolean(l.href));

  // Third-party sites carrying the team's official results — the audience for
  // these is judges and other teams scouting us, not casual visitors.
  // The Orange Alliance is deliberately absent: it is no longer maintained.
  const scouting = [
    { href: settings.scouting?.ftcEvents, label: "FTC Events" },
    { href: settings.scouting?.ftcScout, label: "FTCScout" },
    { href: settings.scouting?.ftcStats, label: "FTCStats" },
  ].filter((l): l is { href: string; label: string } => Boolean(l.href));

  return (
    <footer className="mt-[var(--section-gap)] border-t border-[var(--color-border)] bg-black">
      <div className="shell grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div
            className="glow-text"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontSize: "20px",
              letterSpacing: "0.14em",
            }}
          >
            {settings.teamName.toUpperCase()}
          </div>
          <p className="micro mt-2">
            FTC {settings.teamNumber} · {settings.location}
          </p>
          <p className="mt-4 max-w-xs" style={linkStyle}>
            {settings.tagline}
          </p>
        </div>

        <div>
          <h2 className="micro mb-4">Explore</h2>
          <ul className="space-y-2">
            {EXPLORE.map((l) => (
              <li key={l.href}>
                <Link href={l.href} style={linkStyle}>
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <a
                href="https://firstinspires.org/ftc"
                target="_blank"
                rel="noopener noreferrer"
                style={linkStyle}
              >
                Start an FTC Team
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="micro mb-4">Follow</h2>
          <ul className="space-y-2">
            {socials.map((l) => (
              <li key={l.href}>
                <a href={l.href} target="_blank" rel="noopener noreferrer" style={linkStyle}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          {scouting.length > 0 && (
            <>
              <h2 className="micro mb-4 mt-8">Our record</h2>
              <ul className="space-y-2">
                {scouting.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} target="_blank" rel="noopener noreferrer" style={linkStyle}>
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div>
          <h2 className="micro mb-4">Support the team</h2>
          <p className="mb-4 max-w-xs" style={linkStyle}>
            {settings.teamName} runs on community support. Sponsorship funds parts, travel, and
            the outreach we do across St. Tammany Parish.
          </p>
          <Link
            href="/sponsors/join"
            className="inline-block border px-5 py-2.5"
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 700,
              fontSize: "13px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--color-gold)",
              borderColor: "rgba(242,183,5,0.45)",
            }}
          >
            Become a Sponsor
          </Link>
        </div>
      </div>

      <div className="border-t border-[var(--color-border)]">
        <div className="shell flex flex-col gap-2 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="micro">
            © {new Date().getFullYear()} {settings.teamName} · FIRST Tech Challenge Team{" "}
            {settings.teamNumber}
          </p>
          <p className="micro">{settings.season}</p>
        </div>
      </div>
    </footer>
  );
}
