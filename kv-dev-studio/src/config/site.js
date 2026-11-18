/**
 * Central site configuration.
 * Update contact details, navigation and social profiles here.
 */
export const site = {
  name: 'KV DEV STUDIO',
  tagline: 'Creative digital studio',
  description:
    'A creative digital studio helping businesses build a strong online presence through modern websites, strategic branding, local SEO and social media.',
  phoneDisplay: '+91 89763 23043',
  phoneHref: 'tel:+918976323043',
  whatsappNumber: '918976323043',
  email: 'contact@kvdevstudio.com',
  year: 2026,
};

export const whatsappLink = (text = "Hi KV DEV STUDIO, I'd like to discuss a project.") =>
  `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(text)}`;

export const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Our Work', href: '#work' },
  { label: 'Contact', href: '#contact' },
];

/**
 * Social profiles. Leave the list empty until real profile URLs exist.
 * The footer always shows WhatsApp, email and phone icons, and adds one icon per entry here
 * (Instagram, LinkedIn, Facebook, X, Behance, Dribbble and YouTube get their own icon; others show a globe).
 * Example: { label: 'Instagram', href: 'https://instagram.com/yourhandle' }
 */
export const socialLinks = [];
