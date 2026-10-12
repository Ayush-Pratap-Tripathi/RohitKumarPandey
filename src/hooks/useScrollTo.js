import { useCallback } from 'react'
import { useLenis } from 'lenis/react'

export function useScrollTo() {
  const lenis = useLenis()

  return useCallback(
    (id, options = {}) => {
      const target = id === 'top' ? 0 : document.getElementById(id)
      if (target === null) return
      if (lenis) {
        lenis.scrollTo(target, { duration: 1.5, ...options })
      } else if (target === 0) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        target.scrollIntoView({ behavior: 'smooth' })
      }
    },
    [lenis],
  )
}
