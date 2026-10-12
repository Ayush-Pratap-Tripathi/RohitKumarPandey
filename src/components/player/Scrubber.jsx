import { motion, useTransform } from 'motion/react'
import { useRef, useState } from 'react'
import { clamp, cn, formatDuration, formatTimecode } from '../../lib/utils'

const chapterAt = (chapters, t) => chapters?.findLast((c) => c.t <= t) ?? null

/*
  Seek bar. Chapters split the track into segments (like markers on an NLE timeline);
  hovering previews the scene thumbnail and exact timecode.
*/
export function Scrubber({ videoRef, duration, current, progress, buffered, chapters, fps }) {
  const trackRef = useRef(null)
  const [hover, setHover] = useState(null)
  const [dragging, setDragging] = useState(false)
  const thumbLeft = useTransform(progress, (p) => `${p * 100}%`)

  const measure = (clientX) => {
    const r = trackRef.current.getBoundingClientRect()
    const p = clamp((clientX - r.left) / r.width, 0, 1)
    return { p, x: p * r.width, width: r.width }
  }

  const seek = (p) => {
    const v = videoRef.current
    if (!v || !duration) return
    v.currentTime = p * duration
    progress.set(p)
  }

  const onPointerDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    setDragging(true)
    const m = measure(e.clientX)
    setHover(m)
    seek(m.p)
  }
  const onPointerMove = (e) => {
    const m = measure(e.clientX)
    if (e.pointerType === 'mouse' || dragging) setHover(m)
    if (dragging) seek(m.p)
  }
  const onPointerUp = (e) => {
    setDragging(false)
    if (e.pointerType !== 'mouse') setHover(null)
  }

  const onKeyDown = (e) => {
    const v = videoRef.current
    if (!v || !duration) return
    const step = e.shiftKey ? 10 : 5
    const keys = {
      ArrowRight: v.currentTime + step,
      ArrowUp: v.currentTime + step,
      ArrowLeft: v.currentTime - step,
      ArrowDown: v.currentTime - step,
      Home: 0,
      End: duration - 0.1,
    }
    if (!(e.key in keys)) return
    e.preventDefault()
    v.currentTime = clamp(keys[e.key], 0, duration)
  }

  const hoverTime = hover ? hover.p * duration : 0
  const hoverChapter = hover ? chapterAt(chapters, hoverTime) : null
  const tipWidth = hoverChapter?.thumb ? 168 : 120
  const tipLeft = hover ? clamp(hover.x, tipWidth / 2, hover.width - tipWidth / 2) : 0

  // Segment boundaries: [0, c1, c2, …, duration]
  const marks = chapters?.length ? chapters.map((c) => c.t).filter((t) => t > 0 && t < duration) : []

  return (
    <div
      ref={trackRef}
      role="slider"
      tabIndex={0}
      aria-label="Seek"
      aria-valuemin={0}
      aria-valuemax={Math.round(duration) || 0}
      aria-valuenow={Math.round(current)}
      aria-valuetext={`${formatDuration(current)} of ${formatDuration(duration)}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onPointerLeave={() => !dragging && setHover(null)}
      onKeyDown={onKeyDown}
      className="group/seek relative flex h-7 cursor-pointer touch-none items-center outline-offset-4"
    >
      <div
        className={cn(
          'relative h-[3px] w-full overflow-hidden rounded-full bg-white/[0.14] transition-[height] duration-200',
          (hover || dragging) && 'h-[6px]',
        )}
      >
        <div className="absolute inset-y-0 left-0 bg-white/20" style={{ width: `${buffered * 100}%` }} />
        <motion.div className="absolute inset-0 origin-left bg-lilac-300" style={{ scaleX: progress }} />
        {marks.map((t) => (
          <span
            key={t}
            className="absolute inset-y-0 w-[3px] -translate-x-1/2 bg-ink-950"
            style={{ left: `${(t / duration) * 100}%` }}
          />
        ))}
      </div>

      <motion.span
        aria-hidden="true"
        style={{ left: thumbLeft }}
        className={cn(
          'absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lilac-100 shadow-[0_0_0_4px_rgb(198_194_241_/_0.25)] transition-opacity',
          hover || dragging ? 'opacity-100' : 'opacity-0 group-focus-visible/seek:opacity-100',
        )}
      />

      {hover && duration > 0 && (
        <div
          className="pointer-events-none absolute bottom-full mb-3 -translate-x-1/2 overflow-hidden rounded-[10px] border border-white/10 bg-ink-900/95 shadow-2xl backdrop-blur-md"
          style={{ left: tipLeft, width: tipWidth }}
        >
          {hoverChapter?.thumb && <img src={hoverChapter.thumb} alt="" className="aspect-video w-full object-cover" />}
          <div className="px-2.5 py-2">
            {hoverChapter && <p className="truncate text-[12px] font-medium text-bone">{hoverChapter.title}</p>}
            <p className="font-mono text-[10.5px] text-mist tabular-nums">{formatTimecode(hoverTime, fps)}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export { chapterAt }
