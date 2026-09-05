// Pure helpers shared by every script/page that reads a case object —
// nothing here is specific to any one screen. Was js/matrix.js until the
// Coverage Matrix was retired; the matrix-only functions (computeSegments,
// assignLanes, buildMatrixModel, CAPABILITY_TICK) went with it, but these
// three are still load-bearing for scripts/build-case-pages.mjs,
// scripts/build-noscript.mjs, and scripts/build-og-images.mjs.

const NEEDS_INPUT_PREFIX = '[NEEDS INPUT';

// Deliberately checks anywhere in the string, not just at the start.
// Content should never embed a marker mid-sentence (the convention is one
// array entry per real sentence OR per open question, never both in one
// string), but this is the guard's last line of defence if that convention
// slips — a mid-string marker still gets caught here even if it can't be
// cleanly extracted for display.
export function isNeedsInput(value) {
  return typeof value === 'string' && value.includes(NEEDS_INPUT_PREFIX);
}

// Falls back to the case title (always real) when org isn't confirmed yet,
// rather than ever rendering a raw "[NEEDS INPUT: ...]" string on the page.
export function displayLabel(caseObj) {
  if (!isNeedsInput(caseObj.org)) return caseObj.org;
  const [firstPart] = caseObj.title.split(/\s+—\s+/);
  return firstPart || caseObj.title;
}

function parseYear(dateStr) {
  if (!dateStr || isNeedsInput(dateStr)) return null;
  const match = /^(\d{4})/.exec(dateStr);
  return match ? match[1] : null;
}

// Never fabricates a date: only ever shows years that are actually present
// in the data. Returns null (render nothing) when both ends are unknown.
export function displayDateRange(caseObj) {
  const start = parseYear(caseObj.dateStart);
  const end = parseYear(caseObj.dateEnd);
  if (start && end) return start === end ? start : `${start} → ${end}`;
  if (start) return `${start} →`;
  if (end) return `→ ${end}`;
  return null;
}
