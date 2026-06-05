# Open Human Design — Research & Requirements

> Synthesis of deep research (competitors, accuracy, content, UI/UX, OSS landscape) into an actionable
> requirements document. Goal: build **the best Human Design app in existence** — open-source, free,
> oriented toward simplicity while covering all bases.
>
> Findings marked **[VERIFIED]** survived adversarial fact-checking. **[CORRECTED]** items had an error
> fixed during verification. **[UNCERTAIN]** items need confirmation before shipping as fact.
> **[ENGINE BUG]** flags a concrete defect found in the local `natal-engine` HD calculator.

---

## 1. Competitive Landscape

### 1.1 The market, by segment

| App | Segment | Free tier | Paid | Signature feature | Weakness we exploit |
|---|---|---|---|---|---|
| **MyBodyGraph** (Jovian Archive, official) | Official/premium | Unlimited charts, Type/Strategy/Authority, 40k celeb charts | $49–$129 one-time unlocks; **$349–$1,199/yr** tiers | "AI Ra" (LLM on Ra's lectures) | Most expensive ecosystem; Variable paywalled at $99 |
| **Maia Mechanics (MMI)** | Pro desktop standard | 7-day trial | $89–$1,199 one-time; web $6–$16/mo | Deepest data (Gate-Line-Color-Tone-Base), Penta, DreamRave, Cycles | Windows-only desktop; dated UI |
| **Genetic Matrix** | Best paid value | Unlimited Individual + Connection charts | ~$4–$13/mo **[UNCERTAIN pricing]** | "Talking Charts" audio narration; 500+ views; tropical+sidereal | Account required; UI busy |
| **64keys** (Living Matrix) | German pro | Unlimited charts + 34-pg analyses, GDPR | €180–€1,080/yr | O16/OC16 org analysis, Team Penta | Expensive pro tiers; EU-centric |
| **Human Design App** (id862678884) | #1 mobile | Unlimited charts, transits, Time Travel, I-Ching oracle | weekly/3mo/annual sub | Transit notifications + home-screen widgets | Composite/returns/AI paywalled |
| **myhumandesign / Align** (Jenna Zoe) | Mainstream/beginner | Useful free tier | ~$30/mo | "Ask Jenna AI", daily tips, sleek UI | Non-canonical language; "painful font" complaints |
| **HumanDesign.ai** | AI-first social | Unlimited charts, "Bella" chatbot, 55k celeb, social feed | $8.88–$35/mo | Rapid iteration, social network | AI-centric, depth varies |
| **Neutrino** | Offline mobile/desktop | — | ~$7.49/mo or $46/yr; desktop $199–$599 | Fully offline, Animal & Dream charts | Subscription |
| **HumDes.com** | Free reference | Huge free reference + free Penta/Gene Keys *viewing* | PDF reports paid | 40+ reference sections, 80-country tz | Reports paywalled; reference-only |
| **HD&Me / HumanDesignChart.org / Bodygraph.io** | Free no-account | Full free chart incl. Variables (some) | $49–$249 reports | No signup, plain-English | Shallow depth, single-chart |
| **bodygraph.com** | B2B / white-label | 21-day trial | ~$50/mo or $500/yr | Branded reports, API, WordPress plugin | No perpetual free for individuals |
| **Human Archetypes** | Deep indie | — | $11/mo or $99/yr | 384 I-Ching lines, DreamRave, Cycle charts, Chiron/Lilith | Niche, paid-only |

Sources: https://www.mybodygraph.com/pricing · https://www.maiamechanics.com/ · https://www.geneticmatrix.com/ ·
https://www.64keys.com/ · https://www.humandesignapp.com/ · https://humandesign.ai/plans · https://neutrinoplatform.com/ ·
https://www.humdes.com/en/ · https://hdandme.com/best-human-design-chart-generators/ · https://bodygraph.io/ ·
https://www.jaccunningham.com/blog/human-design-bodygraph-comparison-2025

### 1.2 What users PRAISE (preserve / emulate)

- **Tap-anywhere interactive bodygraph**; pull someone else's chart mid-conversation (fast multi-chart lookup).
- **Celebrity chart libraries** (40k–90k) for learning by comparison.
- **Talking Charts / audio narration** (Genetic Matrix) for auditory learners.
- **Daily transit themes + affirmations** tailored to type; **transit notifications & home-screen widgets**.
- **Offline mode + local data privacy** ("your data stays with you"); **dark mode**.
- **Birth-Time Reliability scoring** (Maia) — builds trust in the chart.
- **AI chat grounded in source material**; **"Time Travel" to any date**; I-Ching oracle.
- **Rapid iteration + responsive support** (HDAI) builds loyalty.

Sources: https://www.humandesignapp.com/ · https://www.vanesshenry.com/blog/human-design-bodygraph-calculators ·
https://www.trustpilot.com/review/humandesign.ai

### 1.3 What users HATE (avoid at all costs)

1. **Paywall overreach** — #1 complaint. "Makes you pay for everything." MyBodyGraph's $349–$1,199/yr is seen as gouging.
2. **Poor writing / typos** — "misspelled words to the point where I'm not sure of the intention of the sentence."
3. **Bugs / crashes** — "the moment I paid the app started to crash and crash and crash."
4. **Billing errors** — users "charged three separate times," double-charged.
5. **No onboarding** — "without a guide I wouldn't know what to do"; users beg for tutorials.
6. **Ugly / painful design** even on $30/mo premium apps.
7. **Accuracy confusion** — users don't grasp birth-time sensitivity and blame the app when Type differs.

Sources: https://justuseapp.com/en/app/1582464555/hd-human-design/reviews ·
https://apps.apple.com/us/app/human-design-hd-birth-chart/id1582464555?see-all=reviews

### 1.4 The gap we fill (our wedge)

**No competitor offers Variable/PHS + Connection + Transits + Returns + Penta all for FREE.** That is the single
biggest opening. Our differentiated position:

1. **Free depth** — give away the Variable/PHS + advanced layers everyone else paywalls.
2. **Beautiful, calm, modern design** — the category is engineer-built and ugly; design quality is the biggest lever.
3. **Progressive disclosure / onboarding** — directly targets the "what do I do with this" complaint.
4. **Trustworthy accuracy** — transparent birth-time/timezone handling + a reliability indicator.
5. **Privacy/offline, no-account** — data stays on device; no signup friction; no surprise charges.
6. **Source-accurate language** — classical Ra terms (optionally offer Quantum/Jenna-Zoe aliases), all original prose.
7. **Open-source engine** (`natalengine`) — the only credible open HD calculation library with an MCP server.

---

## 2. Calculation Accuracy Spec

This is **table stakes**: get it right or lose all trust. Verify output gate-by-gate against bodygraph.io /
humdes.com / Maia Mechanics as ground truth. The local `natal-engine` already implements most of this correctly;
specific defects are flagged **[ENGINE BUG]**.

### 2.1 Ephemeris & coordinate system **[VERIFIED]**

- **Geocentric, tropical zodiac.** Official Jovian/Maia uses Swiss Ephemeris + JPL planetary database.
- `natal-engine` uses **astronomy-engine** (VSOP87 + NOVAS, ±1 arcminute, MIT, pure-JS, no data files). This is
  **more than sufficient**: a gate spans 5.625° and a line 0.9375°, so ±1 arcminute can never flip a line.
  Swiss Ephemeris (0.001 arcsec) is the gold reference but is AGPL/paid and unnecessary for a static site.
- **The dominant error source is birth-TIME uncertainty, not the ephemeris** — design the UX around this fact.
- **Fix the stale comment**: `astronomy.js` header says "Mean node calculation" / "Meeus algorithms" but the
  body uses astronomy-engine `GeoVector` + `Ecliptic` (VSOP87) for planets and a Meeus *true-node* approximation
  for the node. Correct the comments.

Sources: https://github.com/cosinekitty/astronomy · https://support.jovianarchive.com/hc/en-us/articles/4892936418321 ·
https://www.astro.com/swisseph/swepha_e.htm

### 2.2 Gate wheel — 64 gates → zodiac degrees **[VERIFIED]**

- Each gate spans **exactly 5°37'30" = 5.625° = 360/64**, in **Rave-Mandala (I Ching) order, NOT numeric order**.
- Anchored so **Gate 17 begins 03°52'30" Aries** and **Gate 41 begins exactly 02°00'00" Aquarius** (the genesis/
  "HD new year" gate). Gate 25 straddles 0° Aries (28°15'00" Pisces → 03°52'30" Aries).
- `natal-engine` encodes this correctly: `GATE_WHEEL_OFFSET = 358.25` (Gate 25 start = 358°15') with the full
  64-element `GATE_ORDER` array. **Confirmed canonical.**

Full ordered sequence (gate : start degree) — `25:28°15'Pis, 17:03°52'30"Ari, 21:09°30'Ari, 51:15°07'30"Ari,
42:20°45'Ari, 3:26°22'30"Ari, 27:02°00'Tau, 24:07°37'30"Tau, 2:13°15'Tau, 23:18°52'30"Tau, 8:24°30'Tau,
20:00°07'30"Gem, 16:05°45'Gem, 35:11°22'30"Gem, 45:17°00'Gem, 12:22°37'30"Gem, 15:28°15'Gem, 52:03°52'30"Can,
39:09°30'Can, 53:15°07'30"Can, 62:20°45'Can, 56:26°22'30"Can, 31:02°00'Leo, 33:07°37'30"Leo, 7:13°15'Leo,
4:18°52'30"Leo, 29:24°30'Leo, 59:00°07'30"Vir, 40:05°45'Vir, 64:11°22'30"Vir, 47:17°00'Vir, 6:22°37'30"Vir,
46:28°15'Vir, 18:03°52'30"Lib, 48:09°30'Lib, 57:15°07'30"Lib, 32:20°45'Lib, 50:26°22'30"Lib, 28:02°00'Sco,
44:07°37'30"Sco, 1:13°15'Sco, 43:18°52'30"Sco, 14:24°30'Sco, 34:00°07'30"Sag, 9:05°45'Sag, 5:11°22'30"Sag,
26:17°00'Sag, 11:22°37'30"Sag, 10:28°15'Sag, 58:03°52'30"Cap, 38:09°30'Cap, 54:15°07'30"Cap, 61:20°45'Cap,
60:26°22'30"Cap, 41:02°00'Aqu, 19:07°37'30"Aqu, 13:13°15'Aqu, 49:18°52'30"Aqu, 30:24°30'Aqu, 55:00°07'30"Pis,
37:05°45'Pis, 63:11°22'30"Pis, 22:17°00'Pis, 36:22°37'30"Pis` → wraps to 25.

Sources: https://bonniesorsby.com/human-design-gates-by-degree/ · https://www.barneyandflow.com/gate-zodiac-degrees ·
https://jovianarchive.com/pages/gates-and-hexagrams-in-human-design

### 2.3 Design date — 88° of SOLAR ARC, not 88 days **[VERIFIED]**

- The Design imprint is the instant the Sun's tropical longitude was **exactly 88° LESS** than at birth.
- **NOT a fixed 88-day offset.** The Sun moves ~0.953–1.019°/day (faster near perihelion ~Jan 3, slower near
  aphelion ~Jul 4), so 88° ≈ 86.4–89.3 days. A flat 88-day subtraction drifts up to ~1.5 days near solstices —
  enough to flip a gate/line. **This is a real bug source in cheap calculators.**
- **Algorithm**: `target = (personalitySunLong − 88 + 360) % 360`; root-find the exact date+time the Sun hits
  `target`, handling the 0° Aries wrap. Then **sample ALL 13 Design bodies at that one solved instant**.
- `natal-engine` does this correctly (iterative refinement from a ~89-day estimate to the exact moment).

Sources: https://genekeys.com/docs/whats-a-pre-natal-design-unconscious-planet-why-88-degrees/ ·
https://humandesigncollective.com/in-the-shadow-of-the-sun/

### 2.4 The 13 activation points & node type **[CORRECTED]**

- **Exactly 13 activations per side** (Personality = birth, Design = 88°-arc), **26 total**. Column order:
  **Sun, Earth, North Node, South Node, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto.**
- **Earth = Sun + 180°** exactly; **South Node = North Node + 180°** exactly. So only **11 bodies are
  independently computed** (Sun, Moon, Mercury–Pluto, North Node); Earth + South Node derived by opposition.
  **[VERIFIED]**
- **Node type — CORRECTION:** The research claimed Jovian Archive *officially* uses the **true** node. Verification
  found this is **not documented** by Jovian — the official source only specifies "Swiss Ephemeris + JPL." The
  "true node" attribution comes from a third-party analyst.
  - **Recommendation:** default to **TRUE (osculating) node** anyway — it's the dominant HD convention, Genetic
    Matrix defaults to it, and `natal-engine` already computes the true node (Meeus perturbation terms in
    `astronomy.js`). But do **not** present "Jovian officially uses true node" as fact.
  - **True vs mean differ by up to ~1.5–2°** — rarely shifts gate/line, but frequently shifts **Color/Tone/Base**
    of the nodal activations (and thus the Environment & Perspective arrows). **Expose node type as a config
    option** (true default, mean optional) to match arbitrary official charts during QA.

Sources: https://support.jovianarchive.com/hc/en-us/articles/4892936418321 ·
https://www.geneticmatrix.com/learn-hub/calculations/draconic.html · `natal-engine/src/calculators/astronomy.js:280-311`

### 2.5 Line / Color / Tone / Base subdivision **[CORRECTED]**

Recursive **6/6/6/5** subdivision of each gate's arc (note: Base divides by **5**, all others by 6).
Per gate = 6×6×6×5 = **1,080 positions**; total = 64×1,080 = **69,120**.

| Level | Span (degrees) | Span (DMS) | Span (arcsec) | Count |
|---|---|---|---|---|
| Gate | 5.625 | 5°37'30" | 20250 | 64 |
| Line | 0.9375 | 0°56'15" | 3375 | 6 |
| Color | 0.15625 | 0°09'22.5" | 562.5 | 6 |
| Tone | 0.026041667 | 0°01'33.75" | 93.75 | 6 |
| Base | 0.005208333 | 0°00'18.75" | 18.75 | 5 |

**Algorithm** from ecliptic longitude L: find gate via wheel order; `p = offset within gate [0, 5.625)`;
`line = floor(p/0.9375)+1`; then recurse into the remainder for `color = floor(rem/0.15625)+1`,
`tone = floor(rem/0.026041667)+1`, `base = floor(rem/0.005208333)+1`.

**Semantics [VERIFIED]:** Color = motivation/PHS layer; **Tone DETERMINES Variable arrow direction**;
Base = the transcendent root.

**[CORRECTION — birth-time figure]** The research said one Base ≈ "~18 seconds of clock time." **That is wrong**
(it assumed the Sun moves 1°/24h). The Sun moves ~0.9856°/day, so in CLOCK time:

- **1 Base ≈ 7.6 min (~8 min)** · 1 Tone ≈ 38 min · 1 Color ≈ 3.8 hours.

(A Base is still ~18.75 *arcseconds* of solar longitude — only the arc→clock conversion was off, by ~25×.) The
qualitative conclusion stands: **exact birth time is critical for Base / Variable / PHS accuracy** — but the
sensitivity is "minutes," not "seconds." Independent confirmation: humandesignwise.com/sub-strct-5 ("Base changes
≈ every 8 minutes, Tone every 38 minutes, Color every 3.8 hours").

Sources: https://www.jovianarchive.com/Stories/16/Substructure_and_Birth_Time ·
https://humandesignwise.com/sub-strct-5 · https://freehumandesignchart.com/human-design-variable/

### 2.6 Type determination **[VERIFIED]**

Pure function of center definition + motor-to-throat connectivity. Evaluate **in order, first match wins**:

1. **0 centers defined** → **Reflector**
2. **Sacral defined AND a motor connected to Throat** (via a complete defined channel path) → **Manifesting Generator**
3. **Sacral defined** (no motor-to-throat) → **Generator**
4. **Sacral undefined AND a motor connected to Throat** → **Manifestor**
5. else (some centers defined, no Sacral, no motor-to-throat) → **Projector**

The **four motors** are **Sacral, Solar Plexus, Heart/Ego, Root**. "Motor to throat" = a continuous defined path
(direct or through intermediary defined centers) from a motor to the Throat. For MG the Sacral itself counts as
the motor; for Manifestor the path must come from Heart/SP/Root (not Sacral). `natal-engine` implements a BFS for
this — verify it requires a *motor* in the path, not merely any defined path to the Throat.

Sources: https://jovianarchive.com/blogs/human-design-basics/the-4-human-design-types ·
https://www.geneticmatrix.com/learn-hub/types/index.html

### 2.7 Inner Authority hierarchy **[VERIFIED]**

Strict descending precedence, first match wins:

1. **Emotional / Solar Plexus** (if SP defined — outranks all)
2. **Sacral** (SP undefined, Sacral defined)
3. **Splenic** (neither above, Spleen defined)
4. **Ego / Heart** (none above, Heart/Will defined)
5. **Self-Projected** (Projector: none above, G connected to Throat)
6. **Mental / Environmental** ("no inner authority": only Head+Ajna(+Throat), nothing below throat)
7. **Lunar** (Reflector: 0 defined centers; wait a 28-day lunar cycle)

Sources: https://jovianarchive.com/pages/what-is-inner-authority-in-human-design · https://www.humdes.com/en/kb/authority/

### 2.8 Definition (single/split/triple/quadruple) **[VERIFIED]**

= **count of connected components** in the graph of defined centers, where an **edge exists only for a COMPLETE
channel** (both gates active). Hanging (single) gates do **not** connect centers.

- 1 component → **Single** (~41%) · 2 → **Split** (~46%) · 3 → **Triple Split** (~11%) ·
  4 → **Quadruple Split** (~1%) · 0 defined → **No Definition** (Reflector). Max is 4.
- "Small vs large split" (bridgeable by one gate vs needing a full channel) is **interpretive, not a category**.

Algorithm: 9 center-nodes, add an edge per complete channel, run union-find/BFS over defined centers, count components.

Sources: https://jovianarchive.com/blogs/human-design-basics/single-split-triple-or-quad-understanding-your-chart-s-definition-type ·
https://www.geneticmatrix.com/learn-hub/definition/index.html

### 2.9 Profile, Incarnation Cross & angle **[VERIFIED]**

- **Profile = (Personality Sun line) / (Design Sun line)**, e.g. 1/3. The line comes from the Line subdivision of
  the Sun gate in each calc.
- **Incarnation Cross = 4 gates in this load-bearing order: Personality Sun / Personality Earth | Design Sun /
  Design Earth** — e.g. `(32/42 | 56/60)`. Order matters (Personality Sun names the cross). Earth = Sun+180° so
  the four gates are two opposition pairs. **192 crosses = 64 Sun-gates × 3 angles.**
- **Angle by profile:** Right Angle (personal destiny) ← 1/3, 1/4, 2/4, 2/5, 3/5, 3/6 · **Juxtaposition (fixed
  fate) ← ONLY 4/1** · Left Angle (transpersonal) ← 4/6, 5/1, 5/2, 6/2, 6/3.
  - **[UNCERTAIN — boundary case]** Sources disagree on **4/6**: most list it Left Angle, some Right Angle.
    Use the canonical mapping above (4/6 = Left Angle) but flag for QA against MMI.
- Naming format: `[Angle] Cross of [Theme] (g1/g2 | g3/g4)`. The wheel splits into **4 Quarters of 16 gates**
  (Initiation/Civilization/Duality/Mutation) governed by Godheads — needed for full cross naming.

Sources: https://www.geneticmatrix.com/human-design-incarnation-crosses/ ·
https://www.humandesignlifecoaching.com/blog/2017/3/11/quarters-and-godheads-of-the-human-design-mandala

### 2.10 Variable / Four Arrows **[VERIFIED — and an ENGINE BUG]**

Four arrows, each pointing **Left or Right** based on the **TONE (1–6)** of a specific activation:

- **Tones 1, 2, 3 → arrow LEFT** (active/focused/strategic/structured).
- **Tones 4, 5, 6 → arrow RIGHT** (passive/receptive/peripheral/fluid).

| Arrow | Position | Source activation | Column meaning |
|---|---|---|---|
| **Determination / PHS** (digestion) | top-left | **Design Sun** tone | Design / body |
| **Environment** | bottom-left | **Design Node** tone | Design / body |
| **Motivation** (mind) | top-right | **Personality Sun** tone | Personality / mind |
| **Perspective / View** | bottom-right | **Personality Node** tone | Personality / mind |

Convention: **left column = Design**, **right column = Personality**; **top arrows from Sun**, **bottom from
Nodes**. Each arrow's full decode = **Color + Tone** of its activation (Color gives the 6 digestion/environment/
motivation/perspective sub-types; Tone gives the direction). **[UNCERTAIN]** A minority of sources draw the bottom
arrows from Earth rather than Nodes; the teaching-standard (and `natal-engine`) uses Nodes. The 1-3=left / 4-6=right
tone rule is universal.

> **[ENGINE BUG — HIGH PRIORITY]** `natal-engine/src/calculators/humandesign.js` `calculateVariable()` computes the
> arrow direction from **Color** (`const isLeft = (color) => color <= 3`) instead of **Tone**. Per the verified
> spec, **arrow direction is set by Tone (1-3 left / 4-6 right)**. The function already computes the correct tones
> (`determinationTone`, etc.) — the fix is to switch `isLeft(...Color)` to `isLeft(...Tone)` for all four arrows.
> This currently mislabels Variable arrows for any chart where Color and Tone fall on opposite sides of the
> midpoint. **Also note the JSDoc above the function describes the Color-based logic — update it too.**
> Until fixed, every Variable/PHS readout (our headline free differentiator) is potentially wrong.

Sources: https://freehumandesignchart.com/human-design-variable/ ·
https://www.humandesignlifecoaching.com/blog/2017/3/11/the-four-transformations-of-human-design-determination-environment-perspective-motivation ·
`natal-engine/src/calculators/humandesign.js:853-917`

### 2.11 Implementation forks to decide & document

1. **True vs mean node** — default TRUE (convention), expose toggle. (§2.4)
2. **88° vs 88 days** — use solar arc, root-found. (§2.3) ✅ engine correct.
3. **Variable arrow = Tone, not Color** — engine bug, must fix. (§2.10)
4. **Bottom Variable arrow source** = Nodes (teaching-standard), Earth is a minority variant. (§2.10)
5. **Cross angle for 4/6** = Left Angle (canonical), QA against MMI. (§2.9)
6. **Birth-time/timezone** = the largest real error source — see §5.3.

---

## 3. Content Requirements

### 3.1 IP constraints — what is free vs proprietary **[VERIFIED]**

**Decisive precedent:** a 2020 Florence (Italy) court ruled **no copyright exists over the Human Design system
itself** — its ideas, procedures, and methods of representation can be freely discussed, referenced, illustrated.
Reinforced by US 17 USC 102(b) (no copyright over "an idea, procedure, process, system, method of operation").

- **SAFE to use (uncopyrightable facts/structure):** gate numbers, gate↔hexagram mapping (HD gate # = I Ching
  King Wen # exactly), channel gate-pairs, center structure & topology, type/authority/profile/definition
  mechanics, all the **names/labels** (gate, channel, profile, cross names are short factual labels), I Ching
  hexagram names (public-domain ancient text), all calculation logic.
- **MUST AVOID verbatim:** Ra Uru Hu's exact prose/lectures/recordings (Jovian Archive copyright); trademarks
  **"Rave BodyGraph™" and "Rave Mandala™"** (say "bodygraph"/"chart"/"mandala"), "Maia Mechanics," Jovian artwork.
- **Practical rule:** reproduce all STRUCTURE and FACTS freely; write **every interpretive keynote in original
  phrasing**. Anchor original gate write-ups to the public-domain I Ching hexagram name + an original modern keynote.

Sources: https://en.wikipedia.org/wiki/Human_Design · https://web.jovianarchive.com/Terms_and_Conditions

### 3.2 Interpretive text inventory (all original prose)

| Element | Count | Text needed per item |
|---|---|---|
| **Types** | 5 (incl. MG) | aura, strategy, signature, not-self theme, % population |
| **Authorities** | 7 | description, decision practice, which types |
| **Profiles** | 12 | name, life arc, conscious/unconscious line dynamic, harmonious partners |
| **Lines** | 6 | keynote, trigram (1-3 lower/4-6 upper), harmonic pair (1-4, 2-5, 3-6) |
| **Centers** | 9 | theme, defined behavior, undefined/open behavior, **not-self question**, wisdom, biological correlate |
| **Gates** | 64 | gate name, I Ching hexagram name, center, keynote |
| **Gate lines** | 64×6 = **384** | line-level keynote (+ exaltation/detriment per line for depth) |
| **Channels** | 36 | name, gate pair, two centers, circuit, keynote |
| **Circuits** | 3 + Integration | theme, what the energy "wants," sub-circuit streams |
| **Incarnation crosses** | 192 | name `[Angle] Cross of [Archetype]`, 4 gates, quarter/godhead |
| **Variable arrows** | 4 | per arrow: 6 Colors (digestion/environment/motivation/perspective) + Tone direction |
| **Variable substructure** | Color/Tone/Base | 6 Cognitions (Smell/Taste/Outer Vision/Inner Vision/Feeling/Touch), advanced |

`natal-engine` already ships `gate-descriptions.js`, `channel-descriptions.js`, `incarnation-crosses.js` and rich
center definitions — audit these for (a) original phrasing (no Ra verbatim), (b) completeness (384 line-level
texts are the gap most apps paywall — our differentiator), (c) the Variable type tables.

### 3.3 Canonical name tables (uncopyrightable — seed directly)

- **64 gates** — HD gate # = I Ching hexagram # (1:1). Full name lists captured (e.g. 1 Self-Expression / The
  Creative … 41 Contraction/Fantasy/Decrease … 64 Confusion/Before Completion).
- **36 channels** — full gate-pair / name / centers / circuit map captured (see §4.3 table).
- **12 profiles** — 1/3 Investigator-Martyr … 6/3 Role Model-Martyr.
- **6 lines** — 1 Investigator, 2 Hermit, 3 Martyr, 4 Opportunist, 5 Heretic, 6 Role Model.
- **9 centers**, **5 types**, **7 authorities**, **circuitry streams** (Knowing, Centering, Defense, Ego,
  Logic/Understanding, Sensing/Abstract + Integration), **Variable categories** (6 digestion / 6 environment /
  6 motivation / 6 perspective).

Sources: https://freehumandesignchart.com/the-64-human-design-gates/ ·
https://en.wikipedia.org/wiki/List_of_hexagrams_of_the_I_Ching · https://www.geneticmatrix.com/learn-hub/channels/index.html

### 3.4 Depth target

Competitors paywall **Variable/PHS** and **line-level (384) detail**. Our opportunity: **give that depth away with
original text**, surfaced via progressive disclosure (type-card → full substructure). Optional **Quantum HD /
Jenna-Zoe alias layer** for users coming from those ecosystems, with classical Ra terms as the default.

---

## 4. UI / UX Direction

### 4.1 Canonical bodygraph anatomy **[VERIFIED]**

Tall portrait stack (current `viewBox` 851×1309, ~0.65 aspect — correct). Top → bottom:

1. **Head** — upward triangle (crown).
2. **Ajna** — downward (inverted) triangle below Head.
3. **Throat** — square; the central hub (11 gates, most-connected).
4. **G / Identity** — diamond, exact center.
5. **Ego / Heart / Will** — small upward triangle, upper-**right** pocket (smaller than others).
6. **Sacral** — square, lower-center.
7. **Spleen** — triangle on the **left**, pointing inward, mid-low.
8. **Solar Plexus** — triangle on the **right**, mirroring Spleen.
9. **Root** — square at the base.

Spleen (left) and Solar Plexus (right) mirror each other flanking Sacral. Wired by 36 channels.

Sources: https://jovianarchive.com/pages/the-nine-centers-of-the-bodygraph-in-human-design

### 4.2 Color conventions **[VERIFIED — and a correctness fix for our app]**

> **[FIX] `bodygraph.js` currently fills ALL defined centers with one amber color.** The canonical convention
> colors **each center individually**; one uniform amber reads as "wrong" to anyone coming from MyBodyGraph /
> Genetic Matrix (and risks reading the wrong color as the wrong center).

Traditional per-center colors when **defined**:

| Center | Color | Hex family |
|---|---|---|
| Head, G | Yellow | `#f4fa78` |
| Ajna | Green | `#9cfc65` |
| Ego/Heart, Sacral | Red | `#ef5f52` / `#ff0606` |
| Throat, Spleen, Solar Plexus, Root | Brown/tan | `#b9965e` |

**Undefined/open = white** with a thin neutral stroke. Doctrinally "defined = colored, undefined = white" is what
matters, so a cohesive custom palette is *allowed* — but **ship traditional colors as the default** and offer a
**"modern monochrome" theme toggle**.

**Channel / gate activation fill:**

- **Personality-only = BLACK** (conscious / birth).
- **Design-only = RED** (unconscious / 88°-arc prior).
- **Both = black+red stripe** (the canonical "barber-pole"; OR half-black/half-red split). Our app currently
  collapses "both" to a single brown — acceptable simplification, but **true striping (SVG pattern / two stacked
  paths) is the authentic convention**; consider it for fidelity.
- **Hanging gate** (one of two gates active) → render the active half solid, inactive half faint (light gray
  ~0.35 opacity, which the current code does well). Channel does **not** complete.
- **Circuit color** (CLAUDE.md tokens: individual=purple, tribal=red, collective=blue, integration=green) is an
  **optional accent/overlay only — never replaces** the black/red activation coloring.

Sources: https://www.color-hex.com/color-palette/1032222 · https://www.geneticmatrix.com/learn-hub/centers/index.html ·
https://justfollowjoy.com/blog/human-design-101-the-gates-and-channels

### 4.3 Planet columns **[VERIFIED — a commonly-reversed gotcha]**

Two vertical columns of **13 rows** flank the graph:

- **LEFT column = DESIGN = RED = unconscious** (88°-arc before birth).
- **RIGHT column = PERSONALITY = BLACK = conscious** (birth moment).
- **People frequently get this backwards — Design/red on the LEFT, Personality/black on the RIGHT.**

Row order (top→bottom): **Sun, Earth, N Node, S Node, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus,
Neptune, Pluto.** Each row: planet glyph + `gate.line` (e.g. `34.2`); advanced view adds Color/Tone/Base + arrow.
Glyphs: ☉ ⊕ ☊ ☋ ☽ ☿ ♀ ♂ ♃ ♄ ♅ ♆ ♇.

**36-channel reference** (gateA-gateB | Name | Centers | Circuit) — for hover keynotes & circuit coloring:
1-8 Inspiration G-Throat Individual; 2-14 Beat G-Sacral Individual; 3-60 Mutation Root-Sacral Individual;
4-63 Logic Head-Ajna Collective; 5-15 Rhythm G-Sacral Individual; 6-59 Intimacy Sacral-SP Tribal;
7-31 Alpha G-Throat Collective; 9-52 Concentration Sacral-Root Collective; 10-20 Awakening Throat-G Individual;
10-34 Exploration Sacral-G Individual; 10-57 Perfected Form Spleen-G Individual; 11-56 Curiosity Ajna-Throat
Collective; 12-22 Openness SP-Throat Individual; 13-33 Prodigal Throat-G Collective; 16-48 Wavelength Spleen-Throat
Collective; 17-62 Acceptance Ajna-Throat Collective; 18-58 Judgment Root-Spleen Collective; 19-49 Synthesis
Root-SP Tribal; 20-57 Brainwave Spleen-Throat Individual; 20-34 Charisma Sacral-Throat Individual; 21-45 Money
Throat-Ego Tribal; 23-43 Structuring Ajna-Throat Individual; 24-61 Awareness Head-Ajna Individual; 25-51
Initiation G-Ego Individual; 26-44 Surrender Spleen-Ego Tribal; 27-50 Preservation Sacral-Spleen Tribal; 28-38
Struggle Root-Spleen Individual; 29-46 Discovery G-Sacral Individual; 30-41 Recognition Root-SP Individual; 32-54
Transformation Root-Spleen Tribal; 34-57 Power Spleen-Sacral Integration; 35-36 Transitoriness SP-Throat
Collective; 37-40 Community SP-Ego Tribal; 39-55 Emoting Root-SP Individual; 42-53 Maturation Sacral-Root
Collective; 47-64 Abstraction Head-Ajna Collective. **Integration channels:** 10-20, 10-34, 20-34, 34-57.

Sources: https://manifestinghumandesign.com/human-design-planets/ ·
https://amydoyle.com.au/2022/11/28/how-to-read-your-human-design-chart-numbers-and-symbols/

### 4.4 Progressive disclosure ladder **[VERIFIED pattern]**

- **Tier 0 (identity hook, biggest/first):** Type, Strategy, Authority, Profile, Signature & Not-Self theme.
- **Tier 1:** 9 centers (defined vs open) + one-line meanings.
- **Tier 2:** Channels + keynotes.
- **Tier 3:** Gates + Lines.
- **Tier 4 (advanced, collapsed by default):** Variables (4 arrows / PHS), Color/Tone/Base, Incarnation Cross,
  Definition, Circuitry.

Map onto the existing 4-view app: **Foundation panel = Tier 0**, then tabs **Centers / Channels / Gates /
Advanced**, Advanced collapsed by default. Pattern: "surface the next-best action when the previous is complete."

Sources: https://www.mybodygraph.com/ · https://www.geneticmatrix.com/ ·
https://jovianarchive.com/blogs/chart-interpretations-components/how-to-read-your-human-design-chart-a-step-by-step-intro

### 4.5 Onboarding (first chart)

1. **Birth data entry** — date, **EXACT time** (warn: minutes change gates/Profile), birth **place via geocoded
   location with historical timezone** (§5.3).
2. **Reveal headline identity FIRST in plain language** before the graph: "You are a Generator. Your strategy is
   to respond."
3. **Animate the bodygraph filling in** — sequential center-fill; vortex effect for open centers (bodygraph.io
   pattern) — turns a static diagram into a moment.
4. **Guided "explain this to me" tour** — Type → Strategy → Authority → Centers, tap-to-continue.
5. **Plain, confident, non-mystical microcopy** (Co-Star's voice drove virality).
6. **Optional account to save & return** for deeper layers. **Anti-pattern: requiring signup before any result.**

Sources: https://medium.com/demagsign/how-the-design-of-the-astrology-app-co-star-is-conquering-the-masses-d6b6d235c806 ·
https://bodygraph.io/

### 4.6 Interactivity

Every visual element tappable with authored content (Genetic Matrix has ~24k tooltips):

- **Tap gate node** → detail panel: gate name, line, keynote, parent channel, hanging-vs-complete status.
- **Tap/hover channel** → name + keynote + two gates + circuit.
- **Tap center** → defined/undefined meaning + which gates/channels define it + the not-self theme when open.
- **Hover planet row** → highlight the corresponding gate node (bidirectional column↔graph linking = premium touch).
- One **canonical selection state**: selecting a channel highlights both gates + both centers.
- **Persistent side panel on desktop; bottom-sheet on mobile** (not modal popovers). Debounce hover; anchor
  tooltips so they don't jump.

### 4.7 Mobile

- Fit tall portrait graph to viewport height; side columns collapse into a swipe-up "Activations" sheet or two
  narrow rails.
- **Bottom-sheet detail panels** (no hover on touch); **pinch-zoom** (gate numbers get tiny); **min 44×44px tap
  targets** on gate nodes; sticky Type/Strategy/Authority header; avoid two-finger gestures.
- 2025 aesthetic: soft rounded cards, soft gradients (high contrast), subtle microinteractions + haptics; avoid
  stroked/bordered buttons (read as dated). Dark mode + offline = differentiators (we have dark mode via
  `data-theme`).

### 4.8 Modern vs dated

- **Dated:** cramped dense tables, system fonts at small sizes, hard 1px strokes/bordered buttons, flat primaries,
  static PNG charts, no dark mode, purple-galaxy clip-art, everything-visible-at-once.
- **Modern (Co-Star is the north star):** editorial typography with strong hierarchy (our Inter + Crimson Pro is a
  good pairing — lean into large confident headings); restraint & whitespace; distinctive plain-spoken voice;
  **animation as meaning** (center-fill, vortex); subtle depth (soft shadows/gradients); cohesive restrained or
  warm palette (our warm-amber + Crimson Pro avoids the galaxy cliché); dark mode as table stakes.
- Meta-lesson: **treat HD with the craft of any high-quality consumer product** — the category is ugly, so design
  is the biggest competitive lever.

Sources: https://medium.com/demagsign/how-the-design-of-the-astrology-app-co-star-is-conquering-the-masses-d6b6d235c806 ·
https://fuselabcreative.com/mobile-app-design-trends-for-2025/

---

## 5. Engine / Interop Requirements (`natalengine`)

Goal: make `natalengine` **THE open HD engine** — the credible, MIT-licensed, MCP-equipped reference the
ecosystem builds on. (Existing OSS: hdkit is archived/undocumented; human-design-py is a good validation
reference; SharpAstrology.HumanDesign is the most complete data model. The niche for a polished JS engine + app
is wide open.)

### 5.1 Output schema (expose for full interoperability)

No industry-standard HD/astrology JSON exists; the de-facto convention is Kerykeion/Astrologer-API. Expose:

- **26 activations** (13 bodies × {personality, design}), each: `{ planet, side, gate, line, color, tone, base,
  fixingState (exalted|detriment|juxtaposed), absoluteLongitude }`. Absolute ecliptic longitude lets consumers
  re-derive everything.
- **Derived:** `type, strategy, authority, profile (e.g. "3/5"), definition (single|split|triple-split|quad|none),
  definedCenters, openCenters, channels [{ gates, name, centers, circuit, activationType }], incarnationCross
  { gates, name, angle, quarter }, variables { determination, environment, motivation, perspective } each
  { arrow:L|R, color, tone, type }, signature, notSelfTheme`.
- **Reproducibility block:** `birthDateTimeUTC, designDateTimeUTC, ianaZone, resolvedUtcOffset, nodeType,
  ephemeris, engineVersion`.
- **Stable machine IDs** (gate numbers, center keys) **separate from human-readable labels**, so localization /
  Quantum-alias layers can swap labels without breaking consumers.

Sources: https://github.com/g-battaglia/Astrologer-API · https://github.com/CReizner/SharpAstrology.HumanDesign ·
https://humandesignapi.nl/

### 5.2 Engine fixes & additions (priority-ordered)

1. **[BUG] Variable arrows from Tone, not Color** (§2.10) — `calculateVariable()` line ~876. Highest priority.
2. **Node type config** — true (default) / mean toggle for QA against official charts (§2.4).
3. **Variable substructure depth** — expose Color/Tone/Base per activation + the 6 Cognitions (gap vs SharpAstrology).
4. **Birth-time "guess" mode** — enumerate distinct possible charts across an uncertainty window (where line/
   activation flips), à la SharpAstrology `.Guess()`. Directly addresses the unknown-birth-time problem.
5. **Composite / Connection** — channel activation typing: Electromagnetic, Dominance, Compromise, Companionship.
6. **Transit** chart (overlay) + "completes-channel" detection (engine already has `hd-transits.js`, `penta.js`).
7. **Fix stale comments** — `astronomy.js` "Mean node"/"Meeus algorithms" header; `humandesign.js` Variable JSDoc.
8. **ConnectionChart / TransitChart / Returns (Solar/Saturn/Uranus/Chiron) / Cycle** chart types.

### 5.3 Birth data & timezone (the largest real accuracy risk)

- **NEVER store a flat numeric offset.** Store `{ localDateTime, ianaZone, resolvedUtcOffset, isOverridden }` and
  recompute the UTC instant via the IANA zone at the historical date (period-correct DST).
  > **[ENGINE GAP]** `natal-engine/src/geocode.js` currently does `estimateTimezoneFromLocation()` (naive
  > longitude/country offset) — **not IANA-historical**. This will produce wrong charts for DST/wartime/pre-1970
  > births. Replace with an IANA zone + a historical-offset resolver (Luxon / @js-temporal).
- **Geocoding (static-site friendly):** **Open-Meteo Geocoding** is the clear primary —
  `https://geocoding-api.open-meteo.com/v1/search` — no API key, CORS-clean, and **returns the IANA `timezone`
  directly** plus lat/lng/elevation/admin hierarchy (attribution: "Location data based on GeoNames"). Photon
  (komoot) optional for autocomplete; Nominatim only if self-hosted (1 req/s, must cache, CORS-flaky).
- **coords→IANA on device:** bundle **`tz-lookup`** (public domain, ~72KB, browser-friendly) as a fallback;
  resolve historical offsets with **Luxon** or **@js-temporal**.
- **Pre-1970 caveat:** IANA tzdb pre-1970 data is sourced from uncited astrology books and is unreliable —
  **surface an uncertainty warning and allow the user to override the offset** for old/wartime births. Link out to
  astro.com Atlas as the cross-check authority.
- **Birth-Time Reliability indicator** — show how close to a gate/line/tone boundary the chart sits, so users
  trust it (Maia's trust-builder). Sensitivity: ~±4 min ideal; ±15–20 min usually preserves Type+Authority.

Sources: https://open-meteo.com/en/docs/geocoding-api · https://github.com/photostructure/tz-lookup ·
https://data.iana.org/time-zones/tzdb-2022b/theory.html · https://www.astro.com/cgi/aq.cgi?Go=Go

---

## 6. Prioritized Roadmap

### P0 — Credibility (must fix/have; the chart must be RIGHT and TRUSTWORTHY)

1. **Fix Variable arrow bug** — Tone not Color (`humandesign.js`). Blocks our headline free differentiator. (§2.10)
2. **Per-center traditional colors** in `bodygraph.js` (stop the uniform amber) + undefined = white. (§4.2)
3. **Black/red channel + planet-column conventions** — Design/red LEFT, Personality/black RIGHT; render activation
   colors correctly (striping optional). (§4.2–4.3)
4. **Location-based birth entry with historical IANA timezone** (Open-Meteo + Luxon); replace naive offset
   estimation. Add birth-time accuracy warning. (§5.3)
5. **Validate engine output gate-by-gate** vs bodygraph.io / humdes.com / MMI; fix stale comments. (§2.1, §5.2)
6. **No-account, privacy-first, offline-capable; clean writing** (proofread all content; original prose only). (§1.4, §3.1)
7. **Headline-first onboarding + progressive disclosure** (Tier 0 → Advanced collapsed). (§4.4–4.5)
8. **Tap-anywhere interactive bodygraph** with authored tooltips for gates/channels/centers/planets. (§4.6)

### P1 — Differentiators (FREE depth competitors paywall)

1. **Full Variable / PHS view, free** — 4 arrows + 6 digestion/environment/motivation/perspective + Color/Tone/
   Base, original text. (§2.10, §3.2)
2. **384 line-level gate interpretations**, free. (§3.2)
3. **Connection / Composite charts** typed EM / Dominance / Compromise / Companionship. (§5.2)
4. **Transits** — current overlay + completes-channel detection + daily transit theme. (§5.2)
5. **Saved charts library** (local-first) + optional **celebrity charts** for learning. (§1.2)
6. **Incarnation Cross with named archetype + quarter/godhead** (192 crosses). (§2.9)
7. **Beautiful, calm, modern design** — editorial type, animated reveal, dark mode, mobile bottom-sheets. (§4.8)
8. **Node-type & "guess across time window" QA tooling**; Birth-Time Reliability indicator. (§5.2–5.3)

### P2 — Delight (pro-tier parity & polish)

1. **Returns** (Solar/Saturn/Uranus/Chiron) + **Cycle** charts. (§1; engine work §5.2)
2. **Penta / Team** group analysis (engine has `penta.js`) + perfect-Penta detection. (§1.4 — under-served niche)
3. **DreamRave / Sleep** chart (5 centers, 15 gates, 88°-of-Moon-movement calc).
4. **AI chat grounded in our original source text** (avoid Ra-verbatim training). (§1.2)
5. **Transit notifications + home-screen widgets**; **"Time Travel"** to any date; **I-Ching oracle**. (§1.2)
6. **PDF export**, **mandala/wheel view**, **audio narration** (Talking-Charts-style), multi-language. (§1.1)
7. **Quantum-HD / Jenna-Zoe alias label layer** (classical Ra default). (§3.4)
8. **MCP server parity** — expose the full HD schema (§5.1) so `natalengine` becomes the ecosystem's open engine.
