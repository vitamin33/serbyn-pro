import { FileText, PlayCircle } from 'lucide-react';

// Home §7 — PROOF OF METHOD. Layout is built now; the two artifacts are
// human-supplied (VS-TODO). Placeholders are styled as "on request / coming
// soon" — clean, never lorem, never a broken link.
const PROOFS = [
  {
    icon: FileText,
    title: 'Sanitized sample audit report',
    body: 'The exact deliverable format — findings, severity, evidence, and a prioritized fix list — with a real (client-anonymized) example.',
    status: 'Available on request', // [VS-TODO:sample-report]
    todo: 'VS-TODO:sample-report',
  },
  {
    icon: PlayCircle,
    title: 'Method walkthrough (2–3 min)',
    body: 'A short screen recording walking through how an agent trajectory is evaluated and where the false-greens hide.',
    status: 'Coming soon', // [VS-TODO:loom]
    todo: 'VS-TODO:loom',
  },
];

export function ProofOfMethod() {
  return (
    <section className="section border-t border-border">
      <div className="container">
        <div className="mb-10">
          <p className="label-caps mb-2 text-muted-foreground">
            04_proof_of_method
          </p>
          <h2 className="headline-lg">See the method, not just claims</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {PROOFS.map(proof => (
            <div
              key={proof.title}
              className="flex flex-col rounded-lg border border-dashed border-border bg-card p-6"
            >
              <proof.icon
                className="mb-3 h-5 w-5 text-primary"
                strokeWidth={1.75}
              />
              <h3 className="headline-sm mb-2">{proof.title}</h3>
              <p className="body-md mb-5 flex-1 leading-relaxed text-muted-foreground">
                {proof.body}
              </p>
              <span className="inline-flex w-fit items-center gap-2 rounded-sm border border-border px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-warning"
                  aria-hidden="true"
                />
                {proof.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
