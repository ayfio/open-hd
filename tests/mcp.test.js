/**
 * MCP server tests — drive the actual request handler with web-standard
 * Requests (no wrangler needed; the handler is pure web-platform code).
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { handleMcpRequest } from '../worker/mcp.js';

let id = 0;
async function rpc(method, params = {}) {
  const res = await handleMcpRequest(new Request('http://localhost/mcp', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      accept: 'application/json, text/event-stream'
    },
    body: JSON.stringify({ jsonrpc: '2.0', id: ++id, method, params })
  }));
  assert.equal(res.status, 200, `${method} → HTTP ${res.status}`);
  const body = await res.json();
  assert.ok(!body.error, `${method} → ${JSON.stringify(body.error)}`);
  return body.result;
}

async function callTool(name, args) {
  const result = await rpc('tools/call', { name, arguments: args });
  const text = result.content?.[0]?.text || '';
  assert.ok(!result.isError, `${name} errored: ${text.slice(0, 200)}`);
  return JSON.parse(text);
}

test('initialize handshake', async () => {
  const result = await rpc('initialize', {
    protocolVersion: '2025-06-18',
    capabilities: {},
    clientInfo: { name: 'test', version: '0' }
  });
  assert.equal(result.serverInfo.name, 'open-human-design');
});

test('tools/list exposes the five Phase-2 tools', async () => {
  const { tools } = await rpc('tools/list');
  const names = tools.map(t => t.name).sort();
  assert.deepEqual(names, ['analyze_team', 'compare_charts', 'compute_chart', 'get_descriptions', 'get_transits']);
  for (const t of tools) {
    assert.ok(t.description.length > 40, `${t.name} needs a real description`);
    assert.ok(t.inputSchema.type === 'object');
  }
});

test('compute_chart with explicit offset', async () => {
  const out = await callTool('compute_chart', {
    birth: { birthDate: '1990-06-15', birthTime: '14:30', utcOffset: -6 }
  });
  assert.equal(out.humanDesign.type, 'Manifestor');
  assert.equal(out.humanDesign.profile.startsWith('2/5'), true);
  assert.ok(out.humanDesign.channels.length >= 1);
  assert.ok(out.humanDesign.channels[0].keynote.length > 10, 'keynotes inlined (one-shot)');
  assert.ok(out.humanDesign.variable.notation);
});

test('compute_chart geocodes place and resolves historical offset', async () => {
  const out = await callTool('compute_chart', {
    birth: { birthDate: '1990-06-15', birthTime: '14:30', place: 'Boulder, Colorado' }
  });
  assert.equal(out.place.utcOffsetAtBirth, -6); // MDT June 1990
  assert.equal(out.place.ianaTimezone, 'America/Denver');
  assert.equal(out.humanDesign.type, 'Manifestor');
});

test('compute_chart multi-system: gene keys + astrology', async () => {
  const out = await callTool('compute_chart', {
    birth: { birthDate: '1990-06-15', birthTime: '14:30', utcOffset: -6, lat: 40.0, lon: -105.3 },
    systems: ['human_design', 'gene_keys', 'astrology'],
    detail: 'full'
  });
  assert.ok(out.geneKeys.activationSequence.lifeWork.gift);
  assert.ok(out.astrology.sun);
  assert.ok(out.humanDesign.substructure.personality.sun.tone >= 1);
});

test('compute_chart without birth time flags unknown', async () => {
  const out = await callTool('compute_chart', {
    birth: { birthDate: '1990-06-15', utcOffset: -6 }
  });
  assert.match(out.input.birthTime, /unknown/);
});

test('compare_charts returns typed connections', async () => {
  const out = await callTool('compare_charts', {
    personA: { birthDate: '1990-06-15', birthTime: '14:30', utcOffset: -6 },
    personB: { birthDate: '1985-03-20', birthTime: '08:00', utcOffset: 1 }
  });
  assert.ok(out.compositeType);
  assert.ok(Array.isArray(out.electromagnetic));
  assert.ok(out.summary.length > 20);
});

test('get_transits', async () => {
  const out = await callTool('get_transits', {
    birth: { birthDate: '1990-06-15', birthTime: '14:30', utcOffset: -6 },
    date: '2026-06-04'
  });
  assert.match(out.transitSun, /^Gate \d+\.\d/);
  assert.ok(Array.isArray(out.channelCompletions));
});

test('analyze_team', async () => {
  const out = await callTool('analyze_team', {
    members: [
      { name: 'A', birthDate: '1990-06-15', birthTime: '14:30', utcOffset: -6 },
      { name: 'B', birthDate: '1985-03-20', birthTime: '08:00', utcOffset: 1 },
      { name: 'C', birthDate: '1992-11-02', birthTime: '22:00', utcOffset: -7 }
    ]
  });
  assert.equal(out.members.length, 3);
  assert.ok(out.groupType);
  assert.ok(out.filledRoles.length + out.missingRoles.length > 0);
});

test('get_descriptions', async () => {
  const out = await callTool('get_descriptions', {
    gates: [34, 20],
    channels: ['20-34'],
    centers: ['sacral']
  });
  assert.ok(out.gates[34].keynote);
  assert.ok(out.channels['20-34'].whenDefined);
  assert.ok(out.centers.sacral.notSelfQuestion);
});

test('helpful errors: bad date, missing tz, unknown place', async () => {
  const r1 = await rpc('tools/call', { name: 'compute_chart', arguments: { birth: { birthDate: 'junk' } } });
  assert.ok(r1.isError && /YYYY-MM-DD/.test(r1.content[0].text));
  const r2 = await rpc('tools/call', { name: 'compute_chart', arguments: { birth: { birthDate: '1990-06-15' } } });
  assert.ok(r2.isError && /place.*or.*utcOffset/i.test(r2.content[0].text));
  const r3 = await rpc('tools/call', { name: 'compute_chart', arguments: { birth: { birthDate: '1990-06-15', place: 'Xyzzyqwobble' } } });
  assert.ok(r3.isError && /no match/i.test(r3.content[0].text));
});
