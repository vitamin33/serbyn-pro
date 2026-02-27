import { ExternalLink, Mail } from 'lucide-react';

export function CTASection() {
  return (
    <section className="section border-t border-border">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight">
            Book an Architecture Review
          </h2>
          <p className="mb-8 text-muted-foreground">
            30-minute call to discuss your AI system architecture, agent
            orchestration challenges, or infrastructure strategy.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="https://calendly.com/serbyn-vitalii/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Book a Call
              <ExternalLink className="h-4 w-4" />
            </a>
            <a
              href="mailto:serbyn.vitalii@gmail.com"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              <Mail className="h-4 w-4" />
              serbyn.vitalii@gmail.com
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-xs text-muted-foreground">
            <span>NDA available</span>
            <span className="text-border" aria-hidden="true">
              /
            </span>
            <span>GMT+2 Kyiv</span>
            <span className="text-border" aria-hidden="true">
              /
            </span>
            <span>UK LTD registered</span>
          </div>
        </div>
      </div>
    </section>
  );
}
