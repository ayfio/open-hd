/**
 * Open Human Design — remote MCP server (Phase 2: ad-hoc compute tools).
 *
 * Five one-shot tools, no auth required — they compute deterministic math
 * from birth data supplied in the call (no user data is stored or read).
 * See docs/PLATFORM.md for the tool design rationale and the Phase-4
 * additions (list_people / save_person / saved-name BirthInputs).
 *
 * Stateless: a fresh Server + transport per request (the SDK-documented
 * pattern for serverless runtimes). Charts compute in ~1ms, so JSON
 * responses (no SSE stream) keep clients simple and fast.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';

import {
  calculateHumanDesign,
  calculateGeneKeys,
  calculateAstrology,
  compareHumanDesign,
  calculateHDTransits,
  analyzePenta,
  searchPlaces,
  resolveUtcOffset,
  GATE_DESCRIPTIONS,
  CHANNEL_DESCRIPTIONS,
  CENTERS,
  GATES
} from 'natalengine';

// ---------------------------------------------------------------------------
// BirthInput resolution
// ---------------------------------------------------------------------------

const BIRTH_INPUT_SCHEMA = {
  type: 'object',
  properties: {
    birthDate: { type: 'string', description: 'YYYY-MM-DD (local date of birth)' },
    birthTime: { type: 'string', description: 'HH:MM 24h local. Omit if unknown (noon is used and noted — minutes matter in Human Design).' },
    place: { type: 'string', description: 'Birth place, e.g. "Boulder, Colorado". Geocoded server-side; the historical UTC offset at the birth moment is resolved automatically (handles DST and timezone history). Preferred over utcOffset.' },
    lat: { type: 'number', description: 'Latitude — only needed if place is not given' },
    lon: { type: 'number', description: 'Longitude — only needed if place is not given' },
    utcOffset: { type: 'number', description: 'UTC offset in hours at the birth moment (e.g. -6, 5.5). Only use when place is unavailable — you must account for historical DST yourself.' }
  },
  required: ['birthDate']
};

/**
 * Geocode a free-form place string. Open-Meteo matches bare names only,
 * but AIs naturally pass "City, Region" / "City, Country" — so on a miss,
 * retry with the name before the first comma and rank candidates by how
 * well their full label matches the qualifier.
 */
async function geocodeFlexible(placeStr) {
  let places = await searchPlaces(placeStr, 5);
  if (places.length || !placeStr.includes(',')) return places;

  const [head, ...rest] = placeStr.split(',').map(s => s.trim());
  places = await searchPlaces(head, 10);
  const qualifier = rest.join(' ').toLowerCase();
  if (!places.length || !qualifier) return places;

  const qualifierTokens = qualifier.split(/[\s,]+/).filter(Boolean);
  const matches = places.filter(p => {
    const lbl = p.label.toLowerCase();
    return qualifierTokens.some(tok => lbl.includes(tok));
  });
  return matches.length ? matches : places;
}

async function resolveBirth(input, label = 'birth') {
  if (!input || typeof input !== 'object') throw new Error(`${label}: expected an object`);
  const { birthDate } = input;
  if (!birthDate || !/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
    throw new Error(`${label}.birthDate must be YYYY-MM-DD`);
  }
  const timeUnknown = !input.birthTime;
  const birthTime = input.birthTime && /^\d{1,2}:\d{2}$/.test(input.birthTime) ? input.birthTime : '12:00';

  let utcOffset = typeof input.utcOffset === 'number' ? input.utcOffset : null;
  let placeNote = null;

  if (utcOffset === null && input.place) {
    const places = await geocodeFlexible(input.place);
    if (!places.length) throw new Error(`${label}.place: no match found for "${input.place}" — try a larger nearby city or pass utcOffset directly`);
    const top = places[0];
    utcOffset = resolveUtcOffset(birthDate, birthTime, top.timezone);
    placeNote = {
      resolved: top.label,
      ianaTimezone: top.timezone,
      utcOffsetAtBirth: utcOffset,
      lat: top.latitude,
      lon: top.longitude,
      ...(places.length > 1 ? { otherCandidates: places.slice(1, 4).map(p => p.label) } : {})
    };
  }

  if (utcOffset === null) {
    throw new Error(`${label}: provide either place (preferred) or utcOffset`);
  }

  const [h, m] = birthTime.split(':').map(Number);
  return {
    birthDate,
    birthTime,
    birthHour: h + (m || 0) / 60,
    timeUnknown,
    utcOffset,
    placeNote
  };
}

// ---------------------------------------------------------------------------
// Chart serializers — token-efficient, interpretive text inlined (one-shot)
// ---------------------------------------------------------------------------

const actMap = (gates) => {
  const out = {};
  for (const [planet, g] of Object.entries(gates)) {
    if (g) out[planet] = `${g.gate}.${g.line}`;
  }
  return out;
};

function hdSummary(chart, detail = 'summary') {
  const base = {
    type: chart.type.name,
    strategy: chart.type.strategy,
    signature: chart.type.signature,
    notSelfTheme: chart.type.notSelf,
    typeMeaning: chart.type.description,
    authority: chart.authority.name,
    authorityPractice: chart.authority.description,
    profile: `${chart.profile.numbers} ${chart.profile.name}`,
    profileTheme: chart.profile.theme,
    definition: chart.definition,
    incarnationCross: chart.incarnationCross?.fullName,
    variable: {
      notation: chart.variable?.notation,
      determination: chart.variable?.determination?.name,
      environment: chart.variable?.environment?.name,
      motivation: chart.variable?.motivation?.name,
      perspective: chart.variable?.perspective?.name,
      cognition: chart.variable?.determination?.cognition?.name
    },
    centers: {
      defined: chart.centers.definedNames,
      undefined: chart.centers.undefinedNames,
      open: chart.centers.openNames
    },
    channels: chart.channels.map(ch => ({
      channel: `${ch.gates[0]}-${ch.gates[1]}`,
      name: ch.name,
      circuit: ch.circuit,
      keynote: CHANNEL_DESCRIPTIONS[`${ch.gates[0]}-${ch.gates[1]}`]?.whenDefined || ch.theme
    })),
    activations: {
      personality: actMap(chart.gates.personality),
      design: actMap(chart.gates.design)
    },
    designDate: chart.positions?.design?.date
  };

  if (detail === 'full') {
    base.substructure = {
      personality: Object.fromEntries(Object.entries(chart.gates.personality)
        .filter(([, g]) => g)
        .map(([p, g]) => [p, { gate: g.gate, line: g.line, color: g.color, tone: g.tone, base: g.base }])),
      design: Object.fromEntries(Object.entries(chart.gates.design)
        .filter(([, g]) => g)
        .map(([p, g]) => [p, { gate: g.gate, line: g.line, color: g.color, tone: g.tone, base: g.base }]))
    };
    base.gateKeynotes = Object.fromEntries(chart.gates.all.map(g =>
      [g, GATE_DESCRIPTIONS[g]?.keynote || GATES[g]?.name]));
  }
  return base;
}

function gkSummary(gk) {
  const sphere = (s) => s ? { key: s.keyLine || s.key, shadow: s.shadow, gift: s.gift, siddhi: s.siddhi } : null;
  return {
    activationSequence: {
      lifeWork: sphere(gk.activationSequence.lifeWork),
      evolution: sphere(gk.activationSequence.evolution),
      radiance: sphere(gk.activationSequence.radiance),
      purpose: sphere(gk.activationSequence.purpose)
    },
    venusSequence: {
      attraction: sphere(gk.venusSequence.attraction),
      iq: sphere(gk.venusSequence.iq),
      eq: sphere(gk.venusSequence.eq),
      sq: sphere(gk.venusSequence.sq)
    },
    pearlSequence: {
      vocation: sphere(gk.pearlSequence.vocation),
      culture: sphere(gk.pearlSequence.culture),
      pearl: sphere(gk.pearlSequence.pearl)
    }
  };
}

function astroSummary(a) {
  return {
    sun: a.sun?.sign?.name || a.sun?.sign,
    moon: a.moon?.sign?.name || a.moon?.sign,
    rising: a.rising?.sign?.name || a.rising?.sign || 'needs lat/lon',
    planets: Object.fromEntries(Object.entries(a.planets || {}).map(([p, v]) =>
      [p, `${v.sign?.name || v.sign} ${v.degree || ''}`.trim()]))
  };
}

const json = (obj) => ({ content: [{ type: 'text', text: JSON.stringify(obj, null, 1) }] });
const errText = (msg) => ({ content: [{ type: 'text', text: `Error: ${msg}` }], isError: true });

function birthMeta(b) {
  return {
    input: { birthDate: b.birthDate, birthTime: b.timeUnknown ? 'unknown (noon used — line-level details may be unreliable)' : b.birthTime, utcOffset: b.utcOffset },
    ...(b.placeNote ? { place: b.placeNote } : {})
  };
}

// ---------------------------------------------------------------------------
// Tools
// ---------------------------------------------------------------------------

const TOOLS = [
  {
    name: 'compute_chart',
    description: 'Compute a chart from birth data. Human Design by default; add "gene_keys" and/or "astrology" to systems for those views of the same birth moment. One call returns the complete picture including interpretive keynotes — prefer detail:"summary" unless line/color/tone/base substructure is needed.',
    inputSchema: {
      type: 'object',
      properties: {
        birth: BIRTH_INPUT_SCHEMA,
        systems: {
          type: 'array',
          items: { type: 'string', enum: ['human_design', 'gene_keys', 'astrology'] },
          description: 'Default ["human_design"]'
        },
        detail: { type: 'string', enum: ['summary', 'full'], description: 'full adds per-planet color/tone/base substructure and gate keynotes' }
      },
      required: ['birth']
    },
    async handler({ birth, systems = ['human_design'], detail = 'summary' }) {
      const b = await resolveBirth(birth);
      const hd = calculateHumanDesign(b.birthDate, b.birthHour, b.utcOffset);
      const out = { ...birthMeta(b) };
      if (systems.includes('human_design')) out.humanDesign = hdSummary(hd, detail);
      if (systems.includes('gene_keys')) out.geneKeys = gkSummary(calculateGeneKeys(hd));
      if (systems.includes('astrology')) {
        const lat = birth.lat ?? b.placeNote?.lat ?? null;
        const lon = birth.lon ?? b.placeNote?.lon ?? null;
        out.astrology = astroSummary(calculateAstrology(b.birthDate, b.birthHour, b.utcOffset, lat, lon));
      }
      return json(out);
    }
  },
  {
    name: 'compare_charts',
    description: 'Human Design connection analysis between two people: electromagnetic (attraction — each has half a channel), companionship (both whole), compromise and dominance channels, composite type, and a relationship summary.',
    inputSchema: {
      type: 'object',
      properties: {
        personA: BIRTH_INPUT_SCHEMA,
        personB: BIRTH_INPUT_SCHEMA
      },
      required: ['personA', 'personB']
    },
    async handler({ personA, personB }) {
      const [a, b] = await Promise.all([resolveBirth(personA, 'personA'), resolveBirth(personB, 'personB')]);
      const chartA = calculateHumanDesign(a.birthDate, a.birthHour, a.utcOffset);
      const chartB = calculateHumanDesign(b.birthDate, b.birthHour, b.utcOffset);
      const cmp = compareHumanDesign(chartA, chartB);
      const cc = cmp.connectionChart;
      const connList = (items) => items.map(c => ({ channel: `${c.channel} (${c.gates.join('-')})`, meaning: c.description }));
      return json({
        personA: { ...birthMeta(a), type: chartA.type.name, profile: chartA.profile.numbers, authority: chartA.authority.name },
        personB: { ...birthMeta(b), type: chartB.type.name, profile: chartB.profile.numbers, authority: chartB.authority.name },
        compositeType: cc.compositeType,
        typeDynamic: cmp.typeInteraction?.dynamic,
        electromagnetic: connList(cc.connections.electromagnetic),
        companionship: connList(cc.connections.companionship),
        compromise: connList(cc.connections.compromise),
        dominance: connList(cc.connections.dominance),
        summary: cmp.summary
      });
    }
  },
  {
    name: 'get_transits',
    description: 'How current (or any date\'s) planetary transits interact with a person\'s Human Design chart: channel completions (temporary definition), temporarily defined centers, reinforced gates.',
    inputSchema: {
      type: 'object',
      properties: {
        birth: BIRTH_INPUT_SCHEMA,
        date: { type: 'string', description: 'YYYY-MM-DD, default today (UTC)' }
      },
      required: ['birth']
    },
    async handler({ birth, date }) {
      const b = await resolveBirth(birth);
      const chart = calculateHumanDesign(b.birthDate, b.birthHour, b.utcOffset);
      const d = date && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : new Date().toISOString().split('T')[0];
      const t = calculateHDTransits(chart, d);
      return json({
        ...birthMeta(b),
        natalType: chart.type.name,
        transitDate: d,
        transitSun: `Gate ${t.highlights.sun.gate}.${t.highlights.sun.line} — ${t.highlights.sun.gateName}`,
        transitMoon: `Gate ${t.highlights.moon.gate}.${t.highlights.moon.line} — ${t.highlights.moon.gateName}`,
        channelCompletions: t.channelCompletions.map(c => ({
          channel: `${c.channel} (${c.gates.join('-')})`,
          how: c.natalGate
            ? `natal Gate ${c.natalGate} completed by transit Gate ${c.transitGate} (${c.transitPlanet})`
            : 'pure transit channel',
          significance: c.significance
        })),
        temporarilyDefinedCenters: t.temporarilyDefinedCenters.map(c => ({ center: c.centerName, theme: c.theme })),
        reinforcedGates: t.reinforcedGates.slice(0, 8).map(g => `Gate ${g.gate} — ${g.gateName}`)
      });
    }
  },
  {
    name: 'analyze_team',
    description: 'Human Design group/Penta analysis for 2-9 people: group type, filled and missing team roles, electromagnetic connections between members, recommendations.',
    inputSchema: {
      type: 'object',
      properties: {
        members: {
          type: 'array',
          minItems: 2,
          maxItems: 9,
          items: {
            type: 'object',
            properties: { name: { type: 'string' }, ...BIRTH_INPUT_SCHEMA.properties },
            required: ['birthDate']
          }
        }
      },
      required: ['members']
    },
    async handler({ members }) {
      if (!Array.isArray(members) || members.length < 2) throw new Error('members: need at least 2 people');
      const resolved = await Promise.all(members.map((m, i) => resolveBirth(m, m.name || `member ${i + 1}`)));
      const charts = resolved.map(b => calculateHumanDesign(b.birthDate, b.birthHour, b.utcOffset));
      const names = members.map((m, i) => m.name || `Person ${i + 1}`);
      const r = analyzePenta(charts, names);
      return json({
        members: names.map((n, i) => ({ name: n, type: charts[i].type.name, profile: charts[i].profile.numbers })),
        groupType: r.groupType,
        isPenta: r.isPenta,
        filledRoles: r.filledRoles.map(x => ({ role: x.role, by: x.contributors, meaning: x.description })),
        missingRoles: r.missingRoles.map(x => ({ role: x.role, suggestion: x.suggestion })),
        electromagnetics: r.electromagnetics.slice(0, 10).map(e => ({ channel: e.channel, between: [e.personA, e.personB], theme: e.theme })),
        recommendations: r.recommendations.map(x => x.insight)
      });
    }
  },
  {
    name: 'get_descriptions',
    description: 'Interpretive reference text for Human Design elements — use for follow-up depth questions ("what does Gate 34 mean?") without recomputing a chart. Free (not metered).',
    inputSchema: {
      type: 'object',
      properties: {
        gates: { type: 'array', items: { type: 'integer', minimum: 1, maximum: 64 }, description: 'Gate numbers' },
        channels: { type: 'array', items: { type: 'string' }, description: 'Channel keys like "20-34"' },
        centers: { type: 'array', items: { type: 'string', enum: Object.keys(CENTERS) }, description: 'Center keys' }
      }
    },
    async handler({ gates = [], channels = [], centers = [] }) {
      const out = {};
      if (gates.length) {
        out.gates = Object.fromEntries(gates.filter(g => GATE_DESCRIPTIONS[g]).map(g => [g, {
          name: GATES[g]?.name,
          keynote: GATE_DESCRIPTIONS[g].keynote,
          description: GATE_DESCRIPTIONS[g].description,
          harmonicGate: GATE_DESCRIPTIONS[g].harmonic,
          center: GATES[g]?.center
        }]));
      }
      if (channels.length) {
        out.channels = Object.fromEntries(channels
          .map(k => [k, CHANNEL_DESCRIPTIONS[k] || CHANNEL_DESCRIPTIONS[k.split('-').reverse().join('-')]])
          .filter(([, v]) => v)
          .map(([k, v]) => [k, { description: v.description, whenDefined: v.whenDefined }]));
      }
      if (centers.length) {
        out.centers = Object.fromEntries(centers.filter(c => CENTERS[c]).map(c => [c, {
          name: CENTERS[c].name,
          theme: CENTERS[c].theme,
          defined: CENTERS[c].definedMeaning,
          undefined: CENTERS[c].undefinedMeaning,
          notSelfQuestion: CENTERS[c].notSelfQuestion
        }]));
      }
      if (!Object.keys(out).length) throw new Error('pass at least one of gates, channels, centers');
      return json(out);
    }
  }
];

// ---------------------------------------------------------------------------
// Server factory + request handler (stateless)
// ---------------------------------------------------------------------------

function buildServer() {
  const server = new Server(
    { name: 'open-human-design', version: '0.3.0' },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: TOOLS.map(({ name, description, inputSchema }) => ({ name, description, inputSchema }))
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const tool = TOOLS.find(t => t.name === request.params.name);
    if (!tool) return errText(`Unknown tool: ${request.params.name}`);
    try {
      return await tool.handler(request.params.arguments || {});
    } catch (err) {
      return errText(err.message || String(err));
    }
  });

  return server;
}

export async function handleMcpRequest(request) {
  const server = buildServer();
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined, // stateless — fresh instance per request
    enableJsonResponse: true
  });
  await server.connect(transport);
  return transport.handleRequest(request);
}
