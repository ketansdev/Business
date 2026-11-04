import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  /** Each entry renders as one masked line. Intentional line breaks, editorial-style. */
  lines: ReactNode[];
  as?: ElementType;
  className?: string;
  id?: string;
};

/**
 * Headline split into masked lines for the line-reveal animation.
 * The full text stays in the DOM in reading order, so it remains accessible.
 */
export function Lines({ lines, as: Tag = "h2", className, id }: Props) {
  return (
    <Tag className={className} id={id} data-lines>
      {lines.map((line, i) => (
        <span key={i} className="line-mask">
          <span className="line-inner">{line}</span>
        </span>
      ))}
    </Tag>
  );
}

export function Eyebrow({ children, className, light }: { children: ReactNode; className?: string; light?: boolean }) {
  return (
    <p className={cn("eyebrow flex items-center gap-3", light ? "text-paper/70" : "text-sage-deep", className)}>
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-sage" />
      <span aria-hidden className="h-px w-8 bg-sage/60" />
      {children}
    </p>
  );
}
