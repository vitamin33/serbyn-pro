'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Navbar } from '@/components/navbar';
import { FooterLegal } from '@/components/footer-legal';

const NAV = [
  { name: 'WORK', href: '/work' },
  { name: 'BLOG', href: '/blog' },
  { name: 'ABOUT', href: '/about' },
  { name: 'RESUME', href: '/resume' },
] as const;

const CONTACT = 'https://calendly.com/serbyn-vitalii/30min';

// Routes that keep the simple top-nav layout (resume is print-optimized; legal
// is plain). Everything else gets the persistent lab sidebar shell.
function isMinimal(path: string): boolean {
  return path.startsWith('/resume') || path.startsWith('/legal');
}

function Wordmark({ className }: { className?: string }) {
  return (
    <Link
      href={'/' as any}
      className={cn('flex items-center gap-2', className)}
      aria-label="serbyn.io — home"
    >
      <span className="h-2 w-2 rounded-full bg-success" />
      <span className="font-mono text-sm font-semibold tracking-tight">
        <span className="text-foreground">serbyn</span>
        <span className="text-primary">.pro</span>
      </span>
    </Link>
  );
}

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
    <div className="lg:pl-64">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border bg-card lg:flex">
        <Wordmark className="border-b border-border px-5 py-[18px]" />
        <nav className="flex-1 space-y-1 px-3 py-6" aria-label="Primary">
          {NAV.map(item => (
            <Link
              key={item.href}
              href={item.href as any}
              className={cn(
                'block rounded-md px-3 py-2 font-mono text-xs tracking-wide transition-colors',
                isActive(item.href)
                  ? 'bg-secondary text-foreground'
                  : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="space-y-3 border-t border-border px-4 py-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-success" />
            <span className="label-caps text-muted-foreground">
              SYSTEM STATUS: ONLINE
            </span>
          </div>
          <a
            href={CONTACT}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-md bg-primary px-3 py-2 text-center text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            CONTACT
          </a>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-background/80 px-4 py-3 backdrop-blur lg:hidden">
        <Wordmark />
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          className="btn btn-ghost p-2"
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          <span className="font-mono text-xs">{open ? 'CLOSE' : 'MENU'}</span>
        </button>
      </div>
      {open && (
        <div className="border-b border-border bg-card px-4 py-2 lg:hidden">
          {NAV.map(item => (
            <Link
              key={item.href}
              href={item.href as any}
              onClick={() => setOpen(false)}
              className="block rounded-md px-3 py-2 font-mono text-sm text-muted-foreground hover:text-foreground"
            >
              {item.name}
            </Link>
          ))}
          <a
            href={CONTACT}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 block rounded-md bg-primary px-3 py-2 text-center text-sm font-medium text-primary-foreground"
          >
            CONTACT
          </a>
        </div>
      )}

      <main id="main">{children}</main>
      <FooterLegal />
    </div>
  );
}
