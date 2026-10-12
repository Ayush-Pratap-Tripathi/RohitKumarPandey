import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { videos } from '../data/content'
import { pickSource } from '../lib/utils'

const PlayerContext = createContext(null)

export function usePlayer() {
  const ctx = useContext(PlayerContext)
  if (!ctx) throw new Error('usePlayer must be used inside <PlayerProvider>')
  return ctx
}

/*
  The player's <video> element is mounted once and never unmounted. Opening a film
  sets its src and calls play() synchronously inside the click handler, which keeps
  the user gesture intact so browsers allow playback with sound.
*/
export function PlayerProvider({ children }) {
  const videoRef = useRef(null)
  const indexRef = useRef(0)
  const originElRef = useRef(null)
  const returnFocusRef = useRef(null)
  const [state, setState] = useState({ isOpen: false, index: 0, originRect: null, token: 0 })
  const [mutedFallback, setMutedFallback] = useState(false)

  const load = useCallback((index, startAt = 0) => {
    const video = videoRef.current
    if (!video) return
    const src = pickSource(videos[index])

    if (video.dataset.src !== src) {
      video.dataset.src = src
      video.src = src
    }

    const seek = () => {
      try {
        video.currentTime = startAt
      } catch {
        /* metadata not ready — handled by the listener below */
      }
    }
    if (video.readyState >= 1) seek()
    else video.addEventListener('loadedmetadata', seek, { once: true })

    video.muted = false
    setMutedFallback(false)
    video.play()?.catch(() => {
      // Browser refused unmuted playback — start muted and offer an unmute button.
      video.muted = true
      setMutedFallback(true)
      video.play()?.catch(() => {})
    })
  }, [])

  const open = useCallback(
    (index, { startAt = 0, origin } = {}) => {
      returnFocusRef.current = document.activeElement
      indexRef.current = index
      originElRef.current = origin ?? null
      const originRect = origin?.getBoundingClientRect?.() ?? null
      setState((s) => ({ isOpen: true, index, originRect, token: s.token + 1 }))
      load(index, startAt)
    },
    [load],
  )

  const go = useCallback(
    (direction) => {
      const index = (indexRef.current + direction + videos.length) % videos.length
      indexRef.current = index
      originElRef.current = null
      setState((s) => ({ ...s, index, originRect: null }))
      load(index, 0)
    },
    [load],
  )

  const close = useCallback(() => {
    videoRef.current?.pause()
    setState((s) => ({ ...s, isOpen: false }))
  }, [])

  const value = useMemo(
    () => ({ ...state, open, go, close, videoRef, originElRef, returnFocusRef, mutedFallback, setMutedFallback }),
    [state, open, go, close, mutedFallback],
  )

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
}
