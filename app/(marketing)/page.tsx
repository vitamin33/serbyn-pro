import { HeroArchitect } from '@/components/hero-architect';
import { FeaturedWork } from '@/components/featured-work';
import { Capabilities } from '@/components/capabilities';
import { TechStack } from '@/components/tech-stack';
import { AboutSnippet } from '@/components/about-snippet';
import { CTASection } from '@/components/cta-section';

export default function HomePage() {
  return (
    <>
      <HeroArchitect />
      <FeaturedWork />
      <Capabilities />
      <TechStack />
      <AboutSnippet />
      <CTASection />
    </>
  );
}
