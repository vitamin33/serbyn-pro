import { Quote } from 'lucide-react';

// Home §8 — WHAT COLLEAGUES SAY. Layout only. Quote text, names, and LinkedIn
// links are supplied by Vitalii verbatim ([VS-TODO:linkedin-recs]) — no quote
// text is authored here. Placeholder cards read clean, not empty.
export function Colleagues() {
  return (
    <section className="section border-t border-border">
      <div className="container">
        <div className="mb-10">
          <p className="label-caps mb-2 text-muted-foreground">
            05_what_colleagues_say
          </p>
          <h2 className="headline-lg">What colleagues say</h2>
          <p className="mt-3 max-w-2xl body-md text-muted-foreground">
            Named recommendations from engineers and leads I&apos;ve worked with
            are shared on request, with links to the originals.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="flex flex-col rounded-lg border border-dashed border-border bg-card p-6"
            >
              <Quote
                className="mb-4 h-5 w-5 text-primary/50"
                strokeWidth={1.75}
              />
              <p className="body-md flex-1 leading-relaxed text-muted-foreground/60">
                Reference available on request.
              </p>
              <span className="mt-5 inline-flex w-fit items-center gap-2 rounded-sm border border-border px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-warning"
                  aria-hidden="true"
                />
                LinkedIn recommendation
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
