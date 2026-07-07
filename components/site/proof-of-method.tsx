import fs from 'node:fs';
import path from 'node:path';
import {
  FileText,
  PlayCircle,
  ArrowDownToLine,
  ArrowUpRight,
} from 'lucide-react';
import { PROOF_LOOM_URL } from '@/lib/facts';

// Home §04 — PROOF OF METHOD. Each card renders ONLY when its artifact is real:
// the sample report when public/sample-audit-report.pdf exists at build time, the
// walkthrough when PROOF_LOOM_URL is set. No unfulfilled-promise placeholder
// copy — if neither artifact exists, the whole section is omitted.
// [VS-TODO:sample-report-pdf] [VS-TODO:loom]
const SAMPLE_REPORT_HREF = '/sample-audit-report.pdf';

function sampleReportExists(): boolean {
  try {
    return fs.existsSync(
      path.join(process.cwd(), 'public', 'sample-audit-report.pdf')
    );
  } catch {
    return false;
  }
}

interface Proof {
  icon: typeof FileText;
  title: string;
  body: string;
  href: string;
  cta: string;
  external: boolean;
}

export function ProofOfMethod() {
  const proofs: Proof[] = [];

  if (sampleReportExists()) {
    proofs.push({
      icon: FileText,
      title: 'Sanitized sample audit report',
      body: 'The exact deliverable format — findings, severity, evidence, and a prioritized fix list — with a real (client-anonymized) example.',
      href: SAMPLE_REPORT_HREF,
      cta: 'Download the sample report',
      external: false,
    });
  }

  if (PROOF_LOOM_URL) {
    proofs.push({
      icon: PlayCircle,
      title: 'Method walkthrough (2–3 min)',
      body: 'A short screen recording walking through how an agent trajectory is evaluated and where the false-greens hide.',
      href: PROOF_LOOM_URL,
      cta: 'Watch the walkthrough',
      external: true,
    });
  }

  if (proofs.length === 0) return null;

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
          {proofs.map(proof => (
            <a
              key={proof.title}
              href={proof.href}
              {...(proof.external
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : { download: true })}
              className="group flex flex-col rounded-lg border border-border bg-card p-6 transition-colors hover:border-primary/50"
            >
              <proof.icon
                className="mb-3 h-5 w-5 text-primary"
                strokeWidth={1.75}
              />
              <h3 className="headline-sm mb-2">{proof.title}</h3>
              <p className="body-md mb-5 flex-1 leading-relaxed text-muted-foreground">
                {proof.body}
              </p>
              <span className="inline-flex w-fit items-center gap-1.5 font-mono text-xs text-primary group-hover:underline">
                {proof.cta}
                {proof.external ? (
                  <ArrowUpRight className="h-3.5 w-3.5" />
                ) : (
                  <ArrowDownToLine className="h-3.5 w-3.5" />
                )}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
