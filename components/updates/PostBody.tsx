import Image from "next/image";
import Link from "next/link";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PostBlock } from "@/lib/content";

/**
 * A season update's body.
 *
 * Every other page on this site is composed of fields the team fills in, which
 * is what keeps them visually consistent. This is the one place students write
 * freely, so the styling has to hold up whatever they type — long paragraphs,
 * a stray h4, a list of part numbers — without anyone having to think about it.
 *
 * Measure is capped at ~68 characters. The rest of the site is a HUD and reads
 * in glances; this is the only thing on it anyone reads a paragraph of, and
 * full-width prose on a 27" monitor is unreadable however good the typeface is.
 */
const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p style={{ fontSize: "17px", lineHeight: 1.75, marginBlock: "0 1.25em" }}>{children}</p>
    ),
    h2: ({ children }) => (
      <h2
        className="glow-text"
        style={{
          fontFamily: "var(--font-heading)",
          fontWeight: 700,
          fontSize: "clamp(20px, 2.6vw, 26px)",
          letterSpacing: "0.04em",
          marginBlock: "1.8em 0.6em",
        }}
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3
        style={{
          fontFamily: "var(--font-heading)",
          fontWeight: 700,
          fontSize: "clamp(17px, 2vw, 20px)",
          letterSpacing: "0.04em",
          marginBlock: "1.6em 0.5em",
        }}
      >
        {children}
      </h3>
    ),
    // Anything deeper than h3 is levelled off rather than shrinking into the
    // body copy, where a heading stops looking like a heading.
    h4: ({ children }) => (
      <h4 className="micro" style={{ marginBlock: "1.6em 0.5em" }}>
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote
        className="my-7 border-l-2 pl-5"
        style={{
          borderColor: "var(--color-border-active)",
          fontSize: "18px",
          lineHeight: 1.65,
          color: "var(--color-text-secondary)",
        }}
      >
        {children}
      </blockquote>
    ),
  },

  list: {
    bullet: ({ children }) => (
      <ul className="mb-6 flex list-disc flex-col gap-2 pl-6" style={{ fontSize: "17px" }}>
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mb-6 flex list-decimal flex-col gap-2 pl-6" style={{ fontSize: "17px" }}>
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li style={{ lineHeight: 1.65 }}>{children}</li>,
    number: ({ children }) => <li style={{ lineHeight: 1.65 }}>{children}</li>,
  },

  marks: {
    strong: ({ children }) => <strong style={{ fontWeight: 700 }}>{children}</strong>,
    code: ({ children }) => (
      <code
        className="border px-1.5 py-0.5"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.9em",
          borderColor: "var(--color-border)",
          color: "var(--color-cyan)",
        }}
      >
        {children}
      </code>
    ),
    link: ({ children, value }) => {
      const href: string = value?.href ?? "#";
      // Anything not pointing back at this site opens in a new tab and says so
      // to a screen reader. `noreferrer` because we do not know where students
      // will link to.
      const external = /^https?:\/\//.test(href) && !href.includes("novapyra");
      return (
        <Link
          href={href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="underline decoration-1 underline-offset-4 transition-colors hover:text-[var(--color-white)]"
          style={{ color: "var(--color-accent)" }}
        >
          {children}
        </Link>
      );
    },
  },

  types: {
    image: ({ value }) =>
      value?.url ? (
        <figure className="my-8">
          <div className="hud-frame scanlines relative overflow-hidden">
            <Image
              src={value.url}
              alt={value.alt ?? ""}
              width={1400}
              height={933}
              className="h-auto w-full"
              sizes="(max-width: 768px) 100vw, 720px"
            />
          </div>
          {value.alt && <figcaption className="micro mt-3">{value.alt}</figcaption>}
        </figure>
      ) : null,
  },
};

export default function PostBody({ body }: { body: PostBlock[] | null }) {
  if (!body || body.length === 0) return null;
  return (
    <div className="max-w-[68ch] text-[var(--color-text-secondary)]">
      <PortableText value={body} components={components} />
    </div>
  );
}
