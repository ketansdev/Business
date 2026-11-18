import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
// Mobile address-bar show/hide shouldn't re-measure the pinned runway.
ScrollTrigger.config({ ignoreMobileResize: true })

export { gsap, ScrollTrigger }
