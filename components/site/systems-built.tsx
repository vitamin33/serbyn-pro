import Link from 'next/link';
import { Github, ArrowRight, ExternalLink } from 'lucide-react';
import { Stat } from '@/components/site/stat';
import { OutboundLink } from '@/components/site/cta';
import { SYSTEMS } from '@/lib/facts';

// Home §4 — SYSTEMS I DESIGNED AND BUILT. Header states ownership literally
// (source-label rule). One hard metric per card via the labeled Stat component;
// GitHub link when a repo URL exists, otherwise a clean "coming soon" placeholder
// (VS-TODO:dw-github) — never a broken link.
export function SystemsBuilt() {
  return (
    <section className="section border-t border-border">
      <div className="container">
        <div className="mb-10">
          <p className="label-caps mb-2 text-muted-foreground">
            01_systems_i_designed_and_built
          </p>
          <h2 className="headline-lg">Systems I designed and built</h2>
          <p className="mt-3 max-w-2xl body-md text-muted-foreground">
            Not client logos — my own systems, where I proved the reliability
            and cost methods I bring to your agents.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {SYSTEMS.map(sys => (
            <div
              key={sys.id}
              className="flex flex-col rounded-lg border border-border bg-card p-6"
            >
              <h3 className="headline-sm mb-2">{sys.name}</h3>
              <p className="body-md mb-5 flex-1 leading-relaxed text-muted-foreground">
                {sys.tagline}
              </p>
              <Stat claim={sys.metric} className="mb-5" />
              {sys.id === 'dw' && (
                <Link
                  href={'/methodology' as any}
                  className="mb-3 inline-flex items-center gap-1.5 font-mono text-xs text-primary hover:underline"
                >
                  How runs &amp; passes are counted
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
              {sys.repo ? (
                <OutboundLink
                  href={sys.repo}
                  location={`systems_${sys.id}`}
                  className="inline-flex items-center gap-1.5 font-mono text-xs text-primary hover:underline"
                >
                  {sys.repo.includes('github.com') ? (
                    <Github className="h-3.5 w-3.5" />
                  ) : (
                    <ExternalLink className="h-3.5 w-3.5" />
                  )}
                  {sys.linkLabel ?? 'View on GitHub'}
                </OutboundLink>
              ) : (
                <span className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground/60">
                  <Github className="h-3.5 w-3.5" />
                  Repository — coming soon
                </span>
              )}
            </div>
          ))}
        </div>

        <p className="mt-8 font-mono text-xs text-muted-foreground/70">
          Built with Python, LangGraph, FastAPI, PostgreSQL, Redis, and Docker.
        </p>
      </div>
    </section>
  );
}
