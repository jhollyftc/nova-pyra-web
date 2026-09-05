# Nova Pyra — team website

The public site for **FIRST Tech Challenge Team 25619 Nova Pyra**, Mandeville, Louisiana.
Live at **https://nova-pyra-web.vercel.app**; target domain **novapyra.app**.

It exists to do three things: recruit sponsors, give judges a linkable home for the engineering
work, and act as an outreach hub the team can publish to themselves.

## Running it

```bash
npm install
npm run dev            # http://localhost:3000
npm run build          # must pass before pushing
npm run check:assets   # against a running server; catches broken images
```

Needs `.env.local` — copy `.env.local.example` and fill in the Sanity project id.

**`--webpack` is required on both `dev` and `build`, not optional.** Tailwind is pinned to exactly
4.0.3 and its toolchain breaks under Turbopack on Node v24; see the pinned `overrides` in
`package.json`. If a build dies with `TypeError: Cannot convert undefined or null to object` in
`@tailwindcss/postcss`, check that `@tailwindcss/node` resolved to 4.0.14 and not a 4.3.x — the
caret range floats it otherwise, and that mismatch crashes the PostCSS plugin.

Pushing to `main` deploys to production automatically, in about a minute.

## Layout

| Path | What it is |
|---|---|
| `app/` | Routes. One page per section, all statically prerendered. |
| `app/studio/` | The embedded Sanity Studio. |
| `components/` | Shared UI. `components/home/` holds the front-page bands. |
| `sanity/` | Schemas, Studio structure, client. |
| `lib/content.ts` | **The only boundary between the site and Sanity.** |
| `lib/queries.ts` | GROQ queries, one per page's needs. |
| `public/` | Only the GLB models and their Draco decoder. |
| `scripts/` | The asset checker and the sponsor-logo cleaner. |

### Two rules worth keeping

**Nothing queries Sanity directly.** Every read goes through an accessor in `lib/content.ts`. That
indirection is what let the whole site move from JSON files to a CMS without restructuring a single
page — only the accessors became async.

**Images are projected to plain URLs in `lib/queries.ts`**, not returned as Sanity refs, so
components receive strings and stay unaware of where content comes from.

## Content

Everything is edited at [/studio](https://nova-pyra-web.vercel.app/studio) — see
[EDITING.md](EDITING.md), which is written for the students and mentors who use it.

Content was migrated from the pit app's JSON in September 2026 (108 documents, 60 assets). The
importer, the media-transcoding pipeline and the original JSON are in git history if a dataset ever
needs re-seeding; `npx sanity dataset export` is the supported backup route.

The CMS resizes and reformats every uploaded image on the fly, which is what stops the original
asset problem recurring — the pit app's `public/` was 364 MB, 303 MB of it GIFs, one of them 42 MB,
all of which had to be transcoded by hand before it could go on the web.

## Things that are deliberate

- **The hero logo has no entrance animation.** It is screen-blended so its black background drops
  out, and `mix-blend-mode` only blends against the nearest ancestor stacking context — any
  wrapper with opacity or a transform traps the blend and the black box becomes visible.
- **CAD models live in `public/`, not the CMS.** 6.9–16.5 MB binaries that change once a season and
  load only behind an explicit button, so they never affect page weight.
- **Test charts state "higher/lower is better" explicitly.** Two of the three measure things where
  lower is better; without the label, falling bars read as declining performance.
- **Every animation has a `prefers-reduced-motion` path.** Videos fall back to their poster frame.

## Known limitations

- **Sanity's free plan has two roles: Administrator and Viewer.** Viewer is read-only, so every
  editor is an administrator and can change anything. The grouped Studio menu is a convenience,
  not a permission boundary. Document history makes mistakes recoverable; real per-user
  permissions need the paid Growth plan.
- **No route has been checked on a physical phone.** Layouts are written for 360px–2560px but have
  not been eyeballed on a device.
- Stat counters server-render as `0` and count up on view, so a scraper without JS sees zeros.

## Not yet built

The DNS cutover to the `novapyra.app` apex. A public page for season updates — the `post` schema
exists and is editable, but nothing renders it yet.

## Related repos

`ftc-pit-app` is the origin of the content and the design tokens. It is a **1920×1080 Electron
kiosk** and is deliberately untouched by this project — it has to keep working offline at
competitions, and still reads its own local JSON.
