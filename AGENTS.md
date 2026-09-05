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
- Content lives in `content/` as typed JSON behind `lib/content.ts`. Nothing imports a JSON file
  directly — this indirection is what lets Phase 2 swap in Sanity without touching any component.
- Every animation must have a `prefers-reduced-motion: reduce` path. Use the `useReducedMotion`
  hook from `framer-motion`.
- Media: no GIFs. Video goes through `components/Video.tsx`, which handles posters and reduced
  motion. Run `npm run media` to regenerate from the pit app's assets.
