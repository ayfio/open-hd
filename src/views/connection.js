/**
 * Connection view — how two designs interact. Person A is the current
 * chart; Person B comes from saved people or a quick manual entry.
 */

import { compareHumanDesign } from 'natalengine';
import { renderBodygraph } from '../bodygraph.js';
import { computeChart } from '../lib/chartdata.js';
import { listPeople, birthFromPerson, getSharedGuest } from '../lib/people.js';
import { createPlaceSearch } from '../lib/placesearch.js';
import { esc } from '../lib/format.js';
import { getCurrentChart } from './chart.js';

let placeB = null;

export function setupConnectionView() {
  document.getElementById('conn-calculate').addEventListener('click', runComparison);
  placeB = createPlaceSearch(document.getElementById('conn-place'), {
    placeholder: 'Birth place (resolves the timezone)',
    getDateTime: () => ({
      date: document.getElementById('conn-date').value,
      time: document.getElementById('conn-time').value
    })
  });
}

/** Refresh the saved-people picker each time the view opens. */
export function renderConnectionView() {
  const select = document.getElementById('conn-person');
  const people = listPeople();
  const current = getCurrentChart();
  const options = people
    .filter(p => p.id !== current?.birth?.id)
    .map(p => `<option value="${esc(p.id)}">${esc(p.name)}</option>`)
    .join('');
  // A chart they arrived at via a share link stays comparable (P1-11).
  const guest = getSharedGuest();
  const guestOpt = guest?.name && guest?.birthDate && guest.id !== current?.birth?.id
    ? `<option value="__guest">${esc(guest.name)} (shared chart)</option>` : '';
  select.innerHTML = `<option value="">— enter birth data below —</option>${guestOpt}${options}`;
  select.onchange = () => {
    document.getElementById('conn-manual').classList.toggle('hidden', !!select.value);
  };
}

function runComparison() {
  const current = getCurrentChart();
  if (!current) return;

  const select = document.getElementById('conn-person');
  let birthB = null;

  if (select.value === '__guest') {
    birthB = getSharedGuest();
  } else if (select.value) {
    const person = listPeople().find(p => p.id === select.value);
    if (person) birthB = birthFromPerson(person);
  } else {
    const date = document.getElementById('conn-date').value;
    if (!date) return;
    const time = document.getElementById('conn-time').value || '12:00';
    const loc = placeB?.getBirthLocation(date, time);
    if (!loc) { placeB?.flagMissing(); return; } // no silent UTC=0
    birthB = {
      name: document.getElementById('conn-name').value.trim() || 'Person B',
      birthDate: date,
      birthTime: time,
      timezone: loc.timezone,
      location: loc.lat != null ? loc : null
    };
  }
  if (!birthB) return;

  const b = computeChart(birthB);
  const comparison = compareHumanDesign(current.chart, b.chart);
  renderConnectionContent(comparison, current, b);
}

function renderConnectionContent(comparison, a, b) {
  const container = document.getElementById('connection-content');
  const cc = comparison.connectionChart;

  const renderConnections = (items, label, blurb, color) => {
    if (!items.length) return '';
    return `
      <div style="margin-bottom:16px">
        <div class="panel-title">${label} (${items.length})</div>
        <p class="panel-intro">${blurb}</p>
        ${items.map(c => `
          <div class="connection-type" style="border-left:3px solid ${color}">
            <div class="conn-channel">${esc(c.channel)} (${c.gates.join('-')})</div>
            <div class="conn-desc">${esc(c.description)}</div>
          </div>
        `).join('')}
      </div>
    `;
  };

  container.innerHTML = `
    <div class="connection-graphs">
      <div class="connection-graph">
        <div class="connection-graph-name">${esc(a.birth.name || 'You')}</div>
        <div class="connection-graph-type">${esc(a.chart.type.name)} ${esc(a.chart.profile.numbers)}</div>
        <div id="conn-graph-a"></div>
      </div>
      <div class="connection-graph">
        <div class="connection-graph-name">${esc(b.birth.name || 'Person B')}</div>
        <div class="connection-graph-type">${esc(b.chart.type.name)} ${esc(b.chart.profile.numbers)}</div>
        <div id="conn-graph-b"></div>
      </div>
    </div>

    <div class="foundation-grid" style="margin-bottom:20px">
      <div class="foundation-item">
        <div class="label">Composite Type</div>
        <div class="value">${esc(cc.compositeType)}</div>
        <div class="detail">${cc.compositeChannelCount} channels together</div>
      </div>
      <div class="foundation-item">
        <div class="label">Type Dynamic</div>
        <div class="value">${esc(comparison.typeInteraction.dynamic)}</div>
        <div class="detail">${esc(comparison.typeInteraction.typeA)} + ${esc(comparison.typeInteraction.typeB)}</div>
      </div>
    </div>

    ${renderConnections(cc.connections.electromagnetic, 'Electromagnetic', 'Each of you carries half the channel — together you create energy neither has alone. Attraction and friction both live here.', 'var(--electromagnetic)')}
    ${renderConnections(cc.connections.companionship, 'Companionship', 'You both have the whole channel — shared, stable common ground.', 'var(--integration)')}
    ${renderConnections(cc.connections.compromise, 'Compromise', 'One has the full channel, the other half of it — the full-channel side tends to dominate the theme.', 'var(--collective)')}
    ${renderConnections(cc.connections.dominance, 'Dominance', 'One has the full channel, the other nothing — this energy conditions the open person one-way.', 'var(--text-tertiary)')}

    <div class="panel-title">Summary</div>
    <p>${esc(comparison.summary)}</p>
  `;

  renderBodygraph(document.getElementById('conn-graph-a'), a.chart, { compact: true });
  renderBodygraph(document.getElementById('conn-graph-b'), b.chart, { compact: true });
}
