import { useEffect } from 'react'
import { saveData } from '../lib/utils'

// Plays a muted preview <video> only while it is meaningfully on screen,
// and pauses it whenever `enabled` is false (e.g. the player overlay is open).
export function useInViewPlayback(videoRef, { enabled = true, threshold = 0.35 } = {}) {
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (!enabled || saveData()) {
      video.pause()
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {})
        else video.pause()
      },
      { threshold },
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [videoRef, enabled, threshold])
}
