# ARCANA: Clarity through symbolism

A minimalist tarot reading application. You choose one of four spreads, optionally set an intention, and reveal cards from a freshly shuffled 78-card deck one by one with a 3D flip. Each card is read according to its position, its orientation and the words of your question. When every card is revealed, a synthesis of the whole reading is generated.

Everything runs in the browser. There is no backend, no account and no AI service. Interpretations are composed locally and deterministically from structured card data.

## Running

Requires Node 20+.

```bash
cd arcana
npm install
npm run dev          # http://localhost:5174
npm run check        # typecheck + lint + unit tests + production build
npm run build        # production build into arcana/dist (relocatable: base "./")
npm run preview      # serve the production build
```

Dev tools:

- `/harness/gallery.html` renders the whole deck (front and back) for reviewing artwork. It accepts `?suit=major|cups|swords|wands|pentacles` and `&w=<px>`.
- `npm run shot -- <url> <out.png> [--w --h --mobile --full --reduced --click --press --eval …]` takes a headless screenshot and reports console errors. Run `npx playwright install chromium` once before first use.

## Spreads

| Spread | Cards | Positions |
|---|---|---|
| Single Insight | 1 | Insight |
| Three Perspectives | 3 | Past · Present · Future |
| Deeper Perspective | 5 | Core · Challenge · Foundation · Guidance · Direction (a cross) |
| Complete Picture | 10 | Celtic Cross: Present, crossing Challenge, Foundation, Recent Past, Conscious Focus, Near Future, plus a staff of Self, Environment, Hopes & Fears, Potential Outcome |

## How a reading works

1. **Begin.** The full deck is shuffled (an unbiased Fisher–Yates shuffle using `crypto.getRandomValues`). The spread's cards are dealt, and each gets an orientation (reversed with probability ⅓). The draw is fixed for the life of the reading. Which card you click never affects which card you get.
2. **Reveal.** A card goes `hidden → revealing → revealed`, each step at most once. Its identity is not in the DOM until the flip begins, and its name and interpretation appear only after the flip settles. "Reveal all remaining" staggers the flips.
3. **Interpret.** Each revealed card shows its keywords, core meaning, a reading for its position, a reflective question and a practical consideration.
   - The position text comes from templates for the position's role (challenge, guidance, foundation and so on). These are tone-aware: a supportive card in the Challenge position reads differently from a difficult one.
   - Your question is scanned for a life area (work, relationships or personal path) and for decision phrasing. The interpretation then adds the card's own wording for that area.
4. **Synthesise.** Once every card is revealed, the reading is summarised from its actual draws:
   - themes per position and tone trajectories
   - elemental dignities between paired positions (same element reinforces, fire–air and water–earth support, fire–water and air–earth oppose)
   - patterns across Major Arcana, suits, court cards, reversals and repeated numbers
   - reflective questions and practical considerations

**Refresh and navigation.** The session (reading, chosen spread, question) is kept in `sessionStorage`, so a refresh restores the reading exactly. The browser Back button returns to the spread selection, where the reading can be resumed. Closing the tab clears everything. Starting a new reading while one with revealed cards exists asks for confirmation first.

## Code map

```
src/
  domain/                       pure, framework-free, unit-tested
    types.ts                    cards, spreads, positions, orientations, readings
    cards/                      authored content: major.ts + one file per suit (78 cards)
    tarotDeck.ts                assembles the deck: ids, names, numerals, elements
    spreadDefinitions.ts        the four spreads and their positions
    spreadGeometry.ts           pixel layouts per spread (wide / compact), shared by stage, preview and diagrams
    shuffleDeck.ts              shuffle, draw, orientation, seeded PRNG for tests
    questionContext.ts          life-area and decision detection for the optional question
    interpretationEngine.ts     card × position × question → interpretation
    readingSynthesis.ts         whole-reading synthesis
    readingModel.ts             create / resolve / validate readings, plain-text export
  artwork/                      original SVG system (200 × 300 card face)
    style.ts                    stroke and fill tokens, geometry helpers
    primitives.tsx              suit emblems, figures, horses, thrones, sky and landscape
    majorArt.tsx, cupsArt.tsx, swordsArt.tsx, wandsArt.tsx, pentaclesArt.tsx
    registry.ts                 card id → illustration
  state/                        reducer (guarded transitions), persistence, session hook (timers, history)
  components/
    cards/                      TarotCard (3D reveal), front, back, artwork
    landing/                    hero, spread selector and diagrams, morphing spread preview
    reading/                    header and progress, spread layout, detail panel and phone sheet, summary, actions
    layout/, ui/                site header, About dialog, buttons, native <dialog>
```

## Accessibility

- Spreads are a native radio group, so arrow keys move between them.
- Cards are buttons in position order. A face-down card's label names only the position.
- Revealing, selecting and dismissing work from the keyboard (Enter, Space, Escape). Focus is always visible.
- Reveals are announced through a live region, and progress is exposed as a progressbar.
- With `prefers-reduced-motion`, the flip becomes a short cross-fade and other motion is removed.

## Publishing

ARCANA is published at [www.lantran.dev/tarot/](https://www.lantran.dev/tarot/). `npm run publish:site` (or `node ../scripts/publish-site.mjs`) builds it and copies `arcana/dist/` into `/tarot/` at the repository root, alongside the home page and the explorer; see the root README. The build uses relative asset paths, so it works from any sub-path.

## Limitations

- The question is read with transparent keyword rules, not language understanding. Unusual phrasing falls back to a general, keyword-based framing.
- Card art is drawn from geometric primitives. Some crowded scenes (several Minor Arcana fives and tens) are deliberately schematic.
- On phones, the ten-card cross uses cards about 90 px wide. Labels carry the names and the focused sheet shows each card large.
- Readings are not saved beyond the browser tab. "Copy reading" is the way to keep one.
