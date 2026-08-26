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
    // Real content below, from Ayomide's own written account. Everything not
    // explicitly stated by her is a literal open question, per rule R1. Per
    // her instruction: no colleague names (roles only), no reproduction of
    // the Lead's briefing as a site artifact, and nothing operationally
    // sensitive (security liaison arrangements, contact lists, anything
    // that maps the agent network by location). This page still needs her
    // sign-off before publication per R3, and the build guard independently
    // blocks it while open items remain below.
    situation: [
      'The Situation Room ran as a designed operation with a defined command structure: a Situation Room Lead, supervisors over LGA desks, desk officers taking field reports, and separate technical, logistics, media, security and incident functions, backed by a standby support group.',
      'Reports moved along a fixed chain from polling-unit agents through ward and LGA leads to the desk, and issues were classified Green, Amber or Red according to severity.',
      'Agents were each assigned to a specific LGA, so conflicting reports from within the same territory were rare.',
      'Some issues during the operation were escalated beyond the desk to the media, security and standby support functions.',
      'She supervised a cluster of LGA desks inside that structure across a four-week run-up and through election day.',
    ],
    missing: [
      'The framework existed on paper before the field network did.',
      'At the point supervisors took over, polling units did not yet have verified contacts, collation had not been tested end to end against live result uploads, and the fallback path for a failure of the app or the internet had been specified but not proven.',
      'The gap was between a designed system and one that had been exercised.',
    ],
    // built[] originally had a 5th item asking what she set up beyond the
    // briefing — a bare discovery question with no real content behind it,
    // not a refinement of something already stated. Closed out per
    // instruction: removed rather than left as an open question, since
    // there was genuinely nothing there yet.
    built: [
      'A verified contact network across assigned LGAs — two reliable contacts per polling unit and ward, each with a backup number, so a single unreachable agent never blacked out a unit.',
      'Desk-level reporting discipline: every issue logged with time, LGA, ward, polling unit, source, verification status, action owner and current status, so a report could be picked up mid-shift by someone who had not taken the call.',
      'Paired support supervisors onto documentation oversight at polling-unit and ward level, briefed individually rather than collectively, so accountability for result documentation sat with a named person per area.',
      'Ran collation and reporting readiness tests ahead of go-live, including integration against live result uploads, so failures surfaced before election day rather than during it.',
    ],
    // A third decision (two agents contradicting each other on the same
    // location) was dropped rather than answered: Ayomide's real answer was
    // that this rarely happened, because agents were each assigned a single
    // LGA (see situation[] above). Writing a decision narrative for a
    // scenario that didn't really occur would overstate it — the honest
    // version of that fact lives in situation[], not here.
    //
    // The two follow-up questions on cost (what the verification step cost,
    // what the ward/LGA fallback cost) were closed out as refinements, not
    // gaps — the decisions themselves are substantially told; what verifying
    // actually cost is a detail Ayomide can add later, not a missing fork.
    decisions: [
      'On several occasions, security reports came in from party agents at different polling units. The standard response was for the reporting agent to escalate to supervisors, who called ward agents to verify — only escalating to security once a report was confirmed true.',
      'On election day, some party agents at individual polling units could not be reached to confirm results at that level of detail. The room relied on ward agents and LGA-level party chairmen instead.',
    ],
    // outcome[] and metrics[] were both genuinely empty — no real figures
    // exist yet for coverage, verification rate, or on-schedule reporting.
    // An absent block is honest; a block of placeholder numbers is debt, so
    // both are empty arrays rather than open questions. Same for artifacts[]
    // below — no real artifact has been identified or redacted yet.
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
    // Year precision only, per instruction — matches what the title itself
    // already states (Manchester 2026, London 2027). Exact month/day still
    // unconfirmed.
    dateStart: '2026',
    dateEnd: '2027',
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
    dateStart: '2026', // year confirmed per instruction; month/day still unconfirmed
    dateEnd: '2026',
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
    // Year confirmed per instruction; the 4-month window within 2026 and
    // exact start/end dates are still unconfirmed.
    dateStart: '2026',
    dateEnd: '2026',
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
    dateStart: '2026', // year confirmed per instruction; month/day still unconfirmed
    dateEnd: '2026',
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
    dateStart: '2026', // year confirmed per instruction; month/day still unconfirmed
    dateEnd: '2026',
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
      '[NEEDS INPUT: 2–3 sentences on what existed at Lendsqr when she joined as Product Operations Officer]',
    ],
    missing: [
      '[NEEDS INPUT: the specific structural or process absence she stepped into]',
    ],
    built: [
      '[NEEDS INPUT: what she specifically built or introduced — e.g. a process for tracking usage trends, a system for triaging user-facing technical issues]',
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
    dateStart: '2024-07', // per your note; WRD open question 6 also gives "July 2024"
    dateEnd: '[NEEDS INPUT: engagement end date, or "ongoing"]',
    situation: [
      '[NEEDS INPUT: 2–3 sentences on what existed at HostMeNG when she arrived]',
    ],
    missing: [
      '[NEEDS INPUT: the specific structural absence]',
    ],
    built: [
      'Market-trend and feedback analysis work.',
      '[NEEDS INPUT: What was analysed, what method was used, and how did findings feed back into Clea/Pushbio decisions?]',
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
    title: 'Calnita MVP',
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
      'User research initiatives that directly shaped the product roadmap.',
      '[NEEDS INPUT: What method — surveys, interviews, usability testing — and what cadence?]',
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
    dateStart: '2026', // year confirmed per instruction; month/day still unconfirmed
    dateEnd: '2026',
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
