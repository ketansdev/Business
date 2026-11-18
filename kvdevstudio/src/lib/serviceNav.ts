import { SERVICES, serviceAnchor } from './site'

/**
 * Navigation into the Services section. The cinematic stage registers a
 * navigator that maps a service to its exact scroll position on the pinned
 * runway; otherwise we fall back to the card's anchor in the stacked list.
 */
type Navigator = (index: number, smooth: boolean) => void
let navigator: Navigator | null = null

export function registerServiceNavigator(fn: Navigator | null) {
  navigator = fn
}

export function navigateToService(index: number, reduced: boolean) {
  if (navigator) {
    navigator(index, !reduced)
    return
  }
  const el = document.getElementById(serviceAnchor(SERVICES[index]))
  if (!el) return
  el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' })
  flash(el, reduced ? 0 : 650)
}

/** Brief lime highlight on a card once the scroll lands. */
export function flash(el: Element, delay: number) {
  el.classList.remove('is-targeted')
  window.setTimeout(() => el.classList.add('is-targeted'), delay)
  window.setTimeout(() => el.classList.remove('is-targeted'), delay + 1900)
}
