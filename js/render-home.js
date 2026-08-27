import { DOMAINS, CAPABILITIES, CASES } from '../data/cases.js';
import { buildMatrixModel, displayLabel, displayDateRange, CAPABILITY_TICK } from './matrix.js';

const domainLabel = new Map(DOMAINS.map((d) => [d.slug, d.label]));
const capabilityLabel = new Map(CAPABILITIES.map((c) => [c.slug, c.label]));
const capabilityAtIndex = CAPABILITIES.map((c) => c.slug);

function caseHref(caseObj) {
  return `work/${caseObj.slug}/`;
}

function el(tag, props = {}, children = []) {
  const node = document.createElement(tag);
  Object.entries(props).forEach(([key, value]) => {
    if (key === 'class') node.className = value;
    else if (key === 'text') node.textContent = value;
    else if (key.startsWith('data-')) node.setAttribute(key, value);
    else if (key.startsWith('aria-')) node.setAttribute(key, value);
    else node[key] = value;
  });
  children.forEach((child) => node.appendChild(child));
  return node;
}

// ---------------------------------------------------------------------
// Mobile view: filter chips (domain + capability, equal prominence) and a
// grouped card list. Grouping follows the active filter rather than always
// grouping by domain — domain-first grouping already gives away the "depth
// in one industry" argument for free; capability-first is the harder,
// more important read (the method repeating across unrelated domains), so
// it's the default when nothing is filtered, and it's what capability
// filtering switches TO grouping by domain, so a visitor who picks "delivery"
// sees exactly which industries that capability shows up in.
// ---------------------------------------------------------------------

function buildMobileView() {
  const state = { domain: null, capability: null };

  const root = el('div', { class: 'mobile-view' });

  const filters = el('div', { class: 'filters' });
  const domainRow = el('div', { class: 'filter-row' });
  domainRow.appendChild(el('span', { class: 'filter-row-label', text: 'Domain' }));
  const domainScroll = el('div', { class: 'chip-scroll', role: 'group', 'aria-label': 'Filter by domain' });
  domainRow.appendChild(domainScroll);

  const capabilityRow = el('div', { class: 'filter-row' });
  capabilityRow.appendChild(el('span', { class: 'filter-row-label', text: 'Capability' }));
  const capabilityScroll = el('div', { class: 'chip-scroll', role: 'group', 'aria-label': 'Filter by capability' });
  capabilityRow.appendChild(capabilityScroll);

  filters.appendChild(domainRow);
  filters.appendChild(capabilityRow);

  const groupsContainer = el('div', { class: 'card-groups' });

  function makeChip(slug, labelText, isActive, onToggle) {
    const chip = el('button', {
      class: 'chip',
      type: 'button',
      text: labelText,
      'data-slug': slug,
      'aria-pressed': isActive ? 'true' : 'false',
    });
    chip.addEventListener('click', onToggle);
    return chip;
  }

  // See js/render-work.js's renderChips for why this focus bookkeeping is
  // here: rebuilding the chip row on every filter change used to drop
  // keyboard focus to <body>, since replaceChildren() destroys the button
  // the user just activated and nothing restored focus afterward.
  function renderChips() {
    const focused = document.activeElement;
    const focusedSlug = (focused && focused.closest('.chip-scroll')) ? focused.dataset.slug : null;
    const focusedScroll = focusedSlug
      ? (focused.closest('.chip-scroll') === domainScroll ? 'domain' : 'capability')
      : null;

    domainScroll.replaceChildren(
      ...DOMAINS.map((d) => makeChip(d.slug, d.label, state.domain === d.slug, () => {
        state.domain = state.domain === d.slug ? null : d.slug;
        renderAll();
      }))
    );
    capabilityScroll.replaceChildren(
      ...CAPABILITIES.map((c) => makeChip(c.slug, c.label, state.capability === c.slug, () => {
        state.capability = state.capability === c.slug ? null : c.slug;
        renderAll();
      }))
    );

    if (focusedSlug) {
      const scroll = focusedScroll === 'domain' ? domainScroll : capabilityScroll;
      const replacement = scroll.querySelector(`[data-slug="${focusedSlug}"]`);
      if (replacement) replacement.focus();
    }
  }

  function matchingCases() {
    return CASES.filter((c) =>
      (!state.domain || c.domain === state.domain) &&
      (!state.capability || c.capabilities.includes(state.capability))
    );
  }

  function buildCard(caseObj) {
    const tags = el('ul', { class: 'card-tags' },
      caseObj.capabilities.map((slug) => el('li', { text: capabilityLabel.get(slug) || slug }))
    );
    const dateText = displayDateRange(caseObj);
    const children = [
      el('p', { class: 'card-title', text: caseObj.title }),
      el('p', { class: 'card-org', text: dateText ? `${displayLabel(caseObj)} · ${dateText}` : displayLabel(caseObj) }),
      tags,
    ];
    return el('a', { class: 'case-card', href: caseHref(caseObj) }, children);
  }

  function renderGroups() {
    const matches = matchingCases();

    if (matches.length === 0) {
      const domainsWithCapability = state.capability
        ? DOMAINS.filter((d) => CASES.some((c) => c.domain === d.slug && c.capabilities.includes(state.capability)))
        : [];
      const message = state.capability && domainsWithCapability.length
        ? `No cases match both filters. ${capabilityLabel.get(state.capability)} shows up in: ${domainsWithCapability.map((d) => d.label).join(', ')}.`
        : 'No cases match this combination yet.';
      groupsContainer.replaceChildren(el('p', { class: 'empty-state', text: message }));
      return;
    }

    // Group by domain once a capability is the active lens (proves the
    // method repeats); otherwise group by capability (the default, harder
    // argument) — including while only a domain filter is active, so a
    // domain-filtered view still reads as "here's her range within this
    // industry," not a flat undifferentiated list.
    const groupBy = state.capability ? 'domain' : 'capability';
    const axis = groupBy === 'domain' ? DOMAINS : CAPABILITIES;
    const axisSlugKey = groupBy === 'domain' ? 'domain' : null;

    const sections = axis.map((entry) => {
      const casesInGroup = matches.filter((c) =>
        groupBy === 'domain' ? c.domain === entry.slug : c.capabilities.includes(entry.slug)
      );
      if (casesInGroup.length === 0) return null;
      return el('section', { class: 'card-group' }, [
        el('h2', { text: entry.label }),
        ...casesInGroup.map(buildCard),
      ]);
    }).filter(Boolean);

    groupsContainer.replaceChildren(...sections);
  }

  function renderAll() {
    renderChips();
    renderGroups();
  }

  renderAll();
  root.appendChild(filters);
  root.appendChild(groupsContainer);
  return root;
}

// ---------------------------------------------------------------------
// Desktop matrix
// ---------------------------------------------------------------------

function buildMatrixView() {
  const model = buildMatrixModel(DOMAINS, CAPABILITIES, CASES);
  const columnCount = CAPABILITIES.length;

  const matrixScroll = el('div', { class: 'matrix-scroll' });
  const matrix = el('div', {
    class: 'matrix',
  });
  matrix.style.gridTemplateColumns = `200px repeat(${columnCount}, minmax(120px, 1fr))`;

  // Header row
  matrix.appendChild(el('div', { class: 'col-head corner', style: 'grid-row:1; grid-column:1;' }));
  CAPABILITIES.forEach((cap, i) => {
    const head = el('div', {
      class: 'col-head',
      text: cap.label,
      'data-col': i,
      tabindex: '-1',
    });
    head.style.gridRow = '1';
    head.style.gridColumn = `${i + 2} / ${i + 3}`;
    head.addEventListener('mouseenter', () => setActiveColumn(i));
    head.addEventListener('mouseleave', clearActive);
    matrix.appendChild(head);
  });

  let rowLine = 2;
  const allBarLinks = []; // flat, in visual (row-major) order, for keyboard nav
  const laneRows = []; // { rowLine, links: [...] } per lane, for Up/Down nav

  model.forEach(({ domain, laneCount, cases }) => {
    const labelStart = rowLine;
    const labelEnd = rowLine + laneCount;

    const domainLabelEl = el('div', {
      class: 'domain-label',
      text: domain.label,
      'data-domain': domain.slug,
    });
    domainLabelEl.style.gridRow = `${labelStart} / ${labelEnd}`;
    domainLabelEl.style.gridColumn = '1';
    matrix.appendChild(domainLabelEl);

    for (let lane = 0; lane < laneCount; lane++) {
      const thisRowLine = rowLine + lane;
      const laneCell = el('div', { class: 'lane-cell' });
      laneCell.style.gridRow = `${thisRowLine}`;
      laneCell.style.gridColumn = `2 / ${columnCount + 2}`;
      matrix.appendChild(laneCell);

      const barGroup = el('div', { class: 'bar-group' });
      barGroup.style.gridTemplateColumns = 'subgrid';
      barGroup.style.gridColumn = `1 / ${columnCount + 1}`;
      laneCell.appendChild(barGroup);

      const rowCases = cases.filter((c) => c.lane === lane);
      const rowLinks = [];

      rowCases.forEach(({ caseObj, segments, boundingStart, boundingEnd }) => {
        const capNames = caseObj.capabilities.map((s) => capabilityLabel.get(s) || s).join(', ');
        const dateText = displayDateRange(caseObj);
        const ariaLabel = `${caseObj.title}. ${displayLabel(caseObj)}${dateText ? ', ' + dateText : ''}. Capabilities: ${capNames}. ${domain.label}.`;

        // Gap connectors between consecutive segments, and between segments
        // there's a real capability that's simply not part of this case —
        // a tick at the top of the gap column only, never a fill, so a gap
        // never reads as partial presence (WRD review, gap-treatment rule).
        for (let s = 0; s < segments.length - 1; s++) {
          const gapStart = segments[s].end + 1;
          const gapEnd = segments[s + 1].start - 1;
          const connector = el('div', { class: 'bar-connector', 'aria-hidden': 'true' });
          connector.style.gridColumn = `${gapStart + 1} / ${gapEnd + 2}`;
          barGroup.appendChild(connector);
        }

        let primaryLink = null;
        segments.forEach((seg, i) => {
          const isFirst = i === 0;
          const node = el(isFirst ? 'a' : 'div', {
            class: 'bar-seg',
            'data-case': caseObj.slug,
            'data-bounding-start': boundingStart,
            'data-bounding-end': boundingEnd,
            'data-domain': domain.slug,
          });
          node.style.gridColumn = `${seg.start + 1} / ${seg.end + 2}`;
          if (isFirst) {
            node.href = caseHref(caseObj);
            node.setAttribute('aria-label', ariaLabel);
            primaryLink = node;
          } else {
            node.setAttribute('aria-hidden', 'true');
          }

          if (seg.hasLabel) {
            node.appendChild(el('span', {}, [
              el('span', { class: 'label-org', text: displayLabel(caseObj) }),
              ...(dateText ? [el('span', { class: 'label-year', text: dateText })] : []),
            ]));
          } else {
            // Secondary segment: a capability tick, never a blank anonymous
            // block — and never a checkmark, which reads as "verified"
            // rather than "this case continues here." Names the actual
            // capability(ies) this segment covers, visually subordinate to
            // the label (smaller, muted — see .tick in home.css).
            const tickText = Array.from({ length: seg.end - seg.start + 1 }, (_, k) =>
              CAPABILITY_TICK[capabilityAtIndex[seg.start + k]]
            ).join('·');
            node.appendChild(el('span', { class: 'tick', text: tickText }));
          }
          barGroup.appendChild(node);
        });

        // Clicking/focusing anywhere in a non-first segment forwards focus
        // to the real link, so the whole case is one interactive unit even
        // though only one element in the DOM is natively focusable.
        barGroup.querySelectorAll(`.bar-seg[data-case="${caseObj.slug}"]:not(a)`).forEach((secondary) => {
          secondary.style.cursor = 'pointer';
          secondary.addEventListener('click', () => primaryLink.click());
        });

        primaryLink.addEventListener('mouseenter', () => setActiveDomain(domain.slug));
        primaryLink.addEventListener('focus', () => setActiveDomain(domain.slug));
        primaryLink.addEventListener('mouseleave', clearActive);
        primaryLink.addEventListener('blur', clearActive);

        allBarLinks.push({ link: primaryLink, boundingStart, boundingEnd, rowLine: thisRowLine });
        rowLinks.push({ link: primaryLink, boundingStart, boundingEnd });
      });

      laneRows.push({ rowLine: thisRowLine, links: rowLinks });
    }

    rowLine += laneCount;
  });

  matrixScroll.appendChild(matrix);

  // ---- hover/focus dimming: stays inside .matrix, never touches the page ----
  function setActiveDomain(slug) {
    matrix.classList.add('is-dimming');
    matrix.querySelectorAll(`[data-domain="${slug}"]`).forEach((elm) => elm.classList.add('is-active'));
  }
  function setActiveColumn(colIndex) {
    matrix.classList.add('is-dimming');
    matrix.querySelectorAll('.col-head')[colIndex + 0]?.classList.add('is-active');
    allBarLinks.forEach(({ link, boundingStart, boundingEnd }) => {
      if (colIndex >= boundingStart && colIndex <= boundingEnd) {
        link.closest('.bar-group').querySelectorAll('.bar-seg, .bar-connector').forEach((n) => n.classList.add('is-active'));
      }
    });
  }
  function clearActive() {
    matrix.classList.remove('is-dimming');
    matrix.querySelectorAll('.is-active').forEach((n) => n.classList.remove('is-active'));
  }

  // ---- keyboard: arrow keys move between cases, never into empty/gap cells ----
  matrix.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
    const current = allBarLinks.find((b) => b.link === document.activeElement);
    if (!current) return;
    event.preventDefault();

    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      const rowLinks = laneRows.find((r) => r.rowLine === current.rowLine).links;
      const sorted = [...rowLinks].sort((a, b) => a.boundingStart - b.boundingStart);
      const idx = sorted.findIndex((l) => l.link === current.link);
      const nextIdx = event.key === 'ArrowRight' ? idx + 1 : idx - 1;
      if (sorted[nextIdx]) sorted[nextIdx].link.focus();
      return;
    }

    const direction = event.key === 'ArrowDown' ? 1 : -1;
    const rowIndex = laneRows.findIndex((r) => r.rowLine === current.rowLine);
    for (let i = rowIndex + direction; i >= 0 && i < laneRows.length; i += direction) {
      const candidates = laneRows[i].links;
      if (candidates.length === 0) continue;
      const closest = candidates.reduce((best, c) => {
        const overlap = Math.min(c.boundingEnd, current.boundingEnd) - Math.max(c.boundingStart, current.boundingStart);
        const bestOverlap = Math.min(best.boundingEnd, current.boundingEnd) - Math.max(best.boundingStart, current.boundingStart);
        return overlap > bestOverlap ? c : best;
      }, candidates[0]);
      closest.link.focus();
      return;
    }
  });

  return matrixScroll;
}

// ---------------------------------------------------------------------

function init() {
  const appRoot = document.getElementById('app-root');
  if (!appRoot) return;

  appRoot.appendChild(buildMobileView());

  try {
    appRoot.appendChild(buildMatrixView());
    document.documentElement.classList.add('js-matrix-ready');
  } catch (err) {
    // If the matrix fails to build for any reason, the mobile card list
    // (already appended above) remains the fallback at every width — never
    // leave the visitor with nothing. Surface the real error, per this
    // project's "never fail silently" rule.
    console.error('Coverage Matrix failed to build; falling back to the card list.', err);
  }
}

init();
