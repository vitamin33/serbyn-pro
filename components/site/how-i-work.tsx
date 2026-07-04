import { PROTOCOL } from '@/lib/facts';

// Home §6 — HOW I WORK. The operator protocol, rendered as a numbered
// monospace sequence: ground-truth audit → evals → evidence-binding → gated
// rollout. This is the method the offers all run on.
export function HowIWork() {
  return (
    <section className="section border-t border-border">
      <div className="container">
        <div className="mb-10">
          <p className="label-caps mb-2 text-muted-foreground">
            03_operator_protocol
          </p>
          <h2 className="headline-lg">How I work</h2>
          <p className="mt-3 max-w-2xl body-md text-muted-foreground">
            Same sequence every engagement — measure before touching, gate every
            change on evidence.
          </p>
        </div>

        <ol className="space-y-px overflow-hidden rounded-lg border border-border bg-border">
          {PROTOCOL.map((p, i) => (
            <li
              key={p.step}
              className="flex flex-col gap-2 bg-card p-5 sm:flex-row sm:gap-6"
            >
              <span className="metric-lg shrink-0 text-primary/70">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="headline-sm mb-1 font-mono">{p.step}</h3>
                <p className="body-md leading-relaxed text-muted-foreground">
                  {p.detail}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
