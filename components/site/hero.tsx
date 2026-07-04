import { BookingButton, EmailButton } from '@/components/site/cta';
import { TRUST_CHIPS, UPDATED } from '@/lib/facts';

// Home §1 — HERO. Vendor-framed, plain server text (no counters). Kicker → H1 →
// two-sentence positioning → primary booking CTA + plain email → trust chips →
// freshness cue.
export function Hero() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-28 lg:py-32">
      <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

      <div className="container relative">
        <div className="max-w-3xl">
          <p className="label-caps mb-5 text-primary">
            agentic systems architect
          </p>

          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            I make AI agents reliable enough to run in production.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            I&apos;m Vitalii Serbyn — I work with US, UK, and EU teams to get
            agent systems production-ready. Two specialties: agent reliability
            (trajectory evals, false-green-rate metering, evidence-binding
            gates, trust-tiered execution) and LLM cost engineering (multi-model
            routing and cost tracking) — bringing spend down without lowering
            output quality.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <BookingButton location="hero" />
            <EmailButton location="hero" />
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-xs text-muted-foreground">
            {TRUST_CHIPS.map((chip, i) => (
              <span key={chip} className="flex items-center gap-3">
                {i > 0 && (
                  <span className="text-border" aria-hidden="true">
                    ·
                  </span>
                )}
                {chip}
              </span>
            ))}
          </div>

          <p className="mt-6 label-caps text-muted-foreground/70">
            Updated {UPDATED}
          </p>
        </div>
      </div>
    </section>
  );
}
