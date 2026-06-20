'use client';

import { useMemo, useState } from 'react';
import { ProjectCard } from '@/components/lab/project-card';
import {
  caseStudyCategory,
  CATEGORY_LABEL,
  PUBLIC_CATEGORIES,
  type PublicCategory,
} from '@/lib/taxonomy';
import { cn } from '@/lib/utils';
import type { CaseStudy } from '@/lib/case-studies';

type Sort = 'relevance' | 'impact' | 'recent';
type Filter = 'all' | PublicCategory;

const SORTS: { id: Sort; label: string }[] = [
  { id: 'relevance', label: 'Relevance' },
  { id: 'impact', label: 'Impact' },
  { id: 'recent', label: 'Recent' },
];

function sortStudies(studies: CaseStudy[], sort: Sort): CaseStudy[] {
  const copy = [...studies];
  if (sort === 'recent') {
    return copy.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }
  const weight = (s: CaseStudy) =>
    sort === 'relevance'
      ? (s.relevance ?? s.impact_score ?? 0)
      : (s.impact_score ?? 0);
  return copy.sort((a, b) => weight(b) - weight(a));
}

export function WorkGrid({ studies }: { studies: CaseStudy[] }) {
  const [filter, setFilter] = useState<Filter>('all');
  const [sort, setSort] = useState<Sort>('relevance');

  const counts = useMemo(() => {
    const acc: Record<string, number> = {};
    for (const s of studies) {
      const c = caseStudyCategory(s.category);
      acc[c] = (acc[c] ?? 0) + 1;
    }
    return acc;
  }, [studies]);

  const visible = useMemo(() => {
    const filtered =
      filter === 'all'
        ? studies
        : studies.filter(s => caseStudyCategory(s.category) === filter);
    return sortStudies(filtered, sort);
  }, [studies, filter, sort]);

  return (
    <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
      <aside className="hidden lg:block">
        <div className="sticky top-24 space-y-1">
          <p className="label-caps mb-3 text-muted-foreground">SYSTEMS</p>
          <SidebarItem
            label="All projects"
            count={studies.length}
            active={filter === 'all'}
            onClick={() => setFilter('all')}
          />
          {PUBLIC_CATEGORIES.map(c => (
            <SidebarItem
              key={c}
              label={CATEGORY_LABEL[c]}
              count={counts[c] ?? 0}
              active={filter === c}
              onClick={() => setFilter(c)}
            />
          ))}
          <div className="mt-6 flex items-center gap-2 border-t border-border pt-4">
            <span className="h-2 w-2 rounded-full bg-success" />
            <span className="label-caps text-muted-foreground">
              SYSTEM STATUS: ONLINE
            </span>
          </div>
        </div>
      </aside>

      <div>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5 lg:hidden">
            <FilterChip
              label="All"
              active={filter === 'all'}
              onClick={() => setFilter('all')}
            />
            {PUBLIC_CATEGORIES.map(c => (
              <FilterChip
                key={c}
                label={CATEGORY_LABEL[c]}
                active={filter === c}
                onClick={() => setFilter(c)}
              />
            ))}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="label-caps text-muted-foreground">SORT</span>
            <div className="flex gap-1">
              {SORTS.map(s => (
                <FilterChip
                  key={s.id}
                  label={s.label}
                  active={sort === s.id}
                  onClick={() => setSort(s.id)}
                />
              ))}
            </div>
          </div>
        </div>

        {visible.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-12 text-center text-muted-foreground">
            No systems in this category yet.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {visible.map((study, i) => (
              <ProjectCard key={study.slug} study={study} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SidebarItem({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors',
        active
          ? 'bg-secondary text-foreground'
          : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
      )}
    >
      <span>{label}</span>
      <span className="font-mono text-xs">{count}</span>
    </button>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-sm border px-2.5 py-1 font-mono text-xs transition-colors',
        active
          ? 'border-transparent bg-primary text-primary-foreground'
          : 'border-border text-muted-foreground hover:text-foreground'
      )}
    >
      {label}
    </button>
  );
}
