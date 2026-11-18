import meltTheory1600 from '../assets/work/melt-theory-1600.webp'
import meltTheory800 from '../assets/work/melt-theory-800.webp'
import homestead1600 from '../assets/work/homestead-interiors-1600.webp'
import homestead800 from '../assets/work/homestead-interiors-800.webp'

/* -------------------------------------------------------------------------
   Contact + social configuration
   ------------------------------------------------------------------------- */
export const CONTACT = {
  /** Every mailto: link on the site reads from here. */
  email: 'contact@kvdevstudio.com',
  phoneDisplay: '+91 89763 23043',
  phoneHref: 'tel:+918976323043',
  /** WhatsApp click-to-chat link. */
  whatsapp: 'https://wa.me/918976323043',
  /** Full profile URL. Leave empty to show the item as "Soon" (no dead links). */
  instagram: '',
}

export const mailto = (subject?: string) =>
  `mailto:${CONTACT.email}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`

/** Default enquiry used by the contact section's Gmail and WhatsApp links. */
export const ENQUIRY = {
  subject: 'New project enquiry — KV DEV Studio',
  body: "Hi KV DEV Studio,\n\nI'd like to talk about a project for my business.\n\nThanks,",
  whatsapp: "Hi KV DEV Studio! I'd like to discuss a project for my business.",
}

/** Opens Gmail's web composer addressed to the studio, pre-filled. */
export const gmailCompose = (subject = ENQUIRY.subject, body = ENQUIRY.body) =>
  `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(CONTACT.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

/** WhatsApp chat with a pre-typed message. */
export const whatsappWithMessage = (message = ENQUIRY.whatsapp) => `${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`

/* -------------------------------------------------------------------------
   Navigation
   ------------------------------------------------------------------------- */
export const NAV = [
  { id: 'home', label: 'Home' },
  { id: 'services', label: 'Services' },
  { id: 'work', label: 'Work' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
] as const

export type SectionId = (typeof NAV)[number]['id']

/* -------------------------------------------------------------------------
   Services
   ------------------------------------------------------------------------- */
export type ServiceVisualKey = 'web' | 'local' | 'social' | 'brand'

export type Service = {
  index: string
  title: string
  short: string
  /** Label used on the hero's service nodes. */
  node: string
  /** One-line pitch shown when a hero node is explored. */
  teaser: string
  /** Small category label on the cinematic service card. */
  category: string
  /** Label in the services progress indicator. */
  indicator: string
  description: string
  details: string[]
  visual: ServiceVisualKey
}

export const SERVICES: Service[] = [
  {
    index: '01',
    title: 'Website Design & Development',
    short: 'Website Development',
    node: 'Web Development',
    teaser: 'Fast, beautiful websites built to turn visitors into customers.',
    description:
      'High-performance digital experiences designed to capture attention, create trust and convert visitors into customers.',
    details: ['UI/UX & interface design', 'Responsive, fast front-end builds', 'Landing pages, CMS & e-commerce', 'Technical SEO foundations'],
    visual: 'web',
    category: 'Design · Development',
    indicator: 'Website Development',
  },
  {
    index: '02',
    title: 'Google Business Profile & Local SEO',
    short: 'Google Business Profile & SEO',
    node: 'Google Business & SEO',
    teaser: 'Be the business people find first on Google and Maps.',
    description:
      'Make your business easier to discover with optimized Google presence and stronger local search visibility.',
    details: ['Profile setup & optimisation', 'Local keywords & map visibility', 'Photos, posts & Q&A upkeep', 'Consistent business listings'],
    visual: 'local',
    category: 'Local Visibility · Search',
    indicator: 'Google Business & SEO',
  },
  {
    index: '03',
    title: 'Social Media Management',
    short: 'Social Media Management',
    node: 'Social Media',
    teaser: 'Consistent, scroll-stopping content that keeps your brand present.',
    description:
      'Build a consistent brand presence through engaging content, creative visuals and strategic social media management.',
    details: ['Content strategy & calendars', 'Post, reel & story design', 'Reusable visual templates', 'Profile & community management'],
    visual: 'social',
    category: 'Content · Community',
    indicator: 'Social Media Management',
  },
  {
    index: '04',
    title: 'Branding & Graphic Design',
    short: 'Branding & Graphic Design',
    node: 'Branding & Design',
    teaser: 'Identity systems and design that make your brand unmistakable.',
    description:
      'Build a memorable brand identity through distinctive logos, visual systems and professional graphic design.',
    details: ['Logo & identity systems', 'Typography & colour palettes', 'Brand guidelines', 'Print & marketing collateral'],
    visual: 'brand',
    category: 'Identity · Design',
    indicator: 'Branding & Design',
  },
]

/* -------------------------------------------------------------------------
   Selected work
   Covers for Melt Theory and Homestead Interiors come from those projects'
   own asset folders (see scripts/prepare-images.mjs). Taj Icecream has no
   assets in this workspace yet, so it renders a designed brand-board cover —
   swap in a real screenshot via `image` when available.
   ------------------------------------------------------------------------- */
export type Project = {
  id: string
  title: string
  category: string
  year: string
  kind: string
  summary: string
  services: string[]
  image?: { src: string; srcSet: string; alt: string }
  /** Live site URL — when set, the project panel shows a "Visit site" link. */
  url?: string
}

export const PROJECTS: Project[] = [
  {
    id: 'melt-theory',
    title: 'Melt Theory',
    category: 'Creative Brand Experience',
    year: '2026',
    kind: 'Concept project',
    summary:
      'A cinematic, scroll-driven website for a concept luxury ice-cream brand: an intro film, a product that tumbles through 3D, exploded flavour layers and a pinned ingredient story.',
    services: ['Art direction', 'Motion design', 'Front-end development'],
    image: {
      src: meltTheory1600,
      srcSet: `${meltTheory800} 800w, ${meltTheory1600} 1600w`,
      alt: 'Melt Theory — chocolate ice cream, waffles and berries in warm studio light',
    },
  },
  {
    id: 'homestead-interiors',
    title: 'Homestead Interiors',
    category: 'Interior Design Website',
    year: '2026',
    kind: 'Interiors',
    summary:
      'An editorial website for an interior design studio, with a real-time 3D living room in the hero, project galleries and calm, considered motion throughout.',
    services: ['Web design', 'Development', '3D & motion'],
    image: {
      src: homestead1600,
      srcSet: `${homestead800} 800w, ${homestead1600} 1600w`,
      alt: 'Homestead Interiors — a finished living and dining room with a marble feature wall',
    },
  },
  {
    id: 'taj-icecream',
    title: 'Taj Icecream',
    category: 'Brand Website',
    year: '2026',
    kind: 'Food & dessert',
    summary:
      'A brand website for an ice-cream parlour, built to present its flavours, story and store details with the warmth of the product itself.',
    services: ['Web design', 'Development', 'Brand presentation'],
  },
]

/* -------------------------------------------------------------------------
   Process
   ------------------------------------------------------------------------- */
export const PROCESS = [
  { index: '01', title: 'Discover', text: 'Understanding your business, audience and goals.' },
  { index: '02', title: 'Design', text: 'Creating a distinctive visual direction and user experience.' },
  { index: '03', title: 'Develop', text: 'Building responsive, optimized and interactive digital experiences.' },
  { index: '04', title: 'Launch & Grow', text: 'Launching your project and helping your business grow online.' },
] as const

/** Labels that ride the umbrella's rib tips in the hero. */
export const HERO_TAGS = ['Design', 'Development', 'Branding', 'Growth'] as const

/** DOM id of a service card in the Services section. */
export const serviceAnchor = (s: Service) => `service-${s.visual}`
