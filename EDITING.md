# Editing the site

All content lives in **Sanity**. You edit it in a browser, publish, and the site updates —
no code, no terminal, no deploy.

## The editor

**https://nova-pyra-web.vercel.app/studio**

Sign in with the Sanity account you were invited with. It works on a phone, though a laptop is
easier for anything with photos.

Nothing is live until you publish — drafts are private, so it is safe to start something and come
back to it.

Published changes appear **within 15 minutes**. To make them appear in seconds instead, wire up the
webhook once — see below.

### Making publishes instant (one-time, 2 minutes)

At [sanity.io/manage](https://sanity.io/manage) → the project → **API** → **Webhooks** → Create:

| Field | Value |
|---|---|
| Name | `Revalidate website` |
| URL | `https://nova-pyra-web.vercel.app/api/revalidate` |
| Dataset | `production` |
| Trigger on | Create, Update, Delete |
| HTTP method | POST |
| API version | `v2021-03-25` |
| Secret | the value of `SANITY_REVALIDATE_SECRET` in Vercel → Settings → Environment Variables |

The endpoint rejects anything without a valid signature, so the secret has to match exactly. Until
this exists the site still updates, just on the 15-minute window.

**Why the window is 15 minutes and not 1:** every time it expires, the next visitor's page load
re-runs that page's Sanity queries. A full render of the site costs 42 queries, and the free plan
allows 250,000 a month — so a 1-minute window could be exhausted by search-engine crawlers alone.
The webhook removes the trade-off entirely: instant publishes *and* near-zero query usage.

## What lives where

The Studio's left-hand menu is grouped by what you are trying to do, not by how the data is stored.

| To change… | Go to |
|---|---|
| Add an outreach event, with photos | **Outreach → Events** |
| People reached, volunteer hours, schools | **Outreach → Totals** |
| Write a season update | **Outreach → Season updates** |
| Add or edit a sponsor, upload a logo | **Sponsors → Sponsor list** |
| Sponsorship pitch, tier benefits, contact email | **Sponsors → Pitch & tier benefits** |
| Add a competition result | **Competition → Results** |
| Season goals and progress bars | **Competition → This season** |
| Awards | **Competition → Awards** |
| Robot specs, strategy, match clips | **The robot → Overview & strategy** |
| A subsystem's description or marker position | **The robot → Subsystems** |
| Design evolution entries | **The robot → Design evolution** |
| Design cycle, engineering portfolio PDF | **Engineering → Process & portfolio** |
| Problem → solution cards | **Engineering → Problem → solution** |
| Test data charts | **Engineering → Test data** |
| Students and mentors | **The team → People** |
| Founding story, values, subteams, partners | **The team → Story, values & partners** |
| Team timeline | **The team → Timeline** |
| Team name, tagline, logo, social links | **Site settings** |
| **Any section heading or intro line** | **Section headings** |

Every field has a description under it explaining what it is for. Read those first.

## Things worth knowing

**Section headings are editable.** Every "eyebrow / heading / intro" block above a
section — "Problem → Solution · What went wrong, and what we did · The failures are the
interesting part…" and the ~38 others — lives under **Section headings**. Clearing a field
restores the original wording rather than leaving a blank, so it is safe to experiment.

Some headings contain a placeholder in braces, like `{n}` or `{robot}`. Those are numbers
the site works out as it renders — the student count, the current robot's name. Keep them
where you want the value; delete them if you do not. An unfilled placeholder is removed,
never printed as literal text.

**The hero's record and Worlds rank are not typed anywhere.** They are added up from
**Competition → Results**. Add an event with its win-loss-tie record and the front page updates
itself.

**Student names are first name + last initial** — "Hailey V." The editor will refuse a full
surname. This is deliberate: it is a public site and most of the team are minors.

**Photos are resized automatically.** Upload straight from a phone; the site serves a correctly
sized, modern-format version. You do not need to shrink anything first.

**Sponsor logos sit on a dark tile with no white box behind them.** So:

- Best: ask the sponsor for a **transparent PNG** or an **SVG**.
- If all you have is a logo on a white background, clean it first:
  ```bash
  node scripts/clean-logo.mjs path/to/logo.jpg
  ```
  That writes `logo-clean.png` beside it — upload that. It removes the background without
  punching holes in white lettering inside the logo, trims the empty margin, and warns if the
  result is too dark to read on the tile.

**The 3D models are not in the CMS.** They are large files that change once a season and live in
`public/` — replacing one is a code change.

## Adding someone to the editor

sanity.io/manage → your project → **Members** → Invite.

Be aware of a real limitation: on Sanity's **free plan there are only two roles, Administrator and
Viewer**. Viewer is read-only, so anyone who needs to edit *anything* has to be an Administrator,
and can therefore change *everything*. The grouped menu is a convenience, not a lock.

In practice: invite people you trust, and rely on the safety nets — every document keeps its full
history, so any change can be reviewed and reverted. If you later need "students can only edit
their own profile", that requires Sanity's paid Growth plan.

## Backing up

Worth doing once a season, and before anything risky:

```bash
npx sanity dataset export production backup.tar.gz
```

## For developers

Code changes still go through git:

```bash
npm run dev            # http://localhost:3000
npm run build          # must pass before pushing
npm run check:assets   # against a running server; catches broken images
git push               # deploys automatically, ~1 minute
```

`--webpack` is required on both dev and build — see the README for why.

Content is read only through `lib/content.ts`, which is the single boundary between the site and
Sanity. Nothing else queries the CMS directly; keep it that way.
