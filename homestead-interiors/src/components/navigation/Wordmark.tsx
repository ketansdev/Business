import Link from "next/link";
import { cn } from "@/lib/utils";

/** HOMESTEAD INTERIORS wordmark — set in the editorial serif with a sage hairline. */
export function Wordmark({ className, onClick }: { className?: string; onClick?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      aria-label="Homestead Interiors — home"
      className={cn("group inline-flex flex-col leading-none", className)}
    >
      <span className="font-serif text-[1.45rem] font-medium tracking-[0.16em] sm:text-[1.6rem]">HOMESTEAD</span>
      <span className="mt-1.5 flex items-center gap-2">
        <span aria-hidden className="h-[1.5px] w-5 rounded bg-sage transition-all duration-700 ease-out-soft group-hover:w-9" />
        <span className="text-[0.56rem] font-bold tracking-[0.46em]">INTERIORS</span>
      </span>
    </Link>
  );
}
