import { CostExhibit, SectionHeader } from '@/components/ds';
import { COST_CASE } from '@/lib/facts';

// Methodology example for the LLM Cost Teardown page: my OWN-platform bill,
// honestly labeled (never presented as a client result). Slotted into
// OfferPage's `extra` between the levers and the timeline. Offer pages stay
// still, so the exhibit renders settled, without its sequence.
const dollars = (v: string) => Number(v.replace(/[^0-9.]/g, ''));

export function CostCase() {
  return (
    <section className="ds-sec" data-size="offer" aria-labelledby="h-case">
      <div className="ds-wrap">
        <SectionHeader
          id="h-case"
          eyebrow="Worked example"
          title="Worked example — my own platform"
          intro="The same levers, run on my own agent platform. A small bill — but the mechanics are identical, and they scale with spend. Multi-model routing plus caching did most of the work: cheap models for the easy hops, cached results for the repeats, and frontier models only where quality demanded them."
        />
        <div className="ds-mt-40">
          <CostExhibit
            still
            before={{
              value: dollars(COST_CASE.before),
              label: COST_CASE.before,
            }}
            after={{ value: dollars(COST_CASE.after), label: COST_CASE.after }}
            max={90}
            ticks={['$0', '$30', '$60', '$90 / mo']}
            delta={COST_CASE.delta}
            caption={`LLM bill: ${COST_CASE.before} → ${COST_CASE.after} / month`}
            sourceLabel={COST_CASE.label}
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
  );
}
