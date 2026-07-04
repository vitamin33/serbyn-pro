import { Hero } from '@/components/site/hero';
import { CredibilityStack } from '@/components/site/credibility-stack';
import { ResultsStrip } from '@/components/site/results-strip';
import { SystemsBuilt } from '@/components/site/systems-built';
import { Offers } from '@/components/site/offers';
import { HowIWork } from '@/components/site/how-i-work';
import { ProofOfMethod } from '@/components/site/proof-of-method';
import { Colleagues } from '@/components/site/colleagues';
import { Continuity } from '@/components/site/continuity';
import { WritingTeaser } from '@/components/site/writing-teaser';
import { FinalCTA } from '@/components/site/final-cta';

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
      <WritingTeaser />
      <FinalCTA />
    </>
  );
}
