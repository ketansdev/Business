import { BrowserFrame, PhoneFrame } from './Frames';

/*
  Illustrated project previews for concept portfolio pieces.
  Drawn on a 720px artboard (scaled to fit by ScaledPreview) so every size stays on the Tailwind scale.
  Fictional brand names are used so nothing is mistaken for real client work.
*/

const Bar = ({ className = '' }) => <div className={`h-2 rounded-full ${className}`} />;

/* ---------- Business website ---------- */
export function BusinessPreview() {
  return (
    <div className="flex h-full w-full items-start justify-center bg-[#E9EEF5] px-16 pt-20">
      <BrowserFrame url="northline-consulting.com" className="w-full max-w-[900px]">
        <div className="bg-[#0F1E36] px-10 pb-12 pt-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-md bg-[#5B8CFF]" />
              <span className="body-4">Northline</span>
            </div>
            <div className="caption-5 flex gap-6 text-white/60">
              <span>Services</span><span>Approach</span><span>About</span>
            </div>
            <div className="button-xsm rounded-md bg-white px-3 py-2 text-[#0F1E36]">Book a call</div>
          </div>
          <div className="mt-12 grid grid-cols-[1.3fr_1fr] gap-8">
            <div>
              <div className="caption-4 inline-block rounded-md bg-white/10 px-2 py-1 text-white/70">Business advisory</div>
              <p className="heading-2 mt-4">Clear strategy for growing companies.</p>
              <Bar className="mt-6 w-5/6 bg-white/20" />
              <Bar className="mt-3 w-2/3 bg-white/20" />
              <div className="mt-8 flex gap-3">
                <div className="button-sm rounded-lg bg-[#5B8CFF] px-3 py-2">Get started</div>
                <div className="button-sm rounded-lg px-3 py-2 ring-1 ring-white/25">Our services</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 h-32 rounded-xl bg-[#5B8CFF]" />
              <div className="h-24 rounded-xl bg-white/10 p-4"><Bar className="w-3/5 bg-white/40" /><Bar className="mt-2 w-4/5 bg-white/15" /></div>
              <div className="h-24 rounded-xl bg-white/10 p-4"><Bar className="w-1/2 bg-white/40" /><Bar className="mt-2 w-3/4 bg-white/15" /></div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 bg-white p-6">
          {['Strategy', 'Operations', 'Finance'].map((t) => (
            <div key={t} className="rounded-xl bg-[#F3F5F9] p-4">
              <div className="h-6 w-6 rounded-md bg-[#0F1E36]" />
              <p className="body-5 mt-3 text-[#0F1E36]">{t}</p>
              <Bar className="mt-2 w-11/12 bg-black/10" />
            </div>
          ))}
        </div>
      </BrowserFrame>
    </div>
  );
}

/* ---------- Interior design website ---------- */
export function InteriorPreview() {
  return (
    <div className="flex h-full w-full items-start justify-center bg-[#EFE7DC] px-16 pt-20">
      <BrowserFrame url="atelier-maison.studio" className="w-full">
        <div className="bg-[#F8F3EC] px-8 pb-8 pt-6">
          <div className="flex items-center justify-between text-[#3B2F25]">
            <span className="title-2">Atelier Maison</span>
            <span className="caption-4 tracking-widest">MENU</span>
          </div>
          <div className="mt-6 grid grid-cols-[1fr_1.1fr] items-end gap-6">
            <p className="heading-3 font-normal text-[#3B2F25]">Spaces that feel like home.</p>
            <div className="relative h-56 overflow-hidden rounded-t-full bg-[#D9C6AE]">
              <div className="absolute inset-x-8 top-8 h-24 rounded-t-full bg-[#F4EBDD]" />
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-[#C4AB8C]" />
              <div className="absolute bottom-10 left-4 right-10 h-12 rounded-t-xl bg-[#8C6B4F]" />
              <div className="absolute bottom-20 left-8 h-8 w-12 rounded-md bg-[#A9876A]" />
              <div className="absolute bottom-20 left-24 h-8 w-12 rounded-md bg-[#A9876A]" />
              <div className="absolute bottom-10 right-4 h-20 w-1 bg-[#3B2F25]" />
              <div className="absolute bottom-[116px] right-0 h-6 w-8 rounded-t-full bg-[#3B2F25]" />
              <div className="absolute bottom-10 left-[46%] h-14 w-8 rounded-t-full bg-[#5E7A55]" />
            </div>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-3">
            {['#CDB79E', '#B9A285', '#E2D5C3'].map((c) => (
              <div key={c} className="h-16 rounded-lg" style={{ background: c }} />
            ))}
          </div>
        </div>
      </BrowserFrame>
    </div>
  );
}

/* ---------- Food & beverage brand website ---------- */
export function FoodPreview() {
  return (
    <div className="flex h-full w-full items-start justify-center bg-[#FFE3C7] px-16 pt-20">
      <BrowserFrame url="bowlandco.in" className="w-full">
        <div className="bg-[#FFF6EA] px-8 pb-8 pt-6">
          <div className="flex items-center justify-between">
            <span className="heading-6 font-bold text-[#D9411E]">bowl&amp;co.</span>
            <span className="button-xsm rounded-md bg-[#1E3B2F] px-3 py-2 text-white">Order now</span>
          </div>
          <div className="mt-6 grid grid-cols-2 items-center gap-6">
            <div>
              <p className="heading-2 font-bold uppercase leading-none text-[#1E3B2F]">
                Fresh.<br />Bold.<br /><span className="text-[#D9411E]">Local.</span>
              </p>
              <Bar className="mt-6 w-11/12 bg-[#1E3B2F]/15" />
              <Bar className="mt-2 w-2/3 bg-[#1E3B2F]/15" />
            </div>
            <div className="relative mx-auto aspect-square w-full max-w-[220px]">
              <div className="absolute inset-0 rounded-full bg-[#FFD08A]" />
              <div className="absolute inset-[12%] rounded-full bg-white" />
              <div className="absolute left-[26%] top-[24%] h-[24%] w-[24%] rounded-full bg-[#7CB342]" />
              <div className="absolute right-[24%] top-[28%] h-[20%] w-[20%] rounded-full bg-[#D9411E]" />
              <div className="absolute bottom-[24%] left-[34%] h-[22%] w-[30%] rounded-full bg-[#F4B400]" />
              <div className="absolute bottom-[30%] right-[22%] h-[12%] w-[12%] rounded-full bg-[#1E3B2F]" />
            </div>
          </div>
          <div className="mt-6 flex gap-2">
            {['Bowls', 'Juices', 'Salads'].map((t) => (
              <span key={t} className="caption-3 rounded-md bg-white px-3 py-1 text-[#1E3B2F] ring-1 ring-[#1E3B2F]/10">{t}</span>
            ))}
          </div>
        </div>
      </BrowserFrame>
    </div>
  );
}

/* ---------- Branding & logo design ---------- */
export function BrandPreview() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-night px-12 pb-12 pt-20">
      <div className="grid w-full max-w-[560px] grid-cols-[1.15fr_1fr] gap-4">
        <div className="aspect-square rounded-3xl bg-[#F5F1E8] p-6">
          <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
            <circle cx="50" cy="50" r="34" fill="none" stroke="#181818" strokeOpacity=".15" strokeDasharray="2 3" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="#181818" strokeOpacity=".12" />
            <line x1="50" y1="0" x2="50" y2="100" stroke="#181818" strokeOpacity=".12" />
            <path d="M30 70V30h10l20 26V30h10v40H60L40 44v26z" fill="#2F5D50" />
            <circle cx="70" cy="30" r="6" fill="#E7A33E" />
          </svg>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-1 items-center justify-center rounded-3xl bg-[#2F5D50]">
            <span className="heading-1 font-medium text-[#F5F1E8]">Aa</span>
          </div>
          <div className="grid h-16 grid-cols-4 overflow-hidden rounded-3xl">
            <div className="bg-[#2F5D50]" /><div className="bg-[#E7A33E]" /><div className="bg-[#F5F1E8]" /><div className="bg-[#8FB5A4]" />
          </div>
        </div>
        <div className="col-span-2 flex items-center justify-between rounded-3xl bg-[#F5F1E8] px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="body-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#2F5D50] text-[#F5F1E8]">N</span>
            <div>
              <p className="body-4 text-night">Nava Organics</p>
              <p className="caption-5 text-night/50">Identity system</p>
            </div>
          </div>
          <div className="flex gap-1">
            <span className="h-2 w-8 rounded-full bg-[#2F5D50]" />
            <span className="h-2 w-4 rounded-full bg-[#E7A33E]" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Social media creatives ---------- */
export function SocialPreview() {
  return (
    <div className="flex h-full w-full items-center justify-center gap-6 bg-[#E8E3F6] px-12 pt-12">
      <PhoneFrame className="w-56 shrink-0">
        <div className="px-3 pb-4 pt-8">
          <div className="flex items-center gap-2">
            <span className="h-6 w-6 rounded-full bg-[#5C3BD6] ring-2 ring-[#DD2A7B]" />
            <span className="caption-4 text-black/80">lumen.fitness</span>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-1">
            {[
              'bg-[#5C3BD6]', 'bg-[#FFCF4A]', 'bg-night',
              'bg-[#FF7A59]', 'bg-[#5C3BD6]', 'bg-[#D7CEF7]',
              'bg-night', 'bg-[#D7CEF7]', 'bg-[#FFCF4A]',
            ].map((c, i) => (
              <div key={i} className={`relative aspect-square ${c}`}>
                {i % 4 === 0 && <span className="absolute inset-[30%] rounded-full bg-white/80" />}
                {i % 4 === 2 && <span className="absolute bottom-[20%] left-[15%] h-0.5 w-[60%] bg-white/80" />}
              </div>
            ))}
          </div>
        </div>
      </PhoneFrame>
      <div className="flex w-60 flex-col gap-4">
        <div className="aspect-square rounded-3xl bg-[#5C3BD6] p-6 text-white shadow-lift">
          <p className="caption-3 uppercase tracking-widest text-white/60">New class</p>
          <p className="heading-4 mt-2 font-bold leading-none">Morning Mobility</p>
          <div className="caption-3 mt-4 inline-block rounded-md bg-[#FFCF4A] px-2 py-1 text-night">Mon · Wed · Fri</div>
        </div>
        <div className="rounded-3xl bg-[#FFCF4A] p-6 shadow-lift">
          <p className="heading-5 font-bold text-night">&ldquo;Small steps, every day.&rdquo;</p>
          <Bar className="mt-3 w-2/5 bg-night/30" />
        </div>
      </div>
    </div>
  );
}

export const previews = {
  business: BusinessPreview,
  interior: InteriorPreview,
  food: FoodPreview,
  brand: BrandPreview,
  social: SocialPreview,
};
