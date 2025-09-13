'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { trackClientEvent } from '../actions';
import type { Offer } from '@/lib/types.leadgen';

interface StickyCTAProps {
  icp: string;
  offers: Offer[];
  variant?: string;
}

export default function StickyCTA({
  icp,
  offers,
  variant = 'default',
}: StickyCTAProps) {
  const [isVisible, setIsVisible] = useState(false);
  const primaryOffer = offers[0]; // Use first offer

  useEffect(() => {
    const handleScroll = () => {
      // Show CTA after scrolling 100vh
      const scrolled = window.scrollY > window.innerHeight;
      setIsVisible(scrolled);
    };

    // Initial check
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!primaryOffer || !isVisible) {
    return null;
  }

  const handleClick = async () => {
    try {
      await trackClientEvent({
        event: 'cta_click',
        icp,
        variant,
        context: {
          route: window.location.pathname,
          slug: `sticky_cta_${variant}`,
          offer_code: primaryOffer.code,
          user_agent: navigator.userAgent,
        },
      });
    } catch (error) {
      console.error('Failed to track sticky CTA click:', error);
    }

    // Navigate to offers section
    const offersSection = document.getElementById('offers');
    if (offersSection) {
      offersSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const formatPrice = (priceCents: number, currency: string) => {
    const price = priceCents / 100;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 shadow-lg transform transition-transform duration-300 md:hidden ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
              {primaryOffer.name}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Starting at{' '}
              {formatPrice(primaryOffer.price_cents, primaryOffer.currency)}
            </p>
          </div>

          <Button
            onClick={handleClick}
            size="sm"
            className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 px-6"
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
}
