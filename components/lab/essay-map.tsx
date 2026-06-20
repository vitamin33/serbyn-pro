'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import type { TocItem } from '@/lib/toc';

// Sticky numbered "essay map" TOC with scroll-spy active state.
export function EssayMap({
  items,
  className,
}: {
  items: TocItem[];
  className?: string;
}) {
  const [active, setActive] = useState<string>(items[0]?.id ?? '');

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav className={cn('space-y-1', className)} aria-label="Essay map">
      <p className="label-caps mb-3 text-muted-foreground">ESSAY_MAP</p>
      {items.map((item, i) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={cn(
            'block rounded-md px-3 py-1.5 font-mono text-xs transition-colors',
            active === item.id
              ? 'bg-secondary text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <span className="text-primary">
            {String(i + 1).padStart(2, '0')}_
          </span>
          {item.title.toUpperCase().replace(/\s+/g, '_').slice(0, 22)}
        </a>
      ))}
    </nav>
  );
}
