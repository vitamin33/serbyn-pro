import { AchievementsLiveAPI } from '@/components/achievements-live-api';
import { LivePortfolioMetrics } from '@/components/live-portfolio-metrics';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata.caseStudies();

export default function CaseStudiesPage() {
  return (
    <div className="min-h-screen py-16">
      <div className="container">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight mb-6">
            Case Studies
          </h1>
          <p className="text-xl text-muted-foreground leading-8">
            Real-world technical implementations with quantified business impact
            from live GitHub PRs and production systems.
          </p>
        </div>

        {/* Live Portfolio Metrics */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">
            Portfolio Overview
          </h2>
          <LivePortfolioMetrics fallbackToStatic={true} />
        </section>

        {/* Live Achievements as Case Studies */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Featured Achievements
          </h2>
          <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
            Real implementations from GitHub PRs with live metrics and business
            impact data
          </p>
          <AchievementsLiveAPI
            showHeroStats={false}
            showFilters={true}
            limit={12}
            featuredOnly={false}
            fallbackToStatic={true}
          />
        </section>
      </div>
    </div>
  );
}
