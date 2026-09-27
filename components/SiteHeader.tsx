"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import ScrollProgress from "@/components/ScrollProgress";

const NAV = [
  { href: "/robot", label: "Robots" },
  { href: "/engineering", label: "Engineering" },
  { href: "/team", label: "Team" },
  { href: "/impact", label: "Impact" },
  { href: "/season", label: "Season" },
  { href: "/awards", label: "Awards" },
];

export default function SiteHeader({
  teamNumber,
  hasUpdates = false,
}: {
  teamNumber: string;
  /** False until the team has published a first season update — see layout. */
  hasUpdates?: boolean;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduced = useReducedMotion();

  // Sits next to Season, where someone looking for recent news would look.
  const nav = hasUpdates
    ? [...NAV.slice(0, 5), { href: "/updates", label: "Updates" }, ...NAV.slice(5)]
    : NAV;

  /**
   * The header separates from the page once you leave the top of it.
   *
   * At rest over the hero it should read as part of the same surface; over
   * scrolled content it has to read as floating above it, or the blur just
   * looks like a rendering artefact. `passive` because this listener must
   * never be able to make scrolling janky, and the state is a boolean so it
   * re-renders twice per page rather than on every frame.
   */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
      className="sticky top-0 z-40 border-b backdrop-blur-md transition-colors duration-300"
      style={{
        height: "var(--header-height)",
        borderColor: scrolled ? "var(--color-border-active)" : "var(--color-border)",
        background: scrolled ? "rgba(0,0,0,0.88)" : "rgba(0,0,0,0.7)",
        boxShadow: scrolled ? "0 8px 32px rgba(0,0,0,0.6)" : "none",
      }}
    >
      <ScrollProgress />
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
            {teamNumber}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className="nav-link px-3 py-2 transition-colors hover:text-[var(--color-white)]"
                style={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: 600,
                  fontSize: "15px",
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
            className="cta cta-gold hidden border px-4 py-2 sm:inline-block"
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 700,
              fontSize: "14px",
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

      {/*
        Mobile drawer. Most visits to a team site are from a phone, so this is
        the interaction most people actually have with the navigation — it
        appearing and vanishing between frames is the single most abrupt thing
        on the site. AnimatePresence is here for the exit: without it React
        unmounts the panel instantly and only the opening would be animated,
        which reads worse than neither.
      */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            className="dot-grid fixed inset-x-0 bottom-0 z-40 overflow-y-auto border-t border-[var(--color-border)] bg-black lg:hidden"
            style={{ top: "var(--header-height)" }}
            initial={reduced ? false : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 1 } : { opacity: 0, y: -12 }}
            transition={{ duration: reduced ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <nav className="shell flex flex-col py-6">
              {[...nav, { href: "/sponsors/join", label: "Sponsor Us" }].map((item, i) => {
                const isCta = item.href === "/sponsors/join";
                return (
                  <motion.div
                    key={item.href}
                    initial={reduced ? false : { opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: reduced ? 0 : 0.3, delay: reduced ? 0 : 0.05 + i * 0.04 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="block border-b border-[var(--color-border)] py-4"
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
                  </motion.div>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
