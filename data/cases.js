// Single source of truth for the Coverage Matrix, /work filters, and case pages.
// Adding an 11th case = adding one object here. Do not touch layout code.
//
// NEEDS-INPUT convention: any field the WRD doesn't state explicitly, and that
// isn't in the CV text we have, is filled with the literal string
// '[NEEDS INPUT: <question>]' rather than an invented sentence. See WRD R1.
//
// Shape notes:
// - domain/capabilities are kebab-case ids that must match a slug in DOMAINS /
//   CAPABILITIES below — F5's URL params depend on this.
// - outcome[] holds narrative outcome statements, each tagged with its own
//   RAG status ({ text, status }) — one case can be green on one thread and
//   amber on another; there is no single case-level status.
// - metrics[] holds quantified claims ({ value, label, method }). `method` is
//   required on every entry (WRD R2) so it can never be skipped — cases with
//   no headline number in the WRD have an empty metrics[] array rather than
//   an invented one.
// - priority is 'P0' | 'P1' per WRD §6.1, so the Phase 1 ship list is a filter
//   on this field, not a manual call at build time.
// - entityLine is an optional, explicit byline ("role, entity, context —
//   dates") for a case where the engaging entity needs to be stated with
//   precision distinct from `org` alone. Currently only on C1: the
//   engagement was with the Accord Party specifically, not the Osun State
//   Government, even though the party holds the governorship the case is
//   about — that distinction matters enough to spell out, not leave to `org`.
// - situation[] and missing[] hold one entry per sentence/claim (matching the
//   pattern built[]/decisions[]/outcome[] already use), not one long string —
//   so a real, traceable sentence and an open [NEEDS INPUT] question can sit
//   side by side in the same block without one contaminating the other. Only
//   C1 and C3 use this shape so far (see the Step 4/5 review); the rest are
//   still single-entry placeholders pending their own discovery pass.
// - Every [NEEDS INPUT: ...] string IS the open question, not prose with a
//   question attached — never write a real-sounding sentence and footnote
//   it. A field is either fully traceable (state it) or fully open (ask it).

export const DOMAINS = [
  { slug: 'civic', label: 'Civic & elections' },
  { slug: 'infrastructure', label: 'Infrastructure & policy' },
  { slug: 'fintech', label: 'Fintech' },
  { slug: 'hospitality', label: 'Hospitality & travel' },
  { slug: 'consumer', label: 'Consumer & marketplaces' },
  { slug: 'events', label: 'Events & community' },
  { slug: 'devinfra', label: 'Developer / web infrastructure' },
];

// Order is semantic, not alphabetical or packing-optimised: it traces the
// arc of an engagement — arrive/scope, build the structure, deliver, run it
// live under a fixed date, report, ship it yourself. Stakeholder sits second
// because alignment has to precede execution, not because it minimises
// segmented bars in the matrix. This order is load-bearing for the Coverage
// Matrix's column sequence — do not reorder for layout convenience.
export const CAPABILITIES = [
  { slug: 'build-from-zero', label: 'Build from zero' },
  { slug: 'stakeholder', label: 'Stakeholder / vendor' },
  { slug: 'delivery', label: 'Delivery & release' },
  { slug: 'live-ops', label: 'Live ops, fixed date' },
  { slug: 'research', label: 'Research & reporting' },
  { slug: 'ships-it-herself', label: 'Ships it herself' },
];

export const CASES = [
  {
    slug: 'situation-room-osun-election',
    title: 'Situation Room supervision — Osun governorship election',
    org: 'Accord Party',
    // The engaging entity is the Accord Party, not the Osun State
    // Government — the party holds the governorship, but the engagement
    // itself was with the party. Never name the state government as
    // employer here, in prose, or in JSON-LD/OG tags later.
    entityLine: 'Situation Room supervisor, Accord Party, Osun State governorship election — 20 July to 15 August 2026.',
    domain: 'civic',
    capabilities: ['live-ops', 'build-from-zero', 'stakeholder'],
    priority: 'P0',
    dateStart: '2026-07-20',
    dateEnd: '2026-08-15',
    // Structural placeholder content, drafted for Step 5 template proportions
    // (not final copy). Real facts below trace to entity/dates/title (already
    // confirmed) and to Ayomide's own written answers to a discovery Q&A on
    // this case; everything else is an open, specific question, per rule R1.
    // This page also needs her sign-off before publication per R3.
    situation: [
      'When she arrived, the office space and basic setup already existed, alongside the fixed election dates (20 July to 15 August 2026).',
      'Once operating, reports reached her through several channels — phone, media monitoring, and an existing reporting line.',
      '[NEEDS INPUT: Was a rota, an escalation process, or an agent roster already in place before she arrived, or did none of that exist yet?]',
    ],
    missing: [
      '[NEEDS INPUT: What specific structure was missing at the start — a triage step, a shared incident log, an escalation ladder, something else? Name the actual gap.]',
      '[NEEDS INPUT: Was a reporting cadence to the Accord Party leadership already set before she arrived, or did she have to establish one?]',
    ],
    built: [
      '[NEEDS INPUT: What did she set up to triage the incoming phone, media, and reporting-line traffic into one coherent picture?]',
      '[NEEDS INPUT: What structure did she introduce for escalating contradictory or unverified reports?]',
      '[NEEDS INPUT: How did she organise the 70-plus agents and co-supervisors — a roster, a shift structure, a geographic split?]',
      '[NEEDS INPUT: What format or cadence did she put in place for reporting up to the Accord Party leadership?]',
      '[NEEDS INPUT: What changed about handling the internet, software, or rural-area access problems — a workaround, a fallback channel, a different tool?]',
    ],
    decisions: [
      '[NEEDS INPUT: The worst moment involved contradictory reports and unverified information arriving fast — what did she decide, and what did that choice cost or rule out?]',
      '[NEEDS INPUT: The software, internet, and rural-area access broke or nearly broke mid-operation — what did she change, and what was given up to make that change work?]',
      '[NEEDS INPUT: Coordinating 70-plus agents and co-supervisors required a structural choice — centralised control vs. delegated authority, geography vs. shift — which way did she go, and what did that choice sacrifice?]',
    ],
    outcome: [
      { text: '[NEEDS INPUT: How was the contradictory-reports moment ultimately resolved, and what was the result?]', status: '[NEEDS INPUT: green/amber/red]' },
      { text: '[NEEDS INPUT: Once the software/internet/rural-access problems were addressed, what was the actual outcome — full recovery, partial, lasting impact?]', status: '[NEEDS INPUT: green/amber/red]' },
    ],
    metrics: [
      { value: '[NEEDS INPUT: a real number — e.g. agents coordinated, incidents logged, reports processed, response time]', label: '[NEEDS INPUT: what this number would represent]', method: '[NEEDS INPUT: how it was counted and over what period]' },
    ],
    artifacts: [
      '[NEEDS INPUT: a redacted/reconstructed artifact showing how multi-channel reports were logged or triaged — no material that could identify individual agents]',
      '[NEEDS INPUT: a redacted/reconstructed artifact showing the 70-plus agent/co-supervisor coordination structure — e.g. a roster or map, again with no identifying detail]',
    ],
  },
  {
    slug: 'africa-infrastructure-roundtable',
    title: 'Africa Infrastructure Roundtable, Manchester 2026 → London 2027 pipeline',
    org: 'Langovest',
    domain: 'infrastructure',
    capabilities: ['delivery', 'stakeholder', 'live-ops'],
    priority: 'P0',
    dateStart: '[NEEDS INPUT: exact engagement start date — WRD only names event years, Manchester 2026 and London 2027]',
    dateEnd: '[NEEDS INPUT: exact engagement end date, or "ongoing" if the London 2027 pipeline is still live]',
    situation: [
      '[NEEDS INPUT: 2–3 sentences on what existed before this roundtable programme]',
    ],
    missing: [
      '[NEEDS INPUT: the specific structural absence]',
    ],
    built: [
      '[NEEDS INPUT: the structures introduced for delivery, stakeholder management, and live event ops]',
    ],
    decisions: [
      '[NEEDS INPUT: 2–3 real decision forks and what was traded off]',
    ],
    outcome: [
      { text: '[NEEDS INPUT: outcome statement]', status: '[NEEDS INPUT: green/amber/red]' },
    ],
    metrics: [],
    artifacts: [
      '[NEEDS INPUT: a redacted/reconstructed artifact — e.g. stakeholder map, run-of-show]',
    ],
  },
  {
    slug: 'lodgr-booking-platform',
    title: 'Lodgr — booking platform, scoping to post-launch review',
    org: '[NEEDS INPUT: confirm "Lodgr" is the correct org/client name, not just a product name]',
    domain: 'hospitality',
    capabilities: ['build-from-zero', 'delivery', 'research'],
    priority: 'P0',
    dateStart: '[NEEDS INPUT: engagement start date]',
    dateEnd: '[NEEDS INPUT: engagement end date]',
    // Structural placeholder content, drafted for Step 5 template proportions
    // (not final copy). No discovery Q&A has been done for this case yet —
    // unlike C1, nothing here beyond title/domain/capabilities is confirmed,
    // so every claim is an open, specific question rather than a guess.
    situation: [
      '[NEEDS INPUT: When she joined, did Lodgr already have a product built, or was this genuinely a zero-to-one build? What existed — a concept, a prototype, paying customers?]',
      '[NEEDS INPUT: What kind of organisation was Lodgr — a startup she joined, a client engagement, something else — and roughly how large was the team?]',
      '[NEEDS INPUT: What was the state of requirements or product direction before she started scoping?]',
    ],
    missing: [
      '[NEEDS INPUT: What specific process was absent before she arrived — no requirements documentation, no launch plan, no post-launch review process?]',
      '[NEEDS INPUT: Was there an existing PM function at Lodgr before her, or was this role newly created?]',
    ],
    built: [
      '[NEEDS INPUT: What requirements-gathering process did she put in place for scoping the booking platform?]',
      '[NEEDS INPUT: What did the actual delivery process look like — sprints, a roadmap, a release cadence — and did she design it?]',
      '[NEEDS INPUT: What research did she conduct, and what method — user interviews, competitive analysis, usability testing?]',
      '[NEEDS INPUT: What did the launch process consist of, and what changed for post-launch review specifically?]',
      '[NEEDS INPUT: Was there a specific documentation or handoff structure she introduced — a requirements brief, a spec template?]',
    ],
    decisions: [
      '[NEEDS INPUT: What was a real scope trade-off she made — a feature cut, a timeline compromise, a build-vs-buy call — and what was given up?]',
      '[NEEDS INPUT: Did she make a call between speed to launch and thoroughness of testing or research? What did that cost?]',
      '[NEEDS INPUT: Was there a disagreement with stakeholders or the team about direction, and how was it resolved?]',
    ],
    outcome: [
      { text: '[NEEDS INPUT: What was the actual result of the launch — on time, delayed, and against what commitment?]', status: '[NEEDS INPUT: green/amber/red]' },
      { text: '[NEEDS INPUT: What did the post-launch review find, and what happened as a result of it?]', status: '[NEEDS INPUT: green/amber/red]' },
    ],
    metrics: [
      { value: '[NEEDS INPUT: a real number from this engagement — e.g. time to launch, user adoption, retention, requirements delivered]', label: '[NEEDS INPUT: what this number would represent]', method: '[NEEDS INPUT: how it was counted and over what period]' },
    ],
    artifacts: [
      '[NEEDS INPUT: a redacted/reconstructed requirements brief or scoping document from this engagement]',
      '[NEEDS INPUT: a redacted/reconstructed launch checklist or post-launch review template]',
    ],
  },
  {
    slug: 'langovest-volunteer-network',
    title: 'Langovest Volunteer Network, 0 → 12 volunteers across 4 countries in 4 months',
    org: 'Langovest',
    domain: 'infrastructure',
    capabilities: ['build-from-zero', 'stakeholder'],
    priority: 'P0',
    dateStart: '[NEEDS INPUT: start date — WRD gives only a 4-month duration, not calendar dates]',
    dateEnd: '[NEEDS INPUT: end date]',
    situation: [
      '[NEEDS INPUT: 2–3 sentences on what existed before the volunteer network]',
    ],
    missing: [
      '[NEEDS INPUT: the specific structural absence]',
    ],
    built: [
      '[NEEDS INPUT: the structures introduced to recruit, coordinate and retain volunteers across 4 countries]',
    ],
    decisions: [
      '[NEEDS INPUT: 2–3 real decision forks and what was traded off]',
    ],
    outcome: [
      { text: '[NEEDS INPUT: outcome statement — what the growth from 0 to 12 volunteers meant for the network]', status: '[NEEDS INPUT: green/amber/red]' },
    ],
    metrics: [
      { value: '0 → 12', label: 'volunteers across 4 countries', method: '[NEEDS INPUT: how "volunteer" was counted — e.g. active vs. onboarded — and the exact 4-month window, per R2]' },
    ],
    artifacts: [
      '[NEEDS INPUT: a redacted/reconstructed artifact — e.g. onboarding structure, country coordination map]',
    ],
  },
  {
    slug: 'osun-tech-festival',
    title: 'Osun Tech Festival — full festival on a one-month lead time',
    org: '[NEEDS INPUT: the organisation or client behind Osun Tech Festival]',
    domain: 'events',
    capabilities: ['live-ops', 'stakeholder'],
    priority: 'P0',
    dateStart: '[NEEDS INPUT: engagement/festival start date]',
    dateEnd: '[NEEDS INPUT: engagement/festival end date]',
    situation: [
      '[NEEDS INPUT: 2–3 sentences on what existed one month out from the festival]',
    ],
    missing: [
      '[NEEDS INPUT: the specific structural absence]',
    ],
    built: [
      '[NEEDS INPUT: the structures introduced — e.g. run-of-show, vendor/stakeholder coordination]',
    ],
    decisions: [
      '[NEEDS INPUT: 2–3 real decision forks and what was traded off, given the one-month lead time]',
    ],
    outcome: [
      { text: '[NEEDS INPUT: outcome statement]', status: '[NEEDS INPUT: green/amber/red]' },
    ],
    metrics: [],
    artifacts: [
      '[NEEDS INPUT: a redacted/reconstructed artifact — e.g. run-of-show sheet]',
    ],
  },
  {
    slug: 'langovest-website-redesign',
    title: 'Langovest website redesign — 95% of tickets to schedule',
    org: 'Langovest',
    domain: 'devinfra',
    capabilities: ['delivery', 'research'],
    priority: 'P0',
    dateStart: '[NEEDS INPUT: engagement start date]',
    dateEnd: '[NEEDS INPUT: engagement end date]',
    situation: [
      '[NEEDS INPUT: 2–3 sentences on what existed before the redesign]',
    ],
    missing: [
      '[NEEDS INPUT: the specific structural absence]',
    ],
    built: [
      '[NEEDS INPUT: the structures introduced — e.g. ticket brief format, sprint plan]',
    ],
    decisions: [
      '[NEEDS INPUT: 2–3 real decision forks and what was traded off]',
    ],
    outcome: [
      { text: '[NEEDS INPUT: outcome statement]', status: '[NEEDS INPUT: green/amber/red]' },
    ],
    metrics: [
      { value: '95%', label: 'of tickets delivered to schedule', method: '[NEEDS INPUT: what counted as "to schedule," total ticket count, and the measurement period, per R2]' },
    ],
    artifacts: [
      '[NEEDS INPUT: a redacted/reconstructed artifact — e.g. ticket brief template, board structure]',
    ],
  },
  {
    slug: 'boldtron-marketplace-app',
    title: 'Boldtron — marketplace app, remote team, sole point of accountability',
    org: 'Boldtron',
    domain: 'consumer',
    capabilities: ['delivery', 'stakeholder'],
    priority: 'P1',
    dateStart: '[NEEDS INPUT: engagement start date]',
    dateEnd: '[NEEDS INPUT: engagement end date]',
    situation: [
      '[NEEDS INPUT: 2–3 sentences on what existed when she became sole point of accountability for this remote team]',
    ],
    missing: [
      '[NEEDS INPUT: the specific structural absence]',
    ],
    built: [
      '[NEEDS INPUT: the structures introduced to run delivery with a fully remote team]',
    ],
    decisions: [
      '[NEEDS INPUT: 2–3 real decision forks and what was traded off]',
    ],
    outcome: [
      { text: '[NEEDS INPUT: outcome statement]', status: '[NEEDS INPUT: green/amber/red]' },
    ],
    metrics: [],
    artifacts: [
      '[NEEDS INPUT: a redacted/reconstructed artifact — e.g. sprint board structure, remote-team communication cadence]',
    ],
  },
  {
    slug: 'fintech-sponsorship-pipeline',
    title: 'Sponsorship pipeline — Flutterwave, Moniepoint, Paystack, Afin Bank',
    org: '[NEEDS INPUT: the organisation this sponsorship pipeline was run for — Flutterwave/Moniepoint/Paystack/Afin Bank are the sponsor targets, not necessarily the employer]',
    domain: 'fintech',
    capabilities: ['stakeholder', 'research'],
    priority: 'P1',
    dateStart: '[NEEDS INPUT: engagement start date]',
    dateEnd: '[NEEDS INPUT: engagement end date]',
    situation: [
      '[NEEDS INPUT: 2–3 sentences on what existed before the sponsorship pipeline]',
    ],
    missing: [
      '[NEEDS INPUT: the specific structural absence]',
    ],
    built: [
      '[NEEDS INPUT: the structures introduced — e.g. outreach process, pipeline tracking]',
    ],
    decisions: [
      '[NEEDS INPUT: 2–3 real decision forks and what was traded off]',
    ],
    outcome: [
      { text: '[NEEDS INPUT: outcome statement]', status: '[NEEDS INPUT: green/amber/red]' },
    ],
    metrics: [
      { value: '25%', label: 'positive response rate', method: '[NEEDS INPUT: response to what — e.g. cold outreach, proposal — out of how many contacted, over what period, per R2]' },
    ],
    artifacts: [
      '[NEEDS INPUT: a redacted/reconstructed artifact — e.g. pipeline tracker structure, outreach brief]',
    ],
  },
  {
    // Split from the original merged "hostmeng-calnita-product-work" case per
    // instruction: different employers, different domains. Domain and
    // capabilities confirmed. The "research" tag here is market-trend and
    // feedback analysis — a different flavour of research from Calnita's
    // user research below; both are real, per instruction.
    slug: 'hostmeng-clea-pushbio',
    title: 'Clea and Pushbio enhancements',
    org: 'HostMeNG',
    domain: 'devinfra',
    capabilities: ['delivery', 'research'],
    priority: 'P1',
    dateStart: '2024-07', // per your note; WRD open question 6 also gives "July 2024"
    dateEnd: '[NEEDS INPUT: engagement end date, or "ongoing"]',
    situation: [
      '[NEEDS INPUT: 2–3 sentences on what existed at HostMeNG when she arrived]',
    ],
    missing: [
      '[NEEDS INPUT: the specific structural absence]',
    ],
    built: [
      'Market-trend and feedback analysis work [NEEDS INPUT: what was analysed, what method, and how findings fed back into Clea/Pushbio decisions]',
    ],
    decisions: [
      '[NEEDS INPUT: 2–3 real decision forks and what was traded off]',
    ],
    outcome: [
      { text: '[NEEDS INPUT: outcome statement]', status: '[NEEDS INPUT: green/amber/red]' },
    ],
    metrics: [
      { value: '+15%', label: 'retention on Clea and Pushbio', method: '[NEEDS INPUT: retention of what user cohort, measured how, over what period, per R2]' },
    ],
    artifacts: [
      '[NEEDS INPUT: a redacted/reconstructed artifact from this engagement]',
    ],
  },
  {
    // Split from the original merged "hostmeng-calnita-product-work" case —
    // see the note on the HostMeNG case above. Domain and capabilities
    // confirmed. This resolves the WRD §4.1 vs. data mismatch on
    // Consumer & marketplaces × Research & reporting — Calnita is real
    // consumer-domain evidence for that cell.
    slug: 'calnita-beauty-mvps',
    title: 'Three beauty MVPs',
    org: 'Calnita',
    domain: 'consumer',
    capabilities: ['delivery', 'research'],
    priority: 'P1',
    dateStart: '2023', // per your note ("2023–24"); exact month NEEDS INPUT
    dateEnd: '2024-03', // per WRD open question 6 ("Calnita ended March 2024")
    situation: [
      '[NEEDS INPUT: 2–3 sentences on what existed at Calnita when she arrived]',
    ],
    missing: [
      '[NEEDS INPUT: the specific structural absence]',
    ],
    built: [
      'User research initiatives that directly shaped the product roadmap [NEEDS INPUT: specific method — surveys, interviews, usability testing — and cadence]',
    ],
    decisions: [
      '[NEEDS INPUT: 2–3 real decision forks and what was traded off]',
    ],
    outcome: [
      { text: '[NEEDS INPUT: outcome statement]', status: '[NEEDS INPUT: green/amber/red]' },
    ],
    metrics: [
      { value: '90%', label: 'of 3 beauty MVPs shipped on-time', method: '[NEEDS INPUT: "on-time" against what committed dates, and what counted as the 10% that was not, per R2]' },
    ],
    artifacts: [
      '[NEEDS INPUT: a redacted/reconstructed artifact from this engagement]',
    ],
  },
  {
    slug: 'frobits-ai-music-whatsapp',
    title: 'Frobits — AI music generation in WhatsApp, and "Frobits Together" shipped end-to-end',
    org: 'Frobits',
    domain: 'consumer',
    capabilities: ['ships-it-herself'],
    priority: 'P1',
    dateStart: '[NEEDS INPUT: engagement/project start date]',
    dateEnd: '[NEEDS INPUT: engagement/project end date, or "ongoing"]',
    situation: [
      '[NEEDS INPUT: 2–3 sentences on what existed before Frobits — this is her own product, so this should describe the problem she set out to solve]',
    ],
    missing: [
      '[NEEDS INPUT: the specific structural absence]',
    ],
    built: [
      '[NEEDS INPUT: what she built end-to-end — WRD names writing the PRD, building the prototype, and deploying the backend as the differentiator here; confirm the specifics]',
    ],
    decisions: [
      '[NEEDS INPUT: 2–3 real decision forks and what was traded off]',
    ],
    outcome: [
      { text: '[NEEDS INPUT: outcome statement]', status: '[NEEDS INPUT: green/amber/red]' },
    ],
    metrics: [],
    artifacts: [
      '[NEEDS INPUT: a redacted/reconstructed artifact — e.g. PRD excerpt, product screenshot]',
    ],
  },
];
