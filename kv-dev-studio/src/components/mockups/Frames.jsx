/** Lightweight device frames built with CSS: no image weight, crisp at any size. */

export function BrowserFrame({ url = 'yourbusiness.com', className = '', children }) {
  return (
    <div className={`overflow-hidden rounded-2xl bg-white shadow-lift ring-1 ring-black/5 ${className}`}>
      <div className="flex items-center gap-2 bg-[#F7F7F4] px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
        <span className="caption-5 ml-3 flex flex-1 items-center rounded-md bg-white px-2 py-0.5 text-black/40 ring-1 ring-black/5">
          {url}
        </span>
      </div>
      {children}
    </div>
  );
}

export function PhoneFrame({ className = '', children }) {
  return (
    <div className={`rounded-3xl bg-ink p-2 shadow-lift ${className}`}>
      {/* inner radius = 24 − 8 = 16 */}
      <div className="relative overflow-hidden rounded-2xl bg-white">
        <div className="absolute left-1/2 top-2 z-10 h-4 w-12 -translate-x-1/2 rounded-full bg-ink" />
        {children}
      </div>
    </div>
  );
}
