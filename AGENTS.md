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

# Look at it before saying it works

`tsc`, `eslint`, `next build` and `scripts/check-assets.mjs` prove the site
WORKS. None of them say anything about whether it looks right — a hero that
lands under the fold, two dot grids moiréing against each other, an animation
that never fires, a countdown lost in an empty panel: all of that passes every
one of them.

```
PORT=3111 npx next start -p 3111 &
MSYS_NO_PATHCONV=1 PORT=3111 node scripts/shoot.mjs
```

Writes PNGs to `screenshots/` (gitignored) — five scroll positions per route,
because most of this site's motion is scroll-driven and a shot of the top of
the page shows none of it. `--mobile`, `--reduced` (the only way the
reduced-motion branches get exercised at all), `--full`, `--routes=`.

Drives the Chrome already installed on the machine, so `playwright-core` is the
only dependency and no browser is downloaded. In Git Bash, prefix with
`MSYS_NO_PATHCONV=1` or a leading `/` in `--routes` is rewritten to a Windows
path.

# The shot simulator

`public/tools/shot-sim/` is the HIVE Shot Envelope simulator, served at
`/season/shot-sim` via a rewrite in `next.config.js`. It is a copy of a
self-contained HTML file authored outside this repo, not a port — it owns the
full viewport by design and brings its own design system, so it gets its own
URL rather than an iframe inside a page with the site's chrome.

Re-sync it after the team edits the original:

```
node scripts/sync-shot-sim.mjs            # defaults to ~/Desktop/nova-pyra-shot-sim/index.html
node scripts/sync-shot-sim.mjs <path>
```

Never hand-edit the copy in `public/` — the sync script rewrites it, and it
repairs a document head the source does not have (doctype, charset, viewport).
Those belong in the source too.

This is the one exception to "never commit media to `public/`": it is a tool,
not an asset, and it is code the team wrote.
