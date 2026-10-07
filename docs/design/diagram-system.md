# Diagram system for serbyn.io

Status: decided 2026-10-07. Supersedes the "Kinetic Lab" palette in
`docs/redesign/01_DESIGN_SYSTEM.md` for colors, type and diagrams.

Reference: `~/research/design-reference/proof-of-green-mechanics.html` (and its
screenshot). Everything below is measured against that page.

## 1. The question

How do we make diagrams like the reference:

1. **reusable in posts** (a post writes `<FlowDiagram …/>`, not 80 lines of SVG),
2. **themeable in both modes** (light, dark via `prefers-color-scheme`, dark or
   light forced via `data-theme`), with no second render,
3. **static SVG from the server** (visible with JavaScript off, in RSS readers
   that keep inline SVG, and to crawlers),
4. **accessible** (`<svg role="img" aria-label>` plus a caption that states the
   claim),
5. **quick to author** (a post diagram in 10 to 20 lines of data),

and how much does each option cost in client bundle and in looks?

## 2. What the reference does, in mechanics

- Inline `<svg viewBox="0 0 960 H">`, `width: 100%`, `min-width: 760px`, inside a
  bordered surface (`.diagram`, 1px `--line`, radius 6px, padding 14px) that
  scrolls horizontally on phones. The page never scrolls sideways.
- All color comes from CSS classes that read the tokens (`.b`, `.b-acc`, `.ln`,
  `.ln-acc`, `.t-h`…). No color is baked into the SVG, so the dark set applies
  with no re-render. This is the property every option below has to keep.
- Arrowheads are `<marker>`s filled with the same classes.
- Text sizes are tiny and fixed in user units (10.5 to 13px at 960 wide). The
  `min-width: 760px` keeps them at or above about 79% scale.
- Placement is by hand: 4px radius boxes on a loose 10px grid, 20px gutters.

## 3. Options compared

Scores: ✓ good, ~ workable with effort, ✗ fails the criterion.

| Criterion | A. Typed SVG primitives, hand placement | B. A + auto-layout (dagre or elkjs) | C. Mermaid themed via CSS vars | D. D2 at build time | E. React Flow |
|---|---|---|---|---|---|
| Reusable in MDX | ✓ components with typed props | ✓ same components | ~ fenced code block, no props, no emphasis API | ~ fenced block plus a build step | ✓ component, but a client one |
| Both themes, no re-render | ✓ classes read tokens | ✓ same | ~ themeVariables want literal colors; mermaid derives colors in JS, so a theme flip needs a re-render or `!important` CSS overrides on its internal classes | ~ D2 writes literal fills; needs a post-processing pass that swaps them for classes | ~ CSS vars work for nodes; edges are SVG, fine |
| Static SVG on the server, no client JS | ✓ React Server Component | ✓ layout runs at build | ✗ today it renders in the browser (raw source until JS). Server render needs headless Chromium (mermaid-cli + Puppeteer) because it measures text in a DOM | ✓ SVG at build, via a Go binary or a 60 MB WASM package | ✗ needs hydration; v12 can SSR, but as HTML divs plus SVG edges, not one SVG |
| Accessible (`role="img"`, label, caption) | ✓ enforced by the type | ✓ | ~ we patch `aria-label` after render (current `content-enhancers.tsx` does this with a generic label) | ~ needs post-processing | ✗ interactive widget semantics, focusable nodes; overkill for a static claim |
| Quick to author | ~ raw primitives: slow. Presets: fast | ✓ for graph-like diagrams | ✓ fastest for a generic flowchart | ✓ fast, nice syntax | ✗ nodes, edges, viewport, handles |
| Looks like the reference | ✓ it *is* the reference vocabulary | ✓ boxes and labels match; edge routing is less deliberate than hand placement | ✗ its own look: rounded nodes, curved edges, its own label boxes and spacing. We fight it with CSS | ~ close in spirit, but its own spacing, fonts embedded as base64 unless configured | ✗ app UI look (handles, controls) |
| Client bundle | 0 KB | 0 KB (layout runs in the RSC at build) | `mermaid.min.js` is 3.2 MB raw, lazy-loaded per post today | 0 KB client; 60 MB dev/build dependency (`@terrastruct/d2` 0.1.33 unpacked) | about 1.2 MB unpacked (`@xyflow/react` 12.12), ~50 KB gzip shipped + CSS |
| Licence | ours | dagre MIT; elkjs EPL-2.0 / GPL-3.0 | MIT | MPL-2.0 | MIT |
| Emphasis / edge labels / legend / caption | ✓ we design the API | ✓ | ~ `classDef` for emphasis, labels yes, legend no | ~ classes and labels yes, legend no | ~ custom node types |

Notes on the closer calls:

- **dagre vs elkjs.** elkjs has better layered layouts and port constraints, but
  it is 8 MB unpacked (GWT-transpiled Java), async, and dual EPL/GPL licensed.
  `@dagrejs/dagre` (3.1.1, MIT, 1.4 MB unpacked) is synchronous, handles edge
  labels as layout objects, and is the same algorithm mermaid uses for flowcharts.
  The graphs we draw have 4 to 15 nodes; dagre is enough.
- **Mermaid on the server.** Mermaid measures text with `getBBox`, so a pure Node
  render is not possible. Pre-rendering through Chromium at build would work but
  adds Puppeteer to the build for a diagram style we do not want as the default.
- **D2.** The nicest text syntax of the lot. It loses on look (we would
  post-process its SVG into our classes anyway) and on weight.

## 4. Decision

**Typed SVG primitives rendered on the server, with presets per diagram kind.
Auto-layout (dagre) only inside the two presets where hand placement does not
scale: the generic graph and the state machine, plus the shared node positions
in the comparison preset. Mermaid stays as the themed fallback for one-off
diagrams nobody wants to hand-place.**

This matches the expectation in the brief. The one thing I would add: hand
placement stays available as a first-class path. The three reference diagrams
are rebuilt with primitives at the same coordinates, because a diagram that
carries a post's main claim deserves deliberate placement; presets are for the
other 80%.

Fallback order when a preset does not fit:

1. `<Diagram>` + primitives, hand-placed (any shape, exact control).
2. `<GraphDiagram>` (dagre) for anything that is "nodes and arrows" with more
   than ~8 nodes or crossing edges.
3. A ```` ```mermaid ```` fence (sequence diagrams, gantt, class diagrams): it
   renders in the browser and reads the same tokens at render time.

### Dependencies this adds

| Package | Why | Where it runs |
|---|---|---|
| `@dagrejs/dagre` | Layered layout for `GraphDiagram`, `StateMachine`, and shared node positions in `ComparisonDiagram`. Writing a Sugiyama layout by hand is 300+ lines to get edge crossings and long-edge routing right. | Server only (RSC at build). 0 KB client. |
| `@mdx-js/mdx` (already in `node_modules` as a dependency of `@mdx-js/loader`, now declared directly at the same 3.1.0) | Posts are **not** compiled as MDX today: `app/blog/[slug]/page.tsx` turns markdown into HTML with a hand-written converter, so `<FlowDiagram/>` in a post would print as text. Posts that set `mdx: true` in frontmatter are now compiled with `@mdx-js/mdx` `evaluate()` in the server component. Existing posts keep the old converter, so nothing they render changes. | Server only. 0 KB client. |

No other runtime dependency. Fonts come through `next/font/google`, which
downloads IBM Plex at build and serves it from our own origin (test T15c).

## 5. How the system is built

```
components/diagram/
  tokens.ts        text metrics (Plex widths), tone and tier names
  primitives.tsx   Diagram (figure + svg + caption + legend), Box, Boundary,
                   Arrow, Lane, Marker, Badge, Pill, Diamond, Group, Note,
                   SectionLabel, Divider
  geometry.ts      box anchors, orthogonal routing, arrowheads, label placement
  presets/         flow, loop, architecture, swimlane, comparison,
                   objective-tree, regions, graph, state-machine
  index.ts         public exports
  mdx.tsx          the map handed to the MDX compiler
components/article/  page elements from the reference: Eyebrow, Short,
                   DataTable, Stats, Cards, Callout, Tag, TierBadge, Interim
styles/theme.css  the only place colors and font stacks are defined
styles/diagram.css SVG role classes (.dg-b, .dg-ln-acc, .dg-t-h …)
```

Rules every primitive follows:

- **No color in the SVG.** Fill and stroke come from classes that read the
  tokens. Light, dark and `data-theme` all work with zero JavaScript.
- **No `<defs>` or ids.** Arrowheads are drawn as small triangles at the end of
  the path, so two diagrams on one page never collide on marker ids and the
  components stay plain server components (no context, no `useId`).
- **`label` is required** on every diagram and becomes `aria-label`; the type
  will not compile without it. The caption is required on presets, since the
  caption states the claim.
- **Text width is estimated on the server** from IBM Plex advance widths
  (mono is exact: 0.6 em). Presets size boxes to fit their longest line.
- **Scroll, not shrink.** The frame scrolls on narrow screens; the SVG keeps a
  `min-width` of about 79% of its viewBox width, as in the reference.

### The common preset API

```ts
type PresetProps = {
  label: string;            // aria-label, required
  caption: ReactNode;       // states the claim, required
  emphasis?: string[];      // ids of 1–3 nodes or edges to accent
  legend?: LegendItem[];    // shown only for encodings used 2+ times
  width?: number;           // viewBox width, default 960
};
```

Edges are `{ from, to, label?, id? }`. An edge's id defaults to `from->to`,
so `emphasis={['check', 'stop->check']}` accents a node and an edge.

**Legend rule, enforced in code:** a legend item names an encoding (`accent`,
`muted`, `dashed`, `tier-a`…). The preset counts how many drawn elements use
each encoding and drops legend items used fewer than two times. One accented box
is explained by the caption; three accented boxes earn a legend line.

### The nine presets

| Preset | Data API (short) | Layout |
|---|---|---|
| `FlowDiagram` | `steps[{id,title,sub}]`, `edges?` (default: sequential), `rows?` | Hand-free: equal columns, labeled straight arrows |
| `LoopDiagram` | `nodes[]`, `edges?` (default: cyclic), `exit?{from,title,label}` | Nodes on an ellipse, arrows clipped to box edges, optional exit to the right |
| `ArchitectureDiagram` | `nodes[{id,col,row,colSpan}]`, `boundaries[{id,label,contains[]}]` (nest by containing a boundary id), `edges[]` | 12-column grid; boundaries wrap their children with padding by depth; orthogonal edges |
| `SwimlaneDiagram` | `domain`, `columns[{label,at}]`, `lanes[{label,events[],outcome}]`, `marker{at,label}`, `axis` | Lanes against one time axis, marker line across all lanes |
| `ComparisonDiagram` | `nodes[]`, `before{title,edges}`, `after{title,edges}` | Shared node positions (dagre on the union graph); edges only in `after` are accented, edges only in `before` are dashed |
| `ObjectiveTree` | `root{title, children[{title, children[]}]}` | Objective on top, sub-objectives in columns, key results stacked under each |
| `RegionsDiagram` | `regions[{id,label,x,y,w,h,shape}]`, `items[{label,x,y}]` on a 12×6 grid | Zones and overlaps; ellipse or rect; overlaps tint |
| `GraphDiagram` | `nodes[]`, `edges[]`, `direction` | dagre |
| `StateMachine` | `states[{id,initial,final}]`, `transitions[{from,to,label}]` | dagre; self-loops drawn as arcs; initial dot, final double ring |

The gallery at `/lab/diagrams` renders every preset in both themes, plus the
three reference diagrams rebuilt with primitives.

## 6. What this does not do

- No interactivity (hover, zoom, pan). A post that needs that is a different
  component, and it would be client JS on purpose.
- No automatic layout for the architecture preset. Boundaries are a statement
  about the system, so the author places nodes on the grid.
- Text never wraps automatically inside a box. Give `sub` an array for two lines.
