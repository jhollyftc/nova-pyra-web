# Nova Pyra — team website

The public site for **FIRST Tech Challenge Team 25619 Nova Pyra**, Mandeville, Louisiana.
Target domain: **novapyra.app**.

It exists to do three things: recruit sponsors, give judges a linkable home for the engineering
work, and act as an outreach hub the team can publish to themselves.

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
```

**`--webpack` is required on both `dev` and `build`, not optional.** Tailwind is pinned to exactly
4.0.3 and its toolchain breaks under Turbopack on Node v24; see the pinned `overrides` in
`package.json`. If a build dies with `TypeError: Cannot convert undefined or null to object` in
`@tailwindcss/postcss`, check that `@tailwindcss/node` resolved to 4.0.14 and not a 4.3.x.

## Layout

| Path | What it is |
|---|---|
| `app/` | Routes. One page per section, all statically prerendered. |
| `components/` | Shared UI. `components/home/` holds the front-page bands. |
| `content/` | All copy and data, as JSON. Every file carries an `_instructions` key. |
| `lib/content.ts` | **The only boundary between the site and its content.** |
| `assets-src/` | Team-supplied original photos, before processing. |
| `public/` | Generated — see below. Committed, because Vercel cannot rebuild it. |
| `scripts/` | The media pipeline and the asset checker. |

### Two rules worth keeping

**Nothing imports a JSON file directly.** Every read goes through an accessor in `lib/content.ts`.
That indirection is what will let Sanity drop in without touching a single component.

**Every asset path goes through `asset()` in that same file**, which lowercases it. The content
JSON inherited mixed casing from the pit app (`/images/Sponsors/MO.png`); Windows does not care and
Vercel's Linux hosts return 404. Normalising centrally means new content cannot reintroduce it.

## Media

`public/` is generated from `../ftc-pit-app/public` plus `assets-src/`:

```bash
npm run media          # needs ffmpeg on PATH
npm run check:assets   # against a running server; PORT=3111 to change port
```

The pit app's assets are 364 MB, 303 MB of it in GIFs (one is 42 MB) — fine for a kiosk on local
disk, unusable on the web. The pipeline transcodes every GIF to MP4 + WebM + a poster frame, cuts
the studio background from the robot photo *only if it is not already transparent*, and lowercases
every filename. Result: **85 MB**. Do not copy assets across by hand.

GLB models and the 16 MB engineering notebook are committed but never load on page view — the 3D
viewer sits behind an explicit button.

## Before this goes live

- [ ] **Confirm the sponsorship contact address.** `content/sponsorship.json` still uses
      `hello@novapyra.org`, inherited and unverified. The sponsor CTA mails it.
- [ ] **Sustainer and Firestarter list identical benefits** — transcribed faithfully from
      novapyra.org/sponsor-us.html, but it gives a $500 sponsor no reason to give $1,000.
- [ ] The Onshape CAD link in the pit app is still the placeholder `your-doc-id`, so it is omitted
      from the footer. Add the real one.
- [ ] Check every route on a phone. The layouts are written for 360px–2560px but have not been
      eyeballed.

## Not yet built

Sanity CMS (`/studio`, schemas, the one-time importer) — the content layer is shaped for it.
The DNS cutover to the `novapyra.app` apex. A season blog.

## Related repos

`ftc-pit-app` is the source of the content and the design tokens. It is a **1920×1080 Electron
kiosk** and is deliberately untouched by this project — it has to keep working offline at
competitions.
