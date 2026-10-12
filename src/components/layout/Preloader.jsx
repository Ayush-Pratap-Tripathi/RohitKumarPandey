import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useScrollLock } from '../../hooks/useScrollLock'
import { ease } from '../../lib/utils'

const STEP = 430 // ms per count

/*
  An SMPTE-style film leader: 3 — 2 — 1, then the frame splits like a shutter
  and the page plays. Click or press any key to skip.
*/
export function Preloader({ onReveal, onDone }) {
  const [count, setCount] = useState(3)
  const [phase, setPhase] = useState('count') // count → exit → done
  const revealed = useRef(false)
  useScrollLock(phase === 'count')

  const reveal = useCallback(() => {
    if (revealed.current) return
    revealed.current = true
    setPhase('exit')
    onReveal()
  }, [onReveal])

  useEffect(() => {
    const timers = [setTimeout(() => setCount(2), STEP), setTimeout(() => setCount(1), STEP * 2), setTimeout(reveal, STEP * 3)]
    const skip = () => reveal()
    window.addEventListener('keydown', skip)
    return () => {
      timers.forEach(clearTimeout)
      window.removeEventListener('keydown', skip)
    }
  }, [reveal])

  useEffect(() => {
    if (phase !== 'exit') return
    const t = setTimeout(() => {
      setPhase('done')
      onDone?.()
    }, 1100)
    return () => clearTimeout(t)
  }, [phase, onDone])

  if (phase === 'done') return null
  const exiting = phase === 'exit'

  return (
    <div className="fixed inset-0 z-[100]" onClick={reveal} aria-hidden="true">
      <motion.div
        className="absolute inset-x-0 top-0 h-1/2 bg-ink-950"
        animate={{ y: exiting ? '-100%' : '0%' }}
        transition={{ duration: 1, ease: ease.cine }}
      />
      <motion.div
        className="absolute inset-x-0 bottom-0 h-1/2 bg-ink-950"
        animate={{ y: exiting ? '100%' : '0%' }}
        transition={{ duration: 1, ease: ease.cine }}
      />

      <motion.div
        className="absolute inset-0 grid place-items-center"
        animate={exiting ? { opacity: 0, scale: 0.94 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: ease.soft }}
      >
        <div className="relative aspect-square w-[min(64vmin,340px)]">
          <div className="leader-sweep absolute inset-[6%] rounded-full" />
          <svg viewBox="0 0 100 100" className="absolute inset-0 size-full text-white/25">
            <circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" strokeWidth="0.4" />
            <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.4" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="0.25" />
            <line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" strokeWidth="0.25" />
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={count}
                className="font-display text-[clamp(6rem,24vmin,9.5rem)] leading-none text-bone"
                initial={{ opacity: 0, scale: 1.18 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.22, ease: ease.soft }}
              >
                {count}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        <div className="eyebrow pointer-events-none absolute inset-x-5 top-6 flex justify-between text-fog sm:inset-x-8 sm:top-8">
          <span>Rohit Kumar Pandey</span>
          <span>Reel — 2026</span>
        </div>
        <div className="eyebrow pointer-events-none absolute inset-x-5 bottom-6 flex justify-between text-fog sm:inset-x-8 sm:bottom-8">
          <span>Picture start</span>
          <span className="hidden sm:inline">Click to skip</span>
        </div>
      </motion.div>
    </div>
  )
}
