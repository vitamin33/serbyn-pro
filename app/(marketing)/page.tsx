import { Hero } from '@/components/site/hero';
import { CredibilityStack } from '@/components/site/credibility-stack';
import { ResultsStrip } from '@/components/site/results-strip';
import { SystemsBuilt } from '@/components/site/systems-built';
import { Offers } from '@/components/site/offers';
import { CTASection } from '@/components/cta-section';

export default function HomePage() {
  return (
    <>
      <Hero />
      <CredibilityStack />
      <ResultsStrip />
      <SystemsBuilt />
      <Offers />
      {/* §6–§11 land in T04–T05; legacy CTA kept until T05. */}
      <CTASection />
    </>
  );
}
