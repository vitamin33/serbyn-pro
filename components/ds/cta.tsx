'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { track } from '@/lib/analytics';
import { appendUtmParams } from '@/lib/booking';
import { CONTACT } from '@/lib/facts';
import { Arrow, buttonProps, type ButtonVariant } from './primitives';

// Conversion CTAs in the design-system skin. Same contract as
// components/site/cta.tsx: data-cta + data-location on the element, a PostHog
// event on click, UTM cookies appended to the booking URL after hydration.

export function BookingCta({
  location,
  label = 'Book a 30-min systems call',
  variant = 'primary',
  size,
  arrow = true,
  className,
}: {
  location: string;
  label?: ReactNode;
  variant?: ButtonVariant;
  size?: 'sm';
  arrow?: boolean;
  className?: string;
}) {
  const [href, setHref] = useState<string>(CONTACT.booking);
  useEffect(() => setHref(appendUtmParams(CONTACT.booking)), []);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-cta="booking"
      data-location={location}
      onClick={() =>
        track('cta_click', { cta: 'booking', location, outbound: true })
      }
      {...buttonProps({ variant, size, className })}
    >
      {label}
      {arrow && <Arrow />}
    </a>
  );
}

export function EmailCta({
  location,
  variant = 'secondary',
  className,
}: {
  location: string;
  variant?: ButtonVariant;
  className?: string;
}) {
  return (
    <a
      href={`mailto:${CONTACT.email}`}
      data-cta="email"
      data-location={location}
      onClick={() => track('cta_click', { cta: 'email', location })}
      {...buttonProps({ variant, className })}
    >
      {CONTACT.email}
    </a>
  );
}

/** Tagged outbound link (GitHub, LinkedIn, product sites) in any skin. */
export function OutboundCta({
  href,
  location,
  children,
  className,
}: {
  href: string;
  location: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-cta="outbound"
      data-location={location}
      onClick={() =>
        track('outbound_click', { href, location, outbound: true })
      }
      className={className}
    >
      {children}
    </a>
  );
}
