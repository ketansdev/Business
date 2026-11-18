import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import { ArrowUpRight, X } from 'lucide-react'
import { SectionHeader } from './ui/SectionHeader'
import { Button } from './ui/Button'
import TajCover from './portfolio/TajCover'
import { PROJECTS, type Project } from '../lib/site'
import { EASE_OUT } from '../lib/motion'
import { useLockBody } from '../hooks/useLockBody'
import { isFinePointer } from '../lib/env'
import { cn } from '../lib/cn'

const LAYOUT = [
  { span: 'lg:col-span-12', media: 'aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9]' },
  { span: 'lg:col-span-7', media: 'aspect-[4/3] lg:aspect-auto lg:h-[clamp(320px,34vw,520px)]' },
  { span: 'lg:col-span-5', media: 'aspect-[4/3] lg:aspect-auto lg:h-[clamp(320px,34vw,520px)]' },
]

export default function Portfolio() {
  const [openId, setOpenId] = useState<string | null>(null)
  const lastTrigger = useRef<HTMLButtonElement | null>(null)
  const open = PROJECTS.find((p) => p.id === openId) ?? null

  const close = () => {
    setOpenId(null)
    window.setTimeout(() => lastTrigger.current?.focus(), 50)
  }

  return (
    <section id="work" aria-labelledby="work-title" className="section bg-ink-2/40">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="container-x">
        <SectionHeader
          index="02"
          label="Selected Work"
          lines={[<span id="work-title">Selected Works</span>]}
          sub="Digital experiences designed with purpose."
        />

        <ul className="mt-16 grid gap-x-5 gap-y-14 sm:mt-20 md:grid-cols-2 lg:grid-cols-12 lg:gap-y-20">
          {PROJECTS.map((p, i) => (
            <motion.li
              key={p.id}
              className={cn(i === 0 && 'md:col-span-2', LAYOUT[i].span)}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 1.1, ease: EASE_OUT, delay: i === 2 ? 0.12 : 0 }}
            >
              <ProjectCard
                project={p}
                index={i}
                mediaClass={LAYOUT[i].media}
                onOpen={(el) => {
                  lastTrigger.current = el
                  setOpenId(p.id)
                }}
              />
            </motion.li>
          ))}
        </ul>
      </div>

      <AnimatePresence>{open && <ProjectPanel key={open.id} project={open} onClose={close} />}</AnimatePresence>
    </section>
  )
}

function ProjectMedia({ project, priority = false }: { project: Project; priority?: boolean }) {
  if (!project.image) return <TajCover />
  return (
    <img
      src={project.image.src}
      srcSet={project.image.srcSet}
      sizes="(min-width: 1024px) 90vw, 100vw"
      alt={project.image.alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      width={1600}
      height={1000}
      className="absolute inset-0 h-full w-full object-cover"
    />
  )
}

function ProjectCard({
  project: p,
  index,
  mediaClass,
  onOpen,
}: {
  project: Project
  index: number
  mediaClass: string
  onOpen: (el: HTMLButtonElement) => void
}) {
  // Cursor-following "View" bubble (fine pointers only)
  const bx = useMotionValue(0)
  const by = useMotionValue(0)
  const x = useSpring(bx, { stiffness: 260, damping: 26, mass: 0.5 })
  const y = useSpring(by, { stiffness: 260, damping: 26, mass: 0.5 })
  const [hover, setHover] = useState(false)

  const onMove = (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (e.pointerType !== 'mouse' || !isFinePointer()) return
    const r = e.currentTarget.getBoundingClientRect()
    bx.set(e.clientX - r.left)
    by.set(e.clientY - r.top)
  }

  return (
    <article className="group">
      <button
        type="button"
        onClick={(e) => onOpen(e.currentTarget)}
        onPointerMove={onMove}
        onPointerEnter={(e) => {
          if (e.pointerType === 'mouse') {
            const r = e.currentTarget.getBoundingClientRect()
            bx.jump(e.clientX - r.left)
            by.jump(e.clientY - r.top)
            setHover(true)
          }
        }}
        onPointerLeave={() => setHover(false)}
        aria-label={`View project: ${p.title} — ${p.category}`}
        className="relative block w-full cursor-pointer text-left"
      >
        <motion.div
          layoutId={`media-${p.id}`}
          style={{ borderRadius: 28 }}
          className={cn('relative w-full overflow-hidden border border-white/[0.07] bg-card', mediaClass)}
        >
          <div className="absolute inset-0 scale-[1.001] transition-transform duration-[1400ms] ease-out-expo group-hover:scale-[1.06]">
            <ProjectMedia project={p} priority={index === 0} />
          </div>
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/45 to-transparent" />
          <span className="label absolute top-5 left-5 rounded-full border border-white/15 bg-black/40 px-3 py-1.5 text-[10px] text-fg backdrop-blur-md">
            {p.kind}
          </span>
          <span className="absolute top-4 right-4 grid size-11 place-items-center rounded-full border border-white/15 bg-black/35 text-fg backdrop-blur-md transition-all duration-500 ease-out-expo group-hover:rotate-45 group-hover:border-lime group-hover:bg-lime group-hover:text-lime-ink">
            <ArrowUpRight aria-hidden className="size-5" />
          </span>
          <motion.span
            aria-hidden
            style={{ x, y }}
            animate={{ scale: hover ? 1 : 0, opacity: hover ? 1 : 0 }}
            transition={{ duration: 0.35, ease: EASE_OUT }}
            className="pointer-events-none absolute top-0 left-0 -mt-12 -ml-12 hidden size-24 place-items-center rounded-full bg-lime font-display text-[14px] font-semibold text-lime-ink lg:grid"
          >
            View ↗
          </motion.span>
        </motion.div>
      </button>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
        <div>
          <h3 className="font-display text-[clamp(1.6rem,2.6vw,2.3rem)] leading-none font-medium tracking-[-0.04em]">{p.title}</h3>
          <p className="mt-2.5 text-[15px] text-muted">{p.category}</p>
        </div>
        <div className="flex items-center gap-5 pt-1">
          <span className="font-mono text-[12px] tracking-[0.18em] text-dim">{p.year}</span>
          <span className="flex items-center gap-1.5 text-[14px] font-medium text-fg transition-colors group-hover:text-lime">
            <span className="link-underline">View Project</span>
            <ArrowUpRight aria-hidden className="size-4" />
          </span>
        </div>
      </div>
    </article>
  )
}

function ProjectPanel({ project: p, onClose }: { project: Project; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)
  useLockBody(true)

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby={`panel-${p.id}`}>
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-ink/80 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.45 }}
        onClick={onClose}
      />
      <motion.div
        className="relative max-h-[92svh] w-full max-w-[1080px] overflow-y-auto rounded-t-[28px] border border-white/10 bg-ink-2 p-3 shadow-[0_60px_120px_-40px_rgba(0,0,0,0.95)] sm:rounded-[32px] sm:p-4"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 30, opacity: 0 }}
        transition={{ duration: 0.6, ease: EASE_OUT }}
      >
        <motion.div layoutId={`media-${p.id}`} style={{ borderRadius: 22 }} className="relative aspect-[16/10] w-full overflow-hidden bg-card sm:aspect-[16/8]">
          <ProjectMedia project={p} priority />
        </motion.div>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close project"
          className="absolute top-6 right-6 grid size-11 place-items-center rounded-full border border-white/15 bg-black/50 text-fg backdrop-blur-md transition-colors hover:bg-black/70 sm:top-7 sm:right-7"
        >
          <X aria-hidden className="size-5" />
        </button>

        <div className="grid gap-8 px-3 pt-8 pb-5 sm:px-5 lg:grid-cols-12 lg:gap-10 lg:pt-10">
          <div className="lg:col-span-7">
            <p className="label">{p.kind}</p>
            <h3 id={`panel-${p.id}`} className="mt-4 font-display text-[clamp(2.2rem,5vw,3.6rem)] leading-[0.95] font-semibold tracking-[-0.045em]">
              {p.title}
            </h3>
            <p className="mt-5 max-w-[36rem] text-[16.5px] leading-[1.65] text-muted">{p.summary}</p>
          </div>
          <div className="flex flex-col gap-6 lg:col-span-5">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-white/10 pt-6 text-[14px]">
              <div>
                <dt className="label text-[10px]">Category</dt>
                <dd className="mt-2 text-fg">{p.category}</dd>
              </div>
              <div>
                <dt className="label text-[10px]">Year</dt>
                <dd className="mt-2 text-fg">{p.year}</dd>
              </div>
              <div className="col-span-2">
                <dt className="label text-[10px]">Scope</dt>
                <dd className="mt-3 flex flex-wrap gap-2">
                  {p.services.map((s) => (
                    <span key={s} className="rounded-full border border-white/10 px-3 py-1.5 text-[13px] text-muted">
                      {s}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
            <div className="flex flex-wrap gap-3">
              <Button href="#contact" onClick={onClose}>
                Start a similar project
              </Button>
              {p.url && (
                <Button href={p.url} variant="ghost">
                  Visit site
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
