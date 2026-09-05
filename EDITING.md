# Editing the site

Until the CMS is in (see the bottom of this file), all content lives as JSON in `content/`.
Editing is: change a file, check it locally, deploy.

## The three commands

```bash
npm run dev                  # http://localhost:3000 — live-reloads as you save
npm run build                # catches mistakes before they reach the site
npx vercel deploy --prod     # pushes it live to nova-pyra-web.vercel.app
```

You do not need `npm run dev` running to deploy, but it is the fastest way to see a change.

## Where things live

| To change… | Edit |
|---|---|
| Team name, number, tagline, season | `content/config.json` |
| Robot name, specs, subsystems, hotspot positions | `content/robot/specs.json` |
| Game strategy, AUTO/TELEOP/ENDGAME | `content/robot/strategy.json` |
| Design evolution entries | `content/robot/evolution.json` |
| Engineering design process steps | `content/process/edp.json` |
| Problem → solution cards | `content/process/problems.json` |
| Test data charts | `content/process/testing.json` |
| Outreach events and photos | `content/outreach/events.json` |
| People-reached / hours / schools numbers | `content/outreach/stats.json` |
| **Sponsor list, tiers, logos** | `content/outreach/sponsors.json` |
| **Sponsorship pitch, benefits, contact email** | `content/sponsorship.json` |
| Students and mentors | `content/story/members.json` |
| Awards | `content/story/awards.json` |
| Team timeline | `content/story/timeline.json` |
| Founding story, mission, values, subteams, partners | `content/story/team.json` |
| Season description and strategy | `content/season/overview.json` |
| Season goals and progress bars | `content/season/goals.json` |
| Event results (rank, record, awards) | `content/season/events.json` |

Every file opens with an `_instructions` key explaining its own fields. Read it before editing.

**The season record and Worlds rank in the hero are not typed anywhere** — they are summed from
`content/season/events.json`. Add an event there and the hero updates itself.

## Rules that will bite you if you break them

**JSON is strict.** No trailing comma after the last item in a list, all strings in double quotes.
If the site won't start, that is almost always why — `npm run build` will point at the line.

**Student names stay first-name + last-initial.** That is a deliberate privacy convention for
minors, inherited from the pit app. Do not add surnames.

**Never edit anything in `public/`.** It is generated. Your changes will be wiped the next time
anyone runs `npm run media`.

## Adding images

Put the original in `assets-src/`, then:

```bash
npm run media          # processes everything; needs ffmpeg installed
npm run check:assets   # with a server running, confirms nothing 404s
```

Reference it from the JSON by its path under `public/` — e.g. `/images/team-photo.jpg`.

**Adding a sponsor logo:** drop the file into `public/images/sponsors/`, run `npm run media`, and
the pipeline flood-fills its background out, trims it, and converts it to PNG. Then point the
sponsor's `logo` at the `.png`. Watch the output — it warns if a logo is too dark to read on the
tile. A transparent PNG or an SVG is always the better thing to ask a sponsor for.

**Filenames are lowercased automatically.** Do not fight it: the site is served from Linux, where
`Logo.PNG` and `logo.png` are different files, and mixed casing was already breaking twelve
sponsor logos.

## Deploying

```bash
npx vercel deploy --prod
```

Takes about two minutes. If it fails, run `npm run build` locally — the error will be clearer.

Commit your changes too, so the repo matches what is live:

```bash
git add -A
git commit -m "Update sponsor list"
```

## This is temporary

The plan is for content to move into **Sanity**, giving a browser-based editor at `/studio` so
students can add an outreach event or update their own profile without touching JSON, git, or a
terminal. `lib/content.ts` was built as the single boundary for exactly that reason: nothing else
in the codebase reads these files, so the swap does not touch any page or component.

Until then, edits go through this file and through you.
