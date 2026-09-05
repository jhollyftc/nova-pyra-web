# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your
training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code.
Heed deprecation notices.

# Nova Pyra website conventions

- **Tailwind is pinned to exactly 4.0.3** with `@tailwindcss/oxide` overrides. On Node v24 (this
  machine) oxide ≥ 4.0.4 hangs the build. Dev must run `next dev --webpack`, never Turbopack.
- **No `tailwind.config.js`.** The theme is CSS-first via `@theme inline` in `app/globals.css`.
  All color goes through the CSS custom properties defined there — never hard-code a hex in a
  component.
- Tailwind classes are for layout, borders and spacing. Typography uses inline `style={{}}` with
  `clamp()`, matching the pattern established in `ftc-pit-app`.
- Content lives in **Sanity**, read only through `lib/content.ts`. Nothing queries Sanity directly.
  Keep that boundary — it is what let the site move from JSON files to a CMS without restructuring
  a single page.
- Every animation must have a `prefers-reduced-motion: reduce` path. Use the `useReducedMotion`
  hook from `framer-motion`.
- Media: no GIFs. Video goes through `components/Video.tsx`, which handles posters and reduced
  motion. Images come from the Sanity CDN and are resized on the fly — never commit media to
  `public/`, which now holds only the GLB models.
