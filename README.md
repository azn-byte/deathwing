# deathwing

Personal "lab" site — image gallery + small interactive experiments, built
with Next.js (App Router) + Tailwind CSS v4.

## Design direction

Fixed dark theme (always black background, not tied to system light/dark
preference — see `app/globals.css`), bold asymmetrical typography, and
real photography/art treated as hero content rather than decoration.
Modeled after [bymonolog.com](https://bymonolog.com) after comparing it
against three other reference sites (Yann Novak's portfolio, units.gr,
wembi.ai) for style direction — see conversation history for the other
three, kept only as a decision record since their mockups were removed
from the repo once this direction was picked.

## Live site

https://deathwing-three.vercel.app

Auto-deploys on every push to `main` (GitHub → Vercel integration).

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Project structure

```
app/
  page.js                    Home page — see "Homepage" below, not a nav summary
  gallery/page.js             Gallery — reads images from public/images/gallery
  prints/page.js               Prints storefront — lists photos from lib/prints.js
  experiments/page.js         List of experiments (edit the `experiments` array to add more)
  experiments/sketch-pad/     Example experiment: canvas drawing toy
  enter/page.js                Character-creation "login" (see below)
components/Nav.js             Top nav bar — shows current visitor handle if one exists
components/PrintCard.js       Prints storefront card — license toggle + price display
components/HomeSketchTeaser.js  Live drawable canvas embedded on the homepage
lib/images.js                 Reads public/images/gallery at request time for the gallery page
lib/prints.js                 Manually curated list of photos for sale (image + price + license terms)
lib/session.js                Client-side-only visitor session (localStorage) — see below
public/images/gallery/        Drop image files here — they show up in the gallery automatically
public/images/prints/         Photos listed on /prints (must also be added to lib/prints.js)
```

### Homepage (`app/page.js`)

Deliberately not a "here are links to the other 3 pages" summary (decided
2026-07-04, after that read as rushing visitors elsewhere). It's a paced
sequence of distinct moments instead: a headline that gets room to breathe
alone, one real gallery image shown as a "currently pinned" spotlight (not
a grid), an honest Prints teaser that says the shop is empty rather than
faking inventory, and a live drawable canvas for Experiments so there's
something to actually *do* on the homepage, not just read about. Each
section links out in its own voice rather than a repeated CTA block.

### Visitor profile / "login" (`/enter`)

Inspired by [cybercafe.tw](https://cybercafe.tw) (a net-art piece styled as
a 2000s internet cafe login) — a game-like "create your character" flow
instead of a boring form: pick a handle, pick a path (Collector / Creator /
Wanderer). **Status: local-only, no real backend.** It writes to
`localStorage` via `lib/session.js` so it remembers you on one device —
there is no account, no server, and nothing is shared between visitors yet.
The nav shows your handle in place of "Enter" once you've done this once.

Also includes an optional "Connections" step (`lib/connections.js`) — CRM
style, plain self-reported text fields (League of Legends summoner name,
Discord, Steam), not OAuth-verified. Blank fields are simply omitted when
viewing a profile rather than shown empty. Chosen deliberately over real
OAuth for Steam/Discord/Riot because Riot's "Sign in with Riot" requires an
approved production API key from Riot Games (manual review, not self-serve)
— manual text fields work today for all three without waiting on that.

This is step one of a three-part idea (discussed 2026-07-04, not yet built
beyond this UI):
1. This character-creation UI (done)
2. Real auth — recommended: **Supabase**, so Auth + Postgres + Realtime
   come from one service instead of three. Discord OAuth through Supabase
   Auth would also satisfy the "link to Discord" roadmap item in one move.
3. A live "N people here / browsing gallery / reading an experiment" HUD,
   WoW-style — powered by Supabase Realtime Presence once real accounts
   exist. Deliberately not faked with placeholder numbers in the meantime.

### Adding photos

Drop `.jpg`/`.jpeg`/`.png`/`.gif`/`.webp`/`.avif` files into
`public/images/gallery/`. No code changes needed — `lib/images.js` lists
the folder at render time and the gallery page picks them up.

Current limitation: since these are static files bundled with the app,
new images require a redeploy (commit + push) to appear in production.
This is the first thing to change if a scraper starts feeding the gallery
(see Roadmap below) — at that point images need to move to object storage
(Vercel Blob / S3 / Cloudinary) instead of the `public/` folder.

### Adding a new experiment

1. Create `app/experiments/<slug>/page.js`
2. Add `"use client"` at the top if it needs interactivity (state, refs, event handlers)
3. Add an entry to the `experiments` array in `app/experiments/page.js` so it shows up in the list

`sketch-pad` is a working example of this pattern.

### Prints storefront (`/prints`)

Sells digital licenses to personal photography — a personal-use license or
a commercial-use license per photo, no physical print fulfillment. To list
a photo:

1. Add the image file to `public/images/prints/`
2. Add a matching entry (title, description, `personalPrice`,
   `commercialPrice`) to the `prints` array in `lib/prints.js`

**Status: browsing UI only, checkout is not wired up yet.** The "Buy"
button is intentionally disabled — it's a placeholder until a Stripe
account exists and a checkout flow (and a way to actually deliver the
purchased file) is built. See Roadmap below.

## Deployment

- **GitHub repo:** https://github.com/azn-byte/deathwing (remote `origin`, branch `main`)
- **Vercel project:** `deathwing` under the `reachrayli-5154s-projects` account/team, linked to the GitHub repo above
- **Vercel CLI:** authenticated via `npx vercel` (device-flow login — opens a browser to confirm)

### Re-linking on a new machine

The `.vercel/` folder (project link) and `.env.local` (Vercel OIDC token) are
git-ignored and machine-specific — they will NOT come with `git clone`. To
reconnect a fresh checkout to the same Vercel project:

```bash
npx vercel link --yes --project deathwing
npx vercel --prod   # manual deploy if needed; pushing to GitHub also auto-deploys
```

### Self-hosting instead of Vercel

The app has no Vercel-specific dependencies, so it runs anywhere Node runs:

```bash
git clone https://github.com/azn-byte/deathwing.git
cd deathwing
npm install
npm run build
npm start        # serves on port 3000
```

Put this behind a reverse proxy (nginx/Caddy) for a real domain + HTTPS.

### Git identity

Commits in this repo use local (repo-scoped, not global) git config:
`user.name = azn-byte`, `user.email = ray@unlimitedirl.com`. A fresh clone
on a new machine needs this set again if you intend to commit from there —
it's not required just to run or deploy the app.

## Claude Code plugin (optional, machine-local)

The `vercel-plugin` for Claude Code (adds `/deploy`, `/bootstrap`, `/env`,
`/status` commands and Vercel skills) is installed at **user scope** on
this machine — it lives in `~/.claude/`, not in this repo, so it does NOT
transfer with `git clone`. To get the same commands on a new machine:

```bash
npx plugins add vercel/vercel-plugin --yes
```
(then restart Claude Code)

This is a convenience only — everything it does can also be done with the
plain `vercel` CLI commands shown above.

## Roadmap / not-yet-built

Planned but not implemented — noting here so this doesn't get re-derived
from scratch later:

- **Discord link** (superseded 2026-07-04): originally scoped as just a
  link/button. Now folded into the auth plan below instead — Discord OAuth
  via Supabase Auth covers "sign in with Discord" and the link in one step.
- **Real auth + live presence** (started 2026-07-04): see "Visitor
  profile / login" section above for what's built (`/enter`, local-only)
  and the full 3-step plan (character UI → Supabase auth → WoW-style
  live presence HUD). Steps 2 and 3 are not started.
- **Two separate galleries, not one** (decided 2026-07-04): the current
  `/gallery` is a curated/fan-art gallery (Marvel, anime, etc.) — read-only,
  eventually scraper-fed. Personal photography is a different thing
  entirely: each image needs price and licensing terms, plus a checkout
  flow — that's a commerce feature, not a gallery feature. Kept as a
  separate route, `/prints`, so it can evolve independently.
- **`/prints` storefront (in progress, started 2026-07-04):** browsing UI
  and per-photo license selection (personal vs. commercial use) are built —
  see the "Prints storefront" section above. Chose digital licenses over
  physical print fulfillment to start (no printing/shipping logistics).
  Still needed:
  - A Stripe account (user hasn't created one yet) + Checkout integration
  - A database for orders (who bought what license for which photo)
  - A way to actually deliver the purchased file after payment — likely a
    signed/expiring download link generated on successful payment, not a
    publicly guessable URL
  - Decide later whether to add physical prints via a print-on-demand
    service (e.g. Printful/Prodigi) — explicitly deferred, not decided against
- **"Experiments" → "Connections" rename/reframe** (idea logged 2026-07-04):
  two distinct sub-features under one new name:
  - **Account linking (started 2026-07-04):** shipped as plain CRM-style
    text fields on `/enter` — see "Visitor profile / login" above. This is
    the pragmatic v1, not the final form. Still true and still relevant
    for later: real OAuth (Steam self-serve, Discord via Supabase Auth)
    would let these be verified instead of self-reported, and **Riot
    specifically** requires an approved production API key from Riot
    Games (manual review, not self-serve) if that upgrade ever happens.
    Not blocking anything today since the text-field version works now.
  - **Photobooth / selfie sharing** (not started) — user is undecided whether the
    sketch-pad experiment survives the rename. Real open question before
    building: is a submitted photo private-to-the-visitor, or visible to
    others (fitting the WoW-style presence idea)? The latter is
    user-generated content and needs a moderation plan, not just a
    camera API call (`getUserMedia`) — don't build the "visible to
    others" version without deciding this first.
- **Web scraper → curated gallery** (e.g. Marvel/anime images) — should run
  as a separate scheduled job (Vercel Cron if staying on Vercel, or a
  cron/systemd timer if self-hosted), writing to object storage + a
  database, not into `public/images/gallery` directly. This is the change
  that also fixes the "images require a redeploy to appear" limitation
  above.
- Once a scraper, ecommerce, or the auth/presence plan above exists, the
  app needs a real database. Leaning **Supabase** specifically since it
  would also cover auth and realtime presence in the same service — there
  is currently no database anywhere in this project.
