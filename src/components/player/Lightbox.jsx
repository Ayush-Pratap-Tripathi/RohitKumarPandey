import { AnimatePresence, motion, useAnimate, useMotionValue, useReducedMotion } from 'motion/react'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  ArrowCounterClockwiseIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CornersInIcon,
  CornersOutIcon,
  PauseIcon,
  PlayIcon,
  SpeakerHighIcon,
  SpeakerSlashIcon,
  XIcon,
} from '@phosphor-icons/react'
import { videos } from '../../data/content'
import { usePlayer } from '../../context/player'
import { useScrollLock } from '../../hooks/useScrollLock'
import { clamp, cn, ease, formatTimecode } from '../../lib/utils'
import { Button } from '../ui/Button'
import { Scrubber, chapterAt } from './Scrubber'

function useViewport() {
  const [size, setSize] = useState(() => ({ width: window.innerWidth, height: window.innerHeight }))
  useEffect(() => {
    const onResize = () => setSize({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return size
}

// Largest frame of the film's aspect ratio that fits between the header and the transport bar.
function fitFrame(ratio, { width, height }) {
  const compact = width < 640
  const maxW = Math.max(200, width - (compact ? 32 : 96))
  const maxH = Math.max(180, height - (compact ? 200 : 216))
  let w = maxW
  let h = w / ratio
  if (h > maxH) {
    h = maxH
    w = h * ratio
  }
  return { width: Math.round(w), height: Math.round(h) }
}

// Prefer the exact thumbnail that opened the film; otherwise any on-screen frame of it.
function findReturnRect(id, originEl) {
  const vh = window.innerHeight
  const candidates = [originEl, ...document.querySelectorAll(`[data-video-frame="${id}"]`)].filter(Boolean)
  for (const el of candidates) {
    const r = el.getBoundingClientRect()
    if (r.width > 0 && r.bottom > 0 && r.top < vh) return r
  }
  return null
}

const IconButton = ({ ref, label, className, children, ...props }) => (
  <button
    ref={ref}
    type="button"
    aria-label={label}
    title={label}
    className={cn(
      'grid size-10 shrink-0 place-items-center rounded-full text-bone/85 transition-colors hover:bg-white/10 hover:text-bone',
      className,
    )}
    {...props}
  >
    {children}
  </button>
)

export function Lightbox() {
  const { isOpen, index, originRect, token, close, go, videoRef, originElRef, returnFocusRef, mutedFallback, setMutedFallback } =
    usePlayer()

  const item = videos[index]
  const next = videos[(index + 1) % videos.length]
  const reduce = useReducedMotion()
  const viewport = useViewport()
  const frame = fitFrame(item.width / item.height, viewport)

  const [frameScope, animateFrame] = useAnimate()
  const dialogRef = useRef(null)
  const slotRef = useRef(null)
  const closeRef = useRef(null)
  const timecodeRef = useRef(null)
  const closingRef = useRef(false)
  const shownIndexRef = useRef(index)

  const [visible, setVisible] = useState(false)
  const [chrome, setChrome] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [ended, setEnded] = useState(false)
  const [waiting, setWaiting] = useState(false)
  const [muted, setMuted] = useState(false)
  const [hasFrame, setHasFrame] = useState(false)
  const [duration, setDuration] = useState(item.duration)
  const [current, setCurrent] = useState(0)
  const [buffered, setBuffered] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)
  const progress = useMotionValue(0)

  useScrollLock(isOpen)

  // ── Media element events ──────────────────────────────────────────────
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const sync = () => {
      setPlaying(!v.paused && !v.ended)
      setMuted(v.muted)
    }
    const onBuffer = () => {
      let end = 0
      for (let i = 0; i < v.buffered.length; i++) {
        if (v.buffered.start(i) <= v.currentTime + 0.5) end = Math.max(end, v.buffered.end(i))
      }
      setBuffered(v.duration ? end / v.duration : 0)
    }
    const handlers = {
      play: sync,
      pause: sync,
      volumechange: sync,
      timeupdate: () => {
        setCurrent(v.currentTime)
        onBuffer()
      },
      progress: onBuffer,
      loadedmetadata: () => setDuration(v.duration || 0),
      durationchange: () => setDuration(v.duration || 0),
      loadstart: () => {
        setHasFrame(false)
        setEnded(false)
        setBuffered(0)
        setCurrent(0)
      },
      loadeddata: () => setHasFrame(true),
      waiting: () => setWaiting(true),
      canplay: () => setWaiting(false),
      playing: () => {
        setWaiting(false)
        setEnded(false)
        setHasFrame(true)
        sync()
      },
      ended: () => {
        setEnded(true)
        sync()
      },
    }
    Object.entries(handlers).forEach(([event, fn]) => v.addEventListener(event, fn))
    return () => Object.entries(handlers).forEach(([event, fn]) => v.removeEventListener(event, fn))
  }, [videoRef])

  // Frame-accurate timecode + progress while open (written to the DOM, not React state)
  useEffect(() => {
    if (!isOpen) return
    let raf = 0
    const tick = () => {
      const v = videoRef.current
      if (v && v.duration) {
        progress.set(v.currentTime / v.duration)
        if (timecodeRef.current) timecodeRef.current.textContent = formatTimecode(v.currentTime, item.fps)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [isOpen, item.fps, progress, videoRef])

  useEffect(() => {
    const onChange = () => setFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  // ── Open: FLIP from the thumbnail that was clicked ────────────────────
  useLayoutEffect(() => {
    if (!isOpen) return
    closingRef.current = false
    shownIndexRef.current = index
    setVisible(true)
    setChrome(true)

    const el = frameScope.current
    const rest = slotRef.current?.getBoundingClientRect()
    if (originRect && rest?.width && !reduce) {
      const dx = originRect.left + originRect.width / 2 - (rest.left + rest.width / 2)
      const dy = originRect.top + originRect.height / 2 - (rest.top + rest.height / 2)
      const s = originRect.width / rest.width
      el.style.transform = `translateX(${dx}px) translateY(${dy}px) scale(${s})`
      animateFrame(el, { x: [dx, 0], y: [dy, 0], scale: [s, 1], opacity: 1 }, { duration: 0.85, ease: ease.expo })
    } else {
      animateFrame(el, { x: 0, y: 0, opacity: [0, 1], scale: [0.96, 1] }, { duration: 0.5, ease: ease.expo })
    }
    requestAnimationFrame(() => closeRef.current?.focus({ preventScroll: true }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  // Switching films inside the player: a quick dip to black.
  useEffect(() => {
    if (!isOpen || shownIndexRef.current === index) return
    shownIndexRef.current = index
    animateFrame(frameScope.current, { opacity: [0, 1] }, { duration: 0.55, ease: ease.soft })
  }, [index, isOpen, animateFrame, frameScope])

  // ── Close: fly back to the thumbnail if it is on screen ────────────────
  const requestClose = useCallback(async () => {
    if (closingRef.current || !isOpen) return
    closingRef.current = true
    videoRef.current?.pause()
    if (document.fullscreenElement) await document.exitFullscreen().catch(() => {})
    setChrome(false)

    const el = frameScope.current
    const rest = slotRef.current.getBoundingClientRect()
    const target = reduce ? null : findReturnRect(item.id, originElRef.current)

    if (target) {
      await animateFrame(
        el,
        {
          x: target.left + target.width / 2 - (rest.left + rest.width / 2),
          y: target.top + target.height / 2 - (rest.top + rest.height / 2),
          scale: target.width / rest.width,
        },
        { duration: 0.7, ease: ease.expo },
      )
    } else {
      await animateFrame(el, { opacity: 0, scale: 0.95 }, { duration: 0.3, ease: ease.soft })
    }

    close()
    setVisible(false)
    animateFrame(el, { x: 0, y: 0, scale: 1, opacity: 1 }, { duration: 0 })
    setMutedFallback(false)
    const back = returnFocusRef.current
    if (back && document.contains(back)) back.focus({ preventScroll: true })
  }, [isOpen, item.id, reduce, close, animateFrame, frameScope, videoRef, originElRef, returnFocusRef, setMutedFallback])

  // ── Transport ─────────────────────────────────────────────────────────
  const togglePlay = useCallback(() => {
    const v = videoRef.current
    if (!v) return
    if (v.ended) v.currentTime = 0
    if (v.paused || v.ended) v.play()?.catch(() => {})
    else v.pause()
  }, [videoRef])

  const seekBy = useCallback(
    (seconds) => {
      const v = videoRef.current
      if (!v?.duration) return
      v.currentTime = clamp(v.currentTime + seconds, 0, v.duration)
    },
    [videoRef],
  )

  const stepFrame = useCallback(
    (frames) => {
      const v = videoRef.current
      if (!v?.duration) return
      v.pause()
      v.currentTime = clamp(v.currentTime + frames / item.fps, 0, v.duration)
    },
    [videoRef, item.fps],
  )

  const toggleMute = useCallback(() => {
    const v = videoRef.current
    if (!v) return
    v.muted = !v.muted
    setMutedFallback(false)
  }, [videoRef, setMutedFallback])

  const toggleFullscreen = useCallback(() => {
    const v = videoRef.current
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {})
    else if (dialogRef.current?.requestFullscreen) dialogRef.current.requestFullscreen().catch(() => {})
    else v?.webkitEnterFullscreen?.()
  }, [videoRef])

  // Editor-style shortcuts: Space/K, J/L, ←/→, ,/. for frames, M, F, N/P, Esc
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const onButton = e.target.tagName === 'BUTTON'
      const onSlider = e.target.getAttribute?.('role') === 'slider'
      switch (e.key) {
        case 'Escape':
          e.preventDefault()
          requestClose()
          break
        case ' ':
          if (onButton) return
          e.preventDefault()
          togglePlay()
          break
        case 'k':
        case 'K':
          togglePlay()
          break
        case 'ArrowLeft':
          if (onSlider) return
          e.preventDefault()
          seekBy(-5)
          break
        case 'ArrowRight':
          if (onSlider) return
          e.preventDefault()
          seekBy(5)
          break
        case 'j':
        case 'J':
          seekBy(-10)
          break
        case 'l':
        case 'L':
          seekBy(10)
          break
        case ',':
          stepFrame(-1)
          break
        case '.':
          stepFrame(1)
          break
        case 'm':
        case 'M':
          toggleMute()
          break
        case 'f':
        case 'F':
          toggleFullscreen()
          break
        case 'n':
        case 'N':
          go(1)
          break
        case 'p':
        case 'P':
          go(-1)
          break
        case 'Tab': {
          const nodes = dialogRef.current?.querySelectorAll('button:not([disabled]), [href], [tabindex="0"]')
          if (!nodes?.length) return
          const first = nodes[0]
          const last = nodes[nodes.length - 1]
          if (!dialogRef.current.contains(document.activeElement)) {
            e.preventDefault()
            first.focus()
          } else if (e.shiftKey && document.activeElement === first) {
            e.preventDefault()
            last.focus()
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault()
            first.focus()
          }
          break
        }
        default:
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, requestClose, togglePlay, seekBy, stepFrame, toggleMute, toggleFullscreen, go])

  const chapter = chapterAt(item.chapters, current)
  const showPausedCue = hasFrame && !playing && !ended && !waiting

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${item.title} — video player`}
      aria-hidden={!visible}
      className="fixed inset-0 z-[80] bg-transparent"
      style={{ visibility: visible ? 'visible' : 'hidden' }}
      data-lenis-prevent
    >
      <motion.div
        className="absolute inset-0 bg-ink-950/[0.94] backdrop-blur-xl"
        initial={false}
        animate={{ opacity: chrome ? 1 : 0 }}
        transition={{ duration: chrome ? 0.5 : 0.45, ease: ease.soft }}
        onClick={requestClose}
      />

      <div className="pointer-events-none relative flex h-full flex-col">
        <motion.header
          className="page-x pointer-events-auto flex h-16 shrink-0 items-center justify-between gap-4 sm:h-[76px]"
          initial={false}
          animate={{ opacity: chrome ? 1 : 0, y: chrome ? 0 : -12 }}
          transition={{ duration: 0.5, ease: ease.expo, delay: chrome ? 0.2 : 0 }}
        >
          <div className="flex min-w-0 items-baseline gap-3 sm:gap-4">
            <span className="shrink-0 font-mono text-xs text-fog tabular-nums">
              {String(index + 1).padStart(2, '0')} / {String(videos.length).padStart(2, '0')}
            </span>
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={item.id}
                className="truncate text-[15px] font-medium text-bone"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
              >
                {item.title}
              </motion.p>
            </AnimatePresence>
            <span className="hidden shrink-0 rounded-full border border-white/10 px-2 py-0.5 font-mono text-[10.5px] text-mist sm:inline">
              {item.format}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <IconButton label="Previous film (P)" onClick={() => go(-1)}>
              <ArrowLeftIcon size={18} />
            </IconButton>
            <IconButton label="Next film (N)" onClick={() => go(1)}>
              <ArrowRightIcon size={18} />
            </IconButton>
            <IconButton ref={closeRef} label="Close player (Esc)" onClick={requestClose} className="ml-1 border border-white/15">
              <XIcon size={18} />
            </IconButton>
          </div>
        </motion.header>

        <div className="flex min-h-0 flex-1 items-center justify-center px-4 sm:px-12">
          <div ref={slotRef} className="relative" style={{ width: frame.width, height: frame.height }}>
            <motion.div
              ref={frameScope}
              className="pointer-events-auto absolute inset-0 origin-center overflow-hidden rounded-[14px] bg-black shadow-[0_40px_120px_-30px_rgba(0,0,0,0.8)]"
            >
              <video
                ref={videoRef}
                playsInline
                preload="auto"
                onClick={togglePlay}
                onDoubleClick={toggleFullscreen}
                className="absolute inset-0 size-full object-contain"
              />
              <img
                src={item.poster}
                alt=""
                className={cn(
                  'pointer-events-none absolute inset-0 size-full object-cover transition-opacity duration-300',
                  hasFrame ? 'opacity-0' : 'opacity-100',
                )}
              />

              {waiting && !ended && (
                <span className="pointer-events-none absolute inset-0 grid place-items-center">
                  <span className="size-10 animate-spin rounded-full border-2 border-white/15 border-t-lilac-300" />
                </span>
              )}

              <AnimatePresence>
                {showPausedCue && (
                  <motion.button
                    type="button"
                    onClick={togglePlay}
                    aria-label="Play"
                    className="absolute top-1/2 left-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-bone/90 text-ink-950"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.25 }}
                  >
                    <PlayIcon size={22} weight="fill" />
                  </motion.button>
                )}
              </AnimatePresence>

              {mutedFallback && muted && playing && (
                <button
                  type="button"
                  onClick={toggleMute}
                  className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-bone px-4 py-2 text-sm font-medium text-ink-950"
                >
                  <SpeakerSlashIcon size={16} weight="fill" /> Tap for sound
                </button>
              )}

              <AnimatePresence>
                {ended && (
                  <motion.div
                    className="absolute inset-0 grid place-items-center bg-ink-950/75 p-6 text-center backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="flex flex-col items-center">
                      <p className="eyebrow text-fog">Up next</p>
                      <p className="mt-3 font-display text-[clamp(1.6rem,4vw,2.6rem)] leading-tight text-bone">{next.title}</p>
                      <div className="mt-6 flex flex-wrap justify-center gap-2.5">
                        <Button
                          as="button"
                          type="button"
                          size="sm"
                          variant="secondary"
                          onClick={togglePlay}
                          iconLeft={<ArrowCounterClockwiseIcon size={15} />}
                        >
                          Replay
                        </Button>
                        <Button as="button" type="button" size="sm" onClick={() => go(1)} icon={<ArrowRightIcon size={15} />}>
                          Play next
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        <motion.footer
          className="page-x pointer-events-auto shrink-0 pt-3 pb-5 sm:pb-7"
          initial={false}
          animate={{ opacity: chrome ? 1 : 0, y: chrome ? 0 : 12 }}
          transition={{ duration: 0.5, ease: ease.expo, delay: chrome ? 0.25 : 0 }}
        >
          <Scrubber
            videoRef={videoRef}
            duration={duration}
            current={current}
            progress={progress}
            buffered={buffered}
            chapters={item.chapters}
            fps={item.fps}
          />
          <div className="mt-2 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              <IconButton label={playing ? 'Pause (K)' : 'Play (K)'} onClick={togglePlay} className="bg-white/[0.06]">
                {playing ? <PauseIcon size={18} weight="fill" /> : <PlayIcon size={18} weight="fill" />}
              </IconButton>
              <p className="font-mono text-[11.5px] whitespace-nowrap text-mist tabular-nums sm:text-[12px]">
                <span ref={timecodeRef} className="text-bone">
                  00:00:00:00
                </span>
                <span className="text-fog"> / {formatTimecode(duration, item.fps)}</span>
              </p>
              {chapter && (
                <p className="hidden truncate text-[13px] text-mist md:block">
                  <span className="text-fog">·</span> {chapter.title}
                </p>
              )}
            </div>
            <div className="flex items-center gap-1">
              <p className="mr-3 hidden font-mono text-[10.5px] tracking-wide text-fog xl:block">
                Space play · J / L ±10s · , / . frame · M mute · F full
              </p>
              <IconButton label={muted ? 'Unmute (M)' : 'Mute (M)'} onClick={toggleMute}>
                {muted ? <SpeakerSlashIcon size={18} /> : <SpeakerHighIcon size={18} />}
              </IconButton>
              <IconButton label={fullscreen ? 'Exit full screen (F)' : 'Full screen (F)'} onClick={toggleFullscreen}>
                {fullscreen ? <CornersInIcon size={18} /> : <CornersOutIcon size={18} />}
              </IconButton>
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  )
}
