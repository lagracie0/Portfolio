// Generates static work/{slug}/index.html for every case in data/cases.js.
// Run: node scripts/build-case-pages.mjs
//
// Every case gets a page, P0 or P1 — a case with any remaining
// [NEEDS INPUT: ...] renders with a loud, unmissable flag (see
// css/case.css .needs-input) and a draft banner, so an unfinished page can
// never be mistaken for finished copy. This applies identically regardless
// of priority: a P0 case with open items used to be refused outright (no
// page written for it at all), back when the retired Coverage Matrix
// linked to every case — a matrix bar pointing at a 404 is worse than a
// visibly unfinished page, since a 404 gives a visitor no information and
// a draft banner gives them the truth. The guard still blocks a deploy:
// the script exits non-zero and prints every P0 case with open items and
// exactly what's missing, so an unfinished P0 case can't ship silently —
// it just isn't a 404 while it's being worked on.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DOMAINS, CAPABILITIES, CASES } from '../data/cases.js';
import { isNeedsInput, displayLabel, displayDateRange } from '../js/case-utils.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// Never derives meta description / JSON-LD from anything that could carry
// [NEEDS INPUT] text or stale removed detail — always pulls fresh from the
// case's own current situation[]/entityLine, so a confidentiality edit like
// C1's automatically propagates to metadata too, rather than needing a
// second place to remember to update.
function metaDescriptionFor(caseObj) {
  const realSituation = caseObj.situation.find((s) => typeof s === 'string' && !isNeedsInput(s));
  if (realSituation) return realSituation;
  if (caseObj.entityLine && !isNeedsInput(caseObj.entityLine)) return caseObj.entityLine;
  return `${caseObj.title} — a case study from Ayomide Grace Amusan's portfolio.`;
}

const domainLabel = new Map(DOMAINS.map((d) => [d.slug, d.label]));
const capabilityLabel = new Map(CAPABILITIES.map((c) => [c.slug, c.label]));

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Walks every string in a case object and collects every [NEEDS INPUT: ...]
// found, with a field path, so the refusal message names exactly what's
// missing rather than just "this case isn't done."
function collectNeedsInput(value, path, out) {
  if (typeof value === 'string') {
    if (isNeedsInput(value)) out.push({ path, text: value });
  } else if (Array.isArray(value)) {
    value.forEach((item, i) => collectNeedsInput(item, `${path}[${i}]`, out));
  } else if (value && typeof value === 'object') {
    Object.entries(value).forEach(([key, v]) => collectNeedsInput(v, path ? `${path}.${key}` : key, out));
  }
  return out;
}

// Renders a string as plain escaped text, or — if it's an open question —
// as a loud, unmissable flag. Never renders the raw brackets as if they
// were normal copy.
function renderText(value) {
  if (isNeedsInput(value)) {
    const question = value.replace(/^\[NEEDS INPUT:\s*/, '').replace(/\]$/, '');
    return `<span class="needs-input">${escapeHtml(question)}</span>`;
  }
  return escapeHtml(value);
}

function renderParagraphs(entries) {
  return entries.map((e) => `<p>${renderText(e)}</p>`).join('\n');
}

function renderList(entries) {
  return `<ul class="plain-list">\n${entries.map((e) => `  <li>${renderText(e)}</li>`).join('\n')}\n</ul>`;
}

function renderOutcome(entries) {
  return entries.map(({ text, status }) => {
    const known = ['green', 'amber', 'red'].includes(status);
    const badge = known
      ? `<span class="rag-badge ${status}">${status}</span>`
      : `<span class="rag-badge unknown">${renderText(status)}</span>`;
    return `<div class="outcome-item">${badge}<p>${renderText(text)}</p></div>`;
  }).join('\n');
}

function renderMetrics(entries) {
  if (entries.length === 0) return '';
  return entries.map(({ value, label, method }) => `
    <div class="metric">
      <span class="metric-value">${renderText(value)}</span>
      <span class="metric-label">${renderText(label)}</span>
      <span class="metric-method">${renderText(method)}</span>
    </div>`).join('\n');
}

function renderArtifacts(entries) {
  return `<ul class="artifact-list">\n${entries.map((e) => `  <li>${renderText(e)}</li>`).join('\n')}\n</ul>`;
}

function findAdjacent(caseObj, direction) {
  const idx = CASES.indexOf(caseObj);
  for (let step = 1; step <= CASES.length; step++) {
    const i = (idx + direction * step + CASES.length * 2) % CASES.length;
    if (CASES[i].domain !== caseObj.domain) return CASES[i];
  }
  return null;
}

function pageForCase(caseObj, hasOpenItems) {
  const domain = domainLabel.get(caseObj.domain) || caseObj.domain;
  const capNames = caseObj.capabilities.map((s) => capabilityLabel.get(s) || s);
  const dateText = displayDateRange(caseObj);
  const byline = caseObj.entityLine
    ? renderText(caseObj.entityLine)
    : `${renderText(displayLabel(caseObj))}${dateText ? ' · ' + escapeHtml(dateText) : ''}`;

  const prev = findAdjacent(caseObj, -1);
  const next = findAdjacent(caseObj, 1);

  const metaDescription = metaDescriptionFor(caseObj);
  const hasRealDates = !isNeedsInput(caseObj.dateStart) && !isNeedsInput(caseObj.dateEnd);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: caseObj.title,
    description: metaDescription,
    about: domain,
    keywords: capNames.join(', '),
    creator: { '@type': 'Person', name: 'Ayomide Grace Amusan' },
    ...(hasRealDates ? { temporalCoverage: `${caseObj.dateStart}/${caseObj.dateEnd}` } : {}),
  };

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(caseObj.title)} — Ayomide Grace Amusan</title>
<meta name="description" content="${escapeHtml(metaDescription)}">
<link rel="icon" type="image/svg+xml" href="../../assets/favicon.svg">
<link rel="preload" as="font" type="font/woff2" href="../../fonts/archivo-black-expanded.woff2" crossorigin>
<link rel="preload" as="font" type="font/woff2" href="../../fonts/jetbrains-mono-regular.woff2" crossorigin>
<link rel="preload" as="font" type="font/woff2" href="../../fonts/jetbrains-mono-bold.woff2" crossorigin>
<link rel="preload" as="font" type="font/woff2" href="../../fonts/source-serif-4-regular.woff2" crossorigin>
<link rel="preload" as="font" type="font/woff2" href="../../fonts/source-serif-4-italic.woff2" crossorigin>
<link rel="stylesheet" href="../../css/tokens.css">
<link rel="stylesheet" href="../../css/home.css">
<link rel="stylesheet" href="../../css/case.css">
<meta property="og:title" content="${escapeHtml(caseObj.title)}">
<meta property="og:description" content="${escapeHtml(metaDescription)}">
<meta property="og:image" content="../../assets/og/${caseObj.slug}.png">
<meta property="og:type" content="article">
<script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2)}
</script>
</head>
<body>

<a class="skip-link" href="#main">Skip to content</a>

${hasOpenItems ? '<div class="draft-banner">Draft — contains placeholder content, not for publication</div>' : ''}

<header class="site-header">
  <a class="wordmark" href="../../">Ayomide Amusan</a>
  <nav aria-label="Primary">
    <a href="../../work/">Work</a>
    <a href="../../method/">Method</a>
    <a href="../../about/">About</a>
    <a class="cv-link" href="../../assets/cv/ayomide-amusan-cv.pdf">Download CV</a>
  </nav>
</header>

<main id="main">
  <header class="case-header">
    <p class="case-domain">${escapeHtml(domain)}</p>
    <h1>${escapeHtml(caseObj.title)}</h1>
    <p class="entity-line">${byline}</p>
    <ul class="card-tags">
      ${capNames.map((c) => `<li>${escapeHtml(c)}</li>`).join('\n      ')}
    </ul>
  </header>

  <div class="case-body">
    <section class="case-block">
      <h2>Situation</h2>
      ${renderParagraphs(caseObj.situation)}
    </section>

    <section class="case-block">
      <h2>What was missing</h2>
      ${renderParagraphs(caseObj.missing)}
    </section>

    <section class="case-block">
      <h2>What I built</h2>
      ${renderList(caseObj.built)}
    </section>

    <section class="case-block">
      <h2>Decisions and trade-offs</h2>
      ${renderList(caseObj.decisions)}
    </section>

    ${caseObj.outcome.length > 0 || caseObj.metrics.length > 0 ? `<section class="case-block">
      <h2>Outcome</h2>
      ${renderOutcome(caseObj.outcome)}
      ${renderMetrics(caseObj.metrics)}
    </section>` : ''}

    ${caseObj.artifacts.length > 0 ? `<section class="case-block">
      <h2>Artifacts</h2>
      ${renderArtifacts(caseObj.artifacts)}
    </section>` : ''}
  </div>

  <nav class="case-nav" aria-label="Other cases">
    ${prev ? `<a class="prev-case" href="../${prev.slug}/"><span class="nav-label">Previous — ${escapeHtml(domainLabel.get(prev.domain))}</span><span class="nav-title">${escapeHtml(prev.title)}</span></a>` : '<span></span>'}
    ${next ? `<a class="next-case" href="../${next.slug}/"><span class="nav-label">Next — ${escapeHtml(domainLabel.get(next.domain))}</span><span class="nav-title">${escapeHtml(next.title)}</span></a>` : ''}
  </nav>
</main>

<footer class="site-footer">
  <span>&copy; Ayomide Grace Amusan</span>
  <a href="../../contact/">Contact</a>
  <a href="../../assets/cv/ayomide-amusan-cv.pdf">Download CV</a>
</footer>

</body>
</html>
`;
}

// Per-capability domain coverage, with single-case dependencies flagged.
// Runs on every build, not on request — a domain's only case for a given
// capability can lose that tag in an ordinary content edit (it happened to
// Civic x Build-from-zero the same week this check was written), quietly
// weakening the breadth-of-evidence argument the whole site is making.
// Printing this every time means that's visible immediately, not only when
// someone thinks to ask — this outlived the Coverage Matrix that motivated
// it because the underlying coverage question is still real without it.
function printCoverageReport() {
  console.log('\nCapability coverage by domain (single-case dependencies flagged):');
  CAPABILITIES.forEach((cap) => {
    const casesWithCap = CASES.filter((c) => c.capabilities.includes(cap.slug));
    const byDomain = new Map();
    casesWithCap.forEach((c) => {
      if (!byDomain.has(c.domain)) byDomain.set(c.domain, []);
      byDomain.get(c.domain).push(c.slug);
    });
    console.log(`\n  ${cap.label} — ${byDomain.size} domain(s):`);
    for (const [domainSlug, slugs] of byDomain) {
      const domainLabel = DOMAINS.find((d) => d.slug === domainSlug)?.label || domainSlug;
      const flag = slugs.length === 1 ? '  <-- single case' : '';
      console.log(`    ${domainLabel}: ${slugs.join(', ')}${flag}`);
    }
  });
  console.log('');
}

function run() {
  printCoverageReport();

  const generated = [];
  const incompleteP0 = [];

  CASES.forEach((caseObj) => {
    const openItems = collectNeedsInput(caseObj, '', []);
    const hasOpenItems = openItems.length > 0;

    if (caseObj.priority === 'P0' && hasOpenItems) {
      incompleteP0.push({ slug: caseObj.slug, openItems });
    }

    const dir = join(ROOT, 'work', caseObj.slug);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'index.html'), pageForCase(caseObj, hasOpenItems));
    generated.push({ slug: caseObj.slug, priority: caseObj.priority, draft: hasOpenItems });
  });

  console.log(`\nGenerated ${generated.length} of ${CASES.length} case pages:`);
  generated.forEach((g) => console.log(`  ${g.draft ? '(draft)' : '(complete)'} work/${g.slug}/ — ${g.priority}`));

  if (incompleteP0.length > 0) {
    console.log(`\nBLOCKING — ${incompleteP0.length} P0 case(s) generated as drafts, not deploy-ready (still contain [NEEDS INPUT]):`);
    incompleteP0.forEach(({ slug, openItems }) => {
      console.log(`\n  ${slug} — ${openItems.length} open item(s):`);
      openItems.forEach(({ path, text }) => console.log(`    - ${path}: ${text}`));
    });
    console.log('\nPages were written with a draft banner so no case links to a 404, but this build does not clear the deploy gate. Resolve the items above.\n');
    process.exitCode = 1;
  } else {
    console.log('\nNo incomplete P0 cases.\n');
  }
}

run();
