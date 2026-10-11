'use client';

import { useEffect } from 'react';

/**
 * Progressive enhancement for blog post bodies (rendered server-side as HTML):
 * - syntax-highlights ``` fenced code blocks (highlight.js)
 * - renders ```mermaid fences into SVG diagrams (mermaid), the themed fallback
 *   of the diagram system (docs/design/diagram-system.md)
 *
 * Both libs are dynamically imported so they only ship to the client on posts
 * that actually contain code or a diagram. Renders nothing itself.
 */

// Mermaid derives shades from literal colors in JS, so it cannot read CSS
// variables itself. Read the live tokens (styles/theme.css) at render time and
// render again when the color scheme flips.
function tokenTheme() {
  const cs = getComputedStyle(document.documentElement);
  const v = (name: string) => cs.getPropertyValue(name).trim();
  const surface = v('--surface');
  const fg = v('--fg');
  const muted = v('--muted');
  const accent = v('--accent');
  const soft = v('--accent-soft');
  return {
    fontFamily: getComputedStyle(document.body).fontFamily,
    fontSize: '14px',
    background: 'transparent',
    mainBkg: surface,
    primaryColor: surface,
    primaryBorderColor: fg,
    primaryTextColor: fg,
    nodeBorder: fg,
    nodeTextColor: fg,
    secondaryColor: soft,
    secondaryBorderColor: accent,
    secondaryTextColor: fg,
    tertiaryColor: v('--bg'),
    tertiaryBorderColor: muted,
    tertiaryTextColor: fg,
    clusterBkg: v('--bg'),
    clusterBorder: muted,
    lineColor: fg,
    edgeLabelBackground: surface,
    titleColor: fg,
    textColor: fg,
  };
}

export function ContentEnhancers() {
  useEffect(() => {
    const root = document.querySelector('.blog-content');
    if (!root) return;

    const codeBlocks = root.querySelectorAll<HTMLElement>(
      'pre code[class^="language-"]'
    );
    if (codeBlocks.length) {
      import('highlight.js')
        .then(({ default: hljs }) =>
          codeBlocks.forEach(el => hljs.highlightElement(el))
        )
        .catch(() => {});
    }

    const diagrams = Array.from(
      root.querySelectorAll<HTMLElement>('pre.mermaid')
    );
    if (!diagrams.length) return;

    // keep the source so a theme change can render again
    diagrams.forEach(pre => {
      if (!pre.dataset.src) pre.dataset.src = pre.textContent ?? '';
    });

    const render = () =>
      import('mermaid')
        .then(({ default: mermaid }) => {
          diagrams.forEach(pre => {
            pre.removeAttribute('data-processed');
            pre.textContent = pre.dataset.src ?? '';
          });
          mermaid.initialize({
            startOnLoad: false,
            securityLevel: 'strict',
            theme: 'base',
            themeVariables: tokenTheme(),
            flowchart: { curve: 'linear', padding: 14, useMaxWidth: true },
          });
          return mermaid.run({ nodes: diagrams });
        })
        .then(() => {
          // accessibility / image SEO: the rendered SVG is meaningful content
          diagrams.forEach(pre => {
            const svg = pre.querySelector('svg');
            if (svg && !svg.getAttribute('aria-label')) {
              svg.setAttribute('role', 'img');
              svg.setAttribute('aria-label', 'Architecture diagram');
            }
          });
        })
        .catch(() => {});

    void render();
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => void render();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return null;
}
