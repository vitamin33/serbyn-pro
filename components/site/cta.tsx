'use client';

import { ArrowUpRight, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { track } from '@/lib/analytics';
import { CONTACT } from '@/lib/facts';

// Shared conversion CTAs. Every click fires a PostHog event (no-ops cleanly when
// analytics isn't configured). `location` identifies which section the click
// came from so funnels are legible. Booking + outbound links are also tagged for
// the outbound-click metric.

const base =
  'inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium transition-colors rounded-lg';
const primary = 'bg-primary text-primary-foreground hover:bg-primary/90';
const secondary =
  'border border-border text-foreground hover:bg-accent hover:text-accent-foreground';

export function BookingButton({
  location,
  label = 'Book a 30-min systems call',
  variant = 'primary',
  className,
}: {
  location: string;
  label?: string;
  variant?: 'primary' | 'secondary';
  className?: string;
}) {
  return (
    <a
      href={CONTACT.booking}
      target="_blank"
      rel="noopener noreferrer"
      data-cta="booking"
      onClick={() =>
        track('cta_click', { cta: 'booking', location, outbound: true })
      }
      className={cn(
        base,
        variant === 'primary' ? primary : secondary,
        className
      )}
    >
      {label}
      <ArrowUpRight className="h-4 w-4" />
    </a>
  );
}

export function EmailButton({
  location,
  variant = 'secondary',
  className,
}: {
  location: string;
  variant?: 'primary' | 'secondary';
  className?: string;
}) {
  return (
    <a
      href={`mailto:${CONTACT.email}`}
      data-cta="email"
      onClick={() => track('cta_click', { cta: 'email', location })}
      className={cn(
        base,
        variant === 'primary' ? primary : secondary,
        className
      )}
    >
      <Mail className="h-4 w-4" />
      {CONTACT.email}
    </a>
  );
}

// Tagged outbound link (GitHub, LinkedIn, Loom, external repos) — fires the
// outbound-click metric so the analytics events requirement is met everywhere.
export function OutboundLink({
  href,
  location,
  children,
  className,
}: {
  href: string;
  location: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() =>
        track('outbound_click', { href, location, outbound: true })
      }
      className={className}
    >
      {children}
    </a>
  );
}
