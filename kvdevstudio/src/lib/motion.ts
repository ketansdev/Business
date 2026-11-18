/** Shared motion tokens (see design-system/kvdevstudio/MASTER.md → Motion). */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const

export const VIEWPORT_ONCE = { once: true, amount: 0.25 } as const

export const stagger = (each = 0.1, delayChildren = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: each, delayChildren } },
})
