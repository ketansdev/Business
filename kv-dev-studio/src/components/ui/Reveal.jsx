import { motion } from 'framer-motion';

/** Base curve from the design system. */
export const ease = [0.22, 1, 0.36, 1];
const viewport = { once: true, margin: '0px 0px -10% 0px' };

/** Section reveal: rise 32px and fade in once (Spacing-400, 700ms, base curve). */
export function Reveal({ as = 'div', delay = 0, className, children, ...props }) {
  const M = motion[as];
  return (
    <M
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ duration: 0.7, ease, delay }}
      className={className}
      {...props}
    >
      {children}
    </M>
  );
}

/** Parent that staggers its <StaggerItem> children. */
export function Stagger({ as = 'div', stagger = 0.08, delay = 0, className, children, ...props }) {
  const M = motion[as];
  return (
    <M
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
      className={className}
      {...props}
    >
      {children}
    </M>
  );
}

export const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

export function StaggerItem({ as = 'div', className, children, ...props }) {
  const M = motion[as];
  return (
    <M variants={itemVariants} className={className} {...props}>
      {children}
    </M>
  );
}

/** Image reveal: fade, rise and settle scale (transform and opacity only). */
export function ImageReveal({ className, children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={viewport}
      transition={{ duration: 0.8, ease, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
