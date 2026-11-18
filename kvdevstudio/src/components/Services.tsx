import { motion } from 'framer-motion'
import ServicesIntro from './services/ServicesIntro'
import ServiceStage from './services/ServiceStage'
import { ServiceCard } from './services/ServiceListCard'
import { SERVICES, serviceAnchor } from '../lib/site'
import { EASE_OUT } from '../lib/motion'
import { canPinHero } from '../lib/heroState'
import { usePrefersReducedMotion } from '../hooks/useReducedMotion'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { cn } from '../lib/cn'

/**
 * Services. Tablet/desktop with motion: a cinematic, scroll-controlled 3D
 * card stage. Phones, short screens and reduced motion: a stacked list with
 * the same content, no sticky sequence.
 */
export default function Services() {
  const reduced = usePrefersReducedMotion()
  // With the pinned hero, Services rises over its last frames as a rounded sheet.
  const sheet = canPinHero(reduced)
  const roomy = useMediaQuery('(min-width: 768px) and (min-height: 540px)')
  const desktop = useMediaQuery('(min-width: 1024px)')
  const cinematic = roomy && !reduced

  return (
    <section
      id="services"
      aria-labelledby="services-title"
      className={cn(
        'relative',
        sheet &&
          'z-10 -mt-[24svh] rounded-t-[36px] border-t border-white/[0.08] bg-ink shadow-[0_-50px_100px_-30px_rgba(0,0,0,0.85)] sm:rounded-t-[56px] lg:-mt-[28svh]',
      )}
    >
      <ServicesIntro />
      {cinematic ? <ServiceStage tablet={!desktop} /> : <ServiceList />}
    </section>
  )
}

function ServiceList() {
  return (
    <div className="container-x pb-[clamp(88px,11vw,150px)]">
      <motion.ul
        className="grid gap-4 md:grid-cols-2 lg:gap-5"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.08 }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
      >
        {SERVICES.map((s) => (
          <motion.li
            key={s.index}
            id={serviceAnchor(s)}
            className="svc-target scroll-mt-28 [perspective:1400px]"
            variants={{
              hidden: { opacity: 0, y: 40 },
              show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE_OUT } },
            }}
          >
            <ServiceCard service={s} />
          </motion.li>
        ))}
      </motion.ul>
    </div>
  )
}
