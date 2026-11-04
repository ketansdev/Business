import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "solid" | "outline" | "light" | "outline-light" | "text";

/**
 * Pill buttons. On hover a sage fill rises from the bottom, the button lifts
 * slightly and the arrow nudges out — one consistent micro-interaction site-wide.
 */
const base =
  "group relative isolate inline-flex items-center justify-center gap-3 overflow-hidden rounded-full eyebrow !tracking-[0.18em] transition-[color,border-color,box-shadow,transform] duration-500 ease-out-soft focus-visible:outline-offset-4 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]";

const variants: Record<Variant, string> = {
  solid: "bg-ink text-paper px-8 py-[1.1rem] hover:text-ink hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]",
  outline:
    "border border-ink/20 bg-paper/60 text-ink px-8 py-[1.05rem] backdrop-blur-sm hover:border-sage hover:text-ink hover:-translate-y-0.5",
  light: "bg-paper text-ink px-8 py-[1.1rem] shadow-[var(--shadow-soft)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]",
  "outline-light": "border border-paper/40 text-paper px-8 py-[1.05rem] hover:text-ink hover:border-paper",
  text: "!rounded-none text-ink pb-1",
};

const fills: Record<Variant, string> = {
  solid: "bg-sage",
  outline: "bg-sage-soft",
  light: "bg-sage",
  "outline-light": "bg-paper",
  text: "",
};

function Inner({ children, variant, arrow }: { children: ReactNode; variant: Variant; arrow?: boolean }) {
  return (
    <>
      {variant !== "text" && (
        <span
          aria-hidden
          className={cn(
            "absolute inset-0 -z-10 origin-bottom scale-y-0 rounded-full transition-transform duration-700 ease-out-soft group-hover:scale-y-100 group-focus-visible:scale-y-100",
            fills[variant],
          )}
        />
      )}
      <span className="relative">{children}</span>
      {arrow && (
        <span
          aria-hidden
          className={cn(
            "relative -mr-2 flex h-7 w-7 items-center justify-center rounded-full transition-[transform,background-color] duration-500 ease-out-soft group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
            variant === "solid" && "bg-paper/10 group-hover:bg-ink/10",
            variant === "outline" && "bg-ink/5",
            variant === "light" && "bg-ink/5",
            variant === "outline-light" && "bg-paper/10",
            variant === "text" && "-mr-0 h-auto w-auto",
          )}
        >
          <ArrowUpRight strokeWidth={1.5} className="h-4 w-4" />
        </span>
      )}
      {variant === "text" && (
        <span
          aria-hidden
          className="absolute bottom-0 left-0 h-[1.5px] w-full origin-left rounded bg-sage transition-transform duration-700 ease-out-soft group-hover:scale-x-[0.35]"
        />
      )}
    </>
  );
}

type LinkButtonProps = { href: string; variant?: Variant; arrow?: boolean; className?: string; children: ReactNode } & Omit<
  ComponentProps<typeof Link>,
  "href" | "className" | "children"
>;

export function ButtonLink({ href, variant = "solid", arrow = true, className, children, ...rest }: LinkButtonProps) {
  return (
    <Link href={href} className={cn(base, variants[variant], className)} {...rest}>
      <Inner variant={variant} arrow={arrow}>
        {children}
      </Inner>
    </Link>
  );
}

type ButtonProps = { variant?: Variant; arrow?: boolean } & ComponentProps<"button">;

export function Button({ variant = "solid", arrow = false, className, children, ...rest }: ButtonProps) {
  return (
    <button className={cn(base, variants[variant], className)} {...rest}>
      <Inner variant={variant} arrow={arrow}>
        {children}
      </Inner>
    </button>
  );
}
