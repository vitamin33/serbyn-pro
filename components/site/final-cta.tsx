import { BookingButton, EmailButton } from '@/components/site/cta';
import { TRUST_CHIPS } from '@/lib/facts';

// Home §11 — FINAL CTA. Repeat the booking CTA + plain email, with the trust
// line. Vendor close, not a candidate pitch.
export function FinalCTA() {
  return (
    <section className="section border-t border-border">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="headline-lg mb-4">
            Get a straight read on your agents
          </h2>
          <p className="mb-8 body-lg text-muted-foreground">
            A 30-minute systems call: tell me what your agents do and where they
            worry you, and I&apos;ll tell you whether an audit, a cost teardown,
            or a retainer is the right next step.
          </p>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <BookingButton location="final_cta" />
            <EmailButton location="final_cta" />
          </div>

          <p className="mt-8 font-mono text-xs text-muted-foreground">
            {TRUST_CHIPS.join(' · ')}
          </p>
        </div>
      </div>
    </section>
  );
}
