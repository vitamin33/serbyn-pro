# serbyn.io

Consulting site for **Vitalii Serbyn — Agentic Systems Architect**. I make AI
agents reliable enough to run in production: agent reliability engineering
(trajectory evals, false-green-rate metering, evidence-binding gates,
trust-tiered execution) and LLM cost engineering (multi-model routing, caching,
cost tracking).

Next.js 14 (App Router) · TypeScript · Tailwind · dark "Kinetic Lab" design
system. Deployed on Vercel.

## Structure

- `/` — home (hero → credibility → results → systems I built → offers → how I
  work → proof → colleagues → continuity → writing → CTA)
- `/audit` — AI Agent Production-Readiness Audit ($3,500, fixed scope)
- `/llm-cost-teardown` — LLM Cost Teardown (from $2,000)
- `/fractional` — Fractional AI Architect (from $4,000/mo) + Advisory ($200/hr)
- `/writing` — vendor index over the blog; `/blog` + post routes unchanged
- `/methodology` — how DW runs/passes are counted (backs the 101 · 0.94 figure)

**Canonical facts** (every publishable number + its source-label) live in
`lib/facts.ts`. Offer-page copy lives in `lib/offer-content.ts`. Do not hard-code
metrics in components — import them so the site stays consistent and every claim
carries its context label.

## Commands

```bash
npm run dev          # local dev (set NODE_OPTIONS=--max-old-space-size=4096)
npm run build        # production build (also runs lint)
npm run lint         # eslint + prettier
npm run test:e2e     # Playwright suite (tests/refactor/*) — builds + serves on :3100
```

## Analytics

PostHog (client, lazy-loaded only when `NEXT_PUBLIC_POSTHOG_KEY` is set) plus
Vercel Analytics + Speed Insights. Custom events (see `components/site/cta.tsx`):

- `cta_click` — `{ cta: 'booking' | 'email', location }` on every booking/email CTA
- `outbound_click` — `{ href, location }` on outbound links (GitHub, etc.)

`location` names the section (`hero`, `final_cta`, `offer_audit_hero`, …) so
funnels are legible. Events no-op cleanly when no PostHog key is configured.

## UTM convention (outreach links)

`middleware.ts` persists `utm_*` query params to first-party cookies for 30 days,
so a click that lands on any page is attributable through to a later booking.
**Use this scheme for every outreach link** so PostHog reports stay clean:

| Param          | Meaning                        | Allowed values (examples)                                   |
| -------------- | ------------------------------ | ----------------------------------------------------------- |
| `utm_source`   | where the link was shared      | `linkedin`, `email`, `x`, `hn`, `referral`, `newsletter`    |
| `utm_medium`   | channel type                   | `social`, `dm`, `cold-email`, `profile-bio`, `signature`    |
| `utm_campaign` | initiative                     | `audit`, `cost-teardown`, `fractional`, `2026q3-outreach`   |
| `utm_content`  | placement / variant            | `post-cta`, `bio-link`, `email-p1`, `v-a` / `v-b`           |
| `utm_term`     | optional keyword / audience    | `agent-reliability`, `llm-cost`                             |

**Examples**

```
# LinkedIn post promoting the audit
https://serbyn.io/audit?utm_source=linkedin&utm_medium=social&utm_campaign=audit&utm_content=post-cta

# Cold email pitching a cost teardown
https://serbyn.io/llm-cost-teardown?utm_source=email&utm_medium=cold-email&utm_campaign=cost-teardown&utm_content=email-p1

# LinkedIn profile bio link to the home page
https://serbyn.io/?utm_source=linkedin&utm_medium=profile-bio&utm_campaign=2026q3-outreach
```

Keep values lowercase and hyphenated. One `utm_campaign` per initiative so spend
and conversions roll up per offer.
