'use client';

import { Button } from '@/components/ui/button';
import { trackClientEvent } from '../actions';
import type { SitePack, Offer } from '@/lib/types.leadgen';

interface HeroDynamicProps {
  pack: SitePack;
  icp: string;
  offers?: Offer[];
}

export default function HeroDynamic({ pack, icp, offers }: HeroDynamicProps) {
  const hero = pack.blocks.hero;
  const experiment = pack.experiment?.hero;
  const variant = experiment?.variant || 'default';

  // Fallback content if no hero block is provided
  const headline =
    hero?.headline || 'AI engineer who builds reliable LLM platforms';
  const subheadline =
    hero?.sub ||
    'I design and run production-ready LLM services with clear SLOs, MLflow registries, and cost controls';
  const primaryCTA = hero?.cta_primary || 'Get Started';
  const secondaryCTA = hero?.cta_secondary || 'Learn More';

  const handleCTAClick = async (ctaType: 'primary' | 'secondary') => {
    try {
      await trackClientEvent({
        event: 'cta_click',
        icp,
        variant,
        context: {
          route: window.location.pathname,
          slug: `hero_${ctaType}_${variant}`,
          offer_code: offers?.[0]?.code,
          user_agent: navigator.userAgent,
        },
      });
    } catch (error) {
      console.error('Failed to track CTA click:', error);
    }
  };

  const handlePrimaryClick = () => {
    handleCTAClick('primary');
    // Scroll to offers or contact form
    const offersSection = document.getElementById('offers');
    if (offersSection) {
      offersSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSecondaryClick = () => {
    handleCTAClick('secondary');
    // Scroll to case studies
    const caseStudiesSection = document.getElementById('case-studies');
    if (caseStudiesSection) {
      caseStudiesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-24 sm:py-32">
        <div className="mx-auto max-w-4xl text-center">
          {/* Headline */}
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-6xl">
            {headline}
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-400 sm:text-xl">
            {subheadline}
          </p>

          {/* Trust indicators */}
          <div className="mt-6 flex flex-wrap justify-center gap-2 text-sm text-slate-500 dark:text-slate-500">
            <span className="flex items-center gap-1">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clipRule="evenodd"
                />
              </svg>
              UK LTD
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clipRule="evenodd"
                />
              </svg>
              11+ years production systems
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clipRule="evenodd"
                />
              </svg>
              Personal R&D lab
            </span>
          </div>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              onClick={handlePrimaryClick}
              className="min-w-[140px] bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
            >
              {primaryCTA}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleSecondaryClick}
              className="min-w-[140px] border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {secondaryCTA}
            </Button>
          </div>

          {/* Experiment indicator (only in development) */}
          {process.env.NODE_ENV === 'development' && experiment && (
            <div className="mt-8 rounded-lg bg-amber-50 px-4 py-2 text-xs text-amber-800 dark:bg-amber-950 dark:text-amber-200">
              Experiment: {variant}{' '}
              {experiment.arms && `(${experiment.arms.join(', ')})`}
            </div>
          )}
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-100 opacity-20 dark:bg-blue-900" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-purple-100 opacity-20 dark:bg-purple-900" />
      </div>
    </section>
  );
}
