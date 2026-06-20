import { cn } from '@/lib/utils';
import { CATEGORY_CODE, type PublicCategory } from '@/lib/taxonomy';

// Renders a "lab notebook" identifier like 01_ARCH_001 from a category + index.
export function SystemIdLabel({
  category,
  index,
  className,
}: {
  category: PublicCategory;
  index: number;
  className?: string;
}) {
  const seq = String(index + 1).padStart(2, '0');
  const num = String(index + 1).padStart(3, '0');
  const id = `${seq}_${CATEGORY_CODE[category]}_${num}`;
  return (
    <span className={cn('label-caps text-muted-foreground', className)}>
      {id}
    </span>
  );
}
