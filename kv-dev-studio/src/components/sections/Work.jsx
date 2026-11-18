import { ArrowUpRight, Globe } from '@phosphor-icons/react';
import SectionHeading from '../ui/SectionHeading';
import Button from '../ui/Button';
import { ImageReveal, Reveal } from '../ui/Reveal';
import ResponsiveImage from '../ui/ResponsiveImage';
import { projects } from '../../data/projects';
import { imageSizes } from '../../data/images';
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

function ProjectCard({ project, index, centred }) {
  const { title, category, concept, image, alt, preview, link, domain, cover } = project;
  const Preview = previews[preview];
  const Wrapper = link ? 'a' : 'div';
  const wrapperProps = link
    ? { href: link, target: '_blank', rel: 'noopener noreferrer', 'aria-label': `${title}, ${category}. Visit the live website (opens in a new tab)` }
    : {};

  let media;
  if (image) {
    media = (
      <ResponsiveImage
        image={image}
        alt={alt ?? `Homepage of the ${title} website`}
        sizes={imageSizes.card}
        // Composed 16:10 artwork stays centred; a plain full page screenshot is pinned to its top
        className={`h-full w-full object-cover ${typeof image === 'string' ? 'object-top' : 'object-center'}`}
      />
    );
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
    // An odd last card spans both columns at one column's width (gap-x-6 = 24px), centred, so the grid never ends on a hole
    <li className={centred ? 'md:col-span-2 md:mx-auto md:w-[calc((100%_-_24px)/2)]' : undefined}>
      <Wrapper {...wrapperProps} className="group block rounded-3xl">
        <ImageReveal delay={centred ? 0 : (index % 2) * 0.08}>
          {/* isolate keeps the rounded clip intact while the image scales (Safari) */}
          <div className="relative isolate aspect-[16/10] overflow-hidden rounded-3xl bg-paper-sunken ring-1 ring-line/5">
            <div className="absolute inset-0 transition-transform duration-700 ease-base group-hover:scale-[1.04] group-focus-visible:scale-[1.04]">
              {media}
            </div>
            {/* outer radius 24, inset 16: pill badges */}
            {concept ? (
              <span className="type-label absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-ink shadow-soft backdrop-blur">
                Concept
              </span>
            ) : (
              link && (
                <span className="type-label absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-ink shadow-soft backdrop-blur">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#1FAF54]" aria-hidden="true" />
                  Live
                </span>
              )
            )}
          </div>
        </ImageReveal>
        <div className="mt-6 flex items-start justify-between gap-4 px-1">
          <div className="min-w-0">
            <h3 className="type-h3">{title}</h3>
            <ul className="mt-3 flex flex-wrap gap-2" aria-label="Project details">
              <li
                className={`type-small rounded-full px-3 py-1 font-medium ${
                  concept ? 'bg-paper-sunken text-ink-muted' : 'bg-accent-soft text-accent-ink'
                }`}
              >
                {concept ? 'Studio concept' : 'Client project'}
              </li>
              <li className="type-small rounded-full px-3 py-1 text-ink-muted ring-1 ring-inset ring-line/10">{category}</li>
            </ul>
          </div>
          {link && (
            <span
              aria-hidden="true"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-1 ring-inset ring-line/15 transition-colors duration-300 group-hover:bg-ink group-hover:text-paper group-hover:ring-ink"
            >
              <ArrowUpRight size={18} className="transition-transform duration-500 ease-base group-hover:rotate-45" />
            </span>
          )}
        </div>
      </Wrapper>
    </li>
  );
}

export default function Work() {
  const hasConcepts = projects.some((p) => p.concept);
  return (
    <section id="work" aria-labelledby="work-title" className="section-y">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            id="work-title"
            index="04"
            eyebrow="Our work"
            title={
              <>
                A Glimpse of What We <span className="text-accent">Create</span>
              </>
            }
            description="Websites we have designed and built, live and in use, alongside our brand, social media and local SEO work."
          />
          <Reveal delay={0.1} className="shrink-0">
            <Button href="#contact" variant="secondary" arrow>
              Start your project
            </Button>
          </Reveal>
        </div>

        <ul className="mt-12 grid gap-x-6 gap-y-12 md:grid-cols-2 lg:mt-16 lg:gap-y-16">
          {projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} centred={projects.length % 2 === 1 && i === projects.length - 1} />
          ))}
        </ul>

        {hasConcepts && (
          <Reveal>
            <p className="type-small mt-16 flex items-start gap-2 border-t border-line/10 pt-6 text-ink-muted">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
              Projects marked &ldquo;Concept&rdquo; are studio demonstration designs created to show our approach. They are not
              client work, and the brand names shown are fictional.
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
