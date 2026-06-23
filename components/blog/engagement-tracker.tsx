'use client';

import { useEffect } from 'react';
import { track } from '@/lib/analytics';

/**
 * Per-post engagement analytics — answers "which blocks actually work":
 * - `blog_block_viewed`  — each H2 section / diagram / code block that scrolls into
 *   view (once, ≥50% visible) with its label, so you see which content gets reached
 * - `blog_scroll_depth`  — 25/50/75/100% milestones (how far readers actually get)
 * - `blog_cta_click` / `blog_crosslink_click` / `blog_casestudy_click` — the value
 *   signals (Book-a-Review CTA, in-series navigation, case-study clickthroughs)
 *
 * Renders nothing. All events route through `track()`, which no-ops without PostHog.
 */
export function EngagementTracker({ slug }: { slug: string }) {
  useEffect(() => {
    const root = document.querySelector('.blog-content');
    if (!root) return;

    // 1) section / diagram / code blocks entering the viewport (once each)
    const seen = new Set<string>();
    const io = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          const kind = el.classList.contains('mermaid')
            ? 'diagram'
            : el.tagName === 'H2'
              ? 'heading'
              : 'code';
          const label = (el.textContent || '').trim().slice(0, 80) || kind;
          const id = `${kind}:${label}`;
          if (seen.has(id)) continue;
          seen.add(id);
          track('blog_block_viewed', { slug, kind, label });
          io.unobserve(el);
        }
      },
      { threshold: 0.5 }
    );
    root
      .querySelectorAll<HTMLElement>(
        'h2, pre.mermaid, pre code[class*="language-"]'
      )
      .forEach(b => io.observe(b));

    // 2) scroll-depth milestones
    const fired = new Set<number>();
    const onScroll = () => {
      const doc = document.documentElement;
      const pct = Math.round(
        ((window.scrollY + window.innerHeight) / doc.scrollHeight) * 100
      );
      for (const m of [25, 50, 75, 100]) {
        if (pct >= m && !fired.has(m)) {
          fired.add(m);
          track('blog_scroll_depth', { slug, depth: m });
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // 3) value-signal clicks
    const onClick = (ev: MouseEvent) => {
      const a = (ev.target as HTMLElement).closest('a');
      const href = a?.getAttribute('href');
      if (!href) return;
      if (href.includes('calendly.com')) track('blog_cta_click', { slug });
      else if (href.startsWith('/blog/'))
        track('blog_crosslink_click', { slug, to: href });
      else if (href.startsWith('/work/'))
        track('blog_casestudy_click', { slug, to: href });
    };
    document.addEventListener('click', onClick);

    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('click', onClick);
    };
  }, [slug]);

  return null;
}
