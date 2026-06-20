import { cn } from '@/lib/utils';

export type ChipVariant = 'active' | 'success' | 'warning' | 'neutral';

const VARIANT_STYLES: Record<ChipVariant, string> = {
  active: 'border-transparent bg-primary text-primary-foreground',
  success: 'border-success/50 text-success',
  warning: 'border-warning/50 text-warning',
  neutral: 'border-border text-muted-foreground',
};

export function StatusChip({
  label,
  variant = 'neutral',
  className,
}: {
  label: string;
  variant?: ChipVariant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm border px-2 py-0.5 font-mono text-[11px] leading-tight tracking-wide',
        VARIANT_STYLES[variant],
        className
      )}
    >
      {label}
    </span>
  );
}
