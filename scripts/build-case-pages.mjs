// Generates static work/{slug}/index.html for every case in data/cases.js.
// Run: node scripts/build-case-pages.mjs
//
// Hard guard: a P0 case that still contains any [NEEDS INPUT: ...] anywhere
// in its data is refused — no page is written for it, and the script exits
// non-zero — so the site cannot publish placeholder content for a case
// meant to be launch-ready by accident. P1 cases are generated regardless,
// but any remaining [NEEDS INPUT] text renders with a loud, unmissable
// flag (see css/case.css .needs-input) and the page carries a draft banner,
// so an unfinished P1 page can never be mistaken for finished copy.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DOMAINS, CAPABILITIES, CASES } from '../data/cases.js';
import { isNeedsInput, displayLabel, displayDateRange } from '../js/matrix.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

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

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(caseObj.title)} — Ayomide Grace Amusan</title>
<link rel="icon" type="image/svg+xml" href="../../assets/favicon.svg">
<link rel="stylesheet" href="../../css/tokens.css">
<link rel="stylesheet" href="../../css/home.css">
<link rel="stylesheet" href="../../css/case.css">
</head>
<body>

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

    <section class="case-block">
      <h2>Outcome</h2>
      ${renderOutcome(caseObj.outcome)}
      ${renderMetrics(caseObj.metrics)}
    </section>

    <section class="case-block">
      <h2>Artifacts</h2>
      ${renderArtifacts(caseObj.artifacts)}
    </section>
  </div>

  <nav class="case-nav" aria-label="Other cases">
    ${prev ? `<a class="prev-case" href="../${prev.slug}/"><span class="nav-label">Previous — ${escapeHtml(domainLabel.get(prev.domain))}</span><span class="nav-title">${escapeHtml(prev.title)}</span></a>` : '<span></span>'}
    ${next ? `<a class="next-case" href="../${next.slug}/"><span class="nav-label">Next — ${escapeHtml(domainLabel.get(next.domain))}</span><span class="nav-title">${escapeHtml(next.title)}</span></a>` : ''}
  </nav>
</main>

<footer class="site-footer">
  <span>&copy; Ayomide Grace Amusan</span>
  <a href="../../assets/cv/ayomide-amusan-cv.pdf">Download CV</a>
</footer>

</body>
</html>
`;
}

function run() {
  const generated = [];
  const refused = [];

  CASES.forEach((caseObj) => {
    const openItems = collectNeedsInput(caseObj, '', []);
    const hasOpenItems = openItems.length > 0;

    if (caseObj.priority === 'P0' && hasOpenItems) {
      refused.push({ slug: caseObj.slug, openItems });
      return;
    }

    const dir = join(ROOT, 'work', caseObj.slug);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'index.html'), pageForCase(caseObj, hasOpenItems));
    generated.push({ slug: caseObj.slug, priority: caseObj.priority, draft: hasOpenItems });
  });

  console.log(`\nGenerated ${generated.length} of ${CASES.length} case pages:`);
  generated.forEach((g) => console.log(`  ${g.draft ? '(draft)' : '(complete)'} work/${g.slug}/ — ${g.priority}`));

  if (refused.length > 0) {
    console.log(`\nREFUSED — ${refused.length} P0 case(s) not generated (still contain [NEEDS INPUT]):`);
    refused.forEach(({ slug, openItems }) => {
      console.log(`\n  ${slug} — ${openItems.length} open item(s):`);
      openItems.forEach(({ path, text }) => console.log(`    - ${path}: ${text}`));
    });
    console.log('\nBuild did not publish these pages. Resolve the items above, or they stay unpublished.\n');
    process.exitCode = 1;
  } else {
    console.log('\nNo P0 refusals.\n');
  }
}

run();
