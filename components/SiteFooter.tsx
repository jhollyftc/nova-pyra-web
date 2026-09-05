import Link from "next/link";
import { team } from "@/lib/content";

/**
 * The pit app's /connect route was a grid of QR codes — right for a kiosk,
 * pointless in a browser. Those links live here instead.
 *
 * NOTE: two entries in the pit app's connect/links.json are unverified and are
 * deliberately omitted until confirmed — the Onshape CAD link is still the
 * literal placeholder `your-doc-id`, and `hello@novapyra.org` may not be a real
 * mailbox. Add them back once checked.
 */
const SOCIAL = [
  { href: "https://instagram.com/novapyra25619", label: "Instagram" },
  { href: "https://youtube.com/@novapyra25619", label: "YouTube" },
  { href: "https://github.com/novapyra25619", label: "GitHub" },
];

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

export default function SiteFooter() {
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
            NOVA PYRA
          </div>
          <p className="micro mt-2">FTC {team.number} · {team.location}</p>
          <p className="mt-4 max-w-xs" style={linkStyle}>
            {team.tagline}
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
          </ul>
        </div>

        <div>
          <h2 className="micro mb-4">Follow</h2>
          <ul className="space-y-2">
            {SOCIAL.map((l) => (
              <li key={l.href}>
                <a href={l.href} target="_blank" rel="noopener noreferrer" style={linkStyle}>
                  {l.label}
                </a>
              </li>
            ))}
            <li>
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
          <h2 className="micro mb-4">Support the team</h2>
          <p className="mb-4 max-w-xs" style={linkStyle}>
            Nova Pyra runs on community support. Sponsorship funds parts, travel, and the outreach
            we do across St. Tammany Parish.
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
            © {new Date().getFullYear()} {team.name} · FIRST Tech Challenge Team {team.number}
          </p>
          <p className="micro">{team.season} · DECODE</p>
        </div>
      </div>
    </footer>
  );
}
