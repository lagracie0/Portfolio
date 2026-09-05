# Ayomide Grace Amusan — Portfolio

A static portfolio site. Plain HTML, CSS, and vanilla JS ES modules —
no framework, no bundler, no build step for the site itself. `data/cases.js`
is the single source of truth for every case study; a handful of small
Node scripts in `scripts/` generate case pages and a few other
data-derived sections from it.

## Local development

No install step. Open `index.html` directly in a browser, or serve the
repo root with any static file server (e.g. `python3 -m http.server`)
if you want clean URLs (`/work/some-slug/`) to resolve the way they do
in production.

## Regenerating generated content

Whenever `data/cases.js` changes — a new case, a renamed title, a
corrected date — re-run these from the repo root:

```
node scripts/build-home.mjs        # home page's three featured cases
node scripts/build-noscript.mjs    # /work's no-JS fallback card list
node scripts/build-case-pages.mjs  # every work/{slug}/index.html
```

`build-case-pages.mjs` also prints a capability/domain coverage report
and, by default, **exits non-zero if any P0 case still contains
`[NEEDS INPUT: ...]`** — a real, deliberate guard against shipping
placeholder content as if it were finished. Pages still get written
either way (with a loud draft banner and NEEDS-INPUT flagging on
anything incomplete); the guard only controls the exit code, so a local
run stops you before you commit something unfinished as if it were
done.

For a deploy pipeline, which has no way to act on that guard, pass
`--allow-drafts`: same pages, same draft banners, but the script exits
`0` regardless. This is what the Docker build below uses — never run it
this way by hand unless you specifically mean to ship known-incomplete
content.

`scripts/build-og-images.mjs` is separate and does **not** run as part
of a normal build or deploy — it needs Playwright, which is deliberately
not a dependency of this project. Run it by hand, with an external
Playwright install, only when case content changes enough to need new
OG images (see that script's own header comment for the exact steps).

## Deploying to Cloudflare Pages

Current deploy target — Railway's free tier is capped and both project
slots are already in use elsewhere, so this site deploys to
[Cloudflare Pages](https://pages.cloudflare.com/) instead. **Nothing has
been connected or deployed from this repo** — this is prepared
configuration only; connect it from the Cloudflare dashboard yourself.

Cloudflare Pages builds a git-connected project using **dashboard
settings** (build command, output directory), not a repo config file —
so those two values need to be typed into the dashboard once, by hand,
when the project is created:

1. Push this repo to GitHub (or wherever Cloudflare Pages connects to)
   with everything below committed — `_headers`, `.nvmrc`, `404.html`.
2. In the Cloudflare dashboard: **Workers & Pages → Create → Pages →
   Connect to Git**, and pick this repository.
3. In the project's build settings, set:
   - **Build command:**
     `node scripts/build-home.mjs && node scripts/build-noscript.mjs && node scripts/build-case-pages.mjs --allow-drafts`
   - **Build output directory:** `/` — the three scripts above rewrite
     `index.html`, `work/index.html`, and every `work/{slug}/index.html`
     *in place*; there's no separate `dist/`-style output folder, the
     built site is the repo root itself.
   - **Root directory:** leave as the repo root (default).
   - No environment variables are needed — no database, no secrets, and
     the Node version is pinned by `.nvmrc` (Cloudflare Pages reads it
     automatically; if that's ever not picked up, set the `NODE_VERSION`
     environment variable to `20` as a fallback).
4. `_headers` at the repo root sets cache rules automatically on
   deploy — `public, max-age=31536000, immutable` for `.woff2` fonts and
   the OG images under `assets/og/`, `no-cache` for everything else
   (every page, `.css`, `.js`), so a deploy can never leave a visitor's
   browser serving a stale stylesheet or an old page. Nothing to
   configure here beyond the file existing.
5. `404.html` at the repo root is picked up automatically by Cloudflare
   Pages' own convention for a site-wide custom 404 (served with a real
   404 status, not 200) — no configuration needed. It uses **absolute**
   asset paths (`/css/...`, not `../css/...`) deliberately: Cloudflare
   serves this page in place at whatever URL was actually requested, so
   a relative path would resolve against that URL's depth, not the
   file's real location.
6. Clean URLs (`/work/some-slug/` → its `index.html`) work the same way
   they do locally and under the (currently unused) Caddy config —
   Cloudflare Pages resolves a directory-style path to its `index.html`
   automatically for a static deployment, no rewrite rules needed.
7. Once the first deploy finishes, Cloudflare gives you a
   `*.pages.dev` URL — open it and click through a few pages (home,
   `/work`, a case page, a deliberately-mistyped URL to check the 404
   page) before trusting it. Also worth a direct check with `curl -I` on
   a font URL and a page URL to confirm each actually gets the
   `Cache-Control` value intended for it — the `_headers` file's rule
   ordering is written to be correct under either of Cloudflare's
   documented matching behaviours, but this project has no way to run
   Cloudflare Pages itself to verify that live.
8. Optional: **Custom domains** tab to attach a real domain, then follow
   Cloudflare's DNS instructions.
9. Every subsequent push to the connected branch redeploys
   automatically, re-running the build command against whatever
   `data/cases.js` says at that commit.

**Before sharing the domain with anyone:** the CV PDF referenced by
every "Download CV" link (`assets/cv/ayomide-amusan-cv.pdf`) does not
exist yet — every one of those links currently 404s. This is a real,
live-site defect the moment this is public, not a placeholder that's
safe to leave. Add the real file at that exact path before the link
goes out to anyone.

## Alternative deploy target: Railway (prepared, not currently used)

Railway was the original deploy target; its free tier is capped and
both available project slots are in use elsewhere, so Cloudflare Pages
(above) is what's actually live. The Railway configuration is kept in
the repo rather than removed — it costs nothing sitting unused, and
Railway may be worth revisiting later.

The site is served as static files by [Caddy](https://caddyserver.com/)
inside a two-stage Docker build (`Dockerfile`): the first stage runs the
three generator scripts above (with `--allow-drafts`) against a copy of
the repo, the second stage is just Caddy serving the result on the port
Railway assigns it (`Caddyfile`, using `{$PORT}`). `railway.json` points
Railway at the Dockerfile explicitly. To use it instead of Cloudflare:

1. In the Railway dashboard: **New Project → Deploy from GitHub repo**,
   and pick this repository.
2. Railway will detect `railway.json` and build from the `Dockerfile`
   automatically — no build/start command needs setting manually, and
   no environment variables need adding (`PORT` is injected by Railway
   itself).
3. Once the first deploy finishes, open the `*.up.railway.app` URL and
   click through the same pages listed in the Cloudflare steps above
   before trusting it.
4. Optional: **Settings → Networking → Custom Domain** for a real
   domain, then follow Railway's DNS instructions.

Neither this environment nor the one used to prepare the Cloudflare
config above has Docker or Caddy available, so this path is unverified
beyond the generator scripts themselves running correctly — the same
honest caveat as when it was first prepared.
