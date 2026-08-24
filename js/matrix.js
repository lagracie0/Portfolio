// Coverage Matrix — pure functions that turn DOMAINS/CAPABILITIES/CASES into
// the structure the home page renders. No DOM here, so the lane/segment/label
// rules can be reasoned about (and tested) independently of markup.

const NEEDS_INPUT_PREFIX = '[NEEDS INPUT';

export function isNeedsInput(value) {
  return typeof value === 'string' && value.startsWith(NEEDS_INPUT_PREFIX);
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

  // The widest segment carries the label; ties go to the first (leftmost)
  // segment, so every other filled block still gets a tick mark rather than
  // sitting anonymous.
  let labelIndex = 0;
  let labelWidth = -1;
  segments.forEach((seg, i) => {
    const width = seg.end - seg.start + 1;
    if (width > labelWidth) {
      labelWidth = width;
      labelIndex = i;
    }
  });
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
