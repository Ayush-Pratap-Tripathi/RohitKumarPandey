import { useEffect, useRef, useState } from 'react'
import { CaretLeftIcon, CaretRightIcon, PlayIcon } from '@phosphor-icons/react'
import { videos } from '../../data/content'
import { usePlayer } from '../../context/player'
import { useInViewPlayback } from '../../hooks/useInViewPlayback'
import { cn, formatDuration, spokenDuration } from '../../lib/utils'
import { Reveal, Wipe } from '../ui/Reveal'
import { RevealText } from '../ui/RevealText'

const film = videos[0]

export function FeaturedFilm() {
  const { open, isOpen } = usePlayer()
  const previewRef = useRef(null)
  const [previewing, setPreviewing] = useState(false)
  useInViewPlayback(previewRef, { enabled: !isOpen, threshold: 0.45 })

  const facts = [
    { label: 'Format', value: `${film.format} · ${film.resolution}` },
    { label: 'Runtime', value: formatDuration(film.duration) },
    { label: 'Scenes', value: `${film.chapters.length} beats` },
    { label: 'Role', value: film.role.join(' · ') },
  ]

  return (
    <div className="mt-16 sm:mt-24">
      <div className="grid gap-x-12 gap-y-10 lg:grid-cols-12">
        <Wipe direction="left" className="lg:col-span-8" duration={1.3}>
          <button
            type="button"
            data-video-frame={film.id}
            data-cursor="Play film"
            onClick={(e) => open(0, { origin: e.currentTarget })}
            aria-label={`Play ${film.title}, ${spokenDuration(film.duration)}`}
            className="group relative block aspect-video w-full overflow-hidden rounded-[22px] bg-ink-800"
          >
            <img
              src={film.poster}
              srcSet={`${film.posterSmall} 900w, ${film.poster} 1600w`}
              sizes="(min-width: 1024px) 64vw, 100vw"
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute inset-0 size-full object-cover"
            />
            <video
              ref={previewRef}
              src={film.preview}
              muted
              loop
              playsInline
              preload="none"
              onPlaying={() => setPreviewing(true)}
              onPause={() => setPreviewing(false)}
              className={cn(
                'absolute inset-0 size-full object-cover transition-[opacity,scale] duration-[1.2s] ease-expo group-hover:scale-[1.025]',
                previewing ? 'opacity-100' : 'opacity-0',
              )}
            />
            <span className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink-950/80 via-ink-950/5 to-ink-950/25" />

            <span className="absolute top-4 left-4 flex items-center gap-2 sm:top-5 sm:left-5">
              <span className="rounded-full bg-bone px-2.5 py-1 text-[11px] font-semibold tracking-wide text-ink-950 uppercase">
                Featured
              </span>
              <span className="rounded-full bg-ink-950/55 px-2.5 py-1 font-mono text-[10.5px] text-bone/90 backdrop-blur-md">
                {film.format} · {film.resolution}
              </span>
            </span>
            <span className="absolute top-4 right-4 hidden items-center gap-2 font-mono text-[10.5px] tracking-[0.12em] text-bone/80 sm:top-5 sm:right-5 sm:flex">
              <span className={cn('size-1.5 rounded-full bg-rec', previewing && 'animate-rec')} /> PREVIEW
            </span>

            <span className="absolute right-4 bottom-4 left-4 flex items-end justify-between gap-4 sm:right-6 sm:bottom-6 sm:left-6">
              <span className="flex items-center gap-3.5">
                <span className="grid size-12 place-items-center rounded-full bg-bone text-ink-950 transition-transform duration-500 ease-expo group-hover:scale-110 sm:size-14">
                  <PlayIcon size={18} weight="fill" />
                </span>
                <span className="text-left">
                  <span className="block text-[15px] font-medium text-bone sm:text-base">Play the film</span>
                  <span className="block font-mono text-[11px] text-bone/70">with sound · {formatDuration(film.duration)}</span>
                </span>
              </span>
            </span>
          </button>
        </Wipe>

        <div className="flex flex-col lg:col-span-4">
          <Reveal y={12}>
            <p className="eyebrow text-fog">
              <span className="text-lilac-300">01</span> — {film.kicker}
            </p>
          </Reveal>
          <RevealText
            as="h3"
            text={'Wedding Invitation\n*Film*'}
            className="mt-5 font-display text-[clamp(2.6rem,4.4vw,4rem)] leading-[0.95] tracking-[-0.015em]"
          />
          <Reveal delay={0.1}>
            <p className="mt-6 text-[16px] leading-relaxed text-bone/90">{film.summary}</p>
            <p className="mt-3 text-[15px] leading-relaxed text-mist">{film.description}</p>
          </Reveal>
          <Reveal delay={0.18} className="mt-8">
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[14px] border border-white/[0.07] bg-white/[0.07]">
              {facts.map((f) => (
                <div key={f.label} className="bg-ink-950 p-4">
                  <dt className="eyebrow text-[10px] text-fog">{f.label}</dt>
                  <dd className="mt-2 text-[14px] leading-snug text-bone">{f.value}</dd>
                </div>
              ))}
            </dl>
            <ul className="mt-5 flex flex-wrap gap-1.5">
              {film.tags.map((t) => (
                <li key={t} className="rounded-full bg-white/[0.05] px-2.5 py-1 text-[12px] text-mist">
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>

      <SceneIndex />
    </div>
  )
}

function SceneIndex() {
  const { open } = usePlayer()
  const stripRef = useRef(null)
  const [edges, setEdges] = useState({ start: true, end: false })

  useEffect(() => {
    const el = stripRef.current
    const update = () =>
      setEdges({
        start: el.scrollLeft < 8,
        end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8,
      })
    update()
    el.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      el.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  const page = (dir) => stripRef.current.scrollBy({ left: dir * stripRef.current.clientWidth * 0.8, behavior: 'smooth' })

  return (
    <Reveal className="mt-16 border-t border-white/[0.07] pt-8 sm:mt-20">
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="eyebrow text-fog">Scene index</p>
          <p className="mt-3 text-[15px] text-mist">
            {film.chapters.length} beats in {formatDuration(film.duration)} — jump straight into any of them.
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          {[
            { dir: -1, label: 'Previous scenes', disabled: edges.start, Icon: CaretLeftIcon },
            { dir: 1, label: 'Next scenes', disabled: edges.end, Icon: CaretRightIcon },
          ].map(({ dir, label, disabled, Icon }) => (
            <button
              key={dir}
              type="button"
              onClick={() => page(dir)}
              disabled={disabled}
              aria-label={label}
              className="grid size-10 place-items-center rounded-full border border-white/12 text-bone transition-colors hover:bg-white/[0.06] disabled:opacity-30"
            >
              <Icon size={16} />
            </button>
          ))}
        </div>
      </div>

      <div className="relative -mx-4 mt-6 sm:mx-0">
        <ol
          ref={stripRef}
          className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pb-2 sm:scroll-px-0 sm:px-0"
        >
          {film.chapters.map((c, i) => (
            <li key={c.t} className="w-[44%] shrink-0 snap-start sm:w-[29%] md:w-[22%] lg:w-[15.4%]">
              <button
                type="button"
                data-cursor="Jump in"
                onClick={(e) => open(0, { startAt: c.t, origin: e.currentTarget.querySelector('[data-thumb]') })}
                aria-label={`Play from ${c.title}, at ${formatDuration(c.t)}`}
                className="group/scene block w-full text-left"
              >
                <span
                  data-thumb
                  className="relative block aspect-video overflow-hidden rounded-[10px] bg-ink-800 ring-1 ring-white/[0.06]"
                >
                  <img
                    src={c.thumb}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="size-full object-cover transition-transform duration-700 ease-expo group-hover/scene:scale-[1.07]"
                  />
                  <span className="absolute bottom-1.5 left-1.5 rounded-[5px] bg-ink-950/70 px-1.5 py-0.5 font-mono text-[10px] text-bone/90 tabular-nums">
                    {formatDuration(c.t)}
                  </span>
                </span>
                <span className="mt-2.5 flex items-baseline gap-2">
                  <span className="font-mono text-[10.5px] text-fog">{String(i + 1).padStart(2, '0')}</span>
                  <span className="truncate text-[13.5px] text-bone/85 transition-colors group-hover/scene:text-lilac-200">
                    {c.title}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ol>
        <div
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-y-0 right-0 w-20 bg-linear-to-l from-ink-950 to-transparent transition-opacity duration-300',
            edges.end ? 'opacity-0' : 'opacity-100',
          )}
        />
      </div>
    </Reveal>
  )
}
