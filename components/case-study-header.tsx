import { Badge } from '@/components/ui/badge';
import type { CaseStudy } from '@/lib/case-studies';

interface CaseStudyHeaderProps {
  caseStudy: CaseStudy;
}

export function CaseStudyHeader({ caseStudy }: CaseStudyHeaderProps) {
  return (
    <header className="mb-12">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="outline" className="capitalize">
            {caseStudy.category}
          </Badge>
          {caseStudy.project_type && (
            <Badge variant="secondary" className="capitalize">
              {caseStudy.project_type === 'primary'
                ? 'Primary R&D'
                : caseStudy.project_type === 'startup'
                  ? 'Startup'
                  : 'Enterprise'}
            </Badge>
          )}
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          {caseStudy.title}
        </h1>
        <p className="text-xl text-muted-foreground leading-8">
          {caseStudy.summary}
        </p>
      </div>

      {/* Highlight metrics */}
      {caseStudy.highlight_metrics &&
        caseStudy.highlight_metrics.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {caseStudy.highlight_metrics.map(metric => (
              <div
                key={metric}
                className="rounded-lg border border-border bg-card p-3"
              >
                <p className="font-mono text-sm text-foreground">{metric}</p>
              </div>
            ))}
          </div>
        )}

      {/* Technologies */}
      <div>
        <div className="flex flex-wrap gap-2">
          {caseStudy.tech.map(tech => (
            <Badge key={tech} variant="secondary">
              {tech}
            </Badge>
          ))}
        </div>
      </div>
    </header>
  );
}
