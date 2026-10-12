import { useEffect, useRef, useState } from 'react'
import { PlayIcon } from '@phosphor-icons/react'
import { videos } from '../../data/content'
import { usePlayer } from '../../context/player'
import { useCanHover } from '../../hooks/useMediaQuery'
import { cn, formatDuration, saveData, spokenDuration } from '../../lib/utils'
import { Reveal, Wipe } from '../ui/Reveal'

/*
  Poster first, preview on intent: on desktop the silent preview loop plays while hovered;
  on touch screens it plays while the card is on screen. Nothing downloads until then.
*/
export function VideoCard({ video, className, delay = 0, compact = false }) {
  const index = videos.findIndex((v) => v.id === video.id)
  const { open, isOpen } = usePlayer()
  const canHover = useCanHover()
  const frameRef = useRef(null)
  const previewRef = useRef(null)
  const [hovered, setHovered] = useState(false)
  const [onScreen, setOnScreen] = useState(false)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (canHover || saveData()) return
    const el = frameRef.current
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), { threshold: 0.6 })
    io.observe(el)
    return () => io.disconnect()
  }, [canHover])

  const active = !isOpen && (canHover ? hovered : onScreen)

  useEffect(() => {
    const v = previewRef.current
    if (!v) return
    if (active) v.play().catch(() => {})
    else v.pause()
  }, [active])

  return (
    <Reveal as="article" delay={delay} className={cn('group', className)}>
      <Wipe delay={delay}>
        <button
          ref={frameRef}
          type="button"
          data-video-frame={video.id}
          data-cursor="Play"
          onClick={(e) => open(index, { origin: e.currentTarget })}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          onFocus={() => setHovered(true)}
          onBlur={() => setHovered(false)}
          aria-label={`Play ${video.title}, ${spokenDuration(video.duration)}`}
          className="relative block w-full overflow-hidden rounded-[18px] bg-ink-800"
          style={{ aspectRatio: `${video.width} / ${video.height}` }}
        >
          <img
            src={video.poster}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 size-full object-cover transition-transform duration-[1.4s] ease-expo group-hover:scale-[1.04]"
          />
          <video
            ref={previewRef}
            src={video.preview}
            muted
            loop
            playsInline
            preload="none"
            onPlaying={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            className={cn(
              'absolute inset-0 size-full object-cover transition-opacity duration-500',
              playing ? 'opacity-100' : 'opacity-0',
            )}
          />
          <span className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink-950/70 via-transparent to-ink-950/20" />
          <span className="absolute top-3.5 left-3.5 rounded-full bg-ink-950/60 px-2.5 py-1 font-mono text-[10.5px] tracking-[0.08em] text-bone/90 backdrop-blur-md">
            {video.format}
          </span>
          <span className="absolute right-3.5 bottom-3.5 flex items-center gap-2 font-mono text-[11px] text-bone/90">
            <span className="grid size-9 place-items-center rounded-full bg-bone text-ink-950 transition-transform duration-500 ease-expo group-hover:scale-110">
              <PlayIcon size={13} weight="fill" />
            </span>
          </span>
          <span className="absolute bottom-4.5 left-4 font-mono text-[11px] tracking-[0.06em] text-bone/85 tabular-nums">
            {formatDuration(video.duration)}
          </span>
        </button>
      </Wipe>

      <div className="mt-5">
        <p className="eyebrow text-fog">{video.kicker}</p>
        <h3 className="mt-3 text-[1.25rem] leading-snug font-medium tracking-[-0.015em] text-bone">{video.title}</h3>
        <p
          className={cn(
            'mt-2.5 text-[15px] leading-relaxed text-mist',
            compact && 'line-clamp-4 text-[14px] sm:line-clamp-none sm:text-[15px]',
          )}
        >
          {video.summary}
        </p>
        <ul className={cn('mt-4 flex-wrap gap-1.5', compact ? 'hidden sm:flex' : 'flex')}>
          {video.tags.map((t) => (
            <li key={t} className="rounded-full bg-white/[0.05] px-2.5 py-1 text-[12px] text-mist">
              {t}
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  )
}
