import { createMetadata, siteConfig } from '@/lib/seo';
import { Eyebrow, SourceLabel, TextLink } from '@/components/ds';
import { FlowDiagram } from '@/components/diagram';

// Methodology note backing the DW "101 logged runs · 0.94 pass rate" figure
// (linked from the home DW card). Defines what a run and a pass are so the
// number is legible and honestly labeled. Numbers per APPROVED FACTS; run/pass
// definitions written from the pipeline's own behavior.
export const metadata = createMetadata({
  title: 'DW methodology — how runs and passes are counted',
  description:
    'What counts as a run and a pass for DW, the autonomous spec-driven development pipeline: 101 logged runs at a 0.94 pass rate, measured on my own system.',
  canonicalUrl: `${siteConfig.url}/methodology`,
});

export default function MethodologyPage() {
  return (
    <div style={{ padding: '80px 0 120px' }}>
      <div className="ds-wrap">
        <div className="ds-stack" style={{ gap: 20, maxWidth: 860 }}>
          <Eyebrow>Methodology note</Eyebrow>
          <h1 className="ds-h1" data-size="index">
            How DW runs and passes are counted
          </h1>
          <p className="ds-lede" style={{ color: 'var(--muted)' }}>
            DW is an autonomous, spec-driven development pipeline I designed and
            built. A short definition of the numbers so they mean something.
          </p>
        </div>

        <div
          className="ds-card"
          data-claim="101 · 0.94"
          style={{
            marginTop: 40,
            padding: '24px 28px',
            maxWidth: 560,
            display: 'grid',
            gap: 6,
          }}
        >
          <span
            className="ds-display ds-num"
            data-claim-value=""
            style={{ fontSize: 56, letterSpacing: '-0.05em' }}
          >
            101 · 0.94
          </span>
          <span>logged runs · pass rate</span>
          <SourceLabel label="on DW, a system I designed and built" />
        </div>

        <div className="ds-about-flow" style={{ marginTop: 56 }}>
          <h2 className="ds-h3" style={{ fontSize: 26 }}>
            What counts as a run
          </h2>
          <p>
            A <strong>run</strong> is one specification submitted to the
            pipeline and executed end to end to a terminal state — planning,
            change, and verification — without a human taking over mid-way. Each
            run is logged, which is why the count is exact rather than
            estimated. Aborted or half-completed attempts are logged too; they
            simply don’t count as passes.
          </p>
          <h2 className="ds-h3" style={{ fontSize: 26, marginTop: 20 }}>
            What counts as a pass
          </h2>
          <p>
            A <strong>pass</strong> is a run whose output satisfies the spec’s
            acceptance checks — it builds, the tests and evals it was asked to
            meet are green, and the result matches what the spec described —
            with <strong>no human edits</strong> to the produced change. A run
            that needs a person to finish or fix it is recorded as a non-pass,
            even if the final code eventually shipped.
          </p>
        </div>

        <div style={{ marginTop: 40, maxWidth: 1000 }}>
          <FlowDiagram
            title="one DW run"
            label="A spec is planned, the change is made, acceptance checks run, and the ledger records a pass only when no human edited the change."
            caption="A run that needs a person to finish it is recorded as a non-pass, even if the final code eventually shipped."
            emphasis={['checks']}
            steps={[
              { id: 'spec', title: 'Spec', sub: 'submitted' },
              { id: 'plan', title: 'Planning', sub: 'by the pipeline' },
              { id: 'change', title: 'Change', sub: 'by the pipeline' },
              {
                id: 'checks',
                title: 'Acceptance checks',
                sub: 'build, tests, evals',
              },
              { id: 'ledger', title: 'Ledger', sub: 'pass = no human edits' },
            ]}
          />
        </div>

        <div className="ds-about-flow" style={{ marginTop: 56 }}>
          <h2 className="ds-h3" style={{ fontSize: 26 }}>
            Why the honesty matters
          </h2>
          <p>
            A pass rate is only worth quoting if a “pass” can’t quietly include
            work a human rescued. Counting human-touched runs as non-passes is
            the same discipline I bring to client agents: a green has to be
            earned and has to point at its evidence, or it isn’t a green. This
            figure is measured on my own system, not a client’s.
          </p>
        </div>

        <p style={{ marginTop: 40 }}>
          <TextLink href="/writing" strong>
            More on false greens and evidence-binding →
          </TextLink>
        </p>
      </div>
    </div>
  );
}
