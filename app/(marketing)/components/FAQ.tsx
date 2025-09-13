'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { SitePack } from '@/lib/types.leadgen';

interface FAQProps {
  pack: SitePack;
  icp: string;
}

export default function FAQ({ pack, icp }: FAQProps) {
  const faqItems = pack.blocks.faq || [];
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  if (faqItems.length === 0) {
    return null;
  }

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <section className="py-16 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Get answers to common questions about my MLOps consulting services
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <Card
                key={index}
                className="border border-slate-200 dark:border-slate-700"
              >
                <CardContent className="p-0">
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full p-6 text-left hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <h3 className="font-medium text-slate-900 dark:text-slate-100 pr-4">
                        {item.q}
                      </h3>
                      <svg
                        className={`h-5 w-5 text-slate-500 transition-transform flex-shrink-0 ${
                          openItems.has(index) ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </button>

                  {openItems.has(index) && (
                    <div className="px-6 pb-6 pt-0">
                      <div className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        {item.a}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Additional support contact */}
        <div className="text-center mt-12">
          <p className="text-slate-600 dark:text-slate-400">
            Have another question?
            <a
              href="mailto:serbyn.vitalii@gmail.com"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium ml-1"
            >
              Get in touch →
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
