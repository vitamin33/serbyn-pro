import { Hero } from '@/components/site/hero';
import { CredibilityStack } from '@/components/site/credibility-stack';
import { ResultsStrip } from '@/components/site/results-strip';
import { SystemsBuilt } from '@/components/site/systems-built';
import { Offers } from '@/components/site/offers';
import { HowIWork } from '@/components/site/how-i-work';
import { ProofOfMethod } from '@/components/site/proof-of-method';
import { Colleagues } from '@/components/site/colleagues';
import { Continuity } from '@/components/site/continuity';
import { CTASection } from '@/components/cta-section';

export default function HomePage() {
  return (
    <>
      <Hero />
      <CredibilityStack />
      <ResultsStrip />
      <SystemsBuilt />
      <Offers />
      <HowIWork />
      <ProofOfMethod />
      <Colleagues />
      <Continuity />
      {/* §10 Writing + §11 Final CTA land in T05; legacy CTA kept until then. */}
      <CTASection />
    </>
  );
}
