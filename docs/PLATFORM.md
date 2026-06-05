# Open Human Design — Platform Architecture

> Accounts, sync, and the user-scoped remote MCP server. Synthesized 2026-06-04 from
> 4-angle platform research + 3 competing architecture proposals + a 3-lens judge panel
> (unanimous winner: Cloudflare-native). Companion to `RESEARCH.md` (product requirements).

## The destination

A person asks their AI: *"Pull up my partner's chart — are we electromagnetic anywhere?"*
— and it just works, because they connected Open HD to Claude once, months ago.

Three experiences, in priority order:

1. **Anonymous (default, sacred)** — enter a birthday, get a chart, instantly. No wall,
   no account, no network dependency for core flows. Byte-identical to today's static app.
2. **Signed in (optional)** — saved people sync across devices. Sign-in is a *convenience
   upgrade*, surfaced lazily ("sync across devices / connect your AI"), never a gate.
3. **AI-connected (the magic)** — a hosted, user-scoped MCP server. Connect once via
   OAuth from Claude/ChatGPT/Cursor; your AI can then list your people, compute any chart,
   compare two people, check transits — on demand, from stored birth data.

## The load-bearing insight

**Charts are never stored.** natalengine is deterministic, pure-JS, and runs anywhere —
browser, Worker, MCP tool handler. Only *birth data* persists (~6 fields/person, ≤50
people/user). Consequences:

- The backend is tiny: `users`, `people`, OAuth tokens. No chart cache, no invalidation,
  no migrations when the engine improves — recompute is always fresh and always right.
- The privacy story is data minimization, for real: we hold birth data only, nothing derived.
- The same engine version serves the SPA and the MCP — one source of truth for accuracy.

## Decision: Cloudflare all the way

Three architectures were designed and judged (CF-native / Supabase-centric / local-first
purist). **Cloudflare-native won 3/3** on the lenses that matter here (solo-maintainer ops,
MCP quality with real clients, cost, open-source ethos). Why:

| Factor | Cloudflare | Supabase |
|---|---|---|
| Remote MCP | Flagship use case: `agents` SDK `McpAgent`, Streamable HTTP, `workers-oauth-provider` (OAuth 2.1 + DCR + discovery, v0.7.x, production-grade) | Possible on Edge Functions; OAuth-IdP feature is beta (Nov 2025), MCP auth glue is hand-assembled today |
| Always-on cost | **$0–5/mo** (DOs free since Apr 2025; D1/Workers free tiers cover hobby→10k users) | **$25/mo floor** — free tier pauses projects after 7 days of DB inactivity, disqualifying for an always-on MCP endpoint |
| Ops | ONE Worker, ONE `wrangler deploy`, ONE log stream | Two platforms (static host + Supabase) |
| Auth | better-auth on Workers+D1 (magic link, Google/Apple, passkeys later) — more DIY | Turnkey, best-in-class (anonymous-upgrade-in-place is genuinely elegant) |
| Engine compat | natalengine + astronomy-engine are pure ESM, zero data files — bundle comfortably under the 3 MiB free limit (verified) | Also fine (npm: specifiers in Deno) |

Supabase's one real edge — fastest path to turnkey sync — doesn't outweigh the $25 floor
and the hand-rolled MCP auth seam, given that the MCP *is the headline feature*.

**Client reality check (2026):** Claude supports custom remote connectors on ALL plans
(Free gets 1) — paste URL, browser OAuth consent. ChatGPT: developer mode, all plans.
Cursor: one-click + OAuth. Current spec: 2025-06-18, Streamable HTTP, OAuth 2.1 + PKCE,
RFC 9728 protected-resource metadata, RFC 8707 resource indicators, DCR (RFC 7591 — what
Notion/Linear/Stripe actually ship; CIMD later). The demand side is consumer-ready *now*.

## Architecture

```
                        ┌────────────────────── Cloudflare Worker (one deploy) ──────────────────────┐
 Browser (SPA)          │  Router:                                                                    │
 ┌──────────────┐       │   /*                    → Static Assets (Vite SPA, index.html fallback)     │
 │ Vite app     │──GET──┼─▶ /api/auth/*           → better-auth (magic link, Google, Apple)           │
 │ localStorage │◀─sync─┼─▶ /api/sync             → D1 LWW delta sync (session cookie)                │
 │ (live store) │       │   /mcp                  → OAuthProvider.apiHandler = OpenHDMcp.serve()      │
 └──────────────┘       │   /authorize /token /register /.well-known/* → workers-oauth-provider       │
       ▲                │                                                                             │
 Claude/ChatGPT/Cursor  │  Bindings: ASSETS · DB (D1) · OAUTH_KV (KV) · OPENHD_MCP (DO namespace)     │
       └──── OAuth ────▶│  Compute:  natalengine imported in-process (calculators, NOT the stdio mcp) │
                        └─────────────────────────────────────────────────────────────────────────────┘
```

### Storage seam (already built)

`src/lib/people.js` is the single persistence seam (59 lines, wraps natalengine profiles).
It becomes a `PeopleStore` interface with two impls:
- **LocalStore** — today's localStorage. Always the live source of truth for the UI
  (instant, optimistic, offline-correct).
- **SyncStore** — decorator added when signed in: queues pushes, merges pulls. `main.js`
  never changes.

`VITE_OHD_API_BASE` unset → all sync code dead-paths → the app remains a pure static
site for self-hosters. **The backend is an enhancement, never a dependency.**

### Schema (D1) — mirrors natalengine's profile shape losslessly

```sql
CREATE TABLE people (
  id            TEXT NOT NULL,          -- client-generated UUID (same id as localStorage)
  user_id       TEXT NOT NULL,          -- better-auth user
  name          TEXT NOT NULL,
  birth_date    TEXT NOT NULL,          -- YYYY-MM-DD
  birth_time    TEXT NOT NULL,          -- HH:MM
  time_unknown  INTEGER NOT NULL DEFAULT 0,
  loc_lat REAL, loc_lon REAL,
  loc_timezone  REAL,                   -- UTC offset at birth (.5/.75 possible)
  loc_iana TEXT, loc_name TEXT,
  ai_access     INTEGER NOT NULL DEFAULT 0,  -- per-person MCP exposure (explicit opt-in)
  content_hash  TEXT,                   -- hash(birth fields) → dedupe hint
  created_at    TEXT NOT NULL,
  updated_at    TEXT NOT NULL,          -- LWW key (server-stamped on accept)
  deleted_at    TEXT,                   -- tombstone; never hard-delete during sync
  PRIMARY KEY (user_id, id)
);
CREATE INDEX idx_people_user_updated ON people(user_id, updated_at);
```

### Sync: LWW with tombstones (deliberately boring)

≤50 independent records, single-writer-mostly, no cross-record invariants → last-write-wins
on `updated_at` is *correct*, not a compromise. CRDTs are overkill.

- Push: per-record deltas; server upserts iff `incoming.updatedAt > row.updated_at`;
  tombstones beat older edits; server stamps accepted writes with server time.
- Pull: rows where `updated_at > since` (incl. tombstones); same LWW applied into localStorage.
- **First-sign-in merge**: push everything local (idempotent upsert by client UUID), pull
  the union. Same person saved on two devices converges automatically; identical
  `content_hash` rows surface a gentle "looks like a duplicate" merge hint.
- No server-side anonymous users — anonymous stays *truly local* (no MAU churn, no shadow
  accounts). Sign-in is the moment data first leaves the device, and the UI says so.

### MCP server (the headline)

`OpenHDMcp extends McpAgent` (Durable Object per session, Streamable HTTP), wrapped by
`workers-oauth-provider` (authorize/token/register + discovery + DCR). better-auth is the
OAuth upstream, so SPA identity and MCP identity are one user.

**Tools** (read scope unless noted):

| Tool | Purpose |
|---|---|
| `list_people()` | Names + birth summaries of **ai_access-flagged** people only |
| `get_chart({person, detail})` | Resolve person by name/id → full HD chart (foundation → full substructure) |
| `compute_chart({birthDate, birthTime, place?, tzOffset?})` | Ad-hoc chart for arbitrary birth data — works without any saved people |
| `compare_charts({personA, personB})` | Connection analysis (electromagnetic/companionship/compromise/dominance) |
| `get_transits({person?, date?})` | Transit weather over a natal chart |
| `analyze_team({people[]})` | Penta/group dynamics |
| `get_descriptions({gates?, channels?})` | Interpretive text so the AI explains in plain language, not bare codes |
| `save_person(...)` / `delete_person(...)` | Write scope, **off by default** |

Two design rules with teeth:
- **`ai_access` is enforced in the query**, not the prompt: MCP tools can only see rows
  the user explicitly flagged. "Your AI sees exactly what you granted" is a database
  guarantee, not a policy claim.
- **Tool contract lives in natalengine** (target: 1.3.0): the engine already ships a local
  stdio MCP; extracting shared tool *definitions* lets the local server, this hosted
  server, and any third-party natalengine app expose the identical AI surface. The hosted
  Worker imports the *calculators* directly (not the stdio entry).

### Privacy ladder (honest by construction)

E2E encryption is fundamentally incompatible with server-side chart computation — so we
don't pretend. The ladder, stated plainly in the UI:

1. **Default**: "Your birth data stays on your device." (true, literally)
2. **Sync on**: "Stored encrypted-at-rest so your devices stay in sync. We store only
   birth data — never charts, never derived traits. We can technically read it; we never
   sell it or train on it."
3. **AI Access (per person)**: "Lets your connected AI compute this person's charts."
4. *(Phase 5, optional)*: true-E2E "sync without AI" tier — passphrase, AES-256-GCM,
   server stores ciphertext — for privacy maximalists, mutually exclusive with MCP.

## Build phases

| Phase | What | Effort |
|---|---|---|
| **0** | `PeopleStore` seam + `VITE_OHD_API_BASE` flag (no behavior change; protects self-hosters) | ~0.5 day |
| **1** | Cloudflare hosting cutover: `wrangler.jsonc`, Workers Static Assets, domain | ~0.5–1 day |
| **2** | **Remote MCP, ad-hoc tools first** — `compute_chart`/`compare`/`transits` + OAuth shell; test against Claude/ChatGPT/Cursor. Valuable before sync exists. | ~2–4 days |
| **3** | better-auth (magic link + Google + Apple) + D1 schema + LWW sync + SyncStore + lazy sign-in UI | ~3–5 days |
| **4** | **User-scoped MCP** — `list_people`/`get_chart` over D1 with `ai_access` gating + name resolution → *"pull up Mom's chart" works* | ~2–3 days |
| **5** | Passkeys, dedupe UI, E2E no-AI tier, Turnstile, legacy `/sse` compat, privacy copy polish | ongoing |

≈ 8–13 focused days to the full destination; the headline MCP demo lands at Phase 2.

**Cost**: $0 on free tiers; $5/mo Workers Paid recommended for production headroom.
(Supabase equivalent: $25/mo floor because free projects pause after 7 idle days.)

## Known sharp edges

- **better-auth on Workers**: must use a per-request `createAuth(env)` factory — the
  documented module-singleton silently breaks (D1 binding changes per invocation).
- **MCP token hygiene**: validate `aud` on every request (RFC 8707 binding); never pass a
  client's token downstream; KV-stored tokens via workers-oauth-provider are hashed.
- **Name resolution** ("Mom"): match against saved names; ambiguity → the tool returns
  candidates and asks. Aliases can come later.
- **Team/Enterprise Claude** requires an org Owner to add custom connectors — individual
  plans (incl. Free, 1 connector) are the launch audience.

## The Parachute seam (deliberate, not coupled)

What this platform does — personal data + scoped tokens + "my AI can just access it" —
is Parachute Computer's thesis in miniature. OpenHD should ship standalone (clean
open-source story, no dependency on Parachute's maturity), **but** the `PeopleStore`
interface and the MCP tool contract are the two seams where a Parachute-vault-backed
implementation could swap in later: people as vault documents, AI access via hub-minted
scoped tokens. Design decision: keep both contracts storage-agnostic; revisit after
Parachute multi-tenant onboarding is consumer-ready.
