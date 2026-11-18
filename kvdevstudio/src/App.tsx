import { MotionConfig } from 'framer-motion'
import IntroCurtain from './components/IntroCurtain'
import Header from './components/Header'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Services from './components/Services'
import Portfolio from './components/Portfolio'
import About from './components/About'
import Process from './components/Process'
import Contact from './components/Contact'
import Footer from './components/Footer'
import FloatingWhatsApp from './components/FloatingWhatsApp'
import { FORCE_REDUCED } from './lib/env'

export default function App() {
  return (
    <MotionConfig reducedMotion={FORCE_REDUCED ? 'always' : 'user'}>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <IntroCurtain />
      <Header />
      <main id="main">
        <Hero />
        <Marquee />
        <Services />
        <Portfolio />
        <About />
        <Process />
        <Contact />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <div aria-hidden className="grain" />
    </MotionConfig>
  )
}
