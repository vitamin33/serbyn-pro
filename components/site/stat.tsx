import { cn } from '@/lib/utils';
import type { Claim } from '@/lib/facts';

// A single quantified claim rendered as PLAIN server text (no animation, correct
// with JS disabled) that ALWAYS carries its source-label inline. The
// `data-claim` / `data-claim-label` hooks make the "every claim is labeled"
// invariant testable (Playwright T5). Use this for every published number.
export function Stat({
  claim,
  className,
  labelClassName,
}: {
  claim: Claim;
  className?: string;
  labelClassName?: string;
}) {
  return (
    <div data-claim className={cn('flex flex-col', className)}>
      <span className="metric-lg text-foreground">{claim.value}</span>
      <span className="mt-1 body-md text-muted-foreground">
        {claim.caption}
      </span>
      <span
        data-claim-label
        className={cn(
          'mt-2 font-mono text-[11px] leading-tight text-muted-foreground/70',
          labelClassName
        )}
      >
        {claim.label}
      </span>
    </div>
  );
}
