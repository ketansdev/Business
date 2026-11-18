import { ArrowLeft } from '@phosphor-icons/react';
import Logo from '../components/ui/Logo';
import Button from '../components/ui/Button';
import { site } from '../config/site';
import { pages } from './content';

function Shell({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="px-4 pt-4">
        <nav aria-label="Primary" className="mx-auto flex w-full max-w-container items-center justify-between rounded-2xl bg-paper/80 p-2 pl-4 shadow-soft ring-1 ring-line/10 backdrop-blur-xl lg:w-fit lg:gap-12">
          <a href="./" aria-label="KV DEV STUDIO home" className="rounded-lg"><Logo /></a>
          <Button href="./" size="sm" variant="secondary" icon={ArrowLeft}>Back to home</Button>
        </nav>
      </header>
      <main id="main" className="flex-1">{children}</main>
      <footer className="caption-2 container-x flex flex-col justify-between gap-3 py-8 text-ink-muted sm:flex-row">
        <p>© {site.year} KV DEV STUDIO. All Rights Reserved.</p>
        <ul className="flex gap-6">
          <li><a className="rounded hover:text-ink" href="privacy.html">Privacy policy</a></li>
          <li><a className="rounded hover:text-ink" href="terms.html">Terms of use</a></li>
        </ul>
      </footer>
    </div>
  );
}

function Legal({ page }) {
  const { title, updated, sections } = pages[page];
  return (
    <Shell>
      <article className="container-x max-w-3xl py-20">
        <p className="eyebrow">Legal</p>
        <h1 className="heading-3 mt-4 sm:heading-2">{title}</h1>
        <p className="caption-2 mt-4 text-ink-muted">Last updated {updated}</p>
        <div className="mt-12 space-y-10">
          {sections.map((s) => (
            <section key={s.h}>
              <h2 className="heading-6">{s.h}</h2>
              <div className="body-3 mt-3 text-ink-soft">{s.body}</div>
            </section>
          ))}
        </div>
      </article>
    </Shell>
  );
}

function NotFound() {
  return (
    <Shell>
      <section className="container-x flex flex-col items-center py-24 text-center">
        <p className="caption-3 uppercase tracking-widest text-accent-ink">Error 404</p>
        <h1 className="heading-3 mt-4 max-w-hero bg-[linear-gradient(90deg,#000000,#666666)] bg-clip-text text-transparent sm:heading-1">
          This page could not be found.
        </h1>
        <p className="body-7 mt-6 max-w-md text-ink-muted">
          The link may be old or mistyped. Head back to the homepage, or tell us what you were looking for.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {/* Absolute links: a 404 can be served at any depth */}
          <Button href="/" icon={ArrowLeft}>Back to home</Button>
          <Button href="/#contact" variant="secondary">Contact the studio</Button>
        </div>
      </section>
    </Shell>
  );
}

export default function Standalone({ page }) {
  return page === 'notfound' ? <NotFound /> : <Legal page={page} />;
}
