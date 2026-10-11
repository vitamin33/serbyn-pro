# serbyn.io design system v1: "Claim vs. proof"

Status: built and rolled out site-wide on 2026-10-11, from the Claude Design
export `~/Downloads/serbyn.io — Claim vs. proof.html` (15 boards). Every page
now renders on this system; §8 lists what was done and what is still open.

- Tokens: `styles/theme.css`
- Component styles: `styles/ds.css` (prefix `ds-`)
- Components: `components/ds/*`, imported from `@/components/ds`
- Gallery: `/lab/design-system` (noindex, not linked, not in the sitemap). Each
  board section is rendered light and dark.
- Brief the design answered: `docs/design/claude-design-brief.md`

## 1. What the design is

**Concept.** Every number on the site is a claim. Each one gets checked
against its proof, on screen. Three colors carry the whole system:

| Token | Meaning | Light | Dark |
|---|---|---|---|
| `--claim` (terracotta) | the claim under test, the failure, "before", A-side bars. Fills and borders only. | `#cc7c5e` | `#e0906f` |
| `--claim-text` | terracotta as text or as a chip outline (contrast 5.1:1) | `#9e5136` | `#e0906f` |
| `--baseline` (slate) | the comparison arm, "after", B-side bars | `#4f5b77` | `#8f9fc6` |
| `--accent` (evergreen) | proven, fixed, the action: buttons, links, ticks, focus ring | `#496a62` | `#7fb3a4` |

The surface is paper (`#f5f3ee`) in light and "darkroom" (`#151513`) in dark,
with hairlines, no shadows and no gradients.

**Boards in the export and their status:**

| Board | Status |
|---|---|
| Hero A, evidence ledger | not built. B was chosen. |
| **Hero B, Check this claim (chosen)** | `ClaimCheck` |
| Hero C, the −58% exhibit as hero | not built; the exhibit itself is `CostExhibit` |
| Hero directions at 390 | covered by the responsive CSS |
| Design system: tokens, type, mark | `theme.css`, primitives |
| Signature components | exhibits, price, fit, chain, spec table, newsletter, proof-of-method |
| Chart style D.1–D.5 | `ColumnChart`, `BarChart`, `Waffle`, `StatStrip` |
| Motion system | motion tokens and keyframes |
| Motion lab (strike, threads, intervals) | `ClaimCheck`, `useThreads`, `BarChart motion="interval"` |
| Home, light and dark | home section components |
| /audit offer template | offer blocks |
| /writing wall of exhibits | `PostWall`, `MiniExhibit`, `Masthead` |
| /blog/[slug] post template | reading components |
| Mobile 390 | responsive rules in `ds.css` |
| OG templates 1200×630 | **not built** (see §7) |

## 2. Foundations

**Type** (all self-hosted through `next/font`, so T15c still passes):

| Role | Face | Size |
|---|---|---|
| Giant numeral | Manrope 800, −0.06em | clamp(96px, 13vw, 200px) |
| H1 | Manrope 800 / 1.02 | clamp(42, 5vw, 72). Offer pages 40–66, index 40–64, post 36–60. |
| H2 | Manrope 800 / 1.06 | clamp(30, 3.2vw, 46) |
| H3 | Manrope 800 / 1.2 | 22 |
| Verdict | Newsreader italic / 1.3 | clamp(22, 2.2vw, 30) |
| Lede | Plex Sans 400 / 1.6 | 17–19.5 |
| Body | Plex Sans 400 / 1.62 | 16.5; posts 17 / 1.65, 70ch |
| Eyebrow, label | Plex Mono 500, caps, +0.08em | 12 (11, 10.5) |
| Source label | Plex Mono 400 / 1.5, muted | 12 |

Manrope replaces IBM Plex Sans Condensed as `--display`. Headings everywhere
are now 800 weight with −0.03em tracking (`globals.css`).

**Space:** a 4px base. The steps are 4, 8, 12, 16, 24, 32, 48, 64, 88 and 120.
Sections use 120px vertical padding, 104px on offer pages and 72px on phones.

**Radius:** 2 for bars, 3 for chips, 4 for small controls and diagram boxes,
6 for cards and buttons, 8 for the command palette.

**Layout:** the container is 1240px with a 32px gutter (16px under 600px).
Reading is 70ch, and exhibits, tables and figures break out to 1000px. The
margin column appears at 1200px and up. Header height is 60px (56px on phones
and on posts).

**Breakpoints** (from the boards):
- 1080: hero and cost exhibit go to one column, and the header ID line hides.
- 920: the nav collapses into the MENU sheet, steps stack with ▼ connectors,
  and post rows stack.
- 600: the page gutter drops to 16px and result tiles become rows.

**Theme.**
- Order of precedence: `prefers-color-scheme`, then `html[data-theme]`, then
  `data-theme` on any element.
- `ThemeScript` runs in `<head>` before first paint. It adds `html.js` and
  restores the saved choice from `localStorage.theme`.
- The switch offers light, dark and system. It uses a View Transition: a
  420ms circle grows from the pressed button. Without View Transitions it
  swaps instantly; with reduced motion it cross-fades in 120ms.

## 3. Motion rules (binding)

1. **The grammar is claim → scan → proof → settle, then stillness.**
   - Claim: the element appears provisional, at 55–60% opacity or with a
     dashed outline.
   - Scan: a 2px accent hairline sweeps across it on a linear ease.
   - Proof: the source lifts 6px into place, the tick draws, the badge stamps
     with overshoot.
   - Settle: the provisional styling resolves.
2. **Numbers never count up.** They arrive whole and get verified (T2).
3. **The settled state is the default markup.** Pre-states exist only under
   `html.js [data-reveal]:not([data-seen])`. So with JS off, in print, before
   hydration and with reduced motion, the page shows the final state.
4. **Each sequence plays once.** `useReveal` sets `data-seen` the first time
   the element is 35–40% visible, and replay buttons re-key the subtree.
5. **Only `transform` and `opacity` animate.** Whisker positions use
   container-query units (`cqw`), so nothing extends past its track.
6. **Motion budget by page** (from the brief):
   - Home: high, in two places (the claim check and the cost exhibit).
   - Posts: medium (the key number, mini bars and diagrams).
   - `/writing` and `/work`: low.
   - Offer pages: none beyond hover, press and focus.
   - About, résumé, legal: none.

Motion tokens are in `theme.css`:
- Durations: `--dur-instant` 80, `--dur-quick` 160, `--dur-base` 260,
  `--dur-slow` 420, `--dur-story` 900.
- Easings: `--ease-settle`, `--ease-scan`, `--ease-stamp` (8% overshoot),
  `--ease-exit`.
- Spacing in time and distance: `--stagger` 50ms, `--travel` 6px.

## 4. Component catalogue

S = server component, C = client component. Everything is exported from
`@/components/ds`.

### Primitives (`primitives.tsx`, S)

| Component | Use | Notes |
|---|---|---|
| `Mark`, `Wordmark` | header, footer, OG, favicon | The proven tick on a ledger rule, plus "serbyn" in Manrope 800 and ".io" in mono. |
| `Eyebrow` | every section label | `tone` (fg / accent / claim), `size` (sm / xs) |
| `SectionHeader` | home and offer sections | eyebrow ("01 · …"), H2, intro, optional aside |
| `Verdict` | verdict lines in exhibits and sections | Newsreader italic |
| `GiantNumber` | "0 of 40", "−58%" | |
| `buttonProps()`, `Arrow` | any button-styled `<a>`, `<button>` or `Link` | Variants: primary, secondary (mono outline), inverse. `size="sm"` gives the 40px header button. |
| `TextLink` | inline links | The underline draws on hover. |
| `ProofLink` | "↗ proof" after a number | |
| `Chip` | direction ("Lower is better"), topic (claim outline), accent, outline, dashed | |
| `InterimTag` | numbers that will change | replaces `<Interim>` on migration |
| `Card`, `SignoffStrip`, `Signature` | surfaces | The strip closes a section; the signature reads "serbyn.io · field report". |
| `SourceLabel`, `provenanceOf()` | under every number | Built systems and own platform get an accent tick; employed roles get a muted one. Emits `data-claim-label`. |
| `TierBadge`, `Tier` | A–D verdicts | A square stamp, plus an inline letter |

### Data and exhibits (`exhibit.tsx` S, `bars.tsx` C)

| Component | Use | Motion |
|---|---|---|
| `ExhibitFrame` | the shared frame: eyebrow and topic chip, title, meta, body, verdict, source, strip, signature | none |
| `ExhibitNumber` | inset "In the post · 0 of 40" panel | none |
| `BarChart` | ranked bars with Wilson 95% whiskers computed from `k/n`; `inline` puts value labels inside the bar | `none` / `grow` / `interval` |
| `ColumnChart` | the D.1 paired columns | none |
| `Waffle` | the D.4 one-square-per-item chart | none |
| `StatStrip` | the post stats row (dl) | none |
| `DataTable` | mono caps header over a fg rule; `rowHeaders` for spec sheets; scrolls in its own frame | none |
| `Legend`, `Axis` | chart furniture | none |
| `MiniExhibit` | `/writing` and home row thumbnails. Kinds: bars, cost, served, split, ledger, num. | bars grow once |

### Signature (`signature.tsx`, C)

| Component | Use | Sequence |
|---|---|---|
| `ClaimCheck` | home hero | See below. |
| `ResultTiles` | home "Quantified results" | Arrive at 55% opacity, scan 640ms, source lands at 760ms, tick draws at 820ms. Hover or focus traces a thread from the number to its source. Emits `data-claim`, `data-claim-value` and `data-claim-label`. |
| `CostExhibit` | home −58% centerpiece | See below. |
| `HeadToHead` | D.1 in posts and `/work` | Pick an arm to dim the other one to 25%. |
| `KeyNumber` | post hero figure (`id="key-number"`) | Interval sequence with replay |
| `ReplayButton` | figure corner | |

**`ClaimCheck` sequence.**
1. The marker drops (260ms).
2. A scan reads the rows after it (520ms, linear).
3. With the "ends after edit" ending, the strike draws at scan speed, the
   claim turns terracotta and D stamps at 1260ms with an ink ring.
4. With the passing ending, the strike retracts and the underline draws, and
   A stamps.

With JS off it shows the settled D state and hides the controls.

**`CostExhibit` sequence.** It plays on first view.
1. The scan runs from 260ms.
2. The "after" bar shrinks from the "before" length and changes from
   terracotta to evergreen (900–1420ms).
3. The hatched ghost and "−$48" appear at 1300ms.
4. The chip stamps at 1420ms, and the source appears at 1560ms.
5. The thread draws at 1900ms.

### Offer and narrative (`offer.tsx`, S)

| Component | Use |
|---|---|
| `Chain` | operator protocol, method, timeline steps with ▶ and ▼ connectors |
| `TimelineBar` | 2:5:5 phase bar above the timeline |
| `Deliverables` | numbered grid |
| `FitBoxes` | evergreen "for you", terracotta "not a fit" |
| `NoteRow` | "Scope" note |
| `Price` | **Renders once per offer page (T8).** Splits "from" and "/mo" into small type. Sizes: hero, card, compact. |
| `PriceCard` | offer hero card: price, booking CTA, email CTA, 2×2 trust strip |
| `OfferColumns` | home offers: three link columns plus the Advisory/upsell footnote |
| `Faq` | `<details>` with chevron and a `#` anchor. Works without JS. |
| `TermsList` | "How engagements are run" |
| `SystemCard` | Ascend, DW, Crest |
| `CapabilityColumns`, `CapIcon` | "Why this mixture is rare" |
| `FieldReportCard` | "Method, demonstrated" |
| `FinalCta` | closing call to action |
| `ProofOfMethodCard` | renders only when the PDF exists or the Loom URL is set |

### Writing and post (`writing.tsx` S, `reading.tsx` C, `newsletter.tsx` C)

| Component | Use |
|---|---|
| `PostWall`, `PostRow`, `MonthHeader` | the `/writing` wall. Rows are date and category, title, and a mini exhibit. The home teaser uses `size="sm"`. |
| `Masthead` | False Green signup. Variants: default (index), `card`, `footer`. States: idle, checking (scan under the field), subscribed, error. POSTs `{email}` to `/api/subscribe`. |
| `Toc` | sticky; marks the section being read, plus "↑ Jump to the number" |
| `ReadingProgress` | "N min left" and the 2px rule (inside the reading header) |
| `MarginNote` | Tufte note in the margin column at ≥1200px, inline "note ·" below that. **It needs a block-flow parent** (`.ds-flow` or `.post-flow`, not flex or grid). |
| `ShortVersion`, `Callout`, `PullQuote` | post blocks; these replace `<Short>`, `<Callout>` and blockquote |
| `SeriesNav` | "In this series · 6 of 7", segment bar, previous and next |
| `RelatedList` | related case studies (meta at end), more posts (date first) |
| `DiscussCta` | end-of-post booking card |

### Shell (`shell.tsx` C, `footer.tsx` S, `nav.ts`)

| Component | Use |
|---|---|
| `SiteHeader` | wordmark, ID line, nav (Offers menu, Work, Writing, About), theme switch, ⌘K, Contact. `reading={{minutes}}` gives the compact post header. The Offers menu works through CSS hover and focus; the mobile menu is a `<details>`. Both work without JS. |
| `ThemeSwitch` | light, dark, system |
| `CommandPalette` | ⌘K or Ctrl+K. Lists offers, pages and actions; posts are passed in. Arrow keys, Enter and Esc work, and focus returns to the opener. |
| `SiteFooter` | company, site, contact and legal columns, plus the bottom bar. `variant="compact"` is for offer pages. |
| `BookingCta`, `EmailCta`, `OutboundCta` | same contract as `components/site/cta.tsx`: `data-cta`, `data-location`, the PostHog event and UTM params |

## 5. Contracts the components keep

- **Numbers come from `lib/facts.ts`** (or post frontmatter), never typed into
  a component. Intervals are computed with `wilson(k, n)`.
- **Tests stay green:**
  - Every `[data-claim]` has exactly one `[data-claim-label]` (T5).
  - The value carries `data-claim-value`.
  - The offer price renders once (T8).
  - There is no horizontal overflow at 390 or 1440 (T7; the gallery checks at
    0px).
- **Accessibility:**
  - Charts are `role="img"` with a sentence-long label.
  - Threads, scans and ghosts are `aria-hidden`.
  - Tier badges announce "Tier D, no proof".
  - The palette is a combobox and listbox.
  - Every control is at least 44px.
  - The focus ring is the accent outline.

## 6. Verification

Each step below was checked before it was committed:
- `tsc --noEmit` and `next lint` pass, and `next build` passes.
- The Playwright suite passes (62 / 62).
- Screenshots at 1440 light, 1440 dark and 390, with horizontal overflow at
  0px and no console errors. The Vercel analytics scripts return 404 locally;
  that is expected.

Tests changed on purpose:
- **T15a and the diagram dark check:** expect the new `--bg` values,
  `#151513` and `#f5f3ee`.
- **T15a:** looks for the `/audit` link inside `<main>`, since the header
  menu now also links there.
- **Home T2/T5:** reads `[data-claim] [data-claim-value]` instead of
  `.metric-lg`.
- **T10:** accepts either card background (paper or darkroom) as the opaque
  OG corner.

## 7. Where the build departs from the boards

1. **No typing effect on the claim.** The storyboard says "claim types in",
   but the brief rules typing out and the home prototype does not type, so
   the claim fades in.
2. **No Advisory entry in the Offers menu.** There is no `/advisory` page.
   Advisory stays in the offers footnote and on `/fractional`.
3. **No series bar on posts yet.** "In this series · N of M" needs a
   `series:` frontmatter field (name and order), so `SeriesNav` is built but
   not rendered.
4. **Proof-of-method cards stay hidden** until `public/sample-audit-report.pdf`
   exists or `PROOF_LOOM_URL` is set. Their copy no longer says
   "client-anonymized".
5. **No newsletter section on the home page,** as on the board. False Green
   is in the footer link, the `/writing` masthead and the post footer.
6. **Hero A and Hero C are not built;** B was chosen. The Hero C content is
   the `CostExhibit`, placed below the fold as on the home board.
7. **Offer pages render the cost exhibit still** (`CostExhibit still`), to
   keep the motion budget for pages that sell at zero.
8. **Case studies drop the right-rail code panel and the essay map.** They
   use the post reading layout (TOC, post typography).

## 8. Implementation record and open items

**Done, in commit order:**
- **Shell.** SiteHeader (Offers menu, Work, Writing, About, theme switch, ⌘K
  palette with every post, Contact), the compact reading header on posts,
  SiteFooter (compact on offer pages). The old AppShell, navbar,
  footer-legal and case-study header/footer were removed.
- **Home.** Every section on the system.
  - Years changed to 13+ in facts, About, résumé and the SEO copy.
  - Seven posts gained `exhibit:` frontmatter, each value checked against
    the post body.
- **Fonts.** Self-hosted from `app/fonts` with `next/font/local`; builds no
  longer fetch from Google Fonts.
- **Offer pages.** Price card (price once), deliverables, method chain or
  grid, timeline bar and chain, fit boxes, FAQ, method-demonstrated cards,
  advisory card.
- **`/writing`.** The wall of exhibits, grouped by month, with the False
  Green masthead. The unreachable `app/blog/page.tsx` was removed.
- **Post template.**
  - Header, key number from `keyNumber:` frontmatter (on the checkpoint post
    today), TOC, the 70ch column with the margin column, warm code theme,
    restyled article blocks, related lists, discuss card, masthead.
  - `MarginNote` and `PullQuote` in MDX.
  - The title H1 is dropped even after a series note.
- **`/work` and case studies.** Filter and sort without impact scores, cards
  in the exhibit style, case studies on the reading layout. The lab work
  components were removed.
- **About, methodology** (with a flow diagram of one DW run), **legal** and
  **404**. Shadows removed from the shadcn card, button and badge. Résumé
  team size aligned to 2–6.
- **Charts.** `scripts/render-charts.mjs` renders the four charts the posts
  use, light and dark. The post renderer shows the one that matches the
  theme.
- **OG and icons.** Four templates in `lib/og-card.tsx` (TTFs in
  `lib/og-fonts`). `scripts/render-icons.mjs` renders the favicon set, logo
  and manifest colors from the mark.
- **Cleanup.** The old CTA, Stat and Reveal components, the legacy utility
  classes and the old post layout CSS were removed.

**Open items (need a decision or an artifact):**
- **Series.** Add `series:` frontmatter if posts should show "In this series
  · N of M".
- **Key numbers on more posts.** Add `keyNumber:` to the verifier-gap and
  self-verification posts; the same rule applies: every value from the body.
- **Proof of method.** The sample audit PDF and the Loom walkthrough (see
  the brief, Part 0).
- **`contamination-depth.png`** is unused by any post and still in the old
  palette. Re-render it from the raw records if a post needs it.
- **`/lab/design-system`** stays as the living gallery (noindex, not
  linked).
