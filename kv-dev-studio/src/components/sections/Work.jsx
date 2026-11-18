import { ArrowUpRight, Globe } from '@phosphor-icons/react';
import SectionHeading from '../ui/SectionHeading';
import Button from '../ui/Button';
import { ImageReveal, Reveal } from '../ui/Reveal';
import { projects } from '../../data/projects';
import { previews } from '../mockups/Previews';
import ScaledPreview from '../mockups/ScaledPreview';

/**
 * Cover for a live project that has no screenshot yet.
 * Shows only true facts (name, address, type of work), never an imitation of the site itself.
 */
function SiteCover({ title, domain, category, cover }) {
  const dark = cover === 'dark';
  return (
    <div className={`flex h-full w-full flex-col p-12 ${dark ? 'bg-night text-paper' : 'bg-paper-sunken text-ink'}`}>
      <div
        className={`flex items-center gap-2 self-start rounded-lg px-3 py-2 ${dark ? 'bg-paper/10 text-paper/70' : 'bg-white text-ink-muted ring-1 ring-line/10'}`}
      >
        <Globe size={20} aria-hidden="true" />
        <span className="body-6">{domain}</span>
      </div>
      <div className="mt-auto">
        <p className={`caption-3 uppercase tracking-widest ${dark ? 'text-paper/50' : 'text-ink-muted'}`}>{category}</p>
        <p className="heading-1 mt-4">{title}</p>
        <span
          className={`button-md mt-8 inline-flex items-center gap-2 rounded-lg px-3 py-2 ${dark ? 'bg-paper text-ink' : 'bg-ink text-paper'}`}
        >
          Visit live site <ArrowUpRight size={18} aria-hidden="true" />
        </span>
      </div>
    </div>
  );
}

function ProjectCard({ project, index }) {
  const { title, category, concept, image, preview, link, domain, cover } = project;
  const Preview = previews[preview];
  const Wrapper = link ? 'a' : 'div';
  const wrapperProps = link
    ? { href: link, target: '_blank', rel: 'noopener noreferrer', 'aria-label': `${title}, ${category}. Visit the live website (opens in a new tab)` }
    : {};

  let media;
  if (image) {
    media = <img src={image} alt={`Homepage of the ${title} website`} loading="lazy" decoding="async" className="h-full w-full object-cover object-top" />;
  } else if (link) {
    media = (
      <ScaledPreview baseWidth={760}>
        <SiteCover title={title} domain={domain} category={category} cover={cover} />
      </ScaledPreview>
    );
  } else if (Preview) {
    media = (
      <div role="img" aria-label={`Illustrated preview of the ${title} concept`} className="h-full w-full">
        <ScaledPreview baseWidth={720}>
          <Preview />
        </ScaledPreview>
      </div>
    );
  }

  return (
    <li>
      <Wrapper {...wrapperProps} className="group block rounded-3xl">
        <ImageReveal delay={(index % 2) * 0.08}>
          <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-paper-sunken ring-1 ring-line/5">
            <div className="absolute inset-0 transition-transform duration-700 ease-base group-hover:scale-[1.03]">{media}</div>
            {/* outer radius 24, inset 16: badge radius 8 */}
            {concept ? (
              <span className="caption-3 absolute left-4 top-4 rounded-lg bg-white/90 px-2 py-1 uppercase tracking-widest text-ink shadow-soft backdrop-blur">
                Concept
              </span>
            ) : (
              link && (
                <span className="caption-3 absolute right-4 top-4 inline-flex items-center gap-2 rounded-lg bg-white/90 px-2 py-1 uppercase tracking-widest text-ink shadow-soft backdrop-blur">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#1FAF54]" aria-hidden="true" />
                  Live
                </span>
              )
            )}
          </div>
        </ImageReveal>
        <div className="mt-4 flex flex-col gap-1 px-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
          <h3 className="title-2 inline-flex items-center gap-2">
            {title}
            {link && (
              <ArrowUpRight
                size={18}
                aria-hidden="true"
                className="text-ink-muted transition-transform duration-500 ease-base group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink"
              />
            )}
          </h3>
          <p className="caption-2 text-ink-muted sm:shrink-0">{category}</p>
        </div>
      </Wrapper>
    </li>
  );
}

export default function Work() {
  const hasConcepts = projects.some((p) => p.concept);
  return (
    <section id="work" aria-labelledby="work-title" className="py-20 sm:py-24">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            id="work-title"
            eyebrow="Our work"
            title="A Glimpse of What We Create"
            description="Websites we have designed and built, live and in use, alongside our brand and social design work."
          />
          <Reveal delay={0.1}>
            <Button href="#contact" variant="secondary" arrow>
              Start your project
            </Button>
          </Reveal>
        </div>

        <ul className="mt-12 grid gap-x-4 gap-y-10 md:grid-cols-2">
          {projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </ul>

        {hasConcepts && (
          <Reveal>
            <p className="caption-2 mt-12 flex items-start gap-2 text-ink-muted">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              Projects marked &ldquo;Concept&rdquo; are studio demonstration designs created to show our approach. They are not
              client work, and the brand names shown are fictional.
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
