import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="flex min-h-[90svh] items-center bg-paper pt-[var(--header-h)]">
      <div className="container-x">
        <p className="eyebrow mb-8 text-sage-deep">404</p>
        <h1 className="display-xl max-w-4xl">
          This room <em className="text-sage-deep">doesn&apos;t exist</em> — yet.
        </h1>
        <p className="lede mt-8 max-w-md">The page you&apos;re looking for may have moved. Let&apos;s take you somewhere beautiful.</p>
        <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <ButtonLink href="/">Back home</ButtonLink>
          <ButtonLink href="/projects" variant="outline" arrow={false}>
            View projects
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
