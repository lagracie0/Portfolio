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

## Deploying to GitHub Pages

Current deploy target — Railway's free tier was capped, then Cloudflare
Pages was tried next and also became unavailable, so this site deploys
to GitHub Pages, as a **user site** at `lagracie0.github.io`. That
requires the repo itself to be named exactly `lagracie0.github.io`
(a GitHub Pages user-site convention, not a setting) — done separately
from anything in this repo. **Nothing has been enabled or deployed from
here** — `.github/workflows/deploy.yml` is prepared and will run the
moment Pages is turned on for this repo, but that switch is flipped from
the repo's own Settings → Pages, by hand, not from this codebase.

A user site is served at the true domain root
(`https://lagracie0.github.io/`, not
`https://lagracie0.github.io/some-repo-name/`), which is exactly what
makes `404.html`'s absolute paths (`/css/...`, not `../css/...`) resolve
correctly — see the `404.html` section below.

1. In the repo's own settings: **Settings → Pages → Build and
   deployment → Source: GitHub Actions**. This is the one manual step —
   everything else runs from the committed workflow.
2. Push to `main` (or run the workflow manually from the **Actions**
   tab — it also listens for `workflow_dispatch`). The workflow:
   - checks out the repo and installs Node, pinned to the version in
     `.nvmrc` (currently `20`);
   - runs `build-home.mjs`, `build-noscript.mjs`, then
     `build-case-pages.mjs --allow-drafts` — the same three scripts and
     flag every other deploy target here uses;
   - stages a clean copy of the site into a temporary `_site/` directory,
     deliberately leaving out everything that isn't site content — see
     "What doesn't get published" below;
   - publishes that via `actions/upload-pages-artifact` and
     `actions/deploy-pages`, using the `pages: write` /
     `id-token: write` permissions those two actions need (already in
     the workflow file — nothing to add in repo settings for this part).
3. No secrets are needed for any of this — `deploy-pages` authenticates
   via the OIDC token the `id-token: write` permission provides, not a
   manually-created one. If this project ever needs a real secret later,
   add it as a **repository** secret (Settings → Secrets and variables →
   Actions → Repository secrets), not an environment secret — this
   deploy has no per-environment gating that an environment secret would
   add real protection against.
4. Once the first run finishes (check the **Actions** tab for its
   status), the site is live at `https://lagracie0.github.io/` — click
   through a few pages (home, `/work`, a case page, a deliberately-wrong
   URL to check `404.html`) before trusting it.
5. Every subsequent push to `main` redeploys automatically.

**What doesn't get published, and why `.nojekyll` matters here
specifically:** GitHub Pages runs Jekyll on a repo by default, which
silently *drops* any file or directory whose name starts with `_` or
`.` from what gets published — the `.nojekyll` file at the repo root
turns that off. Without it, Jekyll would have quietly excluded
`_headers` on its own; *with* it, nothing is excluded automatically
anymore, which is why the workflow's staging step explicitly excludes,
by name, everything that was never meant to be public: `CLAUDE.md`, the
WRD doc, every other `*.md` (this README included), `tasks/` (the full
internal build log), `scripts/` (build-time-only, never loaded by a
browser), and the other platforms' deploy config (`Dockerfile`,
`Caddyfile`, `railway.json`, `_headers`, `.dockerignore`, `.nvmrc`,
`.gitignore`). Verified this exclusion list locally against the actual
repo contents before committing it — nothing on that list leaks into
the staged output, and nothing real gets accidentally caught by it.

**Say this plainly, not just imply it: caching gets worse on GitHub
Pages.** `_headers` (the Cloudflare cache-rules file) is excluded from
this deploy's published output for the reason above, but even if it
weren't, **GitHub Pages does not read `_headers` at all** — there is no
GitHub Pages equivalent for custom cache headers; it's a platform
limitation, not a gap this repo's configuration can close. Fonts and OG
images will **not** get the `public, max-age=31536000, immutable`
treatment they'd get under Cloudflare Pages or the Railway/Caddy config
— GitHub Pages applies its own uniform caching policy to everything it
serves, shorter than a year and not distinguishing font files or OG
images from anything else. In practice: a first-time visitor sees no
difference at all (there was never a cached copy to lose either way),
but a returning visitor's browser will re-validate or re-fetch fonts
and OG images more often than it would under either other prepared
target. Nothing in this repo can change that on GitHub Pages — it would
take moving to a platform that reads a headers file (Cloudflare Pages
or the Railway/Caddy config, both still sitting ready in this repo) to
get that back.

**Before sharing the domain with anyone:** the CV PDF referenced by
every "Download CV" link (`assets/cv/ayomide-amusan-cv.pdf`) does not
exist yet — every one of those links currently 404s. This is a real,
live-site defect the moment this is public, not a placeholder that's
safe to leave. Add the real file at that exact path before the link
goes out to anyone.

## Alternative deploy targets (prepared, not currently used)

Both kept in the repo rather than removed — they cost nothing sitting
unused, and either may be worth revisiting later.

**Cloudflare Pages.** `_headers` at the repo root sets the cache rules
described above (immutable for fonts/OG images, `no-cache` for
everything else) the moment this or any Cloudflare-Pages-read repo is
connected there instead — no changes needed to the file itself. Connect
via **Workers & Pages → Create → Pages → Connect to Git**, then set
**Build command** to
`node scripts/build-home.mjs && node scripts/build-noscript.mjs && node scripts/build-case-pages.mjs --allow-drafts`
and **Build output directory** to `/` (the three scripts rewrite files
in place; there's no separate build folder for this site). No
environment variables needed; `.nvmrc` is read automatically.

**Railway.** The site is served as static files by
[Caddy](https://caddyserver.com/) inside a two-stage Docker build
(`Dockerfile`): the first stage runs the three generator scripts above
(with `--allow-drafts`), the second is Caddy serving the result on the
port Railway assigns (`Caddyfile`, using `{$PORT}`). `railway.json`
points Railway at the Dockerfile explicitly. Connect via **New Project →
Deploy from GitHub repo** — Railway auto-detects both files; no manual
build/start command or environment variables needed.

Neither of these has been tested end-to-end from any environment this
project has been prepared in — no Docker, Caddy, or Cloudflare Pages
available to verify against. What's documented above is each platform's
own published behaviour, not a live-verified result.
