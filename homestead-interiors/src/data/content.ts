/**
 * Editable brand content: philosophy, process and differentiators.
 * Edit freely to match the studio's real approach and workflow.
 * (Philosophy photos are assigned in src/data/placements.ts.)
 */

export const philosophy = [
  {
    title: "Thoughtful Design",
    body: "Spaces designed around individual lifestyles.",
  },
  {
    title: "Timeless Aesthetics",
    body: "Interiors that remain beautiful beyond trends.",
  },
  {
    title: "Functional Beauty",
    body: "A balance between elegance and everyday comfort.",
  },
  {
    title: "Material Authenticity",
    body: "Thoughtful selection of textures and materials.",
  },
  {
    title: "Personal Expression",
    body: "Spaces that reflect individual identity.",
  },
];

/**
 * OUR PROCESS — official copy supplied by the client (keep the order).
 */
export const process = [
  { title: "Consultation", body: "Understanding your vision, needs, preferences, and project expectations." },
  { title: "Planning", body: "Developing a clear, practical, and well-structured roadmap for your project." },
  { title: "Design", body: "Transforming your ideas into creative, detailed, and refined design concepts." },
  { title: "Finishing", body: "Executing every detail with precision to achieve a flawless and elegant finish." },
  { title: "Handover", body: "Delivering your completed space with quality, care, and confidence." },
];

/**
 * WHY CHOOSE US — official copy supplied by the client.
 * `icon` is a key into the icon map in src/sections/why/WhyHomestead.tsx.
 */
export const whyChooseUs = [
  {
    title: "Creative Designs",
    body: "Innovative and thoughtful designs that inspire, enhance, and elevate every space.",
    icon: "creative",
  },
  {
    title: "Quality Materials",
    body: "Carefully selected premium materials that ensure durability, quality, and lasting elegance.",
    icon: "materials",
  },
  {
    title: "Experienced Team",
    body: "A team of skilled professionals bringing expertise, precision, and dedication to every project.",
    icon: "team",
  },
  {
    title: "Customised Solutions",
    body: "Personalised design solutions tailored to your vision, requirements, and lifestyle.",
    icon: "custom",
  },
  {
    title: "End-to-End Services",
    body: "Complete project management, from initial concepts and planning to execution and final handover.",
    icon: "endToEnd",
  },
  {
    title: "Long-Term Relationships",
    body: "Building lasting relationships through trust, transparency, quality, and continued support.",
    icon: "relationships",
  },
] as const;
