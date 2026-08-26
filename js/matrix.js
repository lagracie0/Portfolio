// Coverage Matrix — pure functions that turn DOMAINS/CAPABILITIES/CASES into
// the structure the home page renders. No DOM here, so the lane/segment/label
// rules can be reasoned about (and tested) independently of markup.

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

// Short codes for the tick shown on a case's non-label segments. Not an
// auto-truncation of the capability label — a checkmark reads as "verified"
// and a truncated label can be ambiguous ("Ships it..."), so these are
// deliberately chosen to be unambiguous at a glance and never confusable
// with a confirmation glyph.
export const CAPABILITY_TICK = {
  'build-from-zero': 'BFZ',
  stakeholder: 'STK',
  delivery: 'DEL',
  'live-ops': 'OPS',
  research: 'RES',
  'ships-it-herself': 'SHIP',
};

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

// Maps a case's capability slugs onto column indices (from CAPABILITIES'
// declared order — the axis is a single source of truth, never hardcoded
// here) and groups them into contiguous runs. A case with all capabilities
// adjacent produces exactly one segment; a case whose capabilities are split
// by capabilities it doesn't have produces one segment per contiguous run,
// joined by gaps.
export function computeSegments(caseObj, capabilityIndex) {
  const indices = caseObj.capabilities
    .map((slug) => capabilityIndex.get(slug))
    .filter((i) => i !== undefined)
    .sort((a, b) => a - b);

  const segments = [];
  let runStart = indices[0];
  let prev = indices[0];
  for (let i = 1; i <= indices.length; i++) {
    const current = indices[i];
    if (current === prev + 1) {
      prev = current;
      continue;
    }
    segments.push({ start: runStart, end: prev }); // inclusive column indices
    if (current !== undefined) {
      runStart = current;
      prev = current;
    }
  }

  // The leftmost segment carries the label by default, so the eye lands in
  // the same place on every row. It only loses the label to a genuinely
  // wider segment elsewhere — one more than one column-width wider — since
  // a segment only marginally wider than the leftmost one isn't worth
  // breaking that consistency for. (Ties, and near-ties within one column,
  // stay leftmost.)
  const widths = segments.map((seg) => seg.end - seg.start + 1);
  const leftmostWidth = widths[0];
  const maxWidth = Math.max(...widths);
  const labelIndex = maxWidth - leftmostWidth > 1 ? widths.indexOf(maxWidth) : 0;
  segments.forEach((seg, i) => { seg.hasLabel = i === labelIndex; });

  return {
    segments,
    boundingStart: indices[0],
    boundingEnd: indices[indices.length - 1],
  };
}

// Greedy lane packing within one domain row: priority (P0 before P1) first,
// then the case's position in the CASES array as a stable tiebreak — most
// dates are still [NEEDS INPUT], so they can't be relied on for ordering.
export function assignLanes(casesInDomain, capabilityIndex) {
  const withRanges = casesInDomain.map((caseObj, originalIndex) => {
    const { segments, boundingStart, boundingEnd } = computeSegments(caseObj, capabilityIndex);
    return { caseObj, segments, boundingStart, boundingEnd, originalIndex };
  });

  withRanges.sort((a, b) => {
    if (a.caseObj.priority !== b.caseObj.priority) {
      return a.caseObj.priority === 'P0' ? -1 : 1;
    }
    return a.originalIndex - b.originalIndex;
  });

  const lanes = []; // each lane: array of { boundingStart, boundingEnd }
  const placed = [];

  for (const item of withRanges) {
    let laneIndex = lanes.findIndex((lane) =>
      lane.every((other) => item.boundingEnd < other.boundingStart || item.boundingStart > other.boundingEnd)
    );
    if (laneIndex === -1) {
      laneIndex = lanes.length;
      lanes.push([]);
    }
    lanes[laneIndex].push({ boundingStart: item.boundingStart, boundingEnd: item.boundingEnd });
    placed.push({ ...item, lane: laneIndex });
  }

  return { laneCount: lanes.length, cases: placed };
}

// Full matrix structure: one entry per domain that has at least one case,
// each with its lane-assigned cases. Domains with zero cases are omitted —
// an empty row proves nothing and WRD F1 only calls for filled cells to be
// links, not for every domain to appear regardless of evidence.
export function buildMatrixModel(DOMAINS, CAPABILITIES, CASES) {
  const capabilityIndex = new Map(CAPABILITIES.map((c, i) => [c.slug, i]));

  return DOMAINS.map((domain) => {
    const casesInDomain = CASES.filter((c) => c.domain === domain.slug);
    if (casesInDomain.length === 0) return null;
    const { laneCount, cases } = assignLanes(casesInDomain, capabilityIndex);
    return { domain, laneCount, cases };
  }).filter(Boolean);
}
