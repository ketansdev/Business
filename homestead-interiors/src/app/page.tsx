import { Hero } from "@/sections/hero/Hero";
import { Introduction } from "@/sections/introduction/Introduction";
import { Philosophy } from "@/sections/philosophy/Philosophy";
import { FeaturedProjects } from "@/sections/projects/FeaturedProjects";
import { PhotoStrip } from "@/sections/projects/PhotoStrip";
import { ServicesSection } from "@/sections/services/ServicesSection";
import { Process } from "@/sections/process/Process";
import { WhyHomestead } from "@/sections/why/WhyHomestead";
import { Testimonials } from "@/sections/testimonials/Testimonials";
import { FinalCTA } from "@/sections/cta/FinalCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Introduction />
      <Philosophy />
      <WhyHomestead />
      <ServicesSection />
      <FeaturedProjects />
      <Process />
      <PhotoStrip />
      <Testimonials />
      <FinalCTA />
    </>
  );
}
