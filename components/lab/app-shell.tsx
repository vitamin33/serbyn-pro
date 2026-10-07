'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Navbar } from '@/components/navbar';
import { FooterLegal } from '@/components/footer-legal';
import { BookingButton } from '@/components/site/cta';

const NAV = [
  { name: 'AUDIT', href: '/audit' },
  { name: 'COST_TEARDOWN', href: '/llm-cost-teardown' },
  { name: 'FRACTIONAL', href: '/fractional' },
  { name: 'WRITING', href: '/writing' },
  { name: 'ABOUT', href: '/about' },
] as const;

// Only the resume keeps the simple top-nav layout (it's print-optimized).
// Everything else gets this shell: one quiet header, the page, the footer.
// Visual language: docs/design/diagram-system.md (reference explainer).
function isMinimal(path: string): boolean {
  return path.startsWith('/resume');
}

function Wordmark({ className }: { className?: string }) {
  return (
    <Link
      href={'/' as any}
      className={cn('flex items-center gap-2', className)}
      aria-label="serbyn.io — home"
    >
      <span className="h-2 w-2 rounded-full bg-primary" />
      <span className="font-mono text-sm font-medium tracking-tight">
        <span className="text-foreground">serbyn</span>
        <span className="text-primary">.io</span>
      </span>
    </Link>
  );
}

const navLink =
  'font-mono text-[0.72rem] font-medium uppercase tracking-[0.06em] transition-colors';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/';
  const [open, setOpen] = useState(false);

  if (isMinimal(pathname)) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main id="main" className="flex-1">
          {children}
        </main>
        <FooterLegal />
      </div>
    );
  }

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
        <div className="container flex h-14 items-center justify-between gap-6">
          <div className="flex min-w-0 items-baseline gap-4">
            <Wordmark />
            <p className="hidden truncate font-mono text-[0.68rem] uppercase tracking-[0.06em] text-muted-foreground xl:block">
              VITALII_SERBYN · AGENTIC_SYSTEMS_ARCHITECT
            </p>
          </div>

          <nav
            className="hidden items-center gap-6 lg:flex"
            aria-label="Primary"
          >
            {NAV.map(item => (
              <Link
                key={item.href}
                href={item.href as any}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={cn(
                  navLink,
                  'border-b-2 py-1',
                  isActive(item.href)
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                )}
              >
                {item.name}
              </Link>
            ))}
            <BookingButton
              location="sidebar"
              label="Contact"
              className="rounded-sm px-3 py-1.5"
            />
          </nav>

          <button
            type="button"
            onClick={() => setOpen(o => !o)}
            className="btn btn-ghost px-2 py-1 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            <span className="font-mono text-xs">{open ? 'CLOSE' : 'MENU'}</span>
          </button>
        </div>

        {open && (
          <div
            id="mobile-nav"
            className="border-t border-border bg-card px-4 py-2 lg:hidden"
          >
            <p className="px-3 pb-1 pt-2 font-mono text-[0.68rem] uppercase tracking-[0.06em] text-muted-foreground">
              VITALII_SERBYN · AGENTIC_SYSTEMS_ARCHITECT
            </p>
            {NAV.map(item => (
              <Link
                key={item.href}
                href={item.href as any}
                onClick={() => setOpen(false)}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={cn(
                  navLink,
                  'block rounded-sm px-3 py-2.5',
                  isActive(item.href)
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {item.name}
              </Link>
            ))}
            <BookingButton
              location="mobile_menu"
              label="Contact"
              className="mb-2 mt-1 w-full rounded-sm px-3 py-2"
            />
          </div>
        )}
      </header>

      <main id="main" className="flex-1">
        {children}
      </main>
      <FooterLegal />
    </div>
  );
}
