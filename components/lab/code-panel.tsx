import { cn } from '@/lib/utils';
import type { CodeBlock } from '@/lib/extract-code';

// Sticky right-rail code viewer for the article layout (Kinetic Lab).
export function CodePanel({
  block,
  className,
}: {
  block: CodeBlock;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-lg border border-border bg-[hsl(220_23%_4%)]',
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <span className="label-caps text-muted-foreground">
          CODE_IMPLEMENTATION
        </span>
        <span className="font-mono text-[11px] text-primary">{block.lang}</span>
      </div>
      <pre className="overflow-x-auto p-4 text-xs leading-relaxed">
        <code className="font-mono text-foreground/90">{block.code}</code>
      </pre>
    </div>
  );
}
