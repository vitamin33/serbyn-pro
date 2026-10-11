'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import type { PaletteItem } from './nav';
import { SiteHeader } from './shell';

// The page frame: header, main, footer. Posts get the compact reading header
// (progress rule, minutes left); offer pages get the compact footer, as on the
// /audit board. The footers are server components passed in from the layout.

const OFFER_PATHS = ['/audit', '/llm-cost-teardown', '/fractional'];

export function SiteShell({
  children,
  footer,
  compactFooter,
  palette,
}: {
  children: ReactNode;
  footer: ReactNode;
  compactFooter: ReactNode;
  palette: PaletteItem[];
}) {
  const path = usePathname() || '/';
  const isPost = /^\/blog\/[^/]+$/.test(path);
  const isOffer = OFFER_PATHS.includes(path);

  return (
    <div className="flex min-h-screen flex-col">
      {isPost ? (
        <SiteHeader reading={{}} />
      ) : (
        <SiteHeader path={path} palette={palette} />
      )}
      <main id="main" className="flex-1">
        {children}
      </main>
      {isOffer ? compactFooter : footer}
    </div>
  );
}
