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
  { slug: 'health-research', label: 'Health & research' },
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
  { slug: 'ships-it-herself', label: 'Ships it myself' },
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
    entityLine: 'Supervisor, Situation Room, Accord Party — Osun State governorship election, 20 July to 15 August 2026.',
    domain: 'civic',
    // build-from-zero removed and research added, per Ayomide's explicit
    // ruling: the command structure, escalation ladder and log fields were
    // set by the Situation Room Lead before supervisors took over, so
    // build-from-zero would claim design work that belongs to someone
    // else — the same documents that would prove that also disprove the
    // tag. research is added because collation-readiness testing and the
    // standing reporting cadence to the Lead both support it. This flips
    // the WRD/data mismatch on this domain: Civic x Research is now
    // resolved (matches WRD §4.1), but Civic x Build-from-zero is now open
    // again, since Civic has only this one case and it no longer carries
    // that tag — see tasks/todo.md. If built[4] below comes back with a
    // real structural contribution she made beyond the briefing, that
    // could reopen the build-from-zero question; until then, it stays off.
    capabilities: ['stakeholder', 'live-ops', 'research'],
    priority: 'P0',
    dateStart: '2026-07-20',
    dateEnd: '2026-08-15',
    // Deliberately reduced for confidentiality, per instruction. This is
    // not a discovery gap — do not restore prior detail (media/security/
    // standby-support escalation, named individuals, or how escalation to
    // security worked) and do not expand this back out. This is the final
    // public version of this content, not a draft awaiting more detail.
    situation: [
      'The Situation Room ran as a designed operation with a defined command structure, a fixed reporting chain from the field to the desk, and a severity classification applied to every issue raised.',
      'Agents were assigned to specific LGAs, so reports from within the same territory rarely conflicted.',
      'I supervised a cluster of LGA desks inside that structure across a four-week run-up and through election day.',
    ],
    missing: [
      'The framework existed on paper before the field network did.',
      'Verified field contacts, end-to-end collation testing and a proven fallback for technical failure were all specified but not yet exercised.',
    ],
    built: [
      'A verified contact network across assigned LGAs, with redundancy at every level so a single unreachable contact never blacked out a unit.',
      'Desk-level reporting discipline: a standard log format capturing time, location, source, verification status, action owner and current status, so any report could be picked up mid-shift by someone who had not taken the call.',
      'Documentation oversight paired to named supervisors by area, briefed individually rather than collectively, so accountability sat with a person rather than a rota.',
      'Collation and reporting readiness tests run ahead of go-live, so failures surfaced before election day rather than during it.',
    ],
    decisions: [
      'Verification before escalation, with an immediate-escalation rule for serious issues. Those pull against each other under time pressure; the standing choice was to confirm through a second source before escalating, accepting delay as the cost of not acting on an unconfirmed report.',
      'Where a contact could not be reached, reporting fell back to the next level up the chain. That preserved coverage but reduced granularity, and the trade-off was made explicitly rather than by default.',
    ],
    outcome: [],
    metrics: [],
    artifacts: [],
  },
  {
    slug: 'africa-infrastructure-roundtable',
    title: 'Africa Infrastructure Roundtable, Manchester 2026 → London 2027 pipeline',
    org: 'Langovest',
    domain: 'infrastructure',
    capabilities: ['delivery', 'stakeholder', 'live-ops'],
    priority: 'P0',
    // Corrected against the CV: her Langovest role ("Project Manager and
    // Coordinator") ran March 2026 - August 2026 — that's the actual
    // engagement period, and what these dates now represent. "London 2027"
    // in the title is the pipeline's target date, which she scoped and
    // built during this window — it isn't when her employment ran, and the
    // two shouldn't be conflated just because the title names both years.
    dateStart: '2026-03',
    dateEnd: '2026-08',
    situation: [
      'I managed the Africa Infrastructure Roundtable\'s Manchester Edition end-to-end across UK and Nigeria stakeholders, as part of my Project Manager and Coordinator role at Langovest.',
    ],
    missing: [
      // Direct entailment of the CV's own verbs ("scoped and built the...
      // pipeline") — you don't scope and build a framework that already
      // exists. Not an inference beyond what the CV states about this
      // specific piece of the engagement.
      'The London 2027 Edition had no engagement framework yet — that needed to be scoped and built following the Manchester Edition.',
    ],
    built: [
      'Managed the Manchester Edition end-to-end across UK and Nigeria stakeholders, then scoped and built the London 2027 Edition\'s pipeline around a five-university engagement framework covering UCL, Imperial College London, Brunel, SOAS and UniLAG.',
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
    org: 'Lodgr', // resolved: the CV names it directly, same pattern as Boldtron/Calnita
    domain: 'hospitality',
    capabilities: ['build-from-zero', 'delivery', 'research'],
    priority: 'P0',
    // Corrected against the CV: this ran during her "Independent Project
    // Manager (Contract), Remote, EMEA" period, September 2025 - March
    // 2026. The CV doesn't say which weeks within that window belonged to
    // Lodgr specifically (she ran Lodgr, Boldtron, and other engagements
    // concurrently in this role), so these are the real bounding dates, not
    // a precise start/end for this engagement alone.
    dateStart: '2025-09',
    dateEnd: '2026-03',
    situation: [
      'Lodgr was an apartment and hotel booking platform I took on during my Independent Project Manager contract (remote, EMEA) — the work began at scoping, turning booking, availability and payment requirements into user stories and sprint plans for the engineering team.',
      '[NEEDS INPUT: did Lodgr already have a product built before this engagement — a concept, a prototype, paying customers — or was this a zero-to-one build, and roughly how large was the team?]',
    ],
    missing: [
      // CV states this generally for the contract's clients, not Lodgr by
      // name specifically — but Lodgr is a named engagement inside that
      // same contract period, so this applies directly, not by inference.
      'There was no existing project management function at Lodgr before this engagement — no project plans, schedules, resource allocations, risk registers or change-request handling.',
    ],
    built: [
      'Took Lodgr from scoping through release and post-launch review, turning booking, availability and payment requirements into user stories and sprint plans for the engineering team.',
      'Introduced the project plans, schedules, resource allocations, risk registers and change-request handling Lodgr didn\'t have before, and set the reporting sequence that kept the team and stakeholders aligned.',
      '[NEEDS INPUT: what research did I conduct for Lodgr specifically, and what method — user interviews, competitive analysis, usability testing?]',
    ],
    decisions: [
      '[NEEDS INPUT: what was a real scope trade-off I made on Lodgr — a feature cut, a timeline compromise, a build-vs-buy call — and what was given up?]',
      '[NEEDS INPUT: did I make a call between speed to launch and thoroughness of testing or research on Lodgr? What did that cost?]',
      '[NEEDS INPUT: was there a disagreement with stakeholders or the team about direction on Lodgr, and how was it resolved?]',
    ],
    outcome: [
      { text: '[NEEDS INPUT: what was the actual result of the launch — on time, delayed, and against what commitment?]', status: '[NEEDS INPUT: green/amber/red]' },
      { text: '[NEEDS INPUT: what did the post-launch review find, and what happened as a result of it?]', status: '[NEEDS INPUT: green/amber/red]' },
    ],
    // No headline number for Lodgr specifically in the CV (the 95%/25%/15%
    // figures all belong to other named engagements) — empty rather than
    // an invented placeholder, per this file's own convention (see header).
    metrics: [],
    artifacts: [
      '[NEEDS INPUT: a redacted/reconstructed requirements brief or scoping document from this engagement]',
      '[NEEDS INPUT: a redacted/reconstructed launch checklist or post-launch review template]',
    ],
  },
  {
    slug: 'langovest-volunteer-network',
    title: 'Langovest Volunteer Network',
    org: 'Langovest',
    domain: 'infrastructure',
    capabilities: ['build-from-zero', 'stakeholder'],
    priority: 'P0',
    // Corrected against the CV: her Langovest role ran March 2026 - August
    // 2026. The network reached 12 volunteers "within 4 months" per the CV,
    // which fits inside this window but doesn't pin down which 4 months
    // exactly — that precision is still unconfirmed.
    dateStart: '2026-03',
    dateEnd: '2026-08',
    situation: [
      'Before this, Langovest had no volunteer network — I was building the Langovest Volunteer Network from zero, as part of my Project Manager and Coordinator role.',
    ],
    missing: [
      'There was no volunteer network, and no onboarding, application-response or coordination system to run one.',
    ],
    built: [
      'Designed the onboarding, application-response and coordination systems that took the network to 12 active volunteers within 4 months, across the UK, Canada, Nigeria and a few other African countries.',
    ],
    decisions: [
      '[NEEDS INPUT: 2–3 real decision forks and what was traded off]',
    ],
    // Framed green: the CV states this growth as an achieved result, not a
    // recovery from a constraint or an open question — see the hard limit
    // on decisions/metrics-method, which this outcome statement doesn't
    // touch (it restates a number the CV already gives, nothing inferred).
    outcome: [
      { text: 'The network grew from 0 to 12 active volunteers within 4 months, across the UK, Canada, Nigeria and a few other African countries.', status: 'green' },
    ],
    metrics: [
      { value: '0 → 12', label: 'active volunteers across 4 countries', method: '[NEEDS INPUT: how "volunteer" was counted — e.g. active vs. onboarded — and the exact 4-month window, per R2]' },
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
    dateStart: '2026-02-19',
    dateEnd: '2026-02-20',
    situation: [
      'The Osun Tech Festival needed to reach delivery on 19–20 February 2026, on a single-month lead time.',
    ],
    missing: [
      '[NEEDS INPUT: the specific structural absence]',
    ],
    built: [
      'Owned speaker coordination, vendor contracts, venue logistics and volunteer deployment to bring the festival to delivery on that lead time, then ran the post-event programme through follow-up engagement and partner debriefs after it closed.',
    ],
    decisions: [
      '[NEEDS INPUT: 2–3 real decision forks and what was traded off, given the one-month lead time]',
    ],
    // Green matches the RAG definition directly: delivered on the
    // committed date. The CV states the festival reached delivery on the
    // named dates against the named lead time — no inference beyond that.
    outcome: [
      { text: 'The festival was delivered as planned on 19–20 February 2026, on a single-month lead time.', status: 'green' },
    ],
    metrics: [],
    artifacts: [
      '[NEEDS INPUT: a redacted/reconstructed artifact — e.g. run-of-show sheet]',
    ],
  },
  {
    slug: 'langovest-website-redesign',
    title: 'Langovest website redesign',
    org: 'Langovest',
    domain: 'devinfra',
    capabilities: ['delivery', 'research'],
    priority: 'P0',
    dateStart: '2026-03', // corrected against the CV: her Langovest role's actual dates
    dateEnd: '2026-08',
    situation: [
      'I ran the Langovest website redesign across design and engineering, as part of my Project Manager and Coordinator role.',
    ],
    missing: [
      // Direct entailment: you can't "remove" ambiguity that wasn't there.
      'Upstream project briefs weren\'t removing requirement ambiguity for the software team before this delivery structure was in place.',
    ],
    built: [
      'Ran the delivery lifecycle in Trello, and structured upstream project briefs that removed requirement ambiguity for the software team, holding 95% of tickets to schedule.',
    ],
    decisions: [
      '[NEEDS INPUT: 2–3 real decision forks and what was traded off]',
    ],
    outcome: [
      { text: 'The redesign was delivered across design and engineering, holding 95% of tickets to schedule.', status: 'green' },
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
    // Corrected against the CV: same Independent PM contract period as
    // Lodgr, September 2025 - March 2026 — the real bounding dates, not a
    // precise start/end for Boldtron specifically within that window.
    dateStart: '2025-09',
    dateEnd: '2026-03',
    situation: [
      'Boldtron was a marketplace app I owned delivery for during my Independent Project Manager contract, directing design, development and QA through the release cycle for a fully remote team.',
    ],
    missing: [
      // "no existing project management function" is stated directly by
      // the CV for this contract's clients; Boldtron is a named engagement
      // inside that same contract. "No single point of accountability" is
      // a direct entailment of the CV's own phrasing — she became THE
      // point of accountability, which is the role being filled, not
      // inferred detail about who held it before.
      'There was no existing project management function at Boldtron before this engagement, and no single point of accountability for the remote team\'s delivery.',
    ],
    built: [
      'Directed design, development and QA through the release cycle, set roadmap and dependency decisions, and managed stakeholders as the point of accountability for the fully remote team.',
      'Introduced the project plans, schedules, resource allocations, risk registers and change-request handling the engagement didn\'t have before.',
    ],
    // "Setting roadmap and dependency decisions" (built[0] above) is a
    // process description — what the role involved — not a stated
    // trade-off. Per instruction, that distinction holds even though it's
    // tempting to read one into the other; this block stays open.
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
    // Replaces the removed "fintech-sponsorship-pipeline" case (Ayomide's
    // instruction — removed entirely, not merged). Fintech now rests on
    // this single case. Facts below are sourced directly from the CV; no
    // discovery pass has been done, so the six blocks are open questions,
    // not drafted narrative.
    slug: 'lendsqr-product-operations',
    title: 'Product operations — Lendsqr',
    org: 'Lendsqr',
    entityLine: 'Product Operations Officer, Lendsqr — August to September 2025.',
    domain: 'fintech',
    capabilities: ['research', 'stakeholder'],
    priority: 'P1',
    dateStart: '2025-08',
    dateEnd: '2025-09',
    situation: [
      '[NEEDS INPUT: 2–3 sentences on what existed at Lendsqr when I joined as Product Operations Officer]',
    ],
    missing: [
      '[NEEDS INPUT: the specific structural or process absence I stepped into]',
    ],
    built: [
      'Managed customer enquiries and collaborated with the product team to resolve technical issues, working toward a seamless user experience.',
      'Supported the development and continuous improvement of product documentation, knowledge bases and user resources.',
      'Tracked and analysed product usage trends to identify process gaps and inform product improvement initiatives.',
    ],
    decisions: [
      '[NEEDS INPUT: 2–3 real decision forks and what was traded off]',
    ],
    outcome: [
      { text: '[NEEDS INPUT: outcome statement — what resulted from the usage-trend analysis or the technical-issue resolution work]', status: '[NEEDS INPUT: green/amber/red]' },
    ],
    metrics: [],
    artifacts: [
      '[NEEDS INPUT: a redacted/reconstructed artifact — e.g. a usage-trend report format, an issue-triage log]',
    ],
  },
  {
    // Split from the original merged "hostmeng-calnita-product-work" case per
    // instruction: different employers, different domains. Domain and
    // capabilities confirmed. The "research" tag here is market-trend and
    // feedback analysis — a different flavour of research from Calnita's
    // user research below; both are real, per instruction.
    slug: 'hostmeng-clea-pushbio',
    title: 'Clea and Pushbio Project Management',
    org: 'HostMeNG',
    domain: 'devinfra',
    capabilities: ['delivery', 'research'],
    priority: 'P1',
    dateStart: '2024-07',
    dateEnd: '2025-01', // resolved from the CV: "Technical Project Manager, HostMeNG, July 2024 - January 2025"
    situation: [
      'The role spanned a cross-functional team across multiple countries, working with developers, designers, website managers and other stakeholders to deliver web hosting services.',
      '[NEEDS INPUT: what specifically existed for Clea and Pushbio when I arrived — what was the product state before my enhancements?]',
    ],
    missing: [
      '[NEEDS INPUT: the specific structural absence]',
    ],
    built: [
      'Led product enhancements for Clea and Pushbio through iterative feedback integration and market-trend analysis, increasing user retention by 15%.',
      'Collaborated with developers, designers, website managers and other stakeholders to optimise processes and deliver the web hosting service.',
    ],
    decisions: [
      '[NEEDS INPUT: 2–3 real decision forks and what was traded off]',
    ],
    outcome: [
      { text: 'User retention on Clea and Pushbio increased by 15% through this work.', status: 'green' },
    ],
    metrics: [
      { value: '+15%', label: 'retention on Clea and Pushbio', method: '[NEEDS INPUT: retention measured how — which user cohort, what tool or report, over what period? The CV names the driving method (iterative feedback integration and market-trend analysis, now in built[]) but not the measurement mechanics.]' },
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
    title: 'Calnita MVP',
    org: 'Calnita',
    domain: 'consumer',
    capabilities: ['delivery', 'research'],
    priority: 'P1',
    dateStart: '2023-06', // resolved from the CV: "Project Manager, Calnita, June 2023 – March 2024"
    dateEnd: '2024-03',
    situation: [
      'The role directed collaboration across product development, marketing and engineering departments.',
      '[NEEDS INPUT: what specifically existed for the beauty-discovery product when I arrived?]',
    ],
    missing: [
      '[NEEDS INPUT: the specific structural absence]',
    ],
    built: [
      'User research initiatives conducted with marketing and engineering teams, identifying unmet needs that shaped the product roadmap.',
      'Data-backed prioritisation of MVP scope and sequencing, which drove the on-time delivery result below.',
      '[NEEDS INPUT: what research method was used for the user research — surveys, interviews, usability testing — and what cadence?]',
    ],
    decisions: [
      '[NEEDS INPUT: 2–3 real decision forks and what was traded off]',
    ],
    outcome: [
      { text: '3 MVPs for hyper-personalised beauty discovery features launched, achieving key project milestones and 90% on-time delivery.', status: 'green' },
    ],
    metrics: [
      { value: '90%', label: 'of 3 beauty MVPs shipped on-time', method: '[NEEDS INPUT: "on-time" against what committed dates, and what counted as the 10% that was not? The CV names the driving method (data-backed prioritisation, now in built[]) but not the measurement mechanics.]' },
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
    dateStart: '2026', // year confirmed per instruction; month/day still unconfirmed
    dateEnd: '2026',
    situation: [
      '[NEEDS INPUT: 2–3 sentences on what existed before Frobits — this is my own product, so this should describe the problem I set out to solve]',
    ],
    missing: [
      '[NEEDS INPUT: the specific structural absence]',
    ],
    built: [
      '[NEEDS INPUT: what I built end-to-end — WRD names writing the PRD, building the prototype, and deploying the backend as the differentiator here; confirm the specifics]',
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
  {
    // New case, per instruction: the earliest role on the CV, previously
    // only referenced in /about's "Before product" narrative and its own
    // Experience section, not represented in the Coverage Matrix at all.
    // health-research is a new domain — see DOMAINS above, deliberately
    // placed last since this is a single, standalone case for it.
    slug: 'fmc-clinical-research',
    title: 'Clinical research coordination — Federal Medical Centre, Ogun State',
    org: 'Federal Medical Centre, Ogun State',
    domain: 'health-research',
    capabilities: ['stakeholder', 'research'],
    priority: 'P1',
    dateStart: '2022-09',
    dateEnd: '2023-06',
    situation: [
      'I was Project Manager for clinical research projects at the Federal Medical Centre, Ogun State, working with investigators and research teams on compliance and project execution.',
    ],
    missing: [
      '[NEEDS INPUT: the specific structural absence]',
    ],
    built: [
      'Assisted in the recruitment of investigators and collected the documentation research projects needed for compliance and execution.',
      'Conducted in-depth research and reviews of current literature on relevant medical topics, to keep project strategies and decisions informed by the latest developments.',
      'Tracked and coordinated data collection processes — accurate, timely data gathering and follow-up visits — to keep research findings continuous and complete.',
    ],
    decisions: [
      '[NEEDS INPUT: 2–3 real decision forks and what was traded off]',
    ],
    outcome: [
      { text: '[NEEDS INPUT: outcome statement]', status: '[NEEDS INPUT: green/amber/red]' },
    ],
    // No headline number for this role in the CV — empty rather than an
    // invented placeholder, per this file's own convention.
    metrics: [],
    artifacts: [
      '[NEEDS INPUT: a redacted/reconstructed artifact — e.g. a compliance documentation checklist, a literature review summary format]',
    ],
  },
];
