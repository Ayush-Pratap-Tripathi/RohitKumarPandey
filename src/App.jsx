import { MotionConfig } from 'motion/react'
import { ReactLenis } from 'lenis/react'
import { useCallback, useState } from 'react'
import { IntroContext } from './context/intro'
import { PlayerProvider } from './context/player'
import { Footer } from './components/layout/Footer'
import { Nav } from './components/layout/Nav'
import { CursorLabel, Grain, ScrollProgress } from './components/layout/Overlays'
import { Preloader } from './components/layout/Preloader'
import { Lightbox } from './components/player/Lightbox'
import { About } from './components/sections/About'
import { Contact } from './components/sections/Contact'
import { DesignCanvas } from './components/sections/DesignCanvas'
import { EditBay } from './components/sections/EditBay'
import { Experience } from './components/sections/Experience'
import { Hero } from './components/sections/Hero'
import { Marquee } from './components/sections/Marquee'
import { Process } from './components/sections/Process'
import { Toolkit } from './components/sections/Toolkit'

const INTRO_KEY = 'rkp:intro-seen'

function shouldSkipIntro() {
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true
    return sessionStorage.getItem(INTRO_KEY) === '1'
  } catch {
    return false
  }
}

export default function App() {
  const [introDone, setIntroDone] = useState(shouldSkipIntro)
  const [showIntro] = useState(() => !shouldSkipIntro())

  const handleReveal = useCallback(() => {
    setIntroDone(true)
    try {
      sessionStorage.setItem(INTRO_KEY, '1')
    } catch {
      /* private mode — the intro will simply play again next time */
    }
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <ReactLenis root options={{ lerp: 0.11, wheelMultiplier: 0.95, anchors: true }}>
        <IntroContext.Provider value={introDone}>
          <PlayerProvider>
            {showIntro && <Preloader onReveal={handleReveal} />}
            <a
              href="#work"
              className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[110] focus:rounded-full focus:bg-bone focus:px-4 focus:py-2 focus:text-ink-950"
            >
              Skip to work
            </a>
            <ScrollProgress />
            <Nav />
            <main>
              <Hero />
              <Marquee />
              <About />
              <EditBay />
              <Process />
              <DesignCanvas />
              <Toolkit />
              <Experience />
              <Contact />
            </main>
            <Footer />
            <Lightbox />
            <CursorLabel />
            <Grain />
          </PlayerProvider>
        </IntroContext.Provider>
      </ReactLenis>
    </MotionConfig>
  )
}
