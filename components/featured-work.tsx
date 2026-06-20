import { getFeaturedCaseStudies } from '@/lib/case-studies';
import { ProjectCard } from '@/components/lab/project-card';
import { Reveal } from '@/components/lab/reveal';

export function FeaturedWork() {
  const studies = getFeaturedCaseStudies();
  if (studies.length === 0) return null;

  return (
    <section className="section border-t border-border">
      <div className="container">
        <div className="mb-10">
          <p className="label-caps mb-2 text-muted-foreground">
            01_DEPLOYED_SYSTEMS
          </p>
          <h2 className="headline-lg">Featured work</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {studies.map((study, i) => (
            <Reveal key={study.slug} delay={i * 80}>
              <ProjectCard study={study} index={i} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
