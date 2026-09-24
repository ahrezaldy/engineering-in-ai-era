# Engineering in the AI Era — A Management Perspective

An interactive, web-based talk deck for **SWE Growth Chapter DIY**, 26 September 2026.
Speaker: **Arif H. Rezaldy**. 45 minutes, 25 slides.

The deck navigates like Google Slides or PowerPoint, runs in the browser, and every slide
has real motion and something to interact with. Six slides carry a live 3D scene.

> This is a private, internal talk deck. It is configured **not** to be crawled or indexed
> (see [Privacy](#privacy)). Do not publish it to a public host.

---

## Prerequisites

| | |
|---|---|
| Node.js | 20.9+ (built and tested on 22.x) |
| pnpm | 10+ (built on 12.4.2) |
| Browser | A recent Chrome, Edge, Safari or Firefox with WebGL2 |
| Display | **Desktop only.** No layout below 1024px wide. Comfortable at 1366×850 and up; slide 23 is the densest — measured, its code panes fit whole at 1440×760 and start to scroll at about 1280×700 |

Don't have pnpm? `npm install -g pnpm` (or `corepack enable`, though corepack does not yet
understand pnpm 12's binary layout — the npm install is the reliable route).

## Install and run

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

Other scripts:

```bash
pnpm build        # production build (also runs a full TypeScript check)
pnpm start        # serve the production build
pnpm lint         # ESLint, including the React Compiler rules
```

Present from a production build if you can — `pnpm build && pnpm start`. It removes the
dev-time double-rendering and is noticeably smoother on an older laptop.

---

## Keyboard shortcuts

| Key | Action |
|---|---|
| `→` · `Space` · `PageDown` | Next slide |
| `←` · `PageUp` | Previous slide |
| `Home` / `End` | First / last slide |
| digits then `Enter` | Jump to slide N (the buffer shows at the bottom) |
| `F` | Toggle fullscreen |
| `Esc` | Exit fullscreen → close the shortcuts sheet → toggle the slide overview |
| `?` | Keyboard shortcuts sheet |
| `←` / `→` on slide 21 | Step Junior → Mid → Senior before moving on |
| `1`–`8` on slide 24 | Jump between recap nodes while the pointer is over the graph |

Mouse: edge chevrons, the progress bar (click anywhere on it to seek), chapter ticks on the
progress bar, and the slide counter (bottom right) opens the overview grid.

Deep links: every slide has a URL, e.g. `http://localhost:3000/#/slide/17`. The hash stays
in sync as you navigate, so you can bookmark or share a position.

---

## Presenting notes

- **Slide 2** is the speaker intro. Hover or click a role on the timeline to bring it
  forward; the contact chips are live links.
- **Slide 4** frames the talk: why a management view, your vantage point, and the
  grain-of-salt caveat. Worth saying the caveat out loud rather than leaving it on screen.
- **Slide 5** has a live Yes/No tally — click it while the room raises hands.
- **Slide 20** walks the chain automatically when you arrive, then hands over: click any
  node or stepper pill to jump, *step* to advance, *replay* to run it again. The side
  panels light up as their step is reached.
- **Slide 21** will not advance past Senior until you have stepped through all three levels;
  the `Execute → Solve → Identify & Multiply` line fills in as you go.
- **Slide 23** steps both engineers forward together — press *advance both* repeatedly.
- **Slide 24** plays the argument back automatically on arrival; *play argument* replays it.
- **Slide 25** carries the discussion questions as clickable prompts, so you can run Q&A
  without leaving the slide.

---

## Project structure

```
docs/                   git-ignored — local working material, not part of the repo
  Engineering_in_the_AI_Era_…md   the speaker's source document
  PLAN.md               slide-by-slide plan: content, motion, 3D concepts
  SOURCE-NOTES.md       every point from the source file, grouped by theme, with IDs
src/
  app/
    layout.tsx          fonts, metadata, robots, theme + reduced-motion providers
    page.tsx            mounts DeckProvider + SlideDeck
    globals.css         design tokens (light/dark), type scale, easings
    robots.ts           disallow all crawlers
  lib/
    deck-config.ts      title, speaker, event, date, chapter ranges
    deck-store.tsx      slide index, keyboard, hash routing, overlay state
    motion.ts           shared easings, springs and variants
    transitions.ts      slide transition variants (push, dolly)
    rng.ts              seeded PRNG so 3D scenes lay out deterministically
    three-console.ts    silences three.js's Clock deprecation notice, forwards the rest
    use-reduced-motion-safe.ts
  components/
    deck/               SlideShell, SlideDeck, NavigationBar, ProgressBar,
                        ThumbnailOverview, ShortcutsSheet, JumpOverlay, ThemeToggle
    ui/                 RevealText, Magnetic, Tilt, CodeBlock, FlowChain, Pill,
                        ReducedMotionGate
    three/              ThreeCanvas (dynamic, ssr:false), CanvasInner, SceneKit
    slides/
      index.ts          the slide registry — order, titles, 3D flags, transitions
      S01Intro.tsx … S27Goals.tsx
      scenes/           R3F scenes used by individual slides
  ```

### The slide registry

[`src/components/slides/index.ts`](src/components/slides/index.ts) is the single source of
truth for slide order. Each entry is:

```ts
{
  id: "value-stack",              // stable key, used by AnimatePresence
  title: "The new engineering value stack",
  kind: "content",                // intro | speaker | overview | framing | content | recap | qa
  Component: S12ValueStack,
  has3d: true,                    // shows a "3D" badge in the overview grid
  transition: "dolly",            // "push" (default) or "dolly" for hero slides
}
```

Reorder the array and everything follows: the counter, the overview grid, the progress bar,
the hash routes. If you move slides across a chapter boundary, update `CHAPTERS` in
[`src/lib/deck-config.ts`](src/lib/deck-config.ts) so the ranges stay contiguous.

Each slide receives `slideIndex` as a prop. Use it (rather than importing the registry) when
a slide needs to know whether it is the active one — importing the registry from a slide
creates a cycle.

---

## How to edit slides

**Change the title, speaker or event:** [`src/lib/deck-config.ts`](src/lib/deck-config.ts).

**Change a slide's words:** each slide keeps its content in plain arrays at the top of its
own file, above the component. Editing copy rarely means touching JSX.

**Add a slide:** create `SxxName.tsx` in `src/components/slides/`, export a named component
taking `{ slideIndex }: SlideProps`, wrap it in `<SlideShell>`, then add it to the registry
where you want it.

The `Sxx` number is a unique file id, **not** a deck position — the registry reorders
slides freely, so `S14CLevel` runs at position 14 and `S26Speaker` at position 2. Use the
next free number and let the registry decide the order.

`SlideShell` gives every slide the same gutters and an animated kicker/title block:

```tsx
<SlideShell kicker="02 · The economics" title="What becomes possible" lede="One short line.">
  {/* your content */}
</SlideShell>
```

Pass `bleed` instead for a full-canvas slide (used by the intro, the statement slides, the
recap and Q&A).

**Keep the interactivity bar.** Every slide in this deck has entrance choreography, a
pointer-reactive element, and something to click, drag or step through. If you add a slide,
give it all three — `Magnetic`, `Tilt` and `RevealText` exist to make that cheap.

### Icons

All icons are [Lucide](https://lucide.dev) (`lucide-react`). Swap one by changing the
import and the `Icon` reference in that slide's data array:

```tsx
import { Hammer } from "lucide-react";
const ITEMS = [{ key: "build", Icon: Hammer, title: "Build more", detail: "…" }];
```

Keep `size` around 13–18 and `strokeWidth={1.75}` to match the rest of the deck.

### Illustrations

There are none, by design — and there are **no custom SVG assets** in this repo. Every
visual is either composed from Lucide icons, drawn with Tailwind/CSS/Motion, or generated
procedurally inside an R3F scene. If you want a stock illustration, [unDraw](https://undraw.co)
and [Storyset](https://storyset.com) match this palette well; drop the file in `public/`
and use one source consistently within a slide rather than mixing styles.

### Code blocks

`CodeBlock` highlights with Shiki and fades in line by line:

```tsx
<CodeBlock code={SNIPPET} lang="ts" caption="rooms.ts" startDelay={0.1} />
```

Only `typescript`, `bash` and `json` grammars and the two Vitesse themes are bundled (see
[Performance](#performance)). To add a language, add it to the `langs` array in
[`src/components/ui/CodeBlock.tsx`](src/components/ui/CodeBlock.tsx). Keep snippets under
about 14 lines so they fit without scrolling.

---

## Authoring a new 3D scene

Everything 3D goes through `ThreeCanvas`, which dynamically imports the canvas with
`ssr: false` — R3F cannot run on the server.

```tsx
import { ThreeCanvas } from "@/components/three/ThreeCanvas";
import { PointerCamera, SceneLights, usePalette } from "@/components/three/SceneKit";

<ThreeCanvas camera={{ position: [0, 0, 8], fov: 45 }}>
  <SceneLights />
  <PointerCamera amount={0.5} enabled={!reduced} />
  <YourScene />
</ThreeCanvas>
```

`SceneKit` provides:

- `usePalette()` — the same colors as `globals.css`, already resolved for the active theme.
  **Always take colors from here**, never hard-code a hex, or the scene will not follow the
  theme toggle.
- `SceneLights` — a three-point rig plus a theme-matched `Environment`.
- `PointerCamera` — a damped camera lean toward the cursor.
- `Particles` — a drifting point field, optionally repelled by the pointer.

Rules that keep the scenes well behaved:

- **Never mutate a render value inside `useFrame`.** Read what you need off the frame state
  (`useFrame(({ camera, pointer, clock }) => …)`) or out of a ref. The React Compiler lint
  rules will fail the build otherwise.
- **Use `mulberry32` from `@/lib/rng`, not `Math.random()`**, for any generated geometry.
  Deterministic layout means the scene looks the same on every render and the generating
  `useMemo` stays pure.
- **Guard idle animation with `useReducedMotionSafe()`**, not `useReducedMotion()`.
- **Watch the first-frame time.** `clock.elapsedTime` starts near zero, so a `useRef(0)`
  start-time sentinel never becomes truthy and your animation freezes. Use `useRef<number
  | null>(null)` and compare against `null`.
- Put HTML labels over the canvas rather than inside it where you can — real type beats
  `drei/Text`. Where you do use `drei/Text`, keep it above any ground plane or it will be
  hidden behind it.

---

## Theming

`next-themes` with `attribute="class"`. The deck **always opens dark** (`defaultTheme="dark"`,
`enableSystem={false}`) because that is what a projector wants; the toggle is the only thing
that changes it, and the choice persists in `localStorage`.

Colors live as CSS custom properties on `:root` and `.dark` in
[`src/app/globals.css`](src/app/globals.css), exposed to Tailwind through `@theme inline`.
Change a token once and both 2D and 3D follow, because `usePalette()` mirrors the same
values.

The palette carries meaning and the audience learns it on slide 5 — keep it:

| Token | Means |
|---|---|
| `--warn` (amber) | output · volume · the old emphasis |
| `--accent` (indigo) | outcome · value · the new emphasis |

---

## Reduced motion

`prefers-reduced-motion: reduce` is honoured but never turns motion off — it calms it.
Motion's `MotionConfig reducedMotion="user"` drops transform and layout animation while
keeping opacity, and scenes additionally stop idle rotation, auto-orbit, looping pulses and
particle drift.

Use **`useReducedMotionSafe()`** from `@/lib/use-reduced-motion-safe`, not Motion's
`useReducedMotion()` directly. The raw hook reads a media query the server cannot know
about, so using it to pick *initial* styles or `drag` props causes a hydration mismatch. The
wrapper reports `false` until after mount, then the truth.

---

## Performance

Targets 60fps on a 2019-era laptop.

- R3F canvases render at `dpr` 1.5, stepping to 2 when there is headroom and down to 1 when
  drei's `PerformanceMonitor` sees the frame rate drop.
- Only the active slide is mounted. `AnimatePresence` unmounts the previous slide once its
  exit transition finishes, so at most two 3D canvases exist for a fraction of a second and
  usually one.
- Shiki is bundled fine-grained — three grammars and two themes instead of the full set.
  That alone took the static chunks from about 15 MB to 2.4 MB.
- `@react-three/rapier` was evaluated and dropped: nothing left in the deck needs a physics
  engine, and it was not worth the WASM payload.

If a scene feels heavy on the presenting machine, the first levers are the instance counts
at the top of the scene file (`COLS`/`ROWS` in `LatticeField`, `count` on `Particles`, `SEG`
in `CapacityTerrain`).

### Console noise

three.js r183 deprecated `Clock`, and `@react-three/fiber` still constructs one for every
`<Canvas>`. Nothing in this repo can stop that, and Next's dev overlay counted it — the deck
showed a red **"1 Issue"** badge on every 3D slide.

[`src/lib/three-console.ts`](src/lib/three-console.ts) installs a filter through
`setConsoleFunction`, three's own supported logging hook, which swallows that one
deprecation and forwards everything else to the real console. Genuine three.js warnings
still surface. Delete that file once R3F moves to `THREE.Timer`.

`pnpm dev` is otherwise free of warnings and errors.

---

## Privacy

This deck must not be indexed:

- [`src/app/robots.ts`](src/app/robots.ts) serves `User-Agent: * / Disallow: /`
- `metadata.robots` in the root layout sets `index: false, follow: false, nocache: true`
- a literal `<meta name="robots" content="noindex, nofollow, noarchive, nosnippet">` is in
  `<head>` as a belt-and-braces second signal

If you deploy it anywhere reachable, put it behind authentication as well. Crawler
directives are a request, not a control.

---

## Content provenance

Every claim on the talk's slides traces to
`docs/Engineering_in_the_AI_Era_A_Management_Perspective_30-45min.md`, the speaker's own
source document. The exceptions: the speaker intro (slide 2) and the closing slide's contact details come
from <https://ahrezaldy.com/>, and the framing on slide 4 — the talk's goal, the years
working with upper management, and the caveat — was supplied directly by the speaker. All
sources are recorded in `docs/SOURCE-NOTES.md`. [`docs/SOURCE-NOTES.md`](docs/SOURCE-NOTES.md) is that document broken
into numbered notes by theme; [`docs/PLAN.md`](docs/PLAN.md) cites those note IDs per slide.

Nothing was invented. Where the source is explicitly hypothetical — the lines-per-day figure
on slide 15 — the slide labels it as such. That figure is the one number deliberately changed:
the source says 100 → 500 per day, the slide shows 1,000 → 5,000 — the same 5× ratio, scaled
ten times, at the speaker's request and recorded as change 15 in `docs/PLAN.md`. No company metrics, benchmarks or AI
vendors are named anywhere, because the source names none.

If you add a slide, add its source note first.

`docs/` is git-ignored, so a fresh clone will not contain it. The files live with the
speaker; ask for them before editing slide content.

---

## Third-party attribution

| | |
|---|---|
| [Lucide](https://lucide.dev) icons | ISC License |
| [Geist Sans / Geist Mono](https://vercel.com/font) | SIL Open Font License 1.1, served via `next/font` |
| [Shiki](https://shiki.style) + Vitesse themes | MIT |
| [three.js](https://threejs.org), [@react-three/fiber](https://r3f.docs.pmnd.rs), [drei](https://drei.docs.pmnd.rs) | MIT |
| [Motion](https://motion.dev) | MIT |
| Speaker photo (`public/arif-rezaldy.jpg`) | The speaker's own, from <https://ahrezaldy.com/> |
| AGIT / GDP Labs / Mamikos marks (`public/logo-*.png`) | Trademarks of their owners, used solely to identify former employers on the speaker's timeline |
| [unDraw](https://undraw.co) / [Storyset](https://storyset.com) | Not currently used — see [Illustrations](#illustrations) for their terms if you add one |

---

## Repository notes

- **Private.** Internal talk material, not for publication.
- **No tests.** Deliberate — this is a deck, not a product.
- **No custom SVG artwork.** Every visual is composed, drawn in CSS, or procedural. The
  only raster assets are the speaker photo and three company marks on slide 2.
- The repo is initialised with git but **has no commits**; the first commit is yours to make.
