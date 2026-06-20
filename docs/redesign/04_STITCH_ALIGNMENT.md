# 04 — Stitch Alignment Audit (Kinetic Lab → built)

> Screen-by-screen parity of the shipped redesign vs the Stitch export
> (`~/Downloads/stitch_ai_systems_architect_portfolio/`). Status as of the
> full-parity build on branch `redesign/kinetic-lab`.

## Global

| Element | Stitch | Built | Status |
|---|---|---|---|
| Wordmark | `V_SERBYN.sys` | `serbyn.pro` (+ status dot) | ✅ improved (real domain) |
| Persistent left sidebar | yes (all screens) | yes (home/work/blog/article); minimal layout on resume/legal | ✅ (scoped for print safety) |
| Nav | NEWS/ARTICLES/LABS/ABOUT | WORK/BLOG/ABOUT/RESUME (real routes) | ◑ relabeled to real routes (intentional) |
| SYSTEM STATUS: ONLINE | yes | yes (sidebar footer) | ✅ |
| CONTACT (top-right) | yes | sidebar CONTACT button | ◑ moved into sidebar |
| Palette / type / grid | electric blue, Inter+JetBrains, blueprint | matched | ✅ |
| Footer GITHUB/LINKEDIN/X_CORP/RSS_FEED | yes | GITHUB/LINKEDIN/RSS_FEED | ◑ (no X — Twitter paused) |

## Home

| Element | Status |
|---|---|
| Availability badge | ✅ (`AVAILABLE FOR NEW ENGAGEMENTS`, from metrics.json) |
| Hero + dual CTA | ✅ |
| Metric strip (4 mono metrics) | ✅ real data (31 agents / 1,178 tests / L0–L4 / 14h+) |
| `01_DEPLOYED_SYSTEMS` featured cards | ✅ ProjectCards w/ system-id, chips, impact, abstract cover |
| Terminal newsletter signup | ✅ |

## Work index

| Element | Status |
|---|---|
| `INDEX / WORK` breadcrumb + heading | ✅ |
| Category filters w/ counts | ✅ (inline; global sidebar holds primary nav) |
| Sort (Relevance/Impact/Recent) | ✅ |
| Cards: system-id, status chips, impact, tech, cover | ✅ |

## Article (case study)

| Element | Status |
|---|---|
| Essay-map TOC (`01_SUMMARY…`) w/ scroll-spy | ✅ (derived from H2s) |
| 3-col layout (TOC · body · code) | ✅ (xl); 2-col lg; stacked mobile |
| Sticky code panel `CODE_IMPLEMENTATION` | ✅ (first fenced block) |
| Highlight-metric callouts | ✅ |
| Bottom CTA | ✅ |

## Blog index

| Element | Status |
|---|---|
| `INDEX / BLOG` + heading | ✅ |
| Kernel Pulse signup | ✅ |
| Post list w/ date/readtime/category/thumb | ◑ list ready; **0 posts** until pipeline runs; thumbnails via OG cards |
| LOAD MORE / pagination | ⬜ deferred (no posts yet) |
| RSS | ✅ `/feed.xml` + head alternate + footer |

## Remaining deltas (deliberate or pending)

- **Nav labels** real routes vs Stitch's NEWS/ARTICLES/LABS — intentional.
- **Covers** = branded abstract gradient cards (real data) vs Stitch's pure abstract art — chosen for info value.
- **Motion** — scroll-reveal / metric count-up / View Transitions: **not yet added** (P-motion pending).
- **Blog pagination** — deferred until posts exist.
- **Stitch copy is placeholder** (fake projects); we map structure to the 3 real case studies, so counts/labels differ by design.

**Overall: ~95% structural parity** on the design language + every screen's components. Biggest honest gaps = motion polish + blog has no content yet (the pipeline fills it).
