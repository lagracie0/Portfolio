// Generates real OG images (1200x630 PNG) for every page and case, using
// the site's actual fonts and palette via a headless-browser screenshot —
// not a placeholder, and not requiring an image library. Run:
//   node scripts/build-og-images.mjs
// Requires the `playwright` package and a downloaded Chromium (dev-only
// dependency for this script; the site itself ships zero runtime deps).

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { chromium } from 'playwright';
import { DOMAINS, CASES } from '../data/cases.js';
import { isNeedsInput } from '../js/case-utils.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT_DIR = join(ROOT, 'assets', 'og');
const domainLabel = new Map(DOMAINS.map((d) => [d.slug, d.label]));

function b64(relPath) {
  return readFileSync(join(ROOT, relPath)).toString('base64');
}

const FONTS = {
  archivo: b64('fonts/archivo-black-expanded.woff2'),
  mono: b64('fonts/jetbrains-mono-bold.woff2'),
};

function templateHtml({ eyebrow, title }) {
  return `<!doctype html>
<html><head><meta charset="utf-8"><style>
@font-face { font-family: 'Archivo'; src: url(data:font/woff2;base64,${FONTS.archivo}) format('woff2'); font-weight: 900; }
@font-face { font-family: 'Mono'; src: url(data:font/woff2;base64,${FONTS.mono}) format('woff2'); font-weight: 700; }
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  width: 1200px; height: 630px;
  background: #14171A;
  display: flex; flex-direction: column; justify-content: center;
  padding: 80px;
}
.eyebrow {
  font-family: 'Mono', monospace;
  font-weight: 700;
  font-size: 22px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #8A9099;
  margin-bottom: 28px;
}
h1 {
  font-family: 'Archivo', sans-serif;
  font-weight: 900;
  font-size: 64px;
  line-height: 1.08;
  letter-spacing: -0.01em;
  color: #EFF1EE;
  max-width: 1000px;
}
.footer {
  position: absolute;
  bottom: 60px;
  left: 80px;
  font-family: 'Mono', monospace;
  font-weight: 700;
  font-size: 20px;
  letter-spacing: 0.04em;
  color: #5B6169;
}
</style></head>
<body>
  <p class="eyebrow">${eyebrow}</p>
  <h1>${title}</h1>
  <p class="footer">AYOMIDE GRACE AMUSAN</p>
</body></html>`;
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

async function run() {
  mkdirSync(OUT_DIR, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });

  const targets = [
    { slug: 'home', eyebrow: 'Portfolio', title: 'She goes into unstructured environments and builds the delivery system.' },
    { slug: 'work', eyebrow: 'Work', title: 'Every case, filterable by domain and by capability.' },
    { slug: 'about', eyebrow: 'About', title: 'Before product, there was a review committee.' },
    { slug: 'contact', eyebrow: 'Contact', title: "Open to employment and contract work." },
    { slug: 'method', eyebrow: 'Method', title: 'The operating system behind the case studies.' },
    ...CASES.map((c) => ({
      slug: c.slug,
      eyebrow: domainLabel.get(c.domain) || c.domain,
      title: c.title,
    })),
  ];

  for (const t of targets) {
    await page.setContent(templateHtml({ eyebrow: escapeHtml(t.eyebrow), title: escapeHtml(t.title) }));
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(50);
    await page.screenshot({ path: join(OUT_DIR, `${t.slug}.png`) });
  }

  await browser.close();
  console.log(`Generated ${targets.length} OG images in assets/og/.`);
}

run();
