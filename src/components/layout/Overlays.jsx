import { AnimatePresence, motion, useMotionValue, useScroll, useSpring } from 'motion/react'
import { useEffect, useState } from 'react'
import { PlayIcon } from '@phosphor-icons/react'
import { usePlayer } from '../../context/player'
import { useCanHover } from '../../hooks/useMediaQuery'

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 })
  return (
    <motion.div aria-hidden="true" className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-lilac-300" style={{ scaleX }} />
  )
}

// Keeps the native cursor; adds a label chip ("Play", "Jump in") over media.
export function CursorLabel() {
  const canHover = useCanHover()
  const { isOpen } = usePlayer()
  const x = useMotionValue(-200)
  const y = useMotionValue(-200)
  const sx = useSpring(x, { stiffness: 520, damping: 40, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 520, damping: 40, mass: 0.4 })
  const [label, setLabel] = useState(null)

  useEffect(() => {
    if (!canHover) return
    const onMove = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
      const target = e.target instanceof Element ? e.target.closest('[data-cursor]') : null
      setLabel(target ? target.getAttribute('data-cursor') : null)
    }
    const onLeave = () => setLabel(null)
    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [canHover, x, y])

  if (!canHover) return null

  return (
    <motion.div aria-hidden="true" className="pointer-events-none fixed top-0 left-0 z-[90]" style={{ x: sx, y: sy }}>
      <AnimatePresence>
        {label && !isOpen && (
          <motion.span
            key="label"
            className="absolute top-5 left-5 flex items-center gap-1.5 rounded-full bg-lilac-300 px-3.5 py-2 text-[13px] font-medium whitespace-nowrap text-ink-950 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)]"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            <PlayIcon size={12} weight="fill" />
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function Grain() {
  return <div aria-hidden="true" className="grain pointer-events-none fixed inset-0 z-[55] overflow-hidden opacity-[0.045]" />
}
