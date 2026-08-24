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

export const DOMAINS = [
  { slug: 'civic', label: 'Civic & elections' },
  { slug: 'infrastructure', label: 'Infrastructure & policy' },
  { slug: 'fintech', label: 'Fintech' },
  { slug: 'hospitality', label: 'Hospitality & travel' },
  { slug: 'consumer', label: 'Consumer & marketplaces' },
  { slug: 'events', label: 'Events & community' },
  { slug: 'devinfra', label: 'Developer / web infrastructure' },
];

export const CAPABILITIES = [
  { slug: 'build-from-zero', label: 'Build from zero' },
  { slug: 'delivery', label: 'Delivery & release' },
  { slug: 'stakeholder', label: 'Stakeholder / vendor' },
  { slug: 'live-ops', label: 'Live ops, fixed date' },
  { slug: 'research', label: 'Research & reporting' },
  { slug: 'ships-it-herself', label: 'Ships it herself' },
];

export const CASES = [
  {
    slug: 'situation-room-osun-election',
    title: 'Situation Room supervision — Osun governorship election',
    org: 'Accord Party',
    domain: 'civic',
    capabilities: ['live-ops', 'build-from-zero', 'stakeholder'],
    priority: 'P0',
    dateStart: '2026-07-20',
    dateEnd: '2026-08-15',
    situation: [
      '[NEEDS INPUT: 2–3 sentences on what existed in the Situation Room when she arrived — per WRD R3, keep this operational: incident intake, agent coordination, escalation, reporting against the fixed election date. No claim about the election or its outcome, no detail that could identify individual agents.]',
    ],
    missing: [
      '[NEEDS INPUT: the specific structural absence — e.g. no incident intake process, no escalation ladder, no reporting cadence — framed operationally per R3]',
    ],
    built: [
      '[NEEDS INPUT: the structures introduced — e.g. incident log format, escalation ladder, reporting cadence — named concretely]',
    ],
    decisions: [
      '[NEEDS INPUT: 2–3 real decision forks and what was traded off, framed operationally per R3]',
    ],
    outcome: [
      { text: '[NEEDS INPUT: outcome statement, framed operationally per R3. This page requires Ayomide\'s sign-off before publication.]', status: '[NEEDS INPUT: green/amber/red]' },
    ],
    metrics: [],
    artifacts: [
      '[NEEDS INPUT: a redacted/reconstructed artifact — e.g. incident log template, escalation ladder diagram — with no material that could identify individual agents]',
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
    situation: [
      '[NEEDS INPUT: 2–3 sentences on what existed when she arrived, from scoping through post-launch review]',
    ],
    missing: [
      '[NEEDS INPUT: the specific structural absence]',
    ],
    built: [
      '[NEEDS INPUT: the structures introduced — e.g. requirements process, launch plan, post-launch review format]',
    ],
    decisions: [
      '[NEEDS INPUT: 2–3 real decision forks and what was traded off]',
    ],
    outcome: [
      { text: '[NEEDS INPUT: outcome statement]', status: '[NEEDS INPUT: green/amber/red]' },
    ],
    metrics: [],
    artifacts: [
      '[NEEDS INPUT: a redacted/reconstructed artifact — e.g. requirements brief, launch checklist]',
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
