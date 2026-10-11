'use client';

import { useEffect, useRef, useState } from 'react';

// Reading UX for posts: a 2px progress rule under the header with "N min
// left", and a sticky table of contents that marks the section being read.

/** Mount inside a position:relative header. `minutes` = whole-post read time. */
export function ReadingProgress({
  minutes,
  target = 'article',
}: {
  /** whole-post read time; measured from the target's text when omitted */
  minutes?: number;
  target?: string;
}) {
  const bar = useRef<HTMLSpanElement>(null);
  const [left, setLeft] = useState<number | null>(minutes ?? null);

  useEffect(() => {
    let raf = 0;
    const el = document.querySelector(target);
    const totalMin =
      minutes ??
      Math.max(
        1,
        Math.round((el?.textContent ?? '').split(/\s+/).length / 230)
      );
    const update = () => {
      raf = 0;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const scrollable = r.height - window.innerHeight;
      const p =
        scrollable > 0 ? Math.min(1, Math.max(0, -r.top / scrollable)) : 1;
      bar.current?.style.setProperty('--p', String(p));
      setLeft(Math.max(0, Math.ceil(totalMin * (1 - p))));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [minutes, target]);

  return (
    <>
      <span className="ds-reading" aria-hidden="true">
        {left === null ? '' : `${left} min left`}
      </span>
      <div className="ds-progress" aria-hidden="true">
        <span ref={bar} />
      </div>
    </>
  );
}

export function Toc({
  items: given,
  jumpTo,
  root = 'article',
}: {
  /** sections; read from the page's h2[id] inside `root` when omitted */
  items?: { id: string; title: string }[];
  /** id of the key-number figure, for "↑ Jump to the number" */
  jumpTo?: string;
  root?: string;
}) {
  const [items, setItems] = useState(given ?? []);
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    if (given) return;
    const found = Array.from(
      document.querySelectorAll<HTMLElement>(`${root} h2[id]`)
    ).map(h => ({ id: h.id, title: h.textContent?.trim() ?? '' }));
    setItems(found);
    setActive(found[0]?.id);
  }, [given, root]);

  useEffect(() => {
    if (!items.length || !('IntersectionObserver' in window)) return;
    const els = items
      .map(i => document.getElementById(i.id))
      .filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-80px 0px -65% 0px' }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  if (!items.length) return <nav className="ds-toc" aria-hidden="true" />;
  return (
    <nav className="ds-toc" aria-label="On this page">
      <span className="ds-eyebrow" data-size="sm" style={{ marginBottom: 8 }}>
        On this page
      </span>
      {items.map(i => (
        <a
          key={i.id}
          href={`#${i.id}`}
          aria-current={active === i.id ? 'true' : undefined}
        >
          {i.title}
        </a>
      ))}
      {jumpTo && (
        <a className="ds-toc-jump" href={`#${jumpTo}`}>
          Jump to the number
        </a>
      )}
    </nav>
  );
}
