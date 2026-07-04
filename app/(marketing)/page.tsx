import { Hero } from '@/components/site/hero';
import { CredibilityStack } from '@/components/site/credibility-stack';
import { ResultsStrip } from '@/components/site/results-strip';
import { FeaturedWork } from '@/components/featured-work';
import { CTASection } from '@/components/cta-section';

export default function HomePage() {
  return (
    <>
      <Hero />
      <CredibilityStack />
      <ResultsStrip />
      {/* Remaining legacy sections are replaced in T03–T05. */}
      <FeaturedWork />
      <CTASection />
    </>
  );
}
