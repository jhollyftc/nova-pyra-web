"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { team } from "@/lib/content";

const NAV = [
  { href: "/robot", label: "Robot" },
  { href: "/engineering", label: "Engineering" },
  { href: "/team", label: "Team" },
  { href: "/impact", label: "Impact" },
  { href: "/season", label: "Season" },
  { href: "/awards", label: "Awards" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // The drawer closes from the link's own onClick rather than an effect on
  // pathname — it covers the viewport, so its links are the only way to
  // navigate while it is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-black/70 backdrop-blur-md"
      style={{ height: "var(--header-height)" }}
    >
      <div className="shell flex h-full items-center justify-between gap-4">
        <Link href="/" className="group flex items-baseline gap-2 whitespace-nowrap">
          <span
            className="glow-text text-[var(--color-white)]"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontSize: "clamp(15px, 2.2vw, 19px)",
              letterSpacing: "0.14em",
            }}
          >
            NOVA PYRA
          </span>
          <span className="micro hidden sm:inline" style={{ letterSpacing: "0.2em" }}>
            {team.number}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className="px-3 py-2 transition-colors"
                style={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: 600,
                  fontSize: "14px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: active ? "var(--color-accent)" : "var(--color-text-secondary)",
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/sponsors/join"
            className="hidden border px-4 py-2 transition-all sm:inline-block"
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
            Sponsor Us
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex h-10 w-10 items-center justify-center border border-[var(--color-border)] lg:hidden"
          >
            <span className="relative block h-3 w-5">
              <span
                className="absolute left-0 block h-px w-5 bg-[var(--color-accent)] transition-transform"
                style={{ top: open ? 6 : 0, transform: open ? "rotate(45deg)" : "none" }}
              />
              <span
                className="absolute left-0 block h-px w-5 bg-[var(--color-accent)] transition-opacity"
                style={{ top: 6, opacity: open ? 0 : 1 }}
              />
              <span
                className="absolute left-0 block h-px w-5 bg-[var(--color-accent)] transition-transform"
                style={{ top: open ? 6 : 12, transform: open ? "rotate(-45deg)" : "none" }}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div
          id="mobile-nav"
          className="dot-grid fixed inset-x-0 bottom-0 z-40 overflow-y-auto border-t border-[var(--color-border)] bg-black lg:hidden"
          style={{ top: "var(--header-height)" }}
        >
          <nav className="shell flex flex-col py-6">
            {[...NAV, { href: "/sponsors/join", label: "Sponsor Us" }].map((item) => {
              const isCta = item.href === "/sponsors/join";
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-[var(--color-border)] py-4"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "clamp(20px, 6vw, 28px)",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: isCta ? "var(--color-gold)" : "var(--color-text-primary)",
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
