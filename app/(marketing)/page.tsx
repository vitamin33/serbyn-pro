import {
  ClaimCheck,
  CapIcon,
  CapabilityColumns,
  Chain,
  CostExhibit,
  Eyebrow,
  FinalCta,
  OfferColumns,
  PostWall,
  ProofOfMethodCard,
  ResultTiles,
  SectionHeader,
  SignoffStrip,
  SystemCard,
  TermsList,
  TextLink,
  Verdict,
  type ResultItem,
} from '@/components/ds';
import { BookingCta, EmailCta } from '@/components/ds/cta';
import {
  ADVISORY,
  CONTACT,
  COST_CASE,
  OFFERS,
  PROOF_LOOM_URL,
  PROTOCOL,
  RESULTS,
  SYSTEMS,
  TRUST_CHIPS,
  UPDATED,
  UPSELL,
  YEARS_EXPERIENCE,
} from '@/lib/facts';
import { SAMPLE_REPORT_HREF, sampleAuditReportExists } from '@/lib/assets';
import { getAllBlogPosts, toPostSummary } from '@/lib/blog-posts';

// Home, "Claim vs. proof" (docs/design/design-system.md). Motion budget: high,
// in two places only (the claim check and the cost exhibit); everything else
// is still. Every number comes from lib/facts and carries its source label.

const ASCEND_REPO = SYSTEMS.find(s => s.id === 'ascend')?.repo;

// Result tiles: the six RESULTS minus the −58%, which gets its own exhibit.
const RESULT_TILES: ResultItem[] = RESULTS.filter(
  r => r.value !== COST_CASE.delta
).map(r => ({
  ...r,
  proof: /Ascend/.test(r.label)
    ? ASCEND_REPO
      ? { href: ASCEND_REPO, external: true }
      : undefined
    : /DW/.test(r.label)
      ? { href: '/methodology', text: 'methodology' }
      : undefined,
}));

const dollars = (v: string) => Number(v.replace(/[^0-9.]/g, ''));

const KIND: Record<string, string> = {
  ascend: 'daemon',
  dw: 'pipeline',
  crest: 'content engine',
};

const OFFER_KIND: Record<string, string> = {
  audit: 'Audit',
  'llm-cost-teardown': 'Cost',
  fractional: 'Retainer',
};

const TERMS = [
  {
    term: 'Contracting entity',
    detail: `${CONTACT.company} (UK LTD). Invoiced in USD/GBP/EUR; standard contractor terms.`,
  },
  {
    term: 'IP & ownership',
    detail: 'Full IP transfer on payment. Your code and findings are yours.',
  },
  {
    term: 'Access',
    detail:
      'Read-only access by default. Write access only when a change is agreed, scoped, and gated.',
  },
  {
    term: 'NDA / DPA',
    detail:
      'NDA on request; DPA available for engagements touching personal data.',
  },
  {
    term: 'Continuity',
    detail:
      'Based in Kyiv with backup power and connectivity in place to keep engagements on schedule.',
  },
  {
    term: 'References',
    detail:
      'Named recommendations from engineers and leads I’ve worked with, shared on the fit call with links to the originals.',
  },
];

function ProofOfMethod() {
  const cards = [];
  if (sampleAuditReportExists())
    cards.push(
      <ProofOfMethodCard
        key="report"
        kind="report"
        title="Sanitized sample audit report"
        body="The exact deliverable format — findings, severity, evidence, and a prioritized fix list — run on one of my own systems."
        href={SAMPLE_REPORT_HREF}
        cta="Download the sample report ↓"
      />
    );
  if (PROOF_LOOM_URL)
    cards.push(
      <ProofOfMethodCard
        key="video"
        kind="video"
        title="Method walkthrough (2–3 min)"
        body="A short screen recording walking through how an agent trajectory is evaluated and where the false-greens hide."
        href={PROOF_LOOM_URL}
        cta="Watch the walkthrough ↗"
      />
    );
  if (!cards.length) return null;
  return (
    <section className="ds-sec" aria-labelledby="h-proof">
      <div className="ds-wrap">
        <SectionHeader
          id="h-proof"
          eyebrow="Proof of method"
          title="See the method, not just claims"
        />
        <div className="ds-cards ds-mt-48">{cards}</div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const posts = getAllBlogPosts().slice(0, 4).map(toPostSummary);

  return (
    <>
      <section className="ds-hero" aria-labelledby="h-hero">
        <div className="ds-wrap ds-hero-grid">
          <div className="ds-hero-copy">
            <Eyebrow>Agentic systems architect</Eyebrow>
            <h1 id="h-hero" className="ds-h1">
              I make AI agents reliable enough to run in production.
            </h1>
            <p className="ds-lede">
              I&apos;m Vitalii Serbyn — I work with US, UK, and EU teams to get
              agent systems production-ready. Two specialties: agent reliability
              (trajectory evals, false-green-rate metering, evidence-binding
              gates, trust-tiered execution) and LLM cost engineering
              (multi-model routing and cost tracking) — bringing spend down
              without lowering output quality.
            </p>
            <div className="ds-actions">
              <BookingCta location="hero" />
              <EmailCta location="hero" />
            </div>
            <div>
              <SignoffStrip items={TRUST_CHIPS} />
              <Eyebrow as="p" size="sm" className="!mt-2.5">
                Updated {UPDATED}
              </Eyebrow>
            </div>
          </div>
          <ClaimCheck
            ledger={[
              { tool: 'Edit', target: 'src/orders.py' },
              {
                tool: 'Bash',
                target: (
                  <>
                    pytest → <span data-result="fail">3 failed</span>
                  </>
                ),
              },
              { tool: 'Edit', target: 'src/orders.py' },
            ]}
            passRow={{
              tool: 'Bash',
              target: (
                <>
                  pytest → <span data-result="pass">42 passed</span>
                </>
              ),
            }}
            passLabel="+ pytest → 42 passed"
            rule="Rule: a claim counts as proven only if a passing test run happened after the last code edit. Tiers A (proven) → D (no proof). From proof-of-green."
          />
        </div>
      </section>

      <section className="ds-sec" aria-labelledby="h-cred">
        <div className="ds-wrap">
          <SectionHeader
            id="h-cred"
            eyebrow="Why this mixture is rare"
            title="Reliability and cost, held by the same hands"
          />
          <div className="ds-mt-56">
            <CapabilityColumns
              items={[
                {
                  icon: CapIcon.shield,
                  title: 'Agent reliability engineering',
                  body: 'Trajectory evals, false-green-rate metering, evidence-binding gates, and trust-tiered L0–L4 execution — the machinery that turns "seems fine" into a number you can gate on.',
                },
                {
                  icon: CapIcon.gauge,
                  title: 'LLM cost engineering',
                  body: 'Multi-model routing, semantic caching, and per-service cost tracking that cut the bill without lowering output quality — the same levers whether you spend hundreds or hundreds of thousands.',
                },
                {
                  icon: CapIcon.layers,
                  title: `${YEARS_EXPERIENCE} years of production systems`,
                  body: 'Long before agents: shipping software people depend on — including a consumer app with 100M+ downloads and a Google Play Editor’s Choice award, and an 80–90% RPC cost reduction on a Web3 platform, both as an engineer in employed roles.',
                },
              ]}
            />
          </div>
        </div>
      </section>

      <section className="ds-sec" aria-labelledby="h-res">
        <div className="ds-wrap">
          <SectionHeader
            id="h-res"
            eyebrow="Quantified results"
            title="The numbers, each with its context"
            aside={
              <Verdict
                tone="muted"
                className="!max-w-[40ch] !text-[clamp(19px,1.7vw,23px)]"
              >
                Every figure below says where it came from — a system I built,
                my own platform, or an employed role. No borrowed client
                metrics.
              </Verdict>
            }
          />
          <div className="ds-mt-56">
            <ResultTiles items={RESULT_TILES} />
          </div>
          <div className="ds-mt-40">
            <CostExhibit
              before={{
                value: dollars(COST_CASE.before),
                label: COST_CASE.before,
              }}
              after={{
                value: dollars(COST_CASE.after),
                label: COST_CASE.after,
              }}
              max={90}
              ticks={['$0', '$30', '$60', '$90 / mo']}
              delta={COST_CASE.delta}
              caption={`LLM bill: ${COST_CASE.before} → ${COST_CASE.after} / month`}
              sourceLabel={COST_CASE.label}
              proof={{ href: '/llm-cost-teardown', text: 'worked example' }}
              verdict="On a larger bill, the same moves free up real budget."
              strip={[
                'Multi-model routing',
                'Caching',
                'No drop in output quality',
              ]}
            />
          </div>
        </div>
      </section>

      <section className="ds-sec" aria-labelledby="h-sys">
        <div className="ds-wrap">
          <SectionHeader
            id="h-sys"
            eyebrow="01 · Systems I designed and built"
            title="Systems I designed and built"
            intro="Not client logos — my own systems, where I proved the reliability and cost methods I bring to your agents."
          />
          <div className="ds-cards ds-mt-48">
            {SYSTEMS.map(s => (
              <SystemCard
                key={s.id}
                name={s.name}
                kind={KIND[s.id] ?? ''}
                tagline={s.tagline}
                metric={s.metric}
                links={[
                  ...(s.id === 'dw'
                    ? [
                        {
                          href: '/methodology',
                          label: 'How runs & passes are counted',
                        },
                      ]
                    : []),
                  ...(s.repo
                    ? [
                        {
                          href: s.repo,
                          label: s.linkLabel ?? 'View on GitHub',
                          external: true,
                          location: `systems_${s.id}`,
                        },
                      ]
                    : []),
                ]}
              />
            ))}
          </div>
          <p className="ds-note ds-mt-40" style={{ fontSize: 12.5 }}>
            Built with Python, LangGraph, FastAPI, PostgreSQL, Redis, and
            Docker.
          </p>
        </div>
      </section>

      <section className="ds-sec" aria-labelledby="h-off">
        <div className="ds-wrap">
          <SectionHeader
            id="h-off"
            eyebrow="02 · Ways to work together"
            title="Fixed-scope offers"
          />
          <div className="ds-mt-48">
            <OfferColumns
              offers={OFFERS.map(o => ({ ...o, kind: OFFER_KIND[o.id] ?? '' }))}
              footnote={
                <>
                  Also available: <strong>{ADVISORY.name}</strong> at{' '}
                  {ADVISORY.price} ({ADVISORY.terms}). {UPSELL}
                </>
              }
            />
          </div>
        </div>
      </section>

      <section className="ds-sec" aria-labelledby="h-how">
        <div className="ds-wrap">
          <SectionHeader
            id="h-how"
            eyebrow="03 · Operator protocol"
            title="How I work"
          />
          <div className="ds-mt-48">
            <Chain
              steps={PROTOCOL.map((p, i) => ({
                k: String(i + 1).padStart(2, '0'),
                title: p.step,
                body: p.detail,
              }))}
            />
          </div>
        </div>
      </section>

      <ProofOfMethod />

      <section className="ds-sec" data-tone="surface" aria-labelledby="h-terms">
        <div className="ds-wrap">
          <SectionHeader
            id="h-terms"
            eyebrow="04 · Continuity and trust"
            title="How engagements are run"
          />
          <div className="ds-mt-48">
            <TermsList items={TERMS} />
          </div>
        </div>
      </section>

      {posts.length > 0 && (
        <section className="ds-sec" aria-labelledby="h-wr">
          <div className="ds-wrap">
            <SectionHeader
              id="h-wr"
              eyebrow="05 · Writing"
              title="Notes on agent reliability"
              aside={
                <TextLink href="/writing" className="ds-mono">
                  <span style={{ fontSize: 14 }}>All writing →</span>
                </TextLink>
              }
            />
            <div className="ds-mt-40 ds-rule-top">
              <PostWall groups={[{ posts }]} size="sm" />
            </div>
          </div>
        </section>
      )}

      <FinalCta
        title="Get a straight read on your agents"
        body="A 30-minute systems call: tell me what your agents do and where they worry you, and I'll tell you whether an audit, a cost teardown, or a retainer is the right next step."
        location="final_cta"
        trust={TRUST_CHIPS}
      />
    </>
  );
}
