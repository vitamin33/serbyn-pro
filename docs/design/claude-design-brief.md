# serbyn.io: redesign brief for Claude Design

Built from the code on `design/diagram-system` and from `origin/main` (fetched 2026-10-10).
Part 0 is for you. Part 1 onward is the prompt: paste everything from the line
`=== PROMPT START ===` to the end into Claude Design. Attach the three Crest
Research cards (head-to-head, task shape, cache reads) as visual references.

---

## Part 0. For Vitalii, before you paste

### Attach to Claude Design

1. The three Crest Research cards ("4 GPUs, 0 Merges", "Task Shape Picks the Winner", "Cache Reads Do The Work").
2. Optional: a screenshot of `/lab/diagrams` in light and dark, so it sees the diagram system it has to re-skin.
3. Optional: this repo, if Claude Design can read GitHub. The prompt below is complete without it.

### Decisions (settled 2026-10-10)

| # | Topic | Decision | What changes in the code later |
|---|---|---|---|
| 1 | Newsletter | One name: **False Green** (beehiiv). | The signup box drops `KERNEL_PULSE` and its own `/api/subscribe` list and subscribes to beehiiv instead. |
| 2 | `/work` | **Keep it live and link it.** Don't hide it. | Add "Work" to the header and footer, and add "Read the case study" to the Ascend and Crest cards on the home page. |
| 3 | Impact scores | **Hidden.** The "Impact" sort is dropped too. | Remove `impact_score` from the cards and the sort. |
| 4 | Proof-of-method blocks | **Hidden until real.** | Nothing yet. See "What goes in the two hidden blocks" below. |
| 5 | Charts in posts | **One palette.** Every chart is re-rendered in the exhibit style. | Re-render the 5 PNGs on `main` from the chart spec in the prompt. |
| 6 | Years and team size | **13+ years**; teams of **2-6** engineers. | The site says "12+ years" (and "12 years" once) in the hero pillar, About, the About meta description, résumé and `lib/facts.ts`. Change all of them to 13+ during implementation. `CLAUDE.md` still says 11+ and 3-4; I left it alone because it has your uncommitted edits. |
| 7 | OG images | Redesigned in the new language. | `lib/og-card.tsx` |
| 8 | Unused components | Delete `case-study-header.tsx` and `case-study-footer.tsx`. | n/a |
| 9 | `main` is 9 commits ahead | Merge `main` before implementing. | git |

**Why `/work` stays.** It is in the sitemap and indexed, and blog posts link to it. The enterprise case study is the only place your employed work (healthcare with 10k+ users, the Web3 launchpad) is told in detail. Hiding it would remove proof, and the brand is proof. The real problem was only that nothing linked to it.

### What goes in the two hidden blocks

**1. Sanitized sample audit report (PDF, 6–10 pages).** It is the deliverable a buyer pays $3,500 for, shown in advance. It should contain:

- A one-page summary: the system, the scope, the verdict, and the top 3 findings.
- A findings table: ID, finding, severity (critical / high / medium / low), evidence (a trace excerpt, a log line, a test), and the fix with its effort.
- The false-green-rate table: claims checked, claims with proof, and the rate.
- The trust-tier map: what each agent may do (L0–L4) against what it should be gated on.
- The prioritized fix list, sequenced for a gated rollout.
- One page on method and limits: what was tested, what was not, and the sample sizes.

**The honest source is your own system.** Run the audit format on Ascend or DW. You already have the material: the six false greens, the nine eval defects, and the served-model check. A real client report needs that client's written permission even when anonymized.

If you use your own system, change the card copy, because the current text says "with a real (client-anonymized) example". For example: "run on Ascend, a system I designed and built".

**2. Method walkthrough (Loom, 2–3 min).** Record one false green being caught, start to finish. The best candidate is the checkpoint experiment, because it ends in one clear number:

- (0:00) The claim: the agent says "done", and the dashboard is green.
- (0:30) The trajectory: one tool result was silently wrong, and the agent did not notice.
- (1:15) The check the agent cannot skip: the same run with the forced checkpoint, which flags it.
- (2:00) The number: 22 of 40 silent failures with no check, 0 of 40 with the forced check, at the same cost.
- (2:30) What this means for your agents, and the audit.

A second option is a proof-of-green session replay, once the observe week has final numbers.

---

=== PROMPT START ===

# Design serbyn.io: the site of an engineer who checks every "green"

## 1. Who this is for and what it must do

serbyn.io is the consulting site of **Vitalii Serbyn, Agentic Systems Architect** (Easelect LTD, a UK company; he works remotely from Kyiv). He sells fixed-scope work to US, UK and EU teams that run AI agents in production:

- an **AI Agent Production-Readiness Audit** at $3,500
- an **LLM Cost Teardown** from $2,000
- a **Fractional AI Architect** retainer from $4,000/mo
- **Advisory** at $200/hr

His writing is about **false greens**: moments when a system reports success and nothing proves it.

Visitors are CTOs, VPs of Engineering, Heads of AI, senior AI engineers, and the people who screen for them. They come from LinkedIn posts and search. They should leave believing one thing: **this person measures, and every number he shows has its source attached.** The conversion action is **"Book a 30-min systems call"** (Calendly). Email is the second action, and the newsletter is the third.

Design the whole site: the design system, every page, both color themes, desktop and mobile. Use the real content in Appendix A. Do not invent content.

## 2. The concept: "Claim vs. proof"

The whole brand is the gap between what a system **claims** and what it can **prove**. Make that the visual language.

- **Every number is an exhibit.** Present numbers the way the attached Crest Research cards do: a big value, a unit in mono, a bar on a quiet track, a "HIGHER IS BETTER" / "LOWER IS BETTER" chip, and a **source label** under it ("on Ascend, a system I designed and built"). The source label is not small print. It is part of the design, and it is the reason to trust the number.
- **Two colors argue, one color settles.**
  - Terracotta = the claim, the thing under test, "before".
  - Slate = the baseline or comparison.
  - Evergreen = proven, verified, the action to take.
  - Use this mapping on every page, so a reader learns it once and can read every chart, diagram and card after that.
- **Paper, not screen.** Warm off-white paper, hairline rules, cards slightly brighter than the page, no shadows, no gradients, no glow. The page feels like a printed research brief that happens to be interactive.
- **A serif verdict.** Each major section can end with one sentence in a serif face, like the verdict line under the Crest cards ("When 96% of tokens are re-reads, hardware hits a throughput ceiling…"). Use only sentences that already exist in the copy (Appendix A marks good candidates with ⟡). Never write new claims.
- **A sign-off strip.** Cards and sections can close with a 3-cell mono strip, like "ZERO MERGES | 4 H200 GPUS | REAL USAGE LOGS". Use the real trust chips: `FIXED-SCOPE AUDITS | READ-ONLY BY DEFAULT | NDA ON REQUEST | US/UK/EU REMOTE`. End with a signature line `SERBYN.IO · FIELD REPORT`, as the Crest cards end with "CREST RESEARCH".

Make it the most impressive consulting site you can, **as a piece of UI, UX and motion design**. The static frames should hold up as editorial design (Stripe Press, a Bloomberg chart, a lab notebook, an engineering spec sheet). The motion should be the kind people screen-record to share. The rule that makes the two compatible is in §5e: **motion always means something here.** It is the act of checking a claim, made visible.

## 3. Palette (start here, improve it if you can)

Sampled from the attached cards. Every text pairing is checked for WCAG AA. Keep the token **names**: the codebase already uses them, and the diagram system reads them.

| Token | Light | Dark | Role |
|---|---|---|---|
| `--bg` | `#f5f3ee` paper | `#151513` | page |
| `--surface` | `#fdfbf6` | `#1d1c1a` | cards, tables, figures |
| `--fg` | `#1c1b19` (15.5:1) | `#ece8df` (15:1) | text |
| `--muted` | `#6b665d` (5.1:1) | `#a39d92` (6.8:1) | secondary text, source labels |
| `--line` | `#e5e0d7` | `#2e2c28` | hairlines, bar tracks |
| `--accent` | `#496a62` evergreen (5.4:1) | `#7fb3a4` (7.7:1) | proven / primary action / links |
| `--accent-soft` | `#dfe8e3` | `#1f302b` | callout fill |
| `--claim` (new) | `#cc7c5e` terracotta, **fills and borders only** | `#e0906f` | the claim, "before", A-side bars |
| `--claim-text` (new) | `#9e5136` (5.1:1) | `#e0906f` (7.3:1) | terracotta used as text or chip outline |
| `--baseline` (new) | `#4f5b77` slate (6.1:1) | `#8f9fc6` (6.9:1) | the baseline, "after", B-side bars |
| `--tier-a` … `--tier-d` | `#3d6b4f` / `#6b7a2a` / `#b06a00` / `#b3261e` | `#7fc49a` / `#b5c46a` / `#e9a23b` / `#f07167` | proof tiers A (proven) to D (no proof); used by diagrams |

Rules:

- **Primary button:** evergreen fill with white text (6:1). Hover is darker. Never use terracotta fills behind text (white on terracotta is 3.2:1). Ink on terracotta (5.4:1) is fine for a small tag.
- **Outlined chips:** a terracotta outline like "SELF-HOSTED AI" marks a category. A filled beige chip (`--line` background, mono uppercase) marks HIGHER/LOWER IS BETTER.
- **Dark mode** is a "darkroom": the same warmth, not blue-black. It applies:
  - through `prefers-color-scheme`,
  - through `<html data-theme="dark|light">`,
  - and through `data-theme` on any element, so a figure can force a theme.
- **Theme toggle:** design a small light/dark/system toggle for the header. There is none today.
- **Syntax highlighting:** code blocks need a warm theme that fits both modes. Today they are a GitHub-dark block.

## 4. Type

The fonts must be on Google Fonts, because the site self-hosts them at build time. No runtime font requests are allowed.

- **Display:** a heavy, tight grotesk for H1/H2 and big numbers, like the bold headings in the cards. Candidates are Manrope 800, Plus Jakarta Sans 800, Inter Tight 800 and Familjen Grotesk. Today the site uses IBM Plex Sans Condensed 600; you may keep it if you can make it work.
- **Body:** IBM Plex Sans 400/500/600 (already installed).
- **Mono:** IBM Plex Mono 400/500 (already installed). Use it for eyebrows, chips, units, source labels, table headers and nav. Use uppercase with +0.08em tracking for eyebrows.
- **Serif:** for verdict lines and maybe pull quotes. IBM Plex Serif keeps it in one family; Newsreader or Source Serif 4 look closer to the card.

Write out the type scale:

- Use `clamp()` for fluid sizes.
- Body at 16–17px with line-height 1.6–1.65.
- The reading measure is 70ch, and wide elements (figures, tables, exhibits) can break out to a 1000px track.
- Numbers use tabular figures.

## 5. Signature components to design

Design each one as a reusable component with its states:

1. **Exhibit card: single number.** This is the "Cache Reads Do The Work" pattern. It has:
   - an eyebrow and a category chip,
   - an "IN THE POST" style highlight box (big value, LOWER/HIGHER chip),
   - ranked labeled bars on one axis, with the axis range stated,
   - a source line.

   First use: the own-platform LLM bill, **$82 → $34 / month, −58%**, label "on my own platform — small bill, same levers scale with spend".
2. **Exhibit card: head-to-head.** Two sides, terracotta vs slate, with:
   - a "ROWS WON" split bar,
   - metric rows that each carry a direction chip,
   - "PREFER A WHEN / PREFER B WHEN" boxes,
   - a serif verdict,
   - a 3-cell sign-off strip.

   Show it with the real data in Appendix D.1 (single answer vs. trajectory). That is the flagship post, and its numbers are published.
3. **Result tile.** Value, caption and the source label, always together (data hooks `data-claim` / `data-claim-label` must stay on the element). Use it for the 6 home results.
4. **Chain.** Boxed steps joined by ▶, like "More tokens used ▶ List price cut ▶ Cache reads". Use it for the 4-step operator protocol and for offer timelines.
5. **Fit boxes.** The two-box "PREFER A WHEN / PREFER B WHEN" pattern becomes "This is for you if…" (evergreen outline) and "Not a fit if…" (terracotta outline) on offer pages.
6. **Price block.** Price in display weight with terms in mono. It must render **exactly once per offer page** (automated test T8).
7. **Offer card** (×3) and an **offer comparison spec sheet**: price, duration, scope and "best when" side by side.
8. **Terms list.** A definition grid for "How engagements are run": 6 key/value pairs.
9. **FAQ.** Each question is an anchor link (`#faq-…`), and every answer is visible. If you add an accordion, it must work without JavaScript, for example with `<details>`.
10. **Post list row.** Date, reading time and category in a mono meta column, then the title and description.
11. **Newsletter capture: "False Green".** This is the only newsletter name on the site. Text: "measured notes from running AI agent systems in production: what broke, what it cost, what the data showed. 1-2 emails a month." One email field and a button. Today it is a fake "terminal window" with three dots; drop that. Give it a small masthead treatment, like a journal's name. It has success and error states:
    - Success: "subscribed — check your inbox to confirm."
    - Error: "something went wrong — try again."
12. **CTA band.** The booking button (primary) plus the email button (secondary, showing the address) plus the trust chips.
13. **Header and mobile menu.** Covered in §6.
14. **Footer.** Covered in Appendix A.
15. **Article elements.** These already exist in the post template and need a re-skin:
    - eyebrow, lede, "The short version" box,
    - data table, stat strip, cards, callout,
    - interim tag (a small amber "INTERIM" superscript),
    - draft note, tier badge A–D, `<Tag now>`.
16. **Diagram skin.** The site has its own server-rendered SVG diagram system with flow, loop, architecture boundaries, swimlanes, comparison, objective tree, regions, graph and state machine.

    Give it its look: line weights, arrowheads, label boxes, emphasis, legend and caption. Use only the tokens, so it works in both themes. Show one flow and one swimlane example. Emphasis uses `--accent`, and failure or "no proof" uses `--claim` or `--tier-d`.
17. **Chart style: one palette for every chart on the site.** Bars, error bars (Wilson 95% intervals appear often), axis, gridlines, value labels, "n / N" counts under bars, legend, title and subtitle, all in the exhibit style. Color always means the same thing:
    - terracotta = the thing under test or the failure,
    - slate = the baseline,
    - evergreen = the proven or fixed state,
    - `--line` = tracks and gridlines.

    Use the light and dark tokens. Design these five real charts from `main` with the data in Appendix D, so the style is proven on real data:
    - D.1 verifier-gap contrast,
    - D.2 checkpoint silent failures,
    - D.3 self-verification cost,
    - D.4 served vs. requested model,
    - D.5 calibration ledger.

    They will be re-rendered as SVG or PNG to match.
18. **OG image template** (1200×630) for:
    - the home page,
    - the offer pages,
    - a blog post (title + date + category),
    - a case study.

    Use the exhibit-card language: paper background, display title, mono eyebrow, sign-off strip.

Motion and interaction for all of these are specified in §5e and §5f.

## 5b. Signature moments: where to spend the ambition

These are the four things that should make a visitor stop scrolling. Each one is built from real mechanisms and real data. None needs new claims.

1. **"Check this claim": an interactive proof check on the home page.** This is the idea the whole practice sells, played as a 20-second interaction.
   - An agent transcript line appears: *"All tests pass. Done."*
   - Below it is the session's own ledger: `Edit src/orders.py`, `pytest → 3 failed`, `Edit src/orders.py`, and then nothing.
   - The visitor presses **"Check the claim"**. A marker line drops at the last code edit and the ledger after it is scanned. The claim gets graded with a tier badge: **D, no test run after the last edit**.
   - Toggle a second ending (`pytest → 42 passed` after the edit) and the same claim grades **A**.

   The rule comes from Vitalii's proof-of-green tool: a claim counts as proven only if a passing test run happened after the last code edit. Tiers go A (proven) to D (no proof).

   Without JavaScript, both endings render statically side by side. The file names and test counts are illustrative UI, so label them "example".

   Place it right after the hero or inside it (one of the hero directions). It shows the method in a way a CTO gets in seconds and an engineer respects.
2. **Every number links to its proof.** Each exhibit's source line is a link wherever proof exists:

   | Number | Links to |
   |---|---|
   | 1,178 tests, 18+ agents | github.com/vitamin33/ascend-core |
   | 101 runs · 0.94 | /methodology |
   | −58% | the worked example on /llm-cost-teardown |
   | each post exhibit | its post |
   | employed-role numbers (100M+, 80–90%) | no link; they keep the plain label |

   Design the link affordance: a small "↗ proof" or "source" tag. The site practises its own discipline in public.
3. **The writing index as a wall of exhibits.** Each post with a headline number gets a mini exhibit in its row. Use only the data in Appendix D:
   - 0 vs 100%,
   - 22 → 6 → 0 of 40,
   - 1.64x,
   - requested ≠ served,
   - 58 runs · 93%.

   The other posts get the plain row. The index should read like a research program, not a blog roll.
4. **The cost exhibit as a centerpiece.** The −58% bill ($82 → $34) on `/llm-cost-teardown` and on the home page is the "Cache Reads Do The Work" card, done perfectly. Make it the most beautiful single object on the site.

Also give the brand a **mark**. Today it is a green dot plus `serbyn.io` in mono. Propose a wordmark, a small monogram or symbol (an idea: a tick inside a ledger rule, a "proven" mark), a favicon set (16/32/180/512) and how the mark sits in the header, the footer and the OG images.

## 5c. References and anti-references

**Aim for:**
- Stripe Press (typographic seriousness)
- The Economist and Bloomberg graphics (exhibit charts with one point each)
- Our World in Data (source lines under every chart)
- Edward Tufte (data-ink)
- Linear's changelog (calm density)
- Vercel's docs (precision in both themes)
- the attached Crest Research cards (the exact palette and card anatomy)

**Avoid everything that signals "generic AI consultant":**
- purple or blue gradients, glassmorphism, glowing orbs, 3D blobs
- robot or brain illustrations, neural-network line art
- animated count-up numbers, logo walls, star ratings
- motion without meaning: things that float, bob, tilt toward the cursor, or fade in only because they entered the viewport
- scroll-jacking that changes wheel speed or traps the page; pinned sections are fine, hijacked scrolling is not
- "Trusted by" bars, stock photos, emoji
- fake terminal windows

The site should look like it was made by someone who reads the raw records.

## 5d. Who arrives and where they should go

Design for these three entry paths, and make each one short:

1. **A CTO or VP of Engineering from a LinkedIn post** lands on a blog post. They read the short version, see the exhibit, and trust the method. Then they reach the audit through the post's CTA or "Method, demonstrated", and book. The post template must make the step from a post to the offer obvious without being salesy.
2. **A Head of AI from search** lands on `/llm-cost-teardown` or `/audit`. They need the price, the scope, what they get and fit/not-fit within one screen and a scroll, then the FAQ, then a booking.
3. **A senior engineer or recruiter screening Vitalii** lands on home or `/about`. They need, fast: what he does, the labeled numbers, the systems he built, the case studies (`/work`), the résumé, and the writing as proof of thinking.

## 5e. Motion design: "motion is verification"

This is where the site should amaze. Build one motion language from the brand idea and use it everywhere, from a button press to the home page story.

### The grammar: claim → scan → proof → settle

Every meaningful animation on the site is a small act of checking, in four beats:

1. **Claim.** The thing appears in its claimed state: a number, a bar, a status, a "done". It is slightly provisional (terracotta tint, a dashed outline, or a lower-contrast weight).
2. **Scan.** A hairline sweeps across it, like a ledger being read or a test runner passing over a file. This is the signature gesture. It is the one motion people should remember.
3. **Proof.** The evidence lands. The source label slides in under the number, an evergreen tick draws itself, a tier badge stamps on with a small overshoot, and the bar locks to its final length.
4. **Settle.** The provisional styling resolves to the final one, and everything is still.

Apply it at every scale:

| Where | Claim | Scan | Proof | Settle |
|---|---|---|---|---|
| Result tile (home §3) | value fades in at 60% contrast | hairline passes left to right | source label slides up 6px, tick draws | value goes to full contrast |
| Exhibit bars | track appears, bars at 0 | — | bars grow to value in sequence, staggered 60ms, longest last | value labels fade in at bar ends |
| Head-to-head (D.1) | both sides appear equal | the split bar animates to the real split | the serif verdict line fades in (no typing effect) | sign-off strip draws its dividers |
| Diagram (flow, swimlane) | nodes appear in the order of the flow | edges draw along their path (stroke-dashoffset) | the emphasized node gets its accent outline last | caption fades in |
| Swimlane marker line | lanes visible | the "last code edit" marker drops from the top and holds | events after it light up; events before it dim | tier badges stamp in per lane |
| Newsletter / sample-report form submit | button label → "checking…" | a hairline runs across the field | evergreen tick + "subscribed — check your inbox to confirm." | form collapses to the message |
| Booking button | press: 1px down, darker | — | arrow ↗ shoots out and back | — |

**Numbers never count up.** A rolling number shows wrong values on the way to the right one, which is a false reading on a site about false readings. A test also requires every number to be correct with JavaScript off. Instead, numbers arrive whole and **get verified**: the scan passes, and the proof lands.

### Motion budget by page (this overrides everything else in §5e)

The audience is CTOs and Heads of AI deciding whether to trust a consultant. Motion has to make them understand faster or trust more. If it makes them wait, it is a cost.

**The rule: pages that explain may move; pages that sell stay still.**

| Page | Budget | What moves |
|---|---|---|
| Home | **High, in one place** | The "Check this claim" scroll story and the −58% exhibit. Result tiles get the scan **once, as a group**, not per tile. Everything else is static. |
| Blog posts | **Medium** | Diagrams build once, exhibits and charts animate on first view, plus the reading progress and the table-of-contents tick. Prose never animates. |
| `/writing` | Low | Mini exhibits draw once on first view. The shared-element transition into a post. |
| `/work` | Low | The FLIP filter. Card hovers. |
| Offer pages (`/audit`, `/llm-cost-teardown`, `/fractional`) | **Near zero** | Micro-interactions only, plus the cost exhibit on the teardown page. No entrance animations. Price, scope and FAQ are on screen immediately, and nothing makes a buyer wait. |
| About, methodology, résumé, legal, 404 | **Zero** | Micro-interactions only. |

Everywhere: micro-interactions (hover, press, focus, the underline draw) and the theme switch. No element should take longer than 400ms to reach its readable state, except the opt-in home scroll story.

### Signature motion moments (storyboard each one)

1. **Home page: "Check this claim" as a scroll story.** The section pins for about 1.5 viewport heights. It is a pinned section, not hijacked scrolling.
   - At scroll 0%, the agent's line "All tests pass. Done." types in.
   - At 25%, the session ledger rows slide in one by one, monospace and timestamped.
   - At 50%, the "last code edit" marker line drops onto the ledger.
   - At 75%, the scan sweeps the rows after the marker and finds nothing. The claim's text flips from green to terracotta, and the **D** badge stamps on.
   - At 100%, a toggle offers the other ending. Clicking it re-runs the scan, a `pytest → 42 passed` row appears after the marker, and the badge morphs D → A in evergreen.

   Scrolling back reverses everything cleanly. On mobile it plays as a tap-through sequence instead of a pin.
2. **The −58% cost exhibit.**
   - The $82 bar draws at full length first.
   - The scan passes, and the bar shrinks to $34 while the removed portion stays behind as a hatched ghost labeled with the difference.
   - The −58% chip stamps on, and the source line "on my own platform…" slides in.
3. **Theme switch as a "darkroom".** Switching to dark uses a View Transition: a circular reveal that expands from the toggle, or a horizontal wipe in the scan gesture. The palette warms into the darkroom tones. Charts and diagrams re-tint in place without re-layout.
4. **Page transitions with shared elements.** On `/writing`, a post row's mini exhibit **morphs into** the full exhibit under the post's H1 (View Transitions with `view-transition-name`). The offer card on home morphs into the offer page's price block. The header stays fixed through every transition.
5. **Diagrams build as you read.** In posts, each diagram builds once when 40% visible: nodes in flow order, then edges drawing along their paths, then emphasis, then caption. A small "replay" control (↻) sits in the figure corner. It does not autoplay again.
6. **The `/work` filter.** Cards re-sort with a FLIP layout animation: they glide to their new positions, and leaving cards fade and scale to 0.98. The filter chip's count ticks over with a vertical slide of the digit. That is the one place a number may slide, because it is a count of the items you see, not a claim.

### Micro-interactions (the polish layer)

- **Links:** the underline draws from left to right on hover and retracts on leave. External links' ↗ nudges 2px.
- **Buttons:** a press depth of 1px with a darker fill. A 40ms tap response, so it feels instant.
- **Focus:** the focus ring is the scan line, a 2px evergreen outline that draws around the element in 160ms. Keyboard users get the signature gesture too.
- **Exhibit hover and tap:** a crosshair on bar charts, revealing `n / N`, the 95% interval and the source on a small card. Touch gets it on tap.
- **FAQ:** opens with a height animation (`interpolate-size: allow-keywords` where supported). The chevron rotates and the answer's first line fades up 4px.
- **Header:**
  - It compresses from 56px to 48px after 80px of scroll, and the identity line fades out.
  - On posts, a 2px reading-progress hairline runs along its bottom edge, in evergreen.
- **Sticky table of contents** on posts and case studies: the active section's tick slides between items (shared layout). Each item shows a thin progress bar for how much of that section is read.
- **Copy affordances:** code blocks and every exhibit's number get a quiet "copy" / "copy link to this exhibit" on hover. The anchor link pulses once on arrival.
- **Hover previews of internal links** (desktop): hovering a link to another post shows a small card with its title, date and key number, like Wikipedia's page previews. It appears after 300ms and is dismissed on leave.

### Motion tokens (define them like color tokens)

| Token | Value | Use |
|---|---|---|
| `--dur-instant` | 80ms | press, tap feedback |
| `--dur-quick` | 160ms | hover, focus, underline |
| `--dur-base` | 260ms | entrances, chips, badges |
| `--dur-slow` | 420ms | bars, scans, morphs |
| `--dur-story` | 700–1200ms | hero and signature sequences |
| `--ease-settle` | `cubic-bezier(0.2, 0, 0, 1)` | most entrances (fast start, soft landing) |
| `--ease-scan` | `linear` | the scan line only; it reads like a machine |
| `--ease-stamp` | spring, about 8% overshoot | tier badges, ticks, chips |
| `--ease-exit` | `cubic-bezier(0.4, 0, 1, 1)` | exits are faster than entrances |
| `--stagger` | 40–60ms | lists, bars, ledger rows |
| `--travel` | 4–8px | the maximum entrance distance; nothing flies in from far away |

Refine the values. The structure, meaning a small named set used everywhere, is the requirement.

### Engineering rules for motion

- Animate only `transform`, `opacity`, `clip-path` and SVG `stroke-dashoffset`. Never animate layout properties. Hold 60fps on a mid-range Android phone. Interactions should have INP under 200ms.
- **CSS first.** Use CSS scroll-driven animations (`animation-timeline: view()` / `scroll()`) where supported, with an IntersectionObserver fallback. If neither runs, the final state shows.
- Use View Transitions for theme and page transitions, with a plain swap as the fallback.
- A motion library (for example Motion / Framer Motion) is allowed only for the scroll story and the FLIP grid. Say which, and why, in the handoff. The codebase requires a written reason for every new dependency.
- **Without JavaScript,** every element renders in its final, settled state. Animation is added on top, never required.
- **`prefers-reduced-motion`:** scans, morphs and pins become instant state changes or 120ms opacity fades. The scroll story becomes a static two-panel comparison. Nothing that conveys information is lost.
- **Animate once.** An element's entrance plays the first time it is seen, not on every scroll past. Replay is always an explicit control.

## 5f. UI/UX ambitions beyond motion

- **A margin column for evidence (Tufte sidenotes).** On desktop (≥1200px), the reading layout gets a right-hand margin column. Source labels, footnotes, sample sizes and "n is small" caveats live there, aligned to the line they qualify. On mobile they fold inline under the paragraph as small expandable notes. This is the brand made structural: the evidence sits next to the claim, always visible.
- **Giant numerals as section openers.** Pick 3–4 moments across the site where one real number is set at 160–240px in the display face, with its source in mono beneath. Examples: "0 of 40" on the D.2 exhibit, "−58%", "1,178". Treat them like magazine spreads.
- **A command palette (⌘K / Ctrl-K)** for the engineers in the audience. It jumps to any page, post or offer, filters posts by title, and offers actions such as "Book a call", "Copy email" and "Toggle theme". Fully keyboard-driven, with visible shortcut hints in the footer. It is optional enhancement; every destination stays reachable without it.
- **Interactive exhibits.** Head-to-head and ranked-bar exhibits allow toggling which arm is highlighted, and the verdict updates to that arm's line from the source data. Everything is keyboard and screen-reader accessible: each exhibit also has a hidden data table.
- **Reading UX on posts:**
  - estimated time left in the header progress bar,
  - "The short version" pinned as a collapsible summary at the top,
  - a "jump to the number" link that scrolls to the post's key exhibit,
  - next/previous within the "False Greens" series with position "4 of 12".
- **Empty, loading and error states are designed,** not defaulted: form errors, an empty filter result on `/work`, a slow network, JavaScript off.
- **Density control:** the home page alternates rhythm deliberately. Dense exhibit sections are followed by one airy typographic section. Show the vertical rhythm as a diagram in the handoff.

## 6. Navigation and information architecture

Today:

- **Header** (sticky, 56px):
  - wordmark (green dot + `serbyn.io`)
  - identity line `VITALII_SERBYN · AGENTIC_SYSTEMS_ARCHITECT` (shown only on wide screens)
  - nav `AUDIT · COST_TEARDOWN · FRACTIONAL · WRITING · ABOUT`
  - a "Contact" button that opens Calendly
- **Mobile:** a "MENU" toggle that opens a dropdown.
- **`/resume`** has its own simple top nav, because the page is print-optimized.

Keep every route. You may:

- change nav **casing and formatting**, for example "Cost Teardown" instead of `COST_TEARDOWN`, and drop the snake_case "system ID" styling across the site,
- regroup the offers under an "Offers" or "Work with me" menu,
- regroup the nav however you like, but it **must include "Work"** (case studies) in the header and footer. Today nothing links to it.

Do not rename pages or change their URLs.

Routes (all must be designed):

| Route | Page | Notes |
|---|---|---|
| `/` | Home | 10 sections, Appendix A.1 |
| `/audit` | Audit offer | Offer template + "Method, demonstrated" + optional sample-report capture |
| `/llm-cost-teardown` | Cost Teardown offer | Offer template + "Worked example — my own platform" exhibit |
| `/fractional` | Fractional offer | Offer template + Advisory note |
| `/about` | About | Narrative, 3 principles, CTA |
| `/methodology` | DW methodology note | Short explainer with one exhibit |
| `/work` | Case study index | Filter chips (All, Architecture, Infrastructure, Optimization, Research, with counts), sort (Relevance, Recent), card grid |
| `/work/[slug]` | Case study (×3) | Header, highlight metrics, tech tags, sticky table of contents, long-form body, a code panel on xl screens, repo links, CTA |
| `/writing` | Blog index | Header, newsletter, list of 12 posts on `main` (8 on this branch) |
| `/blog/[slug]` | Post | Post template with every article element in §5.15 |
| `/resume` | Résumé | Must print well on A4/Letter. Download PDF uses `window.print()` |
| `/legal/privacy`, `/legal/terms` | Legal | Long text, headings, lists |
| `404` | Not found | Two cards (Audit, Writing) + back home |
| `/newsletter` | Newsletter | Humans are redirected to beehiiv. Only crawlers see the page. A minimal page is fine. |
| `/lab/diagrams` | Internal gallery, noindex | Every diagram preset in both themes |

`/blog` redirects to `/writing`, and `/case-studies/*` redirects to `/work/*`.

## 7. Hard constraints

1. **Content is fixed.** Use the copy in Appendix A word for word: headlines, prices, numbers, labels, FAQs. You may:
   - cut a repeated element,
   - choose which existing sentence becomes the serif verdict,
   - change casing and formatting of labels.

   Do not write new marketing claims, testimonials, client logos or statistics. If a layout needs content that does not exist, leave a clearly marked empty slot and list it at the end.
2. **Every number keeps its source label next to it.** Labels look like "on Ascend, a system I designed and built", "as engineer, in an employed role" and "on my own platform". This rule matters more than the layout.
3. **The price appears once per offer page,** in the hero. The closing CTA on offer pages has no price.
4. **No external requests at runtime.** That means fonts, icons and images are self-hosted. Analytics (PostHog) is the only exception, and it is already handled.
5. **Server-rendered.** Every page reads correctly with JavaScript off, with every animated element in its final state. Interactive parts are progressive enhancement: the filters on `/work`, the mobile menu, the theme toggle, the newsletter form, the ⌘K palette, the scroll story and all motion.
6. **Accessibility:**
   - WCAG 2.2 AA.
   - A visible focus ring in `--accent`.
   - Tap targets of at least 44px.
   - A skip link to `#main`.
   - Diagrams are `svg role="img"` with an `aria-label`.
   - Tables and wide figures scroll inside their own frame.
   - **No horizontal page scroll at 390px.**
7. **Stack:** Next.js 14 App Router, Tailwind, shadcn/ui primitives, CSS custom properties for every color, and `lucide-react` icons. Express the design as tokens plus Tailwind-friendly components.
8. **Keep these CTA hooks:**
   - Booking buttons keep `data-cta="booking"`, and email buttons keep `data-cta="email"`.
   - Each CTA has a location id, listed in Appendix C.

## 8. Deliverables

1. **The design system.**
   - Tokens for light and dark, the type scale, spacing (a 4px base), radii (today 6/4/3px; propose your own) and the grid.
   - Every component in §5 with its states.
2. **Pages.** Every route in §6:
   - **desktop 1440** and **mobile 390**,
   - **light and dark** for Home, `/audit`, a blog post and `/work`,
   - light only for the rest.
3. **The home page hero in three alternative directions** before you commit to one:
   - an "evidence ledger" with the 6 results as exhibits next to the H1,
   - the H1 with the "Check this claim" interaction (§5b.1) as the visual,
   - the H1 with the −58% exhibit card as the visual.

   For each direction, show it at 1440 and 390, and critique it against the quality bar below. Then pick one and say why.
4. **The motion system** (§5e):
   - the motion tokens,
   - a storyboard for each signature motion moment (frames with timings),
   - curves drawn out for each easing,
   - a reduced-motion version of every sequence.
5. **A working interactive prototype** with real motion. It needs:
   - the home scroll story,
   - the cost exhibit sequence,
   - the darkroom theme switch,
   - a writing-row-to-post shared-element transition,
   - a diagram building as it scrolls in,
   - the `/work` FLIP filter,
   - the ⌘K palette,
   - the micro-interactions.

   Motion is judged in motion, not in static frames.
6. **The four signature moments** in §5b, working in a clickable prototype:
   - the proof check, with both endings,
   - proof links,
   - the exhibit wall on `/writing`,
   - the cost exhibit.

   The theme toggle and the `/work` filters should also work.
7. **The brand mark, the OG template, and the chart style** with the five charts from Appendix D.
8. **A short spec per component**: anatomy, tokens used, responsive behavior. A developer will implement it in the existing codebase.
9. **A list of every place where you needed content that does not exist**, so Vitalii can supply it.

### Quality bar (check your own work against it before you show it)

- **The screenshot test.** The home hero, the cost exhibit and one post exhibit should each be good enough that a CTO would screenshot them for a LinkedIn post. If a screen is not screenshot-worthy, redo it.
- **The 5-second test.** On the home page, a stranger can say what he sells, to whom, and why to trust him, from the first screen alone.
- **The source test.** Pick any number on any page. Is its source label next to it, and its proof one click away?
- **The 390px test.** Every page at 390px wide: no horizontal scroll, tap targets of 44px or more, exhibits that reflow without shrinking text below 14px, and tables that scroll inside their own frame.
- **The dark test.** Dark mode is designed, not inverted: the same warmth, and charts that stay readable.
- **The print test.** `/resume` and a blog post print cleanly in black on white.
- **The speed budget.**
  - Lighthouse 95+ on all four categories.
  - LCP under 2.0s on 4G.
  - CLS 0.
  - No client JavaScript on content pages beyond the theme toggle, the menu, the forms and the proof-check interaction.
  - Prefer CSS for motion.
- **The meaning test.** For every animation, say in one sentence what it shows: a claim, a scan, a proof, a state change, or a spatial relationship. If the sentence is "it looks nice", cut it, or make it one of those four.
- **The share test.** Would a designer screen-record the home scroll story, the darkroom switch or the cost exhibit and post it? If not, push it further.
- **The smoothness test.** 60fps on a mid-range phone, no layout shift during any animation, INP under 200ms, and every sequence interruptible: scrolling back or clicking mid-animation never leaves a broken state.
- **The reduced-motion test.** Turn on reduced motion and walk the whole site. Every piece of information is still there.

---

## Appendix A. Content, page by page (verbatim)

`{TRUST_CHIPS}` = "Fixed-scope audits · Read-only by default · NDA on request · US/UK/EU remote"
`{UPDATED}` = "July 2026"
Booking button default label: **"Book a 30-min systems call"** (opens `https://calendly.com/serbyn-vitalii/consulting` in a new tab).
Email button label: **"serbyn.vitalii@gmail.com"** (mailto).

### A.1 Home `/`

**§1 Hero**
- Eyebrow: "agentic systems architect"
- H1: **"I make AI agents reliable enough to run in production."**
- Lede: "I'm Vitalii Serbyn — I work with US, UK, and EU teams to get agent systems production-ready. Two specialties: agent reliability (trajectory evals, false-green-rate metering, evidence-binding gates, trust-tiered execution) and LLM cost engineering (multi-model routing and cost tracking) — bringing spend down without lowering output quality."
- Buttons: Booking (primary, location `hero`) · Email (secondary, `hero`)
- Trust chips: {TRUST_CHIPS}
- Freshness: "Updated {UPDATED}"

**§2 Credibility**: eyebrow "why this mixture is rare", H2 "Reliability and cost, held by the same hands". There are 3 pillars, each with an icon (shield-check / gauge / layers):
1. **Agent reliability engineering**: "Trajectory evals, false-green-rate metering, evidence-binding gates, and trust-tiered L0–L4 execution — the machinery that turns "seems fine" into a number you can gate on."
2. **LLM cost engineering**: "Multi-model routing, semantic caching, and per-service cost tracking that cut the bill without lowering output quality — the same levers whether you spend hundreds or hundreds of thousands."
3. **13+ years of production systems**: "Long before agents: shipping software people depend on — including a consumer app with 100M+ downloads and a Google Play Editor's Choice award, and an 80–90% RPC cost reduction on a Web3 platform, both as an engineer in employed roles."

**§3 Results**: eyebrow "quantified results", H2 "The numbers, each with its context", intro "Every figure below says where it came from — a system I built, my own platform, or an employed role. No borrowed client metrics." ⟡. There are 6 tiles (value / caption / source label):

| Value | Caption | Source label |
|---|---|---|
| 18+ | mature agents (27 total) | on Ascend, a system I designed and built |
| 1,178 | automated tests | on Ascend, a system I designed and built |
| 101 | logged pipeline runs · 0.94 pass rate | on DW, a system I designed and built |
| -58% | LLM bill: $82 → $34 / month | on my own platform — small bill, same levers scale with spend |
| 100M+ | app downloads · Google Play Editor's Choice (Top 100) | as engineer, in an employed role |
| 80–90% | RPC cost reduction on a Web3 platform | as engineer, in an employed role |

**§4 Systems I designed and built**: eyebrow "01_systems_i_designed_and_built" (the casing may change), H2 "Systems I designed and built", intro "Not client logos — my own systems, where I proved the reliability and cost methods I bring to your agents." There are 3 cards:

- **Ascend**
  - Description: "Multi-agent orchestration daemon: trust-tiered L0–L4 execution, policy gates, budget guards, and audit logging across live projects."
  - Metric: "1,178 tests"; caption "6-provider LLM fallback · 18+ mature agents (27 total)"; label "a system I designed and built".
  - Link: "View on GitHub" → github.com/vitamin33/ascend-core
- **DW**
  - Description: "Autonomous spec-driven development pipeline: a spec goes in, working change comes out, gated by acceptance checks before it lands."
  - Metric: "101 runs · 0.94 pass"; caption "logged runs, methodology defined"; label "a system I designed and built".
  - Link: "How runs & passes are counted" → /methodology
- **Crest**
  - Description: "LangGraph-based content engine: multi-stage pipeline with multi-model routing and multi-platform publishing."
  - Metric: "LangGraph"; caption "multi-stage content engine"; label "a system I designed and built".
  - Link: "Visit usecrest.io" (external)

The section ends with the footnote "Built with Python, LangGraph, FastAPI, PostgreSQL, Redis, and Docker."

**§5 Offers**: eyebrow "02_ways_to_work_together", H2 "Fixed-scope offers". There are 3 cards (name / price / terms / summary / "Learn more →"):

| Offer | Price | Terms | Summary | Link |
|---|---|---|---|---|
| AI Agent Production-Readiness Audit | $3,500 | flat · ~2 weeks · fixed scope | A ground-truth read on whether your agents are safe to run in production: trajectory evals, false-green metering, evidence-binding gaps, and a prioritized fix list. | /audit |
| LLM Cost Teardown | from $2,000 | ~1 week | A line-by-line teardown of where your LLM spend goes and the six levers that bring it down — without lowering output quality. | /llm-cost-teardown |
| Fractional AI Architect | from $4,000/mo | ~1 day/week · 3-month minimum | Ongoing architectural ownership of your agent platform: reliability, cost, and the gated rollout discipline to keep both in line as you scale. | /fractional |

The line under the cards reads: "Also available: **Advisory** at $200/hr (10-hour minimum block). Audit fee credited against a retainer started within 60 days."

**§6 How I work**: eyebrow "03_operator_protocol", H2 "How I work", intro "Same sequence every engagement — measure before touching, gate every change on evidence." ⟡. There are 4 numbered steps (→ the Chain component):
1. **Ground-truth audit first**: "Before changing anything, I measure what your agents actually do — real trajectories, real pass/fail, real cost — not what the dashboard claims."
2. **Evals before changes**: "I build the trajectory and false-green evals that turn "seems fine" into a number, so every later change is judged against a fixed bar."
3. **Evidence-binding**: "Every "green" has to point at the evidence that earned it. Claims that cannot cite their proof are treated as failures." ⟡
4. **Gated rollout**: "Changes ship behind trust tiers and budget guards, promoting only when the evals and cost metrics hold — with a fast path back."

**§7 Proof of method**: eyebrow "04_proof_of_method", H2 "See the method, not just claims". **This section renders only when its artifacts exist.** Both are missing today, so the section is hidden. Design it anyway.
- Card "Sanitized sample audit report": "The exact deliverable format — findings, severity, evidence, and a prioritized fix list — with a real (client-anonymized) example." CTA "Download the sample report".
- Card "Method walkthrough (2–3 min)": "A short screen recording walking through how an agent trajectory is evaluated and where the false-greens hide." CTA "Watch the walkthrough" (external Loom).

**§8 How engagements are run**: eyebrow "06_continuity_and_trust", H2 "How engagements are run". There are 6 terms:
- **Contracting entity**: "Easelect LTD (UK LTD). Invoiced in USD/GBP/EUR; standard contractor terms."
- **IP & ownership**: "Full IP transfer on payment. Your code and findings are yours."
- **Access**: "Read-only access by default. Write access only when a change is agreed, scoped, and gated."
- **NDA / DPA**: "NDA on request; DPA available for engagements touching personal data."
- **Continuity**: "Based in Kyiv with backup power and connectivity in place to keep engagements on schedule."
- **References**: "Named recommendations from engineers and leads I've worked with, shared on the fit call with links to the originals."

**§9 Writing teaser**: eyebrow "07_writing", H2 "Notes on agent reliability", link "all_writing →" (/writing). It shows the 4 latest posts (date, reading time, title, 2-line description). See A.7 for the post list.

**§10 Final CTA**: H2 "Get a straight read on your agents", text "A 30-minute systems call: tell me what your agents do and where they worry you, and I'll tell you whether an audit, a cost teardown, or a retainer is the right next step." Then Booking (`final_cta`), Email (`final_cta`) and the trust chips.

### A.2 Offer page template (`/audit`, `/llm-cost-teardown`, `/fractional`)

The section order is fixed:

1. **Hero**: eyebrow (kicker), H1, promise, the **price + terms (the only time the price appears)**, Booking and Email, trust chips.
2. **What you get**: H2 and 6 deliverables (title + detail).
3. **Method / levers**: H2, intro and 4 or 6 items.
4. *(extra slot: the page-specific section)*
5. **Timeline**: H2 "Timeline", 3 phases (phase name, when, detail).
6. **Who it's for**: H2 "Who it's for", with "for you" (✓ ×3), "not for you" (✗ ×3) and an optional "Scope" note.
7. **FAQ**: H2 "FAQ", 4 Q&As, each with an anchor.
8. **Closing CTA**: H2 "Ready to start?", text "Book a 30-minute systems call and we'll confirm scope and timing.", then Booking and Email. **No price.**

Each page also emits Service and FAQPage JSON-LD; no visual impact.

#### `/audit`
- Kicker: "ai agent production-readiness audit"
- H1: **"Find out where your agents will fail in production — before your users do."**
- Promise: "A fixed-scope, two-week audit that measures your agents the way production will: real trajectories, real pass/fail, real cost — and hands you a prioritized, evidence-backed fix list."
- Price: $3,500 · flat · ~2 weeks · fixed scope
- Deliverables ("What you get in the audit"):
  1. **Trajectory evaluation suite**: A set of replayable evals over your agents' real execution paths, so "it works on my machine" becomes a measured pass rate.
  2. **False-green-rate report**: Where your pipeline reports success it hasn't earned — the silent failures that pass CI and break in production.
  3. **Evidence-binding gap analysis**: Every "green" checked against the evidence that should back it; claims that can't cite their proof are flagged.
  4. **Trust-tier & permission review**: What your agents are allowed to do vs. what they should be gated on — mapped to an L0–L4 trust model.
  5. **Prioritized fix list**: Findings ranked by production risk and effort, each with a concrete remediation — not a wall of observations.
  6. **Readout call + written report**: A live walkthrough plus the sanitized written report you can circulate to your team and stakeholders.
- Method ("How the audit runs", intro "The same operator protocol every engagement uses — measure first, gate on evidence."):
  1. **Ground-truth audit first**: I instrument your agents and capture what they actually do before proposing a single change.
  2. **Evals before opinions**: I build trajectory and false-green evals so findings are numbers you can re-run, not vibes.
  3. **Evidence-binding**: Each result is tied to the evidence that earned it; unsupported greens are treated as failures.
  4. **Gated remediation plan**: The fix list is sequenced for a gated rollout — trust tiers and budget guards, with a fast path back.
- Timeline:
  1. Phase 0 — Kickoff & access · Days 1–2 · Scope confirmation, read-only access, and a shared definition of "production-ready" for your system.
  2. Phase 1 — Instrument & measure · Week 1 · Capture real trajectories, build the eval suite, and meter false-greens and cost.
  3. Phase 2 — Analyze & report · Week 2 · Findings, severity, evidence, and the prioritized fix list — delivered as a written report and a readout call.
- For you:
  - You run LLM agents in — or close to — production and need to trust them.
  - You have a mainstream Python or TypeScript agent stack.
  - You want a fixed price and a fixed scope, not an open-ended engagement.
- Not for you:
  - You're at the idea stage with no working agent to measure yet.
  - You want implementation capacity — this is an audit, not a build.
  - You're looking only for prompt tweaks rather than reliability engineering.
- Scope note: "The flat price covers mainstream Python/TS agent stacks (LangChain/LangGraph, custom orchestrators, OpenAI/Anthropic/Vercel AI SDKs). Custom or unusual stacks require a short scoping call first so the fixed scope stays honest."
- FAQ:
  - **What access do you need?** Read-only by default: the repository, run logs/traces, and a way to replay representative agent runs. Write access is only requested if we later agree on a change, and it stays scoped and gated.
  - **What if the audit finds nothing serious?** That's a valid — and reassuring — outcome. You still get the eval suite and the report documenting what was tested and why it holds, which is exactly what you want to show stakeholders.
  - **How long does it take?** About two weeks end to end, on the phased timeline above. Scheduling depends on access being ready at kickoff.
  - **What happens after the audit?** Most teams take the fix list and run it themselves. If you'd rather I own the reliability and cost work ongoing, the audit fee is credited against a Fractional AI Architect retainer started within 60 days.
- After the template:
  - **"Method, demonstrated"**: eyebrow "method, demonstrated", H2 "The same method, in the open", intro "The audit runs the discipline these field reports describe — applied to my own systems first." There are 3 cards:
    - "Six False-Greens in a Self-Auditing Agent Pipeline" → "Read the field report"
    - "The Calibration Ledger: 58 Runs, 93% Pass, n Is Small" → "Read the field report"
    - "How runs & passes are counted" → "See the methodology"
  - **Sample report capture**, shown only if the PDF exists. H2 "See the deliverable before you book", text "Get the sanitized sample audit report — the exact format you receive: findings, severity, evidence, and a prioritized fix list." It has an email field (placeholder "you@company.com") and the button "Send it". Success reveals "Download the sample report"; the error text is "something went wrong — email serbyn.vitalii@gmail.com and I'll send it."

#### `/llm-cost-teardown`
- Kicker: "llm cost teardown"
- H1: **"Cut your LLM bill with six levers — without lowering output quality."**
- Promise: "A one-week teardown of where your LLM spend actually goes, which of six levers move it, and how much each is worth against your own traffic and quality bar — no guesswork, no quality regressions."
- Price: from $2,000 · ~1 week
- Deliverables ("What you get in the teardown"):
  1. **Spend map**: Your LLM cost broken down by service, model, and route, so the expensive paths stop hiding inside one monthly total.
  2. **Per-lever opportunity assessment**: Each of the six levers modeled against your actual traffic — what it would save you, not a headline number from someone else's workload.
  3. **Quality-guardrail plan**: The evals and checks that keep output quality fixed while cost comes down, so savings don't quietly cost you accuracy.
  4. **Routing & caching recommendations**: Concrete model-routing and semantic-caching changes, sequenced by savings-per-effort.
  5. **Prioritized savings roadmap**: A ranked plan you can hand to your team — highest-impact, lowest-risk levers first.
  6. **Readout call**: A live walkthrough of the findings and roadmap, plus the written teardown.
- Method ("The six levers", intro "Public benchmarks put each lever's savings in a broad range — but the only number that matters is yours, so I model each one against your real traffic and quality bar instead of quoting a headline percentage."):
  1. **Model routing**: Send each call to the cheapest model that clears the quality bar for that step; reserve frontier models for the hard hops.
  2. **Semantic caching**: Cache on meaning, not exact strings, so near-duplicate requests never hit the model twice.
  3. **Prompt compression**: Trim system prompts, context, and few-shot bloat that silently inflate every single call.
  4. **Batch / async pricing**: Move latency-tolerant work onto batch and async tiers that price well below interactive rates.
  5. **Provider arbitrage**: Price the same capability across providers and route by current cost, not by habit.
  6. **Fallback chains**: Degrade gracefully to cheaper providers on error or overload instead of paying a premium to retry.
- **Extra slot, "Worked example — my own platform"** (→ the Exhibit card, the flagship use):
  - Intro: "The same levers, run on my own agent platform. A small bill — but the mechanics are identical, and they scale with spend."
  - Exhibit: **-58%**, "LLM bill: $82 → $34 / month", label "on my own platform — small bill, same levers scale with spend".
  - Text: "Multi-model routing plus caching did most of the work: cheap models for the easy hops, cached results for the repeats, and frontier models only where quality demanded them — with no drop in output quality. On a larger bill, the same moves free up real budget." ⟡ "On a larger bill, the same moves free up real budget."
- Timeline:
  1. Phase 0 — Instrument spend · Days 1–2 · Read-only access to billing and logs; build the spend map by service, model, and route.
  2. Phase 1 — Model the levers · Days 3–4 · Estimate each lever against your real traffic and define the quality guardrails that protect output.
  3. Phase 2 — Roadmap & readout · Day 5 · Deliver the prioritized savings roadmap and walk through it live.
- For you:
  - Your monthly LLM bill is large enough that a week of engineering pays for itself.
  - You need savings that don't come at the cost of output quality.
  - You want a concrete roadmap, not a vendor pitch.
- Not for you:
  - Your spend is trivial and not worth optimizing yet.
  - You want someone to implement every change for you this week — the teardown is analysis and a roadmap.
  - You're unwilling to define a quality bar to protect.
- FAQ:
  - **Will cutting cost hurt quality?** No — that's the whole point of doing it as engineering rather than blunt downgrades. Every lever is modeled against a quality bar you define, and the guardrail plan keeps output fixed while cost moves.
  - **How much can I actually save?** It depends entirely on your traffic mix, so I won't quote a made-up percentage. Published ranges for these levers are wide; the teardown replaces them with a number modeled on your own usage. See the own-platform example above for how the levers compound.
  - **What access do you need?** Read-only: your billing/usage export and enough logs or traces to see the cost distribution across models and routes.
  - **What's the deliverable?** A written teardown — spend map, per-lever assessment, quality-guardrail plan, and a prioritized roadmap — plus a live readout.

#### `/fractional`
- Kicker: "fractional ai architect"
- H1: **"Keep your agent platform reliable and cheap as it scales — with an architect on the hook."**
- Promise: "Ongoing architectural ownership of your agent platform, about one day a week: I hold the reliability and cost lines so quality and spend stay in control while your team keeps shipping."
- Price: from $4,000/mo · ~1 day/week · 3-month minimum
- Deliverables ("What you get with the retainer"):
  1. **Standing reliability & cost ownership**: A named architect accountable for whether your agents stay trustworthy and affordable — not a one-off report.
  2. **Evals & guardrails, maintained**: The trajectory and false-green evals stay current as your agents change, so regressions surface before users find them.
  3. **Pre-ship architecture review**: New agents and major changes get reviewed against the trust and cost model before they reach production.
  4. **Gated-rollout discipline**: Changes promote through trust tiers and budget guards with a fast path back — the same protocol, applied continuously.
  5. **Monthly reliability & cost report**: A short written read on where reliability and spend stand, and what to do next.
  6. **Direct async access**: A direct line for architectural questions between sessions — not a ticket queue.
- Method ("What ongoing ownership looks like", intro "A predictable weekly cadence built on the same operator protocol as the audit."):
  1. **Weekly cadence**: About one focused day a week on your platform — reviewing, measuring, and moving the reliability and cost work forward.
  2. **Evidence-gated changes**: Every change I recommend or make is gated on evals and cost metrics, promoted only when they hold.
  3. **Cost tracking**: Per-service cost stays instrumented so spend never drifts quietly upward as traffic grows.
  4. **Escalation & handover**: Clear escalation for incidents and clean documentation so your team is never dependent on me being online.
- **Extra slot, Advisory note** (dashed card): eyebrow "prefer something lighter?", H2 "Advisory", "$200/hr" with "10-hour minimum block", and the text "Direct architectural advice on agent reliability and LLM cost, booked in a 10-hour block. No monthly commitment — a direct line to architectural advice on agent reliability and LLM cost when you need it."
- Timeline:
  1. Month 1 — Baseline · Weeks 1–2 · Establish the reliability and cost baseline, stand up (or adopt) the evals, and agree the rollout gates.
  2. Ongoing — Weekly cadence · Every week · Roughly one day a week owning the reliability and cost work; monthly written report.
  3. Quarterly — Direction · Each quarter · Step back on architecture direction, scaling risks, and where to invest next.
- For you:
  - You're running agents in production and need someone accountable for reliability and cost over time.
  - You want senior architectural judgment without a full-time hire.
  - You can commit to at least three months so the work compounds.
- Not for you:
  - You need a full-time engineer or an implementation team — this is ~one day a week of architecture.
  - You want a one-off deliverable — start with an audit or teardown instead.
  - You're not ready to gate changes on evidence.
- FAQ:
  - **What's the time commitment?** About one day a week, with a three-month minimum so the reliability and cost work has time to compound. Scope can flex up by agreement.
  - **Can it start from an audit?** Yes — that's the usual path. The Production-Readiness Audit gives us a shared baseline, and its fee is credited against a retainer started within 60 days.
  - **Do you take write access to our systems?** Read-only by default. Write access is scoped to agreed changes and everything ships through the same gated rollout.
  - **What if we need less than a full engagement?** Then advisory is the better fit — direct architectural advice booked in a 10-hour block, without the ongoing commitment.

### A.3 `/about`
- Eyebrow "// About", H1 **"Vitalii Serbyn"**
- Narrative (6 paragraphs, verbatim):
  1. "I've been shipping production systems for 13+ years. Started building Android apps at EPAM and GlobalLogic — one of them (Magisto) hit 100M+ users and won a Google Play award. Led teams of 2-6 engineers, owned release trains, and learned the production discipline that I now apply to AI systems."
  2. "Since 2024, I've designed and shipped production AI systems through my UK company (Easelect LTD). Ascend is an orchestration daemon with 27 agents (18 mature) and 1,178 automated tests, managing code review, deployments, monitoring, and client reports — all trust-gated with L0-L4 policy enforcement. Crest is an AI content platform with a 6-stage LangGraph pipeline, Thompson Sampling for variant optimization, multi-model routing, and multi-platform publishing — deployed live with 91+ tests."
  3. "On the client side, I solo-architected a Web3 token launchpad on Solana (Next.js + NestJS + FastAPI, real-time blockchain indexing, 80-90% RPC cost reduction through Redis caching and bot detection) and a healthcare platform serving 10k+ users across 4 Flutter apps. PersonSearch is a 30-agent autonomous OSINT platform with dynamic sub-agent spawning. Forge UI is a 6-agent development system with 38 MCP tools for the full Flutter dev lifecycle."
  4. "Across all projects, I build the same infrastructure: multi-model routing by task complexity (GPT-4o for critical decisions, GPT-3.5 for bulk work — 70% cost reduction), full observability with Prometheus/Grafana/Jaeger/Sentry, and cost controls from day one. Every system has health checks, circuit breakers, and graceful degradation built in."
  5. "I also build my own AI development tooling. Every project runs on a custom MCP (Model Context Protocol) stack — I built semantic Code-RAG servers using ChromaDB and Sentence-Transformers for codebase-wide pattern search before writing new code. My development workflow uses multi-agent pipelines: a 9-agent system handles intake → research → spec → implementation → QA → review, with a gate system that kills 70% of feature ideas at signal validation before any code is written. Across Assisterr, 3 parallel agents coordinate across 8+ repositories using shared memory with strict namespace isolation. I don't just build AI systems — I use AI agents to build them."
  6. "I work remotely from Kyiv. Easelect LTD is structured for international contracts (UK-registered, W-8BEN-E for US clients)."
- H2 "Design principles", with 3 cards:
  - **Trust layers**: "Every agent action flows through a trust level (L0-L4). No autonomous system should operate without explicit permission boundaries and escalation paths."
  - **FinOps from day one**: "AI costs compound fast. Token budgets, multi-model routing, and per-tenant cost dashboards are first-class infrastructure — not afterthoughts."
  - **Production discipline**: "13 years of production systems taught me: SLOs, evaluation gates, rollback plans, and observability matter more than the model you choose." ⟡
- CTAs: Booking with label "Book a Call" (`about`), plus the text link "View résumé" → /resume.
- Design idea, using only existing facts: a timeline rail "EPAM / GlobalLogic / Startups 2013–2023 → Easelect LTD 2023–now" (from the résumé data). There is no photo today. If you want a portrait slot, mark it as content to supply.

### A.4 `/methodology`
- Eyebrow "methodology note", H1 **"How DW runs and passes are counted"**
- Lede: "DW is an autonomous, spec-driven development pipeline I designed and built. A short definition of the numbers so they mean something."
- Exhibit: **101 · 0.94**, "logged runs · pass rate", label "on DW, a system I designed and built"
- **What counts as a run**: "A **run** is one specification submitted to the pipeline and executed end to end to a terminal state — planning, change, and verification — without a human taking over mid-way. Each run is logged, which is why the count is exact rather than estimated. Aborted or half-completed attempts are logged too; they simply don't count as passes."
- **What counts as a pass**: "A **pass** is a run whose output satisfies the spec's acceptance checks — it builds, the tests and evals it was asked to meet are green, and the result matches what the spec described — with **no human edits** to the produced change. A run that needs a person to finish or fix it is recorded as a non-pass, even if the final code eventually shipped."
- **Why the honesty matters**: "A pass rate is only worth quoting if a "pass" can't quietly include work a human rescued. Counting human-touched runs as non-passes is the same discipline I bring to client agents: a green has to be earned and has to point at its evidence, or it isn't a green. This figure is measured on my own system, not a client's." ⟡ "a green has to be earned and has to point at its evidence, or it isn't a green."
- Link: "More on false greens and evidence-binding →" (/writing)

### A.5 `/work` (case study index)
- Eyebrow "INDEX / WORK", H1 **"High-performance AI systems & infrastructure"**, lede "Real projects with authentic metrics — from autonomous agent orchestration to multi-project enterprise delivery."
- Controls:
  - filter chips "All · 3", "Architecture · 2", "Infrastructure · 1", "Optimization · 0", "Research · 0";
  - sort "Relevance / Recent" (the "Impact" sort is removed);
  - empty state "No systems in this category yet."
- Card contents:
  - a cover: today an abstract CSS blueprint grid with a category code and `SYS_01`. Replace it with something better, for example a tiny exhibit or a diagram thumbnail.
  - title, 3-line summary (no impact score; it was a self-assigned number and is removed),
  - status chips (the highlight metrics, first 2), up to 5 tech tags, "View case study →".

| Slug | Title | Type | Category | Summary | Highlight metrics | Tech | Date | Link |
|---|---|---|---|---|---|---|---|---|
| ascend-autonomous-agents | Ascend: Agent Orchestration Daemon | Primary R&D | Architecture | Self-hosted orchestration daemon with trust-gated execution (L0-L4), policy engine, and audit logging. 27 agents (18 mature) managing live projects. | 27 agents (18 mature) · L0-L4 trust gating · 4 live projects managed · ~2h/day automated | Python, aiohttp, SQLite, YAML policies, OpenClaw gateway, GitHub Actions | 2024-12 | github.com/vitamin33 |
| crest-signal-driven-platform | Crest: AI Content Platform with Signal-Driven Optimization | Startup | Architecture | AI content platform with a 6-stage LangGraph pipeline, Thompson Sampling for variant optimization, multi-model routing (GPT-4o/3.5), and multi-platform publishing. Deployed live with 91+ tests. | 6-stage LangGraph pipeline · GPT-4o/3.5 model routing · Thompson Sampling A/B · 91+ unit tests | Python, FastAPI, LangGraph, Docker, PostgreSQL, Redis, RabbitMQ, Qdrant, MLflow, Prometheus | 2024-10 | github.com/vitamin33/threads-agent |
| enterprise-multi-project | Full-Stack Architecture Across Healthcare, Web3, and AI | Enterprise | Infrastructure | Production platforms across 3 domains: healthcare (Flutter/Firebase, 10k+ users), Web3 token launchpad (Solana/NestJS, 80-90% RPC cost reduction), and AI content pipeline. | 3 production domains · 9+ repositories · 10k+ end users · 80-90% RPC cost reduction | Flutter, Firebase, NestJS, Python, FastAPI, Solana, PostgreSQL, MongoDB, Redis, AWS ECS | 2024-06 | none |

### A.6 `/work/[slug]` (case study template)
- Back link "INDEX / WORK"
- Header: type badge (Primary R&D / Startup / Enterprise), H1, summary, tech tags, and 4 highlight-metric tiles.
- Three columns on xl: a sticky table of contents (the H2s), the article, and a sticky code panel showing the first code block. The code panel is hidden below xl.
- Article body is long-form markdown: H2, H3, lists, code, blockquotes. Section outlines:
  - **Ascend**: The Challenge · Architecture (Agent Runtime, Trust Levels (L0-L4), Policy Engine, Cost Controls) · Results · Key Learnings
  - **Crest**: The Challenge · Architecture (Platform Architecture, LangGraph AI Pipeline, Multi-Model Routing, Thompson Sampling for Variant Optimization, Multi-Platform Publishing, Observability Stack) · Results · Key Learnings
  - **Enterprise**: The Challenge · Project 1: Healthcare Platform · Project 2: Web3 Token Launchpad (Solana) · Project 3: Content Platform · Shared Engineering Practices · Results · Key Learnings
- Repo / Demo buttons when present.
- CTA box: H2 "Discuss this architecture", text "Want to explore how similar patterns could work for your system?", button "Book Architecture Review" (`work_case_study`).
- Idea: "Trust Levels (L0-L4)" is a natural candidate for a diagram from the diagram system. Design the slot.

### A.7 `/writing` (blog index) and the posts
- Eyebrow "index / writing", H1 **"Writing on agent reliability and LLM cost"**, lede "How I think about making agents trustworthy and affordable in production — the same methods behind the audits and teardowns."
- Newsletter box, **False Green** (the only newsletter name on the site): text "measured notes from running AI agent systems in production: what broke, what it cost, what the data showed. 1-2 emails a month.", email field, button "Subscribe". It subscribes to beehiiv.
- Ruled list, newest first. Each row has date, "N min read", category tag, title and description. Empty state: "First articles coming soon."

Published posts on `main` (all category "architecture"):

| Date | Title |
|---|---|
| 2026-09-30 | The Check the Agent Cannot Skip: 0 of 40 Silent Failures vs 22 of 40 |
| 2026-09-22 | Self-Verification Cost 1.64x and Caught Nothing |
| 2026-09-22 | The API Served a Different Model and My Check Passed |
| 2026-09-08 | Nine Times the Eval Tried to Lie to Me |
| 2026-09-06 | When an AI Agent Says Done: 0% vs 100% False Greens |
| 2026-06-23 | The Arc Since the Six Were Caught |
| 2026-06-17 | The Calibration Ledger: 58 Runs, 93% Pass, n Is Small |
| 2026-06-12 | False Greens: Three Structural Observations |
| 2026-06-08 | One-Sided Contracts Break Agent Pipelines |
| 2026-06-03 | QA Is Only as Honest as Its Coverage |
| 2026-05-30 | Permissive Parsing Is a False-Green Factory |
| 2026-05-26 | Six False-Greens in a Self-Auditing Agent Pipeline |

One draft is in progress: "proof-of-green checks every "done" against what the agent actually ran". It shows interim numbers with "INTERIM" tags. Use it as the showcase for the rich post template: it has diagrams, data tables, a stat strip, cards and a callout.

Most posts are plain markdown, with this structure:

- H2 sections, often "FAQ" and "The Transferable Lesson",
- 1 mermaid diagram,
- 2–4 code blocks,
- an "In this series" link list at the end.

The September posts also embed chart PNGs with captions (see §5.17).

**Post page anatomy:**

- "← All posts"
- a draft banner (dev only)
- header: eyebrow (date · N min read · category), H1, lede (the description), keyword tags
- body
- "Related case studies" (3 cards)
- "More posts" (3 rows)
- CTA callout: H2 "Want to discuss this further?", text "I help teams build autonomous agent systems and production AI infrastructure.", button "Book Architecture Review" (`blog_<slug>`)
- newsletter box

Design ideas:

- a reading-progress hairline;
- a "In this series: False Greens" navigator showing position N of 12;
- the key number of the post as an exhibit card under the H1. Only when the post states that number.

### A.8 `/resume`
- Screen controls (hidden in print): title "Resume", button "Download PDF" (prints).
- Header: "Vitalii Serbyn" / "Agentic Systems Architect" / email · "Kyiv, Ukraine · Remote only · UK LTD for contracting" · serbyn.io
- Sections: Professional Summary · Technical Skills (LLM & GenAI (Current Focus), MLOps & Platform, Backend & Data (13+ years), Frontend & Mobile) · Experience (Agentic Systems Architect, Easelect LTD, 2023–now; Senior/Lead Engineer, EPAM, GlobalLogic, Startups, 2013–2023) · Contracting · Payments
- It must look good on screen and print cleanly in black on white on one or two pages.

### A.9 Legal (`/legal/privacy`, `/legal/terms`)
- Long-form text: H1 plus sections, 190–250 lines each. Use the 70ch reading column with a small table of contents.

### A.10 404
- Eyebrow "error / 404", H1 **"This page doesn't exist"**, text "The link may be broken or the page has moved. Here's where most people are headed:"
- Card "AI Agent Production-Readiness Audit": "Find out where your agents will fail in production — $3,500, fixed scope." → "See the audit"
- Card "Writing": "Field notes on agent reliability and LLM cost engineering." → "Read the field reports"
- Link "← Back to home"

### A.11 Global header and footer
- **Header**: described in §6.
- **Footer** has three columns and a bottom bar:
  - Column 1:
    - **EASELECT LTD**
    - "Agentic Systems Architecture"
    - "Company Number: 15983917"
    - "Registered Office:" Office 12, Initial Business Centre / Wilson Business Park / Manchester, M40 8WN / United Kingdom
  - Column 2:
    - **CONTACT**
    - serbyn.vitalii@gmail.com (mailto)
    - "Remote from Kyiv, Ukraine"
    - "GMT+2 timezone"
  - Column 3:
    - **LEGAL**
    - Privacy Policy
    - Terms of Service
  - Bottom bar:
    - "© {year} Easelect LTD. All rights reserved. Incorporated in England & Wales"
    - GITHUB (github.com/vitamin33), LINKEDIN (linkedin.com/in/vitalii-serbyn-b517a083), RSS_FEED (/feed.xml)
    - "| UK LTD"
  - Add "Work" and the "False Green" newsletter (→ /newsletter) here.

---

## Appendix B. Dynamic data the design must handle

- **Results**: 6 tiles today. Must handle 3–9.
- **Offers**: 3 cards plus Advisory.
- **Systems**: 3 cards. A card may have a GitHub link, an external link or an internal link, and may have none.
- **Case studies**: 3 today, sortable and filterable. Each has title, summary, a type (primary/startup/anonymized), a category, 4 highlight metrics, 6–10 tech tags, a date and optional repo/demo links.
- **Posts**: 12 on `main`, growing about 2 to 6 a month. Each has title, description (around 160 chars), date, reading time, category, 5 keywords, and optional `mdx`/`draft` flags.
- **Titles**: long titles must wrap gracefully at 390px, and some are about 80 characters.
- **Hidden-when-missing blocks**: proof of method (PDF, Loom), sample-report capture and repo links. Design both states, and make the "absent" state invisible rather than a placeholder.

## Appendix C. Interactions, CTAs and analytics hooks (keep the elements; restyle freely)

| Element | Behavior | Analytics |
|---|---|---|
| Booking button | Calendly in a new tab. UTM cookies are appended after hydration. | `cta_click {cta: booking, location}` |
| Email button | mailto | `cta_click {cta: email, location}` |
| Outbound links (GitHub, usecrest.io, Loom) | New tab | `outbound_click` |
| Newsletter form | POST `/api/subscribe`, then a success or error state | none |
| Sample report form | POST `/api/subscribe` with tag `sample-report`, then the download is revealed | none |
| Blog engagement | Scroll depth, block viewed, case-study click, crosslink click, CTA click | `blog_*` events |
| `/work` filters and sort | Client-side state | none |
| Mobile menu | Toggle with `aria-expanded` and `aria-controls="mobile-nav"` | none |
| Theme toggle (new) | light / dark / system, stored per visitor | none |

CTA location ids:

- home: `hero`, `final_cta`
- offer pages: `offer_<id>_hero`, `offer_<id>_cta`
- about: `about`
- header: `sidebar`
- case studies: `work_case_study`
- blog posts: `blog_<slug>`
- systems cards: `systems_<id>`

## Appendix D. Real data for exhibits and charts (from published posts; use exactly)

Each dataset names its post. Do not round, merge or extrapolate. Sample sizes stay visible, because "n" is part of the honesty.

**D.1 "When an AI Agent Says Done: 0% vs 100% False Greens"** (`/blog/same-model-0-and-100-where-the-verifier-gap-actually-lives`): a head-to-head between two jobs for the same model.
- Model `deepseek-v4-flash`, one month.
- Side A, **single answer** (the model reviews one short answer):
  - false-green rate **0%** (0 / 50 wrong answers shown),
  - caught the planted fault **100%** (50 / 50).
  - Zero false greens in 100 attempts across two runs.
- Side B, **trajectory** (the model checks its own twelve-step work):
  - false-green rate **100%** (45 / 45 wrong runs claimed success),
  - caught the planted fault **11%** (8 / 70).
- Error bars are Wilson 95% intervals.
- 680 runs in total; all runs cost **$3.13**.
- Verdict line (verbatim): "the model is a good reviewer of a single answer and a poor auditor of its own multi-step work."
- Today's chart is `public/blog/verifier-gap-contrast.png` on `main`: a dark matplotlib chart with blue for single answer and orange for trajectory. Re-render it.

**D.2 "The Check the Agent Cannot Skip: 0 of 40 Silent Failures vs 22 of 40"** (`/blog/enforced-checkpoint-0-of-40-silent-failures-vs-22-of-40`): ranked bars, lower is better. It is a perfect fit for the "Cache Reads" card.
- Silent failures, meaning runs that finished wrong and claimed success, per 40 runs with a planted error:
  - **no checkpoint 22 of 40**
  - **checkpoint as an optional tool 6 of 40**, at **1.94x** cost; used in 38 of 40 runs
  - **forced checkpoint 0 of 40**, at **1.00x** cost
- Model `deepseek-flash`; 160 runs at the final stage, 40 per arm; the whole experiment cost **$3.67**.
- Verdict (verbatim): "The difference was never whether the agent had access to the truth. It was who decided when to look."
- Chart on `main`: `public/blog/checkpoint-silent-failures.png`.

**D.3 "Self-Verification Cost 1.64x and Caught Nothing"** (`/blog/self-verification-cost-1-64x-and-caught-nothing`): cost comparison.
- 50 tasks per arm:
  - **baseline $0.2004** ($0.00409 per correct answer)
  - **with self-check $0.3285** ($0.00657 per correct answer), which is **1.64x**
- Catches: **0**.
- When shown 50 correct solutions, the checker wrongly rejected **5**, and those false alarms consumed **37%** of that arm's spend (7,730 reasoning tokens vs 1,423 for a normal verdict).
- Verdict (verbatim): "If it is low, the review step is a tax with no refund."

**D.4 "The API Served a Different Model and My Check Passed"** (`/blog/the-api-served-a-different-model-and-my-check-passed`): a requested vs. served exhibit.
- Requested `deepseek-v4-flash`; served `deepseek-flash` on **200 of 200** responses; rerun cost **$0.6972**.
- Verdict (verbatim): "if your "model version" check does not compare requested with served, you do not have one."

**D.5 "The Calibration Ledger: 58 Runs, 93% Pass, n Is Small"**: a single-number exhibit with an honest caveat.
- **~58 runs, ~93% autonomous pass.** The "~" is in the source; keep it.
- Verdict (verbatim): "the most important thing I can tell you about that number is what it does not prove."

**Other posts** have no single headline number. They get the plain row on `/writing`:
- "Nine Times the Eval Tried to Lie to Me" (9 defects; you may show "9")
- "The Arc Since the Six Were Caught"
- "False Greens: Three Structural Observations"
- "One-Sided Contracts Break Agent Pipelines"
- "QA Is Only as Honest as Its Coverage"
- "Permissive Parsing Is a False-Green Factory"
- "Six False-Greens in a Self-Auditing Agent Pipeline" (6; you may show "6")

=== PROMPT END ===
