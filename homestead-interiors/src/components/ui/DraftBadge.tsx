import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Small marker for unconfirmed / illustrative content shown in preview mode. */
export function DraftBadge({ children = "Draft", className }: { children?: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-champagne/60 bg-champagne-soft px-2.5 py-0.5 text-[0.58rem] font-bold uppercase tracking-[0.18em] text-champagne-deep",
        className,
      )}
    >
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-champagne" />
      {children}
    </span>
  );
}

/** Soft champagne notice panel for preview builds. */
export function PreviewNotice({ children }: { children: ReactNode }) {
  return (
    <p className="flex max-w-3xl items-start gap-3 rounded-2xl border border-champagne/40 bg-champagne-soft/70 px-5 py-4 text-sm leading-relaxed text-ink/80">
      <span aria-hidden className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-champagne" />
      <span>{children}</span>
    </p>
  );
}
