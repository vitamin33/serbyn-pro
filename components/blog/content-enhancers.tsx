'use client';

import { useEffect } from 'react';
import 'highlight.js/styles/github-dark.css';

/**
 * Progressive enhancement for blog post bodies (rendered server-side as HTML):
 * - syntax-highlights ``` fenced code blocks (highlight.js)
 * - renders ```mermaid fences into SVG diagrams (mermaid)
 *
 * Both libs are dynamically imported so they only ship to the client on posts
 * that actually contain code or a diagram. Renders nothing itself.
 */
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
    if (diagrams.length) {
      import('mermaid')
        .then(({ default: mermaid }) => {
          mermaid.initialize({
            startOnLoad: false,
            securityLevel: 'strict',
            theme: 'base',
            // Match the serbyn.io dark UI (deep blue-black bg, blue accent, Inter).
            themeVariables: {
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: '14px',
              background: 'transparent',
              // nodes — dark fill, subtle blue-tinted border, light text
              mainBkg: '#141821',
              primaryColor: '#141821',
              primaryBorderColor: '#36506f',
              primaryTextColor: '#e5e8f1',
              nodeBorder: '#36506f',
              nodeTextColor: '#e5e8f1',
              // decision / database / alt shapes use the same surface
              secondaryColor: '#141821',
              secondaryBorderColor: '#36506f',
              secondaryTextColor: '#e5e8f1',
              tertiaryColor: '#141821',
              tertiaryBorderColor: '#36506f',
              tertiaryTextColor: '#e5e8f1',
              // edges + their labels
              lineColor: '#5c6678',
              edgeLabelBackground: '#0d1117',
              titleColor: '#e5e8f1',
            },
            flowchart: { curve: 'basis', padding: 14, useMaxWidth: true },
          });
          return mermaid.run({ nodes: diagrams });
        })
        .catch(() => {});
    }
  }, []);

  return null;
}
