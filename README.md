# deathwing

Personal "lab" site — image gallery + small interactive experiments, built
with Next.js (App Router) + Tailwind CSS v4.

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
  page.js                    Home page
  gallery/page.js             Gallery — reads images from public/images/gallery
  experiments/page.js         List of experiments (edit the `experiments` array to add more)
  experiments/sketch-pad/     Example experiment: canvas drawing toy
components/Nav.js             Top nav bar
lib/images.js                 Reads public/images/gallery at request time for the gallery page
public/images/gallery/        Drop image files here — they show up in the gallery automatically
```

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

- **Discord link** — simplest: a link/button. Optional stretch: "sign in
  with Discord" via Auth.js.
- **Ecommerce** — needs a database (products/orders) + Stripe Checkout +
  webhook for order fulfillment. Nothing exists yet.
- **Web scraper → gallery** (e.g. anime/DBZ images) — should run as a
  separate scheduled job (Vercel Cron if staying on Vercel, or a cron/systemd
  timer if self-hosted), writing to object storage + a database, not into
  `public/images/gallery` directly. This is the change that also fixes the
  "images require a redeploy to appear" limitation above.
- Once a scraper or ecommerce exists, the app needs a real database
  (e.g. Postgres via Neon/Supabase, or self-hosted Postgres) — there is
  currently no database anywhere in this project.
