import { motion } from 'framer-motion';
import { MapPin, NavigationArrow, Phone, Globe, Heart, ChatCircle, PaperPlaneTilt } from '@phosphor-icons/react';
import { BrowserFrame, PhoneFrame } from '../mockups/Frames';
import ScaledPreview from '../mockups/ScaledPreview';
import { ease } from '../ui/Reveal';

const enter = (delay, from = { y: 32 }) => ({
  initial: { opacity: 0, ...from },
  animate: { opacity: 1, x: 0, y: 0, scale: 1 },
  transition: { duration: 0.8, ease, delay },
});

const Bar = ({ className }) => <div className={`h-2 rounded-full ${className}`} />;

/**
 * Decorative hero composition: website, local SEO, social and brand previews.
 * Drawn on a fixed 600px artboard and scaled to fit, so type stays on the Tailwind scale.
 */
export default function HeroVisual() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-xl select-none" aria-hidden="true">
      <ScaledPreview baseWidth={600}>
        <div className="relative h-full w-full">
          {/* Flat abstract shapes */}
          <motion.div {...enter(0.1, { scale: 0.9 })} className="absolute left-20 top-16 h-96 w-96 rounded-full bg-accent-soft" />
          <motion.div {...enter(0.5, { scale: 0.6 })} className="absolute right-6 top-64 h-10 w-10 rounded-lg bg-ink" />
          <motion.div {...enter(0.6, { scale: 0.6 })} className="absolute bottom-6 left-64 h-8 w-8 rounded-full border-4 border-accent" />

          {/* Website */}
          <motion.div {...enter(0.2)} className="absolute left-20 top-24 w-[450px]">
            <BrowserFrame url="yourbrand.com">
              <div className="bg-white p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded bg-ink" />
                    <Bar className="w-16 bg-ink/80" />
                  </div>
                  <div className="flex gap-3">
                    <Bar className="w-8 bg-ink/15" />
                    <Bar className="w-8 bg-ink/15" />
                    <Bar className="w-8 bg-ink/15" />
                  </div>
                  <div className="h-6 w-16 rounded-md bg-accent" />
                </div>
                <div className="mt-8 grid grid-cols-2 items-center gap-6">
                  <div>
                    <p className="heading-5 text-ink">Grow your business online.</p>
                    <Bar className="mt-3 w-full bg-ink/10" />
                    <Bar className="mt-2 w-3/4 bg-ink/10" />
                    <div className="mt-4 flex gap-2">
                      <div className="h-6 w-16 rounded-md bg-ink" />
                      <div className="h-6 w-12 rounded-md ring-1 ring-ink/15" />
                    </div>
                  </div>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-paper-sunken">
                    <div className="absolute -bottom-8 -right-6 h-32 w-32 rounded-full bg-accent" />
                    <div className="absolute left-6 top-6 h-16 w-16 rounded-lg bg-ink" />
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-3 gap-3">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="rounded-lg bg-paper-sunken p-3">
                      <div className={`h-4 w-4 rounded ${i === 1 ? 'bg-accent' : 'bg-ink/80'}`} />
                      <Bar className="mt-2 w-4/5 bg-ink/15" />
                    </div>
                  ))}
                </div>
              </div>
            </BrowserFrame>
          </motion.div>

          {/* Google Business Profile */}
          <motion.div {...enter(0.45, { x: 24 })} className="absolute right-0 top-4 w-64 rounded-2xl bg-white p-4 shadow-lift ring-1 ring-black/5">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
                <MapPin size={20} weight="fill" />
              </span>
              <div>
                <p className="title-4 text-ink">Your Business</p>
                <p className="caption-5 text-ink-muted">
                  <span className="font-semibold text-[#1E8E3E]">Open now</span> · Local services
                </p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[NavigationArrow, Phone, Globe].map((Icon, i) => (
                <div key={i} className="flex flex-col items-center gap-1 rounded-lg bg-paper-sunken py-2">
                  <Icon size={16} className="text-[#1A73E8]" />
                  <span className="h-1 w-6 rounded-full bg-ink/15" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Social post */}
          <motion.div {...enter(0.6)} className="absolute bottom-0 left-0 w-44">
            <PhoneFrame>
              <div className="px-3 pb-4 pt-8">
                <div className="flex items-center gap-2">
                  <span className="h-6 w-6 rounded-full bg-accent ring-2 ring-accent-soft" />
                  <Bar className="w-16 bg-ink/70" />
                </div>
                <div className="relative mt-2 aspect-square overflow-hidden rounded-lg bg-ink">
                  <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-accent" />
                  <p className="heading-6 absolute bottom-3 left-3 leading-tight text-white">
                    New
                    <br />
                    Launch
                  </p>
                </div>
                <div className="mt-2 flex gap-2 text-ink">
                  <Heart size={16} weight="fill" className="text-accent" />
                  <ChatCircle size={16} />
                  <PaperPlaneTilt size={16} />
                </div>
                <Bar className="mt-2 w-4/5 bg-ink/15" />
              </div>
            </PhoneFrame>
          </motion.div>

          {/* Brand kit */}
          <motion.div {...enter(0.75, { x: 24 })} className="absolute bottom-12 right-2 w-64 rounded-2xl bg-ink p-4 text-paper shadow-lift">
            <div className="flex items-center justify-between">
              <span className="caption-3 uppercase tracking-widest text-paper/50">Brand kit</span>
              <span className="heading-5">Aa</span>
            </div>
            <div className="mt-4 grid h-8 grid-cols-4 gap-1">
              <span className="rounded-md bg-accent" />
              <span className="rounded-md bg-paper" />
              <span className="rounded-md bg-night-3" />
              <span className="rounded-md bg-[#E9D8C4]" />
            </div>
          </motion.div>
        </div>
      </ScaledPreview>
    </div>
  );
}
