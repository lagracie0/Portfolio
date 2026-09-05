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

## Deploying to Railway

The site is served as static files by [Caddy](https://caddyserver.com/)
inside a two-stage Docker build (`Dockerfile`): the first stage runs the
three generator scripts above (with `--allow-drafts`) against a copy of
the repo, the second stage is just Caddy serving the result on the port
Railway assigns it (`Caddyfile`, using `{$PORT}`). `railway.json` points
Railway at the Dockerfile explicitly.

**Nothing has been connected to Railway or deployed from this repo** —
this is prepared configuration, not a live deploy. To actually ship it:

1. Push this repo to GitHub (or your Railway-connected git host) with
   all of the above committed — `Dockerfile`, `Caddyfile`, `railway.json`,
   `.dockerignore`, `404.html`.
2. In the Railway dashboard: **New Project → Deploy from GitHub repo**,
   and pick this repository.
3. Railway will detect `railway.json` and build from the `Dockerfile`
   automatically — no build/start command needs setting manually, and
   no environment variables need adding (`PORT` is injected by Railway
   itself; the site has no other runtime configuration, no database, no
   secrets).
4. Once the first deploy finishes, Railway gives you a
   `*.up.railway.app` URL — open it and click through a few pages
   (home, `/work`, a case page, a deliberately-mistyped URL to check the
   404 page) before trusting it.
5. Optional: **Settings → Networking → Custom Domain** to attach a real
   domain, then follow Railway's DNS instructions (a `CNAME` record,
   typically).
6. Every subsequent push to the connected branch redeploys
   automatically, re-running the generator scripts against whatever
   `data/cases.js` says at that commit.

**Before sharing the domain with anyone:** the CV PDF referenced by
every "Download CV" link (`assets/cv/ayomide-amusan-cv.pdf`) does not
exist yet — every one of those links currently 404s. This is a real,
live-site defect the moment this is public, not a placeholder that's
safe to leave. Add the real file at that exact path before the link
goes out to anyone.
