/**
 * The engineering portfolio. Judges' main target on the site, so it is rendered
 * as a deliberate call to action rather than a plain link — the pulsing dot is
 * carried over from the pit app's "live document" treatment.
 *
 * Opens in a new tab; the PDF is large and is never embedded.
 */
export default function NotebookLink({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="hud-frame inline-flex items-center gap-4 px-5 py-4 transition-colors hover:bg-[rgba(17,115,241,0.06)]"
    >
      <span className="relative flex h-2.5 w-2.5 shrink-0">
        <span
          className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-70"
          style={{ background: "var(--color-live)" }}
        />
        <span
          className="relative inline-flex h-2.5 w-2.5 rounded-full"
          style={{ background: "var(--color-live)" }}
        />
      </span>
      <span>
        <span
          className="block"
          style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 700,
            fontSize: "15px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Engineering Portfolio
        </span>
        <span className="micro" style={{ letterSpacing: "0.12em" }}>
          Live document · opens the PDF
        </span>
      </span>
    </a>
  );
}
