/**
 * Central business configuration.
 *
 * Every value set to `null` is unknown and is NOT rendered anywhere on the site.
 * Fill these in with verified details only — the UI picks them up automatically.
 */

export const site = {
  name: "Homestead Interiors",
  shortName: "Homestead",
  tagline: "Spaces that inspire. Interiors that feel like home.",
  message: "Thoughtfully designed spaces, crafted around the way you live.",
  description:
    "Homestead Interiors is an interior design studio creating contemporary, timeless spaces — thoughtfully designed around the way you live.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  locale: "en_IN",

  /**
   * Preview mode shows draft/sample content with clear labels.
   * Set NEXT_PUBLIC_CONTENT_PREVIEW=false before launch to publish confirmed content only.
   */
  contentPreview: process.env.NEXT_PUBLIC_CONTENT_PREVIEW !== "false",

  // ---- VERIFIED CONTACT DETAILS (fill in; null = hidden) ----
  contact: {
    email: null as string | null, // e.g. "studio@homesteadinteriors.com"
    phone: null as string | null, // e.g. "+91 00000 00000"
    address: null as string | null, // e.g. "Studio address, City, State"
    hours: null as string | null, // e.g. "Mon – Sat, 10:00 – 19:00"
  },

  // ---- WHATSAPP (floating button + enquiry form) ----
  whatsapp: {
    number: "+91 99230 83668",
    url: "https://wa.me/919923083668",
  },

  // ---- SOCIAL PROFILES (fill in; null = hidden) ----
  social: {
    instagram: null as string | null,
    pinterest: null as string | null,
    linkedin: null as string | null,
    houzz: null as string | null,
  },

  nav: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Why Us", href: "/#why" },
    { label: "Services", href: "/services" },
    { label: "Projects", href: "/projects" },
    { label: "Process", href: "/#process" },
    { label: "Gallery", href: "/gallery" },
    { label: "Contact", href: "/contact" },
  ],
} as const;

export type NavItem = (typeof site.nav)[number];
