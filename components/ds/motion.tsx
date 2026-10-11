'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

// Motion plumbing shared by every animated component. The CSS in styles/ds.css
// does the animating; this file only decides *when*:
// - useReveal marks an element data-seen the first time enough of it is on
//   screen, then stops observing (animate once).
// - useReplay gives a counter to use as a React key: re-mounting the subtree
//   restarts its CSS animations, which is all a replay button needs.
// Without IntersectionObserver the element is marked seen at once, which is
// the settled state.

export function useReveal<T extends HTMLElement>(threshold = 0.35) {
  const ref = useRef<T | null>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    if (!('IntersectionObserver' in window)) {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      entries => {
        if (entries.some(e => e.isIntersecting)) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [seen, threshold]);

  // Spread onto the element: data-reveal enables the pre-state (only under
  // html.js), data-seen starts the sequence.
  const revealProps = {
    'data-reveal': '',
    ...(seen ? { 'data-seen': '' } : {}),
  } as const;

  return { ref, seen, revealProps };
}

export function useReplay() {
  const [run, setRun] = useState(0);
  const replay = useCallback(() => setRun(r => r + 1), []);
  return { run, replay };
}

export function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  );
}

/** Generic wrapper for server-rendered children that animate on first view
    (mini exhibits, ranked bars). */
export function Reveal({
  as: Tag = 'div',
  threshold,
  className,
  children,
  ...rest
}: {
  as?: 'div' | 'section' | 'figure' | 'span';
  threshold?: number;
  className?: string;
  children: React.ReactNode;
} & Record<`data-${string}`, string | undefined>) {
  const { ref, revealProps } = useReveal<HTMLElement>(threshold);
  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={className}
      {...revealProps}
      {...rest}
    >
      {children}
    </Tag>
  );
}
