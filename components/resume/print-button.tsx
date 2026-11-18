'use client';

import { buttonProps } from '@/components/ds';

/** Opens the browser print dialog; the print styles turn the page into a PDF. */
export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      {...buttonProps({ className: 'no-print' })}
    >
      Download PDF
    </button>
  );
}
