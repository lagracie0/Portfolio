# Website Requirements Document (WRD)
## Ayomide Grace Amusan — Professional Portfolio

| Field | Value |
|---|---|
| Document | WRD — Portfolio Website v1.0 |
| Owner | Ayomide Grace Amusan (Product Owner + PM) |
| Author | Drafted with Claude, acting as PM |
| Date | 24 August 2026 |
| Status | Draft for approval |
| Build target | v1.0 (MVP) ship in 2 weeks; v1.1 within 6 weeks |

---

## 1. Background and problem statement

Ayomide's CV covers fintech, hospitality, infrastructure, web hosting, consumer beauty tech, live events, and civic/election operations, on top of a Biochemistry degree and a self-built AI product. Read as a chronological list, this pattern is a liability: it looks like drift. Read correctly, it is the asset: **she is repeatedly hired into environments that have no delivery structure, and she builds the structure.** The domain changes; the method does not.

A standard portfolio (hero → about → chronological experience → contact) actively works against her, because chronology is the exact frame that makes an interdisciplinary career look scattered. Chronology answers "when," and nobody is asking "when."

**The problem this site solves:** a hiring manager scanning for 45 seconds must leave with one sentence in their head — *"she goes into unstructured environments and builds the delivery system"* — and must be able to verify that claim in any domain they personally care about, in one click.

## 2. Objectives

| # | Objective | Success measure | Target (90 days post-launch) |
|---|---|---|---|
| O1 | Convert the scan into a read | % of sessions that open ≥1 case study | ≥ 45% |
| O2 | Prove depth, not just claims | Median time on an opened case study | ≥ 90 seconds |
| O3 | Make interdisciplinarity legible | % of sessions that open cases in ≥2 different domains | ≥ 20% |
| O4 | Generate inbound | Contact / email / LinkedIn click-through | ≥ 8% of sessions |
| O5 | Survive recruiter screening | CV downloads | ≥ 15% of sessions |
| O6 | Be usable in a live conversation | Deep-link to any single case works and loads < 1.5s | 100% |

**Non-goals for v1.0:** blog, newsletter, CMS, client login, testimonials wall, dark-mode toggle, i18n.

## 3. Audiences

| P | Persona | Arrives from | Time budget | Needs to answer | Design implication |
|---|---|---|---|---|---|
| P1 | **Hiring manager / Head of Product** | LinkedIn, referral | 45 sec, then 5 min if hooked | "Can she own delivery without supervision?" | Thesis visible above the fold; case studies with tradeoffs, not tasks |
| P2 | **Recruiter / talent partner** | LinkedIn, search | 20 sec | "PMP? Agile? Tools? Years? Right level?" | Credentials and tool stack scannable without scrolling into a case; CV download always reachable |
| P3 | **Founder / client hiring a contract PM** | Referral, event | 3 min | "Has she done this in *my* world, and can she start from zero?" | Domain filter; explicit "built the PM function from nothing" cases |
| P4 | **Partner / programme lead** (events, universities, sponsors) | Event follow-up | 2 min | "Can she be trusted with our name and a fixed date?" | Events and stakeholder cases; named organisations |

Primary persona for v1.0 trade-off decisions: **P1**.

## 4. The organising concept

### 4.1 Coverage Matrix (the site's spine and signature)

The homepage is not a hero paragraph followed by cards. It is an interactive **Coverage Matrix**: domains on one axis, capabilities on the other, filled cells where real work exists.

|  | Build from zero | Delivery & release | Stakeholder / vendor | Live ops, fixed date | Research & reporting | Ships it herself |
|---|---|---|---|---|---|---|
| **Civic & elections** | ✓ | | ✓ | ✓ | ✓ | |
| **Infrastructure & policy** | ✓ | ✓ | ✓ | ✓ | | |
| **Fintech** | | | ✓ | | ✓ | |
| **Hospitality & travel** | ✓ | ✓ | | | ✓ | |
| **Consumer & marketplaces** | | ✓ | ✓ | | ✓ | ✓ |
| **Events & community** | ✓ | | ✓ | ✓ | | |
| **Developer / web infrastructure** | | ✓ | ✓ | | ✓ | |

Why this works as navigation *and* as argument: reading **down a column** proves the method repeats across unrelated industries. Reading **across a row** proves depth in one industry. The visitor picks their own entry point, and either way the interdisciplinary claim is proved by structure rather than asserted by adjective. No portfolio the hiring manager saw this week was navigated this way.

### 4.2 Visual language

Drawn from her own working materials — RAG status reports, run-of-show sheets, incident logs, board columns — not from portfolio-template conventions.

- **RAG as the colour system.** Green / amber / red are the native vocabulary of every status report she has ever written. Here they are semantic, never decorative: green = delivered on the committed date, amber = recovered after a real constraint, red = the constraint itself. A visitor who has run projects reads the palette instantly.
- **Typography with three roles:** a wide/heavy grotesk for display, a serif for reading case narrative, a monospace for dates, statuses, metrics and labels — because logs and timestamps are monospaced in real life.
- **Restraint:** the matrix is the one bold element. Everything else is quiet.

Explicitly rejected: cream-and-serif-and-terracotta, dark-mode-with-acid-green, glassmorphism, hero gradient, floating 3D blobs, "Hi, I'm Ayomide 👋", generic timeline scroll.

## 5. Information architecture

```
/                     Home — thesis line + Coverage Matrix + credentials strip
/work                 All cases, filterable (matrix state persists via query params)
/work/:slug           Case study (10 cases at full depth)
/method               How she operates: the repeatable system, with real artifacts
/about                Bio, the Biochemistry-to-product path, certifications, tools
/contact              Email, LinkedIn, CV download, availability
```

Persistent header: logo/name · Work · Method · About · **Download CV** (primary action, always visible).

## 6. Content requirements

### 6.1 Case inventory

| # | Case | Domain | Capabilities | Priority |
|---|---|---|---|---|
| C1 | **Situation Room supervision — Osun governorship election** (Accord Party, 20 Jul – 15 Aug 2026) | Civic & elections | Live ops, build from zero, stakeholder | **P0** |
| C2 | **Africa Infrastructure Roundtable, Manchester 2026 – London 2027 pipeline** (Langovest) | Infrastructure & policy | Delivery, stakeholder, live ops | **P0** |
| C3 | **Lodgr — booking platform, scoping to post-launch review** | Hospitality & travel | Build from zero, delivery, research | **P0** |
| C4 | **Langovest Volunteer Network, 0 – 12 volunteers across 4 countries in 4 months** | Infrastructure & community | Build from zero, stakeholder | **P0** |
| C5 | **Osun Tech Festival — full festival on a one-month lead time** | Events & community | Live ops, stakeholder | **P0** |
| C6 | **Langovest website redesign — 95% of tickets to schedule** | Infrastructure / web | Delivery, reporting | **P0** |
| C7 | **Boldtron — marketplace app, remote team, sole point of accountability** | Consumer & marketplaces | Delivery, stakeholder | P1 |
| C8 | **Sponsorship pipeline — Flutterwave, Moniepoint, Paystack, Afin Bank; 25% positive response** | Fintech | Stakeholder, reporting | P1 |
| C9 | **Clea & Pushbio enhancements, +15% retention** (HostMeNG) + **3 beauty MVPs at 90% on-time** (Calnita) | Developer infra / consumer | Delivery, research | P1 |
| C10 | **Frobits — AI music generation in WhatsApp, and "Frobits Together" shipped end-to-end** | Consumer / own product | Ships it herself | P1 |

C10 is the differentiating case, not a side project: a PM who writes the PRD, builds the prototype and deploys the backend is a materially different hire. It gets its own capability column so it cannot be missed.

### 6.2 Case study template (every case, same six blocks)

1. **Situation** — 2–3 sentences. What existed when she arrived.
2. **What was missing** — the specific absence (no schedule, no owner, no escalation path, no requirements).
3. **What I built** — the structure introduced, named concretely (RAID register, ticket brief format, escalation ladder, sprint plan).
4. **Decisions and trade-offs** — 2–3 real forks with what was given up. *This block is mandatory and is the one that separates this site from a CV.*
5. **Outcome** — result with a one-line method note on how it was measured.
6. **Artifacts** — a redacted or reconstructed real artifact: board structure, brief template, risk register, run-of-show, stakeholder map.

### 6.3 Content integrity rules (binding on the build)

- **R1 — No invented facts.** Every claim traces to the CV, the Situation Room engagement, or Ayomide's written input. Where narrative is missing, the build inserts a visible `[NEEDS INPUT: …]` placeholder. It does not improvise a story.
- **R2 — Metrics carry method notes.** "25% conversion," "95% to schedule," "+15% retention" each get a short parenthetical on what was counted and over what period. Naked percentages get discounted by experienced readers.
- **R3 — C1 is framed operationally, not politically.** The case is about incident intake, agent coordination, escalation and reporting against an immovable date. It names the engagement factually and takes no political position, makes no claim about the election or its outcome, and includes no material that could identify individual agents or sensitive operational detail. Ayomide gives final sign-off on this page's copy before launch.
- **R4 — Concurrent engagements shown honestly.** C1 overlaps the Langovest period; dates are shown as they were.

## 7. Functional requirements

Priority: **M** = must (v1.0), **S** = should (v1.0 if time), **C** = could (v1.1).

| ID | Requirement | Pri |
|---|---|---|
| F1 | Coverage Matrix renders on home from a single content source; filled cells are links, empty cells are inert and visibly inert | M |
| F2 | Hovering/focusing a row or column highlights that row/column and dims the rest; the label shows the case count | M |
| F3 | Clicking a cell opens that case; a cell with >1 case opens `/work` pre-filtered to the intersection | M |
| F4 | `/work` supports filtering by domain and by capability simultaneously; active filters shown as removable chips with a "clear all" | M |
| F5 | Filter state encoded in the URL (`/work?domain=civic&capability=live-ops`) so any view is shareable and back/forward works | M |
| F6 | Empty filter result returns a useful state naming what she *has* done nearby, never a bare "no results" | M |
| F7 | On viewports < 768px the matrix becomes a horizontally scrollable compact grid **plus** an equivalent list of filter chips; all cases reachable without the grid | M |
| F8 | Full keyboard operation of the matrix: arrow keys move between cells, Enter opens, Tab reaches every interactive element, focus is always visible | M |
| F9 | Every case page is a real URL, deep-linkable, and renders standalone without home state | M |
| F10 | Persistent "Download CV" action in header and footer, serving a versioned PDF | M |
| F11 | Case pages carry prev/next navigation weighted to a *different* domain, to drive O3 | S |
| F12 | `/method` presents the repeatable operating system with links to the cases that evidence each step | S |
| F13 | Credentials strip (PMP, Google PM, Alberta Software PM, Asana Workflow Specialist) visible on home without scrolling past the matrix | M |
| F14 | Analytics events: `case_open`, `filter_apply`, `cv_download`, `contact_click`, `matrix_cell_hover`, with domain/capability attributes | S |
| F15 | Contact is a `mailto:` and LinkedIn link — no form, no backend, no spam surface | M |
| F16 | Artifact images open in an accessible lightbox with captions | C |
| F17 | Print stylesheet so a case page prints cleanly to one or two pages | C |

## 8. Non-functional requirements

| ID | Requirement |
|---|---|
| N1 | Fully static. No build step, no framework, no runtime dependencies. Plain HTML, CSS, vanilla JS (ES modules). |
| N2 | Lighthouse ≥ 95 on Performance, Accessibility, Best Practices, SEO on mobile. |
| N3 | LCP < 1.5s on a simulated 4G Nigerian connection; total page weight < 500KB including fonts. |
| N4 | WCAG 2.1 AA: contrast ≥ 4.5:1 for body text, semantic landmarks, alt text on every artifact, `prefers-reduced-motion` respected. |
| N5 | RAG colours never carry meaning by colour alone — always paired with a text label or icon (colour-blind safety, and it is a status system, so this matters). |
| N6 | Works in current Chrome, Safari, Firefox, Edge, and Safari iOS. Degrades to a readable linear document with JS disabled. |
| N7 | Per-page SEO: unique title/meta, JSON-LD `Person` + `CreativeWork` per case, OG images so LinkedIn shares render properly. |
| N8 | Self-hosted or preconnect-optimised fonts, `font-display: swap`, subset to Latin. |
| N9 | Content and presentation separated: all case data in one JS/JSON module, so a case is added by editing data only. |

## 9. Technical approach

- **Stack:** static HTML + CSS + vanilla JS modules. No React, no bundler — consistent with existing no-build practice and the correct choice for a 12-page site.
- **Content model:** one `data/cases.js` exporting an array of case objects (`slug`, `title`, `org`, `domain`, `capabilities[]`, `dates`, `status`, `situation`, `missing`, `built[]`, `decisions[]`, `outcome[]`, `artifacts[]`). The matrix, filters, case pages and JSON-LD all derive from this single source. Adding a case must never require touching layout code.
- **Rendering:** case pages generated client-side from the data module via a template + router, **or** a tiny Node script that emits static HTML at commit time. Preference: the Node script, because static files satisfy N6 and N7 without compromise.
- **Hosting:** GitHub Pages or Cloudflare Pages on a custom domain (Railway is unnecessary overhead for static assets). HTTPS enforced.
- **Repo:** GitHub, with a `CLAUDE.md` carrying the same rules as the Frobits project — no silent spec deviation, no invented justifications, diagnose before fixing — extended with R1 above.

## 10. Release plan

| Phase | Scope | Exit criteria |
|---|---|---|
| **0 — Content** (Ayomide, ~4 hrs) | Write the six blocks for the six P0 cases; collect artifacts; confirm C1 framing | All P0 `[NEEDS INPUT]` placeholders cleared |
| **1 — MVP** | Home + matrix, `/work` + filters, 6 P0 cases, `/about`, `/contact`, CV download | F1–F10, F13, F15; N1–N6 met; tested on one real Android device |
| **2 — Depth** | 4 remaining cases, `/method`, artifacts, analytics | F11, F12, F14, F16 |
| **3 — Validation** | 5-second test with 3 PM peers and 2 hiring managers; iterate the thesis line | ≥4 of 5 recall the thesis unprompted |

## 11. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Matrix is clever but confusing on first contact | High — kills O1 | One-line instruction beneath the thesis; hover state teaches; `/work` list is always one click away as a conventional fallback |
| Content phase stalls; site ships with thin cases | High | Ship 6 cases, not 10. A thin case is worse than an absent one. |
| C1 framing invites political read-through | Medium | R3; operational framing; Ayomide's sign-off; the case is genuinely her strongest live-ops evidence and should not be dropped out of caution |
| Unverifiable percentages read as inflation | Medium | R2 method notes |
| Mobile grid becomes unusable | High — most Nigerian and LinkedIn traffic is mobile | F7 mandates the chip-list equivalent; mobile is tested first, not last |

## 12. Open questions for Ayomide

1. **"Health research"** appears in the CV summary but nothing in the experience section evidences it. Substantiate it with a real engagement, or remove it from both CV and site — an unsupported domain claim is the one thing a sharp interviewer will pull on.
2. **Frobits (C10):** include or hold back? Recommendation: include. It is the strongest single differentiator on the site.
3. **Positioning:** senior/lead PM roles, or contract delivery-consulting clients? The copy register changes materially. Recommendation for v1.0: employment-first, with contract availability noted on `/contact`.
4. **Domain name** and whether the CV PDF is public or gated behind a click.
5. **Artifacts:** which real ones can be shared redacted? Any real artifact beats a reconstruction.
6. **Calnita ended March 2024, HostMeNG began July 2024** — is there anything in the gap worth showing?
