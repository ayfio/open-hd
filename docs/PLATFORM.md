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

**Tool design principle: the right number is "one tool per human intent."** Not one per
engine function (overwhelming — the engine has dozens), not one mega-tool (un-promptable).
Every tool is one-shot: it answers a whole question in a single call, with interpretive
text inlined. A shared `BirthInput` shape keeps them coherent:

```
BirthInput = { birthDate, birthTime?, place? }        // place geocoded + tz-resolved server-side
           | { birthDate, birthTime?, lat, lon, utcOffset }
           | "Saved Name"                              // Phase 4+, signed-in only
```

**Phase 2 — five tools, no auth needed** (compute is deterministic math on public data):

| Tool | Intent it answers | Metered |
|---|---|---|
| `compute_chart({birth, systems?, detail?})` | "What's the chart for someone born …?" — HD by default; `systems` adds `gene_keys` / `astrology` (multi-system from day one) | 1 unit |
| `compare_charts({personA, personB})` | "How do these two people fit?" — typed connection channels + composite | 1 unit |
| `get_transits({birth, date?})` | "What's the weather over this chart today?" | 1 unit |
| `analyze_team({members[]})` | "How does this group work?" — Penta roles | 1 unit |
| `get_descriptions({gates?, channels?, centers?})` | "Tell me more about Gate 34" — follow-up depth without recomputing | free |

**Phase 4 adds three** (write scope explicit, off by default):

| Tool | Intent |
|---|---|
| `list_people()` | "Who do I have saved?" — **ai_access-flagged rows only** |
| `save_person({name, birth})` | "Remember my sister's chart" — the AI becomes a way to *build* your library |
| `delete_person({person})` | Cleanup, with confirmation semantics |

`get_chart("Mom")` is not a ninth tool — saved names slot into `BirthInput`, so
`compute_chart`/`compare_charts`/`get_transits` all accept people by name once signed in.
Eight tools total, five at launch. Ambiguous names return candidates instead of guessing.

Three design rules with teeth:
- **`ai_access` is enforced in the query**, not the prompt: MCP tools can only see rows
  the user explicitly flagged. "Your AI sees exactly what you granted" is a database
  guarantee, not a policy claim.
- **The engine stays a pure math library; the MCP lives in the product.** (Decision
  2026-06-04, reversing an earlier draft.) natalengine = calculators + data tables,
  deterministic, zero I/O — the thing others build on. The MCP server knows about users,
  people, and `ai_access`, so it belongs here in the Worker, which imports the engine's
  *calculators* directly (never the stdio entry). Longer-term, the engine should get
  *lighter*: the stdio MCP bin stays as a demo, but `storage/profiles.js`-style product
  features migrate up into apps. Anyone wanting their own MCP wraps the library in ~50
  lines, as we do.
- **One-shot tools.** Each tool answers a whole human intent in one call — `get_chart`
  inlines the relevant interpretive text so the AI rarely needs a follow-up. Fewer
  round-trips = better answers, less context burn, and fair metering (below).

### Multi-system from day one (the suite question, deferred correctly)

The people store is system-agnostic (birth data only) and the engine already computes
Western astrology, Vedic, and Gene Keys. So the MCP exposes `calculate_astrology` /
`gene_keys_profile` etc. nearly for free, making the *AI surface* multi-system before any
second app exists. Product strategy: **OpenHD stays the focused best-in-class HD app**
(the open competitive lane per RESEARCH.md); future astrology/Gene Keys apps would be new
frontends on this same Worker — same accounts, same people, same MCP.

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

## Pricing (decided 2026-06-04)

**$3/month or $20/year** — for the cloud, never the app.

| | Anonymous | Free account | Paid |
|---|---|---|---|
| The app (charts, transits, connection, team) | ✅ unlimited forever | ✅ | ✅ |
| Local saves (device) | ✅ unlimited | ✅ unlimited | ✅ unlimited |
| Synced people | — | 10 | unlimited |
| MCP/API chart-units | — | 50/mo | unlimited (fair use) |

- **Metering counts chart-units, not raw calls.** Navigational/metadata tools are free
  (`list_people`, `get_descriptions`, search); only chart-computing tools cost 1 unit
  (`get_chart`, `compute_chart`, `compare` = 1, `transits`, `team`). With one-shot tool
  design, "pull up Mom's chart" = exactly 1 unit. User-facing language: *"a query ≈ one
  chart."* Implementation: a monthly counter column in D1.
- Rationale: the market hates paywalls (RESEARCH.md §1.3); we charge only for what runs
  on our servers. Annual ($20) keeps Stripe fees ~4% (vs ~33% at $1/mo). Infra floor is
  $5/mo → subscriber #3 makes the platform self-sustaining. Compute is not a cost factor:
  a full chart + gene keys benchmarks at **0.9ms** of Worker CPU.

## Brand & domain architecture (decided 2026-06-04)

- **Consumer apps get specialty domains.** This app: `openhumandesign.com` (checked
  available 2026-06-04 — register in the same Cloudflare account that runs the Worker).
  Future astrology/Gene Keys frontends get their own names. Specialty positioning wins
  (RESEARCH.md); an umbrella consumer brand would dilute it.
- **The platform stays quiet on `natalengine.com`** (already owned): OAuth at
  `accounts.natalengine.com`, MCP at `mcp.natalengine.com`. The MCP connector name users
  see in Claude is deliberately multi-system: *NatalEngine — your people's charts, any
  system*. When app #2 arrives, "sign in with your NatalEngine account" is the whole
  cross-app story.
- **Naming caution:** the bare "OpenHD" shorthand collides with an established FOSS
  project (OpenHD, drone video — openhdfpv.org). Use the full "Open Human Design"
  wordmark; don't tattoo the abbreviation. (The name itself is still being felt out —
  the positioning below survives a rename.)

### Earning "Open"

1. **Open knowledge** — the deepest claim: HD has been IP-gatekept for 30 years; giving
   away the paywalled depth in original language is an open-access stance toward the
   system itself (legally grounded — 2020 Florence ruling, 17 USC 102(b)).
2. **Open data** — local-first default, export/import, shareable URLs, only birth data
   ever stored, trivially portable.
3. **Open interface** — the MCP/API contract is public; we charge for hosting, not access
   to the interface.
4. **Open engine** — natalengine is MIT on npm; competing frontends welcome.
5. **Self-hosting as credible exit** — the static app runs with the backend env unset,
   forever. HD users mostly won't self-host; the point is the *guarantee* (our cloud must
   earn its keep), not the practice.

## Build phases

| Phase | What | Effort |
|---|---|---|
| **0** | ✅ *done 2026-06-04* — `PeopleStore` seam in `src/lib/people.js` (no behavior change; protects self-hosters) | ~0.5 day |
| **1** | ✅ *code done 2026-06-04* — `wrangler.jsonc` + `worker/index.js` (Workers Static Assets, SPA fallback); **deploy pending `wrangler login` + domain** | ~0.5–1 day |
| **2** | ✅ *code done 2026-06-04* — `worker/mcp.js`: all five tools live, stateless streamable HTTP, flexible geocoding, 11 tests + verified through workerd. No auth yet (tools are public deterministic math); OAuth ships with accounts. Test against Claude/ChatGPT after deploy. | ~2–4 days |
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

## The Parachute vision (deliberate seams, no coupling)

What this platform does — personal data + scoped tokens + "my AI can just access it" —
is Parachute Computer's thesis in miniature. The full vision has three horizons:

**Horizon 1 (now): the open API is anchor-able into anyone's Parachute setup.**
Because the MCP/API contract is public and the compute tools need no account, a person
running their own Parachute can wire chart computation into their personal system today —
a Parachute Runner that posts the day's transits into a vault note, an agent that
computes a chart for anyone they meet, their own custom chart UI reading our API. *They
don't need our app at all* — and that's the point. OpenHD is the mainstream on-ramp; the
open interface is the power-user's escape hatch. Both consume the same engine, so
accuracy is identical everywhere.

**Horizon 2: people-as-vault-data.** The `PeopleStore` interface and the MCP tool
contract are the two storage-agnostic seams. A Parachute-backed implementation slots in
behind them: saved people as vault documents, AI access via hub-minted scoped tokens
instead of our OAuth — your birth-data library living in *your* vault, with OpenHD as
one client of it.

**Horizon 3 (convergence milestone): OpenHD accounts *are* Parachute vaults.** When
Parachute has consumer-grade multi-tenant onboarding, the D1 store can be swapped for
vault storage wholesale and OpenHD becomes Parachute's first consumer showcase — proof
that "your data, your agents, your tools" works for people who will never say the word
"self-host." Until then, D1 is the boring, correct choice; nothing built now is thrown
away (the Worker swaps its storage adapter; the tool contract never changes).
