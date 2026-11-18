import { Reveal } from './Reveal';

/** Section header: eyebrow (Caption 3), Heading 2 title, Body 7 description. */
export default function SectionHeading({ eyebrow, title, description, align = 'left', id, className = '' }) {
  const centered = align === 'center';
  return (
    <Reveal className={`${centered ? 'mx-auto max-w-2xl text-center' : 'max-w-3xl'} ${className}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 id={id} className="heading-3 mt-4 text-ink sm:heading-2">
        {title}
      </h2>
      {description && (
        <p className={`body-7 mt-4 max-w-xl text-ink-muted ${centered ? 'mx-auto' : ''}`}>{description}</p>
      )}
    </Reveal>
  );
}
