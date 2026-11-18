import { useState } from 'react';
import { MotionConfig } from 'framer-motion';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import FloatingWhatsApp from './components/layout/FloatingWhatsApp';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Services from './components/sections/Services';
import TaglineReveal from './components/sections/TaglineReveal';
import WhyUs from './components/sections/WhyUs';
import Work from './components/sections/Work';
import Process from './components/sections/Process';
import Faq from './components/sections/Faq';
import Contact from './components/sections/Contact';

export default function App() {
  const [selectedService, setSelectedService] = useState('');

  return (
    // reducedMotion="user": movement is dropped for visitors who prefer reduced motion; opacity fades remain.
    <MotionConfig reducedMotion="user">
      {/* Sentinel the floating nav observes to know when the page has scrolled */}
      <div id="top-sentinel" className="pointer-events-none absolute left-0 top-0 h-4 w-px" aria-hidden="true" />
      <Header />
      <main id="main">
        <Hero />
        <About />
        <Services onEnquire={setSelectedService} />
        <TaglineReveal />
        <WhyUs />
        <Work />
        <Process />
        <Faq />
        <Contact selectedService={selectedService} />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </MotionConfig>
  );
}
