import { useCallback, useEffect, useRef, useState } from 'react'
import Background from './components/Background'
import Intro from './components/Intro'
import Experience from './components/Experience'
import Collection from './components/Collection'
import Obsession from './components/Obsession'
import Story from './components/Story'
import FindYourMelt from './components/FindYourMelt'
import WallOfLove from './components/WallOfLove'
import Footer from './components/Footer'
import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollToPlugin)
import useReducedMotion from './lib/useReducedMotion'

const SCROLL_KEYS = new Set([' ', 'PageDown', 'PageUp', 'ArrowDown', 'ArrowUp', 'Home', 'End'])

export default function App() {
  const reducedMotion = useReducedMotion()
  const [introDone, setIntroDone] = useState(false)
  const [introMounted, setIntroMounted] = useState(true)
  // category on screen in Collections → its bestseller is carried into The Obsession
  const [carriedCategory, setCarriedCategory] = useState('waffles')
  // Find Your Melt → open a category/product in the existing Collections section
  const [collectionRequest, setCollectionRequest] = useState(null)
  const exploreInCollection = useCallback(
    (target) => {
      setCollectionRequest({ ...target, nonce: Date.now() })
      const nav = document.querySelector('#collection .cnav')
      if (!nav) return
      const y = nav.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.12
      if (reducedMotion) window.scrollTo(0, y)
      else gsap.to(window, { scrollTo: { y, autoKill: true }, duration: 1.8, ease: 'power3.inOut' })
    },
    [reducedMotion],
  )
  const introRef = useRef(null)
  const bgRef = useRef(null)

  const handleIntroDone = useCallback(() => setIntroDone(true), [])
  const handleIntroHidden = useCallback(() => setIntroMounted(false), [])

  // Hold scroll while the intro film plays. Listeners rather than
  // overflow:hidden, so the scrollbar never appears/disappears (no layout shift).
  useEffect(() => {
    if (introDone) return
    const stop = (e) => e.preventDefault()
    const keys = (e) => SCROLL_KEYS.has(e.key) && e.preventDefault()
    window.addEventListener('wheel', stop, { passive: false })
    window.addEventListener('touchmove', stop, { passive: false })
    window.addEventListener('keydown', keys)
    return () => {
      window.removeEventListener('wheel', stop)
      window.removeEventListener('touchmove', stop)
      window.removeEventListener('keydown', keys)
    }
  }, [introDone])

  return (
    <>
      <Background ref={bgRef} reducedMotion={reducedMotion} />
      <main>
        <Experience
          introDone={introDone}
          introRef={introRef}
          onIntroHidden={handleIntroHidden}
          reducedMotion={reducedMotion}
          bgRef={bgRef}
        />
        <Collection reducedMotion={reducedMotion} onCategoryChange={setCarriedCategory} request={collectionRequest} />
        <Obsession reducedMotion={reducedMotion} carriedCategory={carriedCategory} />
        <Story />
        <FindYourMelt reducedMotion={reducedMotion} onExplore={exploreInCollection} />
        <WallOfLove />
      </main>
      <Footer reducedMotion={reducedMotion} onExplore={exploreInCollection} />
      {introMounted && (
        <Intro overlayRef={introRef} onDone={handleIntroDone} skip={reducedMotion} />
      )}
    </>
  )
}
