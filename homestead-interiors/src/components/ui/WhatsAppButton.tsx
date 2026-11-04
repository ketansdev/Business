import { site } from "@/lib/site";
import { WhatsAppIcon } from "./WhatsAppIcon";

/**
 * Floating WhatsApp contact button — fixed bottom-right on every page.
 *
 * - Opens wa.me in a new tab (on phones this hands off to the WhatsApp app).
 * - "WhatsApp Us" label slides in beside the icon on hover (hover-capable
 *   devices only) and on keyboard focus; touch devices just tap the icon.
 * - z-30: above page content, below the header (50), mobile menu (40),
 *   lightbox (90) and page-transition curtain (70).
 */
export function WhatsAppButton() {
  const { url, number } = site.whatsapp;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat with Homestead Interiors on WhatsApp (${number}) — opens in a new tab`}
      className="group fixed z-30 flex items-center rounded-full outline-none bottom-[max(1.5rem,calc(env(safe-area-inset-bottom)+0.75rem))] right-6"
    >
      {/* Tooltip — sits to the left of the icon, never over it */}
      <span
        aria-hidden
        className="pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 translate-x-2 whitespace-nowrap rounded-full bg-paper px-4 py-2.5 text-sm font-semibold text-ink opacity-0 shadow-[0_10px_30px_-12px_rgb(37_42_48/0.35),0_0_0_1px_var(--color-line)] transition-[opacity,transform] duration-300 ease-out-soft group-focus-visible:translate-x-0 group-focus-visible:opacity-100 [@media(hover:hover)]:group-hover:translate-x-0 [@media(hover:hover)]:group-hover:opacity-100"
      >
        WhatsApp Us
      </span>
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_28px_-8px_rgb(37_211_102/0.55),0_4px_12px_-4px_rgb(37_42_48/0.25)] ring-offset-2 ring-offset-paper transition-[transform,box-shadow] duration-300 ease-out-soft group-hover:scale-110 group-hover:shadow-[0_14px_34px_-8px_rgb(37_211_102/0.65),0_6px_16px_-4px_rgb(37_42_48/0.25)] group-focus-visible:scale-110 group-focus-visible:ring-2 group-focus-visible:ring-sage-deep group-active:scale-95 sm:h-[3.75rem] sm:w-[3.75rem]">
        <WhatsAppIcon className="h-7 w-7 sm:h-8 sm:w-8" />
      </span>
    </a>
  );
}
