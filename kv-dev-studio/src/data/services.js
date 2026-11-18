import { Devices, CloudCheck, MapPin, Megaphone, PenNib } from '@phosphor-icons/react';

export const services = [
  {
    id: 'web',
    icon: Devices,
    title: 'Website Design & Development',
    description:
      'Modern, responsive and user-friendly websites designed to turn visitors into customers.',
    includes: [
      'Custom page design for your brand',
      'Fast, mobile friendly build',
      'Search friendly page structure',
      'Contact forms and WhatsApp integration',
    ],
  },
  {
    id: 'hosting',
    icon: CloudCheck,
    title: 'Domain & Hosting Setup',
    description:
      'Get the right domain name for your business and your website live on dependable hosting, set up and connected for you.',
    includes: [
      'Domain name guidance and registration',
      'Hosting setup and configuration',
      'SSL certificate for a secure site',
      'Domain and DNS connection',
    ],
  },
  {
    id: 'seo',
    icon: MapPin,
    title: 'Google Business Profile & Local SEO',
    description:
      'Improve your local visibility, optimise your Google Business Profile and help customers discover your business.',
    includes: [
      'Profile setup and optimisation',
      'Categories, services and photo plan',
      'Local keyword targeting',
      'Regular posts and listing upkeep',
    ],
  },
  {
    id: 'social',
    icon: Megaphone,
    title: 'Social Media Management',
    description:
      'Build your online presence through engaging content, consistent branding and strategic social media management.',
    includes: [
      'Monthly content calendar',
      'Branded post and story designs',
      'Captions and hashtag planning',
      'Consistent profile setup',
    ],
  },
  {
    id: 'brand',
    icon: PenNib,
    title: 'Branding & Graphic Design',
    description:
      'Create a memorable brand identity through professional logos, visual designs and marketing creatives.',
    includes: [
      'Logo design and variations',
      'Colour palette and typography',
      'Business cards and stationery',
      'Print and digital marketing creatives',
    ],
  },
];
