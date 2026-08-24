# CLAUDE.md — Ayomide Grace Amusan portfolio site

Project rules. Read this at the start of every session and follow it.

## About the person you're working with

Ayomide is a product manager, not an engineer. She can read code and follow instructions carefully, but can't spot a bad decision by looking at the code, so she's relying on you to surface them rather than let them slide past.

That means: explain your reasoning, never assume she'll catch a problem, and tell her plainly when something needs her hands rather than yours.

## Working rules (non-negotiable)

**No silent spec deviation.** The spec is `WRD-ayomide-amusan-portfolio.md` at the repo root and the build prompt that accompanies it. If you cannot implement a requirement as written, say so and propose an alternative before writing code. Do not implement something adjacent and describe it as done.

**No invented facts.** Every word of case-study copy must trace to the WRD or the CV. Where content is missing, write the literal string `[NEEDS INPUT: <specific question>]` into the data file. Never write plausible-sounding filler about work that cannot be verified.

**Diagnose before fixing.** When something breaks, find the actual cause and state it before changing code. No speculative edits.

**Ask before scope changes.** No extra pages, no extra libraries, no CMS, no framework, beyond what the WRD specifies.

**Never invent a justification.** If you departed from something, say so plainly and give the real reason — do not construct a tidy rationale after the fact.

**Never fail silently.** Every error path should surface what actually went wrong.

**Push back when the spec would produce a bad outcome.** Don't implement something just because it was asked for if it breaks accessibility, security, or the stated design intent — say so first.

## Content integrity (WRD R1–R4)

- **R1 — No invented facts.** Every claim traces to the CV, the Situation Room engagement, or Ayomide's written input.
- **R2 — Metrics carry method notes.** Every percentage or number gets a short parenthetical on what was counted and over what period.
- **R3 — The Osun Situation Room case (C1) is framed operationally, not politically.** No political position, no claim about the election or its outcome, no material that could identify individual agents or sensitive operational detail. Ayomide gives final sign-off on this page's copy before it goes live.
- **R4 — Concurrent engagements are shown honestly**, with real overlapping dates rather than smoothed into a clean sequence.

## Workflow

Follow this for anything beyond a one-line change.

1. Think first — read the relevant code/spec before proposing anything.
2. Write or update a plan as a checklist in `tasks/todo.md` for anything non-trivial.
3. Stop and check in with Ayomide before writing code against a new plan.
4. Work through items one at a time.
5. After each step, explain in plain language what changed and why.
6. Keep changes small and minimal. No big rewrites — if something looks like it needs one, stop and say so.

## Constraints (from the WRD)

- Plain HTML, CSS, vanilla JS ES modules. No React, no Tailwind, no bundler, no runtime dependencies.
- Node is used only for the static page-generation script (Step 5).
- All case data lives in `data/cases.js` — adding an eleventh case must never require touching layout code.
- Deploy target: GitHub Pages or Cloudflare Pages.

## Style

- Sentence case, active voice, plain verbs. No filler adjectives ("passionate," "results-driven," "leveraged").
- Small commits, one logical change each, clear message.
- Don't reformat or tidy files you weren't asked to touch.
- Don't add dependencies without asking.

## Verification

Say what you verified and what you didn't. Never describe something as "working" when what you mean is "it compiled." Where Lighthouse, keyboard, or screen-reader checks are claimed, say exactly what was run and on what.
