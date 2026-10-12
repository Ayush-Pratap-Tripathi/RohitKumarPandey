import { useEffect } from 'react'
import { useLenis } from 'lenis/react'

// Overlays (intro, menu, player) can overlap, so locks are counted.
let locks = 0

export function useScrollLock(active) {
  const lenis = useLenis()

  useEffect(() => {
    if (!active) return
    locks += 1
    document.documentElement.classList.add('is-locked')
    lenis?.stop()

    return () => {
      locks -= 1
      if (locks === 0) {
        document.documentElement.classList.remove('is-locked')
        lenis?.start()
      }
    }
  }, [active, lenis])
}
