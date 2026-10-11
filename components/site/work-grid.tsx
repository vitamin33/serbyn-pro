'use client';

import { useMemo, useState } from 'react';
import { Chip, Eyebrow, Tick } from '@/components/ds';
import {
  caseStudyCategory,
  CATEGORY_LABEL,
  PROJECT_LABEL,
  PUBLIC_CATEGORIES,
  type PublicCategory,
} from '@/lib/taxonomy';
import type { CaseStudy } from '@/lib/case-studies';

// /work index: category filter and sort over the case studies, cards in the
// exhibit style. Impact scores are not shown and not sortable (decision
// 2026-10-10). Low motion budget: no entrance animation.

type Sort = 'relevance' | 'recent';
type Filter = 'all' | PublicCategory;

const SORTS: { id: Sort; label: string }[] = [
  { id: 'relevance', label: 'Relevance' },
  { id: 'recent', label: 'Recent' },
];

function sortStudies(studies: CaseStudy[], sort: Sort): CaseStudy[] {
  const copy = [...studies];
  if (sort === 'recent')
    return copy.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  // relevance is an editorial order; studies without one keep file order
  return copy.sort((a, b) => (b.relevance ?? 0) - (a.relevance ?? 0));
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

  const categories = PUBLIC_CATEGORIES.filter(c => counts[c]);

  return (
    <div>
      <div className="ds-work-bar">
        <div
          className="ds-segline"
          role="group"
          aria-label="Filter by category"
        >
          <button
            type="button"
            aria-pressed={filter === 'all'}
            onClick={() => setFilter('all')}
          >
            All · {studies.length}
          </button>
          {categories.map(c => (
            <button
              key={c}
              type="button"
              aria-pressed={filter === c}
              onClick={() => setFilter(c)}
            >
              {CATEGORY_LABEL[c]} · {counts[c]}
            </button>
          ))}
        </div>
        <div>
          <Eyebrow size="sm">Sort</Eyebrow>
          <div className="ds-segline" role="group" aria-label="Sort">
            {SORTS.map(s => (
              <button
                key={s.id}
                type="button"
                aria-pressed={sort === s.id}
                onClick={() => setSort(s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="ds-work-grid">
        {visible.map(study => (
          <a key={study.slug} href={study.url} className="ds-card ds-work-card">
            <div className="ds-work-card-head">
              <Eyebrow size="sm">
                {CATEGORY_LABEL[caseStudyCategory(study.category)]}
              </Eyebrow>
              {study.project_type && (
                <Chip variant="claim" size="sm">
                  {PROJECT_LABEL[study.project_type]}
                </Chip>
              )}
            </div>
            <h2>{study.title}</h2>
            <p>{study.summary}</p>
            {study.highlight_metrics && study.highlight_metrics.length > 0 && (
              <ul className="ds-work-metrics">
                {study.highlight_metrics.slice(0, 3).map(m => (
                  <li key={m}>
                    <Tick />
                    {m}
                  </li>
                ))}
              </ul>
            )}
            <span className="ds-link">Read the case study →</span>
          </a>
        ))}
      </div>
    </div>
  );
}
