# CLAUDE.md — Open Human Design

## Overview

Open Human Design (Open HD) is an open-source Human Design chart application powered by NatalEngine.
Strategy (see `docs/RESEARCH.md`): give away the depth competitors paywall (Variable/PHS, line-level
detail, connection, transits, penta), with calm modern design, accurate calculation, and no
account/tracking — local-first.

## Commands

```bash
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm test         # Unit tests (node --test)
npm run e2e      # Browser smoke test (needs dev server running + Chrome)
```

## Setup

`natalengine` is consumed as `file:../natal-engine` — clone
[Unforced-Dev/natal-engine](https://github.com/Unforced-Dev/natal-engine) as a sibling directory
before `npm install`. CI (`.github/workflows/deploy.yml`) does the same; deploys to GitHub Pages at
https://unforced-dev.github.io/open-human-design/ on push to main.

## Architecture

```
src/
├── main.js            # Slim entry: theme, nav, boot (URL → last person → entry), people switcher
├── styles.css         # Full design system with dark mode
├── bodygraph.js       # SVG bodygraph: planet columns, striped dual activations, hover/click,
│                      #   transit rings, reveal animation, traditional center colors
├── lib/
│   ├── chartdata.js   # computeChart + birth-time sensitivityCheck (±15min diff)
│   ├── location.js    # re-exports natalengine timezone module (Open-Meteo + Intl IANA history)
│   ├── people.js      # saved people, backed by natalengine profile storage (interop)
│   ├── share.js       # birth data ↔ URL params (shareable chart links, ?view= deep links)
│   └── format.js      # esc(), formatBirth()
└── views/
    ├── entry.js       # birth form: place autocomplete, tz chip, manual-offset fallback
    ├── chart.js       # bodygraph + foundation + tabs (Centers/Channels/Gates/Planets/Variable/Cross)
    ├── transits.js    # transit overlay graph + completions
    ├── connection.js  # two-person comparison (saved people or manual)
    └── team.js        # penta/group analysis
```

Single-page app, 4 views. State lives in main.js (`currentData`); views read it via
`chart.js#getCurrentChart()`.

## Key conventions

- Personality = black, right column; Design = red, left column; both = candy stripe.
- Traditional center colors when defined (Head/G yellow, Ajna green, Heart/Sacral red, rest tan);
  undefined = white.
- Timezone is always resolved from IANA history at the birth moment (never longitude estimates,
  never current-year DST). Manual UTC offset stays available as a fallback.
- All interpretive text is original phrasing (Ra Uru Hu's prose is Jovian Archive IP; structure,
  names and numbers are free — see docs/RESEARCH.md §3.1).
- `docs/RESEARCH.md` is the requirements doc: competitive landscape, accuracy spec, content
  inventory, UI direction, P0/P1/P2 roadmap.

## Dependencies

- `natalengine` (file link, see Setup) — all calculation; audited against 5 reference charts
- `vite` — build; `playwright-core` — e2e (drives system Chrome)

## Design System

- Warm neutral palette (light) / dark mode via `data-theme="dark"`
- Fonts: Inter (UI), Crimson Pro (headings)
- Color tokens: `--accent` (warm amber), `--personality` (black), `--design` (red)
- Circuit colors: `--individual` (purple), `--tribal` (red), `--collective` (blue), `--integration` (green)
- Type colors: `--generator`, `--manifesting-generator`, `--manifestor`, `--projector`, `--reflector`
