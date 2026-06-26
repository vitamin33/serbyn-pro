import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StatusChip, type ChipVariant } from '@/components/lab/status-chip';
import { SystemIdLabel } from '@/components/lab/system-id-label';
import {
  caseStudyCategory,
  CATEGORY_LABEL,
  CATEGORY_CODE,
} from '@/lib/taxonomy';
import type { CaseStudy } from '@/lib/case-studies';

type Chip = { label: string; variant: ChipVariant };

function deriveChips(study: CaseStudy): Chip[] {
  if (study.status_chips && study.status_chips.length > 0) {
    return study.status_chips;
  }
  return (study.highlight_metrics ?? [])
    .slice(0, 2)
    .map(label => ({ label, variant: 'neutral' as ChipVariant }));
}

export function ProjectCard({
  study,
  index,
  featured = false,
}: {
  study: CaseStudy;
  index: number;
  featured?: boolean;
}) {
  const category = caseStudyCategory(study.category);
  const chips = deriveChips(study);

  return (
    <Link
      href={study.url as any}
      className={cn(
        'group flex flex-col overflow-hidden rounded-lg border bg-card transition-colors hover:border-primary/40',
        featured ? 'border-primary/40 md:flex-row' : 'border-border'
      )}
    >
      {/* Abstract CSS cover (blueprint grid + glow + category glyph) — laid out,
          not a baked-in image, so the card carries no text-as-pixels. */}
      <div
        className={cn(
          'relative overflow-hidden border-b border-border bg-[hsl(220_23%_6%)]',
          featured && 'md:w-1/2 md:border-b-0 md:border-r'
        )}
      >
        <div className="blueprint-grid absolute inset-0 opacity-50" />
        <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-primary/20 blur-3xl transition-opacity group-hover:bg-primary/30" />
        <div className="absolute inset-0 bg-gradient-to-tr from-background/70 via-transparent to-transparent" />
        <div className="relative flex aspect-[1200/630] flex-col justify-between p-5">
          <span className="label-caps text-primary">
            {CATEGORY_LABEL[category]}
          </span>
          <div className="flex items-end justify-between">
            <span className="font-mono text-5xl font-bold leading-none tracking-tight text-foreground/[0.08]">
              {CATEGORY_CODE[category]}
            </span>
            <span className="label-caps text-muted-foreground/60">
              SYS_{String(index + 1).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center justify-between gap-2">
          <SystemIdLabel category={category} index={index} />
          {typeof study.impact_score === 'number' && (
            <span className="label-caps text-primary">
              {study.impact_score} IMPACT
            </span>
          )}
        </div>

        <h3 className="headline-sm transition-colors group-hover:text-primary">
          {study.title}
        </h3>
        <p className="body-md mt-2 line-clamp-3 text-muted-foreground">
          {study.summary}
        </p>

        {chips.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {chips.map(chip => (
              <StatusChip
                key={chip.label}
                label={chip.label}
                variant={chip.variant}
              />
            ))}
          </div>
        )}

        <div className="mt-3 flex flex-wrap gap-1.5">
          {study.tech.slice(0, 5).map(t => (
            <span
              key={t}
              className="rounded bg-secondary px-2 py-0.5 font-mono text-[11px] text-secondary-foreground"
            >
              {t}
            </span>
          ))}
        </div>

        <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
          View case study
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
