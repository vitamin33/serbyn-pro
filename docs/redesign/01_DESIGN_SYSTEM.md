# 01 — Design System (Kinetic Lab → Tailwind/shadcn)

> Source: `~/Downloads/stitch_ai_systems_architect_portfolio/kinetic_lab/DESIGN.md` + the 4 screen exports.
> Target files: `tailwind.config.ts`, `styles/globals.css`, `components/ui/*`, new `components/lab/*`.

## 1. ⚠️ Token source of truth

`DESIGN.md` contains TWO conflicting palettes:
- **Frontmatter YAML** (Material-You auto-gen): `primary: #c6c6cc` (gray), `secondary: #abc7ff` (blue). Off-brand — primary-as-gray.
- **Prose section** (intentional): Background `#0A0C10`, Surface `#11141A`, Border `#1E2430`, **Accent `hsl(210 100% 52%)` electric blue**, Text `#E6E9EF`, Muted `#8B93A1`.

**Use the PROSE palette.** It matches the screenshots and the current live site (whose primary is already `hsl(210 100% 52%)`). The YAML dump is reference-only.

## 2. Color tokens → `globals.css` CSS variables (HSL)

Keep the existing `--token` HSL pattern; update values. Dark-only (no light theme).

| Token | Value (hex → set as HSL) | Role |
|---|---|---|
| `--background` | `#0A0C10` | page bg (Z-0) |
| `--card` / surface | `#11141A` | cards, sidebar (Z-1) |
| `--popover` | `#1E2430` | popovers/tooltips (Z-2) |
| `--border` | `#1E2430` | hairline strokes |
| `--input` | `#1E2430` | input border |
| `--primary` | `hsl(210 100% 52%)` | accent / CTAs / focus |
| `--primary-foreground` | `#FFFFFF` | text on accent |
| `--foreground` | `#E6E9EF` | primary text |
| `--muted-foreground` | `#8B93A1` | metadata, labels |
| `--secondary` | `#181C25` | chip/hover bg |
| `--ring` | `hsl(210 100% 52% / .4)` | focus glow |
| status-success | green hairline (`#3FB950`) | chip border only |
| status-warning | amber hairline (`#D29922`) | chip border only |

Add a **blueprint grid** utility for hero/section backgrounds: 20px CSS grid in `#1E2430` @ 30% opacity.

## 3. Typography → `tailwind.config.ts` + `globals.css`

Fonts already correct (Inter + JetBrains Mono via `--font-sans`/`--font-mono`). Add a type scale matching DESIGN.md:

| Class | Font | Size/LH/Weight | Use |
|---|---|---|---|
| `.headline-lg` | Inter | 32/40, 600, -0.02em | page H1 |
| `.headline-md` | Inter | 24/32, 600, -0.01em | section H2 |
| `.headline-sm` | Inter | 18/24, 600 | card title |
| `.body-lg` / `.body-md` | Inter | 16/24 · 14/20, 400 | prose |
| `.code-md` | JetBrains Mono | 14/20 | code |
| `.label-caps` | JetBrains Mono | 12/16, 500, 0.05em, UPPERCASE | system labels, chips |
| `.metric-lg` | JetBrains Mono | 28/32, 600 | metric strip numbers |

## 4. Radius & spacing

- Radius: components (button/input) `0.5rem`; containers (card/modal) `0.75rem`; selection bars `0.25rem`/sharp. (Current `--radius: 0.75rem` stays; add `--radius-sm: 0.5rem`.)
- Spacing: 4px base; 12px internal padding; 24px section separation; 20px grid gutter. Sidebars fixed 240–320px; central column fluid.

## 5. Component inventory (build under `components/lab/`)

| Component | Used on | Spec | Data |
|---|---|---|---|
| `<SidebarNav/>` | all pages (desktop) | fixed 240–280px; category links (Architecture/Infrastructure/Optimization/Research) with counts; "SYSTEM STATUS: ONLINE" dot; Settings/Logout are decorative. | counts from `metrics.json`; categories from case studies |
| `<MetricStrip/>` | home hero | 4 cells, `label-caps` over `metric-lg`; count-up on view; optional sparkline. | `metrics.json` |
| `<StatusChip/>` | work cards, hero badge | monospace 11px; variants: active (blue bg), success/warning (hairline border), neutral. | derived `status_chips[]` |
| `<SystemIdLabel/>` | cards, sections | `01_ARCH_001` muted mono kicker. | derived from category + index |
| `<ProjectCard/>` | work index, home featured | hero variant = 1px blue top-border; system-id, status chips, title, desc, tech tags, impact badge, cover. | `CaseStudy` (extended) |
| `<EssayMap/>` | article | numbered sticky TOC (`01_SUMMARY`…), active-section highlight via IntersectionObserver. | derived from MDX H2 (rehype-slug) |
| `<CodePanel/>` | article (desktop) | sticky right panel, syntax-highlighted (rehype-highlight present), labeled `0N_CODE_IMPLEMENTATION`. | first fenced block or `featured_code` |
| `<TerminalSignup/>` | home footer, blog top ("Kernel Pulse") | terminal-framed email input + JOIN; success state. | `/api/subscribe` (Resend) |
| `<FilterTabs/>` + `<SortSelect/>` | work index | ALL/PLATFORM/INFRASTRUCTURE/OPTIMIZATION; sort by Relevance/Impact/Recent. | client filter over case studies |
| `<Footer/>` (extend) | all | add `RSS_FEED` link (→ `/feed.xml`), X_CORP/LINKEDIN/GITHUB. | static |

## 6. Animation (Motion + View Transitions; GSAP optional)

- Scroll-reveal on sections; magnetic/lift hover on cards; count-up on metric strip; View Transitions for route changes; one GSAP hero moment (blueprint-grid parallax / accent glow). Respect `prefers-reduced-motion`.

## 7. Build order

Tokens (P0) → primitives (`StatusChip`, `SystemIdLabel`, `MetricStrip`, `TerminalSignup`) → composite (`ProjectCard`, `SidebarNav`, `EssayMap`, `CodePanel`) → wire into screens (P2). Keep shadcn primitives; restyle, don't replace.
