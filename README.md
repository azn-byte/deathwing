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
from the repo once this direction was picked. This is the baseline for
every page — the homepage additionally layers its own "system" identity
on top, see below.

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
  connect/page.js              Profile card + Discord card + list of experiments
  connect/sketch-pad/          Example experiment: canvas drawing toy
  enter/page.js                Real login (Discord via Supabase Auth, see below)
  auth/callback/route.js       OAuth callback — exchanges code for session, triggers Discord auto-join
components/Nav.js             Top nav bar — adds top margin on "/" to clear the fixed ticker
components/VisitorBadge.js    Persistent bottom-right badge, shown site-wide once a profile exists
                                (sits higher on "/" to clear the fixed status bar)
components/HomeExperience.js  The homepage's "system" identity — see below
components/ProfileCard.js     Full profile display, used on /connect
components/DiscordCard.js     Discord sign-in/join card, used on /connect
components/PrintCard.js       Prints storefront card — license toggle + price display
components/HomeSketchTeaser.js  Live drawable canvas embedded on the homepage
lib/supabase/client.js        Browser Supabase client
lib/supabase/server.js        Server Supabase client (Server Components, route handlers)
lib/useProfile.js             Client hook: { loading, user, profile } from real Supabase auth
lib/images.js                 Reads public/images/gallery at request time for the gallery page
lib/prints.js                 Manually curated list of photos for sale (image + price + license terms)
lib/connections.js            CRM-style profile field definitions (see below)
middleware.js                 Refreshes the Supabase auth session cookie on every request
supabase-schema.sql            profiles table + RLS policies — run once in Supabase's SQL Editor
public/images/gallery/        Drop image files here — they show up in the gallery automatically
public/images/prints/         Photos listed on /prints (must also be added to lib/prints.js)
```

### Homepage (`app/page.js` + `components/HomeExperience.js`)

Deliberately not a "here are links to the other 3 pages" summary (decided
2026-07-04, after that read as rushing visitors elsewhere). It's a paced
sequence of distinct moments instead: a headline that gets room to breathe
alone, a few real gallery images shown as a "currently pinned" spotlight
at their natural uncropped aspect ratio (not a forced-crop grid), an
honest Prints teaser that says the shop is empty rather than faking
inventory, and a live drawable canvas for Connect so there's something to
actually *do* on the homepage, not just read about. Each section links
out in its own voice rather than a repeated CTA block.

**The homepage additionally has its own "system" visual identity**, on top
of the site's base dark theme, that no other page has (decided
2026-07-04 — inspired by Ghost in the Shell / Matrix framing, explicitly
kept monochrome after magenta+cyan read as "too Cyberpunk 2077 / Miami
Vice" and green read as "too Matrix cliché"):
- A live scroll-triggered ticker fixed to the very top of the viewport
  and a small stats readout fixed to the bottom — both stay put while
  everything else scrolls underneath, so more sections can be added
  later without disturbing them.
- The stats are real, not decorative: gallery piece count comes from
  `getGalleryImages().length`, not a hardcoded number.
- The hero headline is dynamic: reads the real signed-in profile
  (`lib/useProfile.js`) to show "Welcome back, {handle}" if one exists,
  or an invite ("Images, curated and made.") if not.
- A grayscale-only "glitch" effect on the headline — two offset light/
  dark-grey duplicate layers that flicker briefly on a timer, plus a
  custom cursor-follow ring — texture and motion carry the "system" feel
  instead of any color, on purpose.
- `Nav` and `VisitorBadge` both special-case `pathname === "/"` to make
  room for the fixed ticker/status bar. If either component's spacing
  looks wrong on the homepage, check those conditionals first.

This is intentionally homepage-only — Gallery and Prints stay on the
plain base theme so the "system" chrome never competes with viewing
images or buying a print. Don't apply the ticker/status-bar/glitch
treatment to other pages without deciding that deliberately.

### Visitor profile / login (`/enter`) — real auth, built 2026-07-05

Originally a local-only, game-like "create your character" flow (inspired
by [cybercafe.tw](https://cybercafe.tw)) that just wrote to `localStorage`.
**Upgraded to real accounts** after that got annoying to re-enter across
browsers/devices. Now: **Sign in with Discord** (via Supabase Auth), and
your profile (handle, path, connections) lives in a real Postgres table
(`profiles`, see `supabase-schema.sql`), not a per-browser sticky note.

- `lib/supabase/client.js` / `server.js` — browser and server Supabase
  clients (`@supabase/ssr`)
- `middleware.js` — refreshes the auth session cookie on every request
- `app/auth/callback/route.js` — exchanges the OAuth code for a session
  after Discord redirects back
- `lib/useProfile.js` — client hook returning `{ loading, user, profile }`,
  used by `VisitorBadge`, `ProfileCard`, `HomeExperience`, and `/enter`
  itself. This replaced the old `lib/session.js` (deleted) everywhere.
- `profiles` table has row-level security: a user can only read/write
  their own row (`auth.uid() = id`). Nothing is visible to other visitors
  yet — that's a deliberate later step, not an oversight.
- The "ID" shown in the UI is the real Supabase user UUID (truncated to 8
  chars for display), not a fake generated one.

Also includes an optional "Connections" step (`lib/connections.js`) — CRM
style, plain self-reported text fields (League of Legends summoner name,
Discord, Steam), not OAuth-verified beyond the Discord sign-in itself.
Blank fields are simply omitted when viewing a profile rather than shown
empty. Riot's "Sign in with Riot" (RSO) still requires an approved
production API key from Riot Games (manual review, not self-serve) — the
League field stays a manual text entry for that reason.

**Setting this up on a fresh environment/machine** requires, in order:
1. `npx vercel integration add supabase` (provisions Postgres + auth,
   auto-injects env vars into the Vercel project)
2. Run `supabase-schema.sql` once in the Supabase Dashboard's SQL Editor
3. Register a Discord application (discord.com/developers/applications),
   enable the Discord provider in Supabase Auth with its Client ID/Secret,
   and add Supabase's callback URL to the Discord app's OAuth2 redirects
4. `vercel env pull --environment=preview` locally — **note**: env vars
   pulled down empty (just `""`) the first time here because the
   Supabase integration had marked them "sensitive," which blocks
   `vercel env pull` from ever reading them back. Fixed by re-adding them
   with `vercel env add <name> preview` and answering "no" to "Store as
   sensitive?" — for `NEXT_PUBLIC_*` vars this costs nothing since
   Next.js inlines them into the public JS bundle regardless.

### Discord auto-join (built 2026-07-05)

Signing in with Discord also adds the visitor to the site owner's Discord
server in the same step, via the `guilds.join` OAuth scope:
- `app/enter/page.js` and `components/DiscordCard.js` request
  `scopes: "guilds.join"` when calling `signInWithOAuth`
- `app/auth/callback/route.js` reads `session.provider_token` (the
  visitor's fresh Discord access token, only available right at the
  OAuth callback — Supabase doesn't persist it) and calls Discord's
  `PUT /guilds/{guild_id}/members/{user_id}` as the bot, passing that
  token. Best-effort: failures (already a member, bot missing
  permissions) don't block sign-in.
- Requires a bot added to the Discord application (Developer Portal →
  Bot tab) invited into the target server, plus `DISCORD_BOT_TOKEN` and
  `DISCORD_GUILD_ID` env vars (see `.env.example`).
- **Important limitation**: auto-join only fires at sign-in time. Someone
  already signed in before this scope was added won't be retroactively
  added — there's no stored token to do it with. That's why
  `components/DiscordCard.js` (on `/connect`) also always shows a plain
  invite link (`https://discord.gg/xSQQCFHBcB`) as a fallback for anyone
  the auto-join missed, or who'd rather not sign in at all.

### Connect (`/connect`, renamed from "Experiments" 2026-07-04)

Two things live here now, deliberately merged: the list of small built
experiments (`Sketch Pad` at `/connect/sketch-pad`, same pattern as before
for adding more), and a `ProfileCard` showing the current visitor's full
profile — handle, path, session ID, and any filled-in connections. The
idea: your `/enter` profile isn't siloed to one page, it's something that
"tracks" you as you move through the site.

That tracking is also visible site-wide now: `components/VisitorBadge.js`
renders a small persistent badge in the bottom-right corner of every page
once a profile exists, linking back to `/connect`. Nav no longer shows the
handle itself (that moved to the badge) — nav's "Enter" link is just the
entry point to create/edit a profile.

**Naming is still fluid** — "Connect" is what we're calling this for now
while the look and feel gets figured out; expect it might change again.

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

- **Discord link** (superseded 2026-07-04, done 2026-07-05): Discord OAuth
  via Supabase Auth now covers "sign in with Discord" — see "Visitor
  profile / login" above. Also grew into auto-joining the site's Discord
  server on sign-in ("Discord auto-join" section above) plus a
  `DiscordCard` invite fallback on `/connect` — more than originally
  scoped, but the natural extension once real auth existed.
- **Real auth + live presence**: 3-step plan (character UI → Supabase
  auth → WoW-style live presence HUD). **Steps 1 and 2 are done** — see
  "Visitor profile / login" above. Step 3 (a live "N people here /
  browsing gallery" HUD via Supabase Realtime Presence) is not started.
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
  - **Ownership assumption (decided 2026-07-04):** anything listed on
    `/prints` is assumed to be the user's own original work that they
    created and own. A watermark / "quality seal" badge overlay on print
    thumbnails was tried in an early theme mockup but explicitly removed —
    "not ready for that yet." Keep the idea for later, don't re-add
    without asking first.
- **"Experiments" → "Connect" rename/reframe** (idea logged 2026-07-04,
  route renamed same day — see "Connect" section above): two distinct
  sub-features under one name:
  - **Account linking + persistent profile (built 2026-07-04, upgraded to
    real Discord auth 2026-07-05):** CRM-style text fields on `/enter`,
    surfaced on `/connect` via `ProfileCard` and site-wide via
    `VisitorBadge`. Discord is now a real verified sign-in (not
    self-reported) via Supabase Auth. League of Legends and Steam remain
    self-reported text — Steam has self-serve OAuth if that's wanted
    later, and **Riot specifically** still requires an approved
    production API key from Riot Games (manual review, not self-serve).
  - **Photo challenges with approval queue** (refined 2026-07-04, not
    started, explicitly deferred by user — "let's figure that out later"):
    not open UGC. The real shape: user posts a topic for a recurring photo
    challenge, visitors submit a photo for that topic, submissions sit in
    a private moderation queue, and only the user (via their own
    approve/deny portal) can publish one — nothing goes live
    automatically. This is a meaningfully safer model than "anyone can
    post publicly," so the earlier "don't build without a moderation
    plan" caution is resolved in principle — there IS a plan now, it's
    just not built.
    - Needs: photo upload/storage (not just `getUserMedia` capture —
      submissions must persist until reviewed), a submissions table
      (topic, submitter, status: pending/approved/denied), and an
      admin-only view gated to the user specifically, not any visitor —
      i.e. this needs the real auth plan (Supabase) to distinguish "the
      owner" from "a visitor," not just a handle in `/enter`.
    - User already runs a Discord server with defined roles/permissions
      for this kind of thing — worth reusing that structure (e.g. a
      Discord role determines who can submit, or mirrors moderator
      permissions) once Discord OAuth is wired up, rather than building
      a separate permissions system from scratch.
    - Still undecided whether the sketch-pad experiment survives the
      Experiments → Connections rename.
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
