import { Reveal } from './Reveal';

/** Numbered section label: "01 —— About the studio". The index runs through the page in order. */
export function Eyebrow({ index, dark = false, className = '', children }) {
  return (
    <p className={`type-label inline-flex items-center gap-3 ${dark ? 'text-paper/60' : 'text-ink-muted'} ${className}`}>
      {index && <span className={dark ? 'text-accent' : 'text-accent-ink'}>{index}</span>}
      <span aria-hidden="true" className={`h-px w-8 ${dark ? 'bg-paper/25' : 'bg-line/20'}`} />
      {children}
    </p>
  );
}

/** Section header: numbered eyebrow, h2 (type-h2) and a lead paragraph. `title` may contain highlighted spans. */
export default function SectionHeading({ index, eyebrow, title, description, align = 'left', dark = false, id, className = '' }) {
  const centered = align === 'center';
  return (
    <Reveal className={`${centered ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'} ${className}`}>
      {eyebrow && (
        <Eyebrow index={index} dark={dark}>
          {eyebrow}
        </Eyebrow>
      )}
      <h2 id={id} className={`type-h2 mt-6 ${dark ? 'text-paper' : 'text-ink'}`}>
        {title}
      </h2>
      {description && (
        <p className={`type-lead mt-6 max-w-xl ${dark ? 'text-paper/70' : 'text-ink-muted'} ${centered ? 'mx-auto' : ''}`}>{description}</p>
      )}
    </Reveal>
  );
}
