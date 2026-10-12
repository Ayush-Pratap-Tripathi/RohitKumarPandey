import { useEffect, useRef } from 'react'
import { formatTimecode } from '../../lib/utils'

// A free-running SMPTE timecode. Writes straight to the DOM so it never re-renders React,
// and parks itself while off screen.
export function RunningTimecode({ fps = 25, running = true, className }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !running) return
    let raf = 0
    let visible = true
    const start = performance.now()

    const tick = (now) => {
      el.textContent = formatTimecode((now - start) / 1000, fps)
      raf = visible ? requestAnimationFrame(tick) : 0
    }
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible && !raf) raf = requestAnimationFrame(tick)
    })
    io.observe(el)
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
    }
  }, [fps, running])

  return (
    <span ref={ref} className={className}>
      00:00:00:00
    </span>
  )
}
