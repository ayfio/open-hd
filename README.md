# Open Human Design

**Free, open-source, interactive Human Design charts — all the depth, none of the paywall.**

**[→ Open the app](https://unforced-dev.github.io/open-human-design/)**

Every other Human Design tool charges for the deep layers. Open HD gives you the complete chart
for free, calculated precisely, in an interface designed to be calm rather than overwhelming:

- **Full bodygraph** — canonical layout with Design (red) and Personality (black) planet columns,
  traditional center colors, candy-striped dual activations, tap any gate for detail
- **Type, Strategy, Authority, Profile, Definition** — with plain-language explanations first,
  jargon second
- **Variable / PHS** (the four arrows) — determination, environment, motivation, perspective with
  color, tone and cognition
- **Planetary activations** — all 26, with line/color/tone/base substructure
- **Incarnation Cross** — canonical naming with the gates quartet, plus the Gene Keys
  activation sequence
- **Transits** — any date overlaid on your chart, with channel completions
- **Connection charts** — electromagnetic / companionship / compromise / dominance between two people
- **Team analysis** — Penta roles and group dynamics
- **Birth-time reliability check** — see honestly whether a ±15 minute error would change your chart

## Accuracy

- Planetary positions from [astronomy-engine](https://github.com/cosinekitty/astronomy)
  (VSOP87, ±1 arcminute — a gate spans 5.625°, so far beyond chart-flipping precision)
- Design calculated at **exactly 88° of solar arc** before birth (root-found, not "88 days")
- Birth place → IANA timezone → **historical UTC offset at the birth moment** (wartime DST,
  half-hour zones, the works) — never longitude guessing
- Calculation engine validated against five fully-documented reference charts (Ra Uru Hu,
  Einstein, Marilyn Monroe, Madonna, Amy Winehouse) and the canonical gate wheel (all 64 exact)

## Privacy

No account. No tracking. Charts are computed in your browser and saved to your device only.
Shareable links encode birth data in the URL — share deliberately.

## Development

```bash
git clone https://github.com/Unforced-Dev/natal-engine        # calculation engine (sibling dir)
git clone https://github.com/Unforced-Dev/open-human-design
cd open-human-design
npm install
npm run dev
```

```bash
npm test       # unit tests
npm run e2e    # browser smoke test (dev server must be running)
npm run build  # production build
```

Powered by [NatalEngine](https://github.com/Unforced-Dev/natal-engine) — an open, MIT-licensed
birth chart engine for Human Design, Western astrology, Vedic astrology, and Gene Keys, with an
MCP server for AI integrations.

## License

MIT. Interpretive text is original phrasing. The Human Design system's structure (gates, channels,
centers, mechanics) is uncopyrightable fact; Ra Uru Hu's original prose remains Jovian Archive's,
and none is used here.
