import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function AboutSnippet() {
  return (
    <section className="section border-t border-border">
      <div className="container">
        <div className="grid items-center gap-12 md:grid-cols-2">
          {/* Photo placeholder */}
          <div className="flex aspect-square items-center justify-center rounded-lg border border-border bg-card">
            <span className="font-mono text-sm text-muted-foreground">
              {'// photo'}
            </span>
          </div>

          {/* Bio */}
          <div>
            <p className="mb-2 font-mono text-sm text-muted-foreground">
              {'// About me'}
            </p>
            <h2 className="mb-4 text-3xl font-bold tracking-tight">
              Vitalii Serbyn
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                12+ years shipping production systems — from Android apps with
                100M+ users at GlobalLogic to production AI platforms today.
                Solo architect across Web3, healthcare, and AI agent systems.
              </p>
              <p>
                Now I build agent orchestration daemons, LangGraph pipelines,
                and production AI infrastructure with full observability.
                Director of Easelect LTD (UK), working remotely from Kyiv.
              </p>
            </div>
            <Link
              href="/about"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              Full story
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
