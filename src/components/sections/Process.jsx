import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from 'motion/react'
import { useMemo, useRef, useState } from 'react'
import { useLenis } from 'lenis/react'
import { pipeline } from '../../data/content'
import { cn, ease, formatTimecode } from '../../lib/utils'
import { StepVisual } from '../process/StepVisual'
import { SectionHeader } from '../ui/SectionHeader'

const SEQUENCE_LENGTH = 102 // seconds — the length of the featured film
const RULER = [0, 0.2, 0.4, 0.6, 0.8, 1]

// Deterministic waveform so it renders identically every visit.
const WAVEFORM = Array.from({ length: 120 }, (_, i) => {
  const v = Math.abs(Math.sin(i * 0.37) * 0.55 + Math.sin(i * 0.11 + 1.3) * 0.35 + Math.sin(i * 1.7) * 0.1)
  return 0.18 + v * 0.82
})

export function Process() {
  const runwayRef = useRef(null)
  const timecodeRef = useRef(null)
  const lenis = useLenis()
  const [active, setActive] = useState(0)

  const bounds = useMemo(() => {
    let acc = 0
    return pipeline.map((step) => {
      const start = acc / 100
      acc += step.span
      return { start, end: acc / 100 }
    })
  }, [])

  const { scrollYProgress } = useScroll({ target: runwayRef, offset: ['start start', 'end end'] })

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const found = bounds.findIndex((b) => p >= b.start && p < b.end)
    const next = found === -1 ? (p >= 1 ? bounds.length - 1 : 0) : found
    setActive((prev) => (prev === next ? prev : next))
    if (timecodeRef.current) timecodeRef.current.textContent = formatTimecode(p * SEQUENCE_LENGTH, 30)
  })

  const goToStep = (i) => {
    const el = runwayRef.current
    const top = window.scrollY + el.getBoundingClientRect().top
    const range = el.offsetHeight - window.innerHeight
    const y = top + (bounds[i].start + 0.015) * range
    if (lenis) lenis.scrollTo(y, { duration: 1.2 })
    else window.scrollTo({ top: y, behavior: 'smooth' })
  }

  const step = pipeline[active]

  return (
    <section id="process" aria-labelledby="process-title" className="relative pt-16 sm:pt-24">
      <div className="page-x">
        <SectionHeader
          id="process-title"
          index="03"
          label="Process"
          title={'Where AI fits\nin *the edit*'}
          intro="AI does the heavy lifting; judgement does the cutting. Scroll to scrub through the pipeline behind the films above."
        />
        <ol className="sr-only">
          {pipeline.map((s) => (
            <li key={s.id}>
              {s.title}: {s.body} {s.ai ? `AI assist: ${s.ai}` : ''}
            </li>
          ))}
        </ol>
      </div>

      <div ref={runwayRef} className="relative mt-14" style={{ height: `${pipeline.length * 55 + 100}vh` }}>
        <div className="sticky top-0 flex h-svh items-stretch pt-20 pb-5 sm:pt-24 sm:pb-8">
          <div className="page-x flex max-h-[860px] min-h-0 flex-col self-center" style={{ height: '100%' }}>
            <div
              aria-hidden="true"
              className="flex h-full min-h-0 flex-col overflow-hidden rounded-[22px] border border-white/[0.08] bg-ink-900 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.8)]"
            >
              {/* Title bar */}
              <div className="flex shrink-0 items-center justify-between border-b border-white/[0.06] px-4 py-3 sm:px-5">
                <p className="flex items-center gap-3 font-mono text-[11px] text-fog">
                  <span className="text-bone">Pipeline</span>
                  <span className="hidden sm:inline">Sequence 01 · 30 fps</span>
                </p>
                <p className="flex items-center gap-2 font-mono text-[12px] text-bone tabular-nums">
                  <span className="size-1.5 animate-rec rounded-full bg-rec" />
                  <span ref={timecodeRef}>00:00:00:00</span>
                </p>
              </div>

              {/* Program monitor */}
              <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)_auto] md:grid-cols-[1.05fr_1fr] md:grid-rows-1">
                <div className="relative order-2 flex min-h-0 flex-col border-white/[0.06] p-5 sm:p-7 md:order-1 md:border-r lg:p-9">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={step.id}
                      className="flex min-h-0 flex-1 flex-col"
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.35, ease: ease.expo }}
                    >
                      <p className="eyebrow text-fog">
                        Step <span className="text-lilac-300">{String(active + 1).padStart(2, '0')}</span> /{' '}
                        {String(pipeline.length).padStart(2, '0')}
                      </p>
                      <h3 className="mt-3 font-display text-[clamp(2.25rem,5.2vw,5.25rem)] leading-[0.95] text-bone sm:mt-4">
                        {step.title}
                      </h3>
                      <p className="mt-3 max-w-md text-[14.5px] leading-relaxed text-mist sm:mt-5 sm:text-[16px] lg:text-[17px]">
                        {step.body}
                      </p>
                      {step.ai && (
                        <div className="mt-4 flex max-w-md items-start gap-3 rounded-[12px] border border-lilac-300/20 bg-lilac-300/[0.06] p-3 sm:mt-5 sm:p-3.5">
                          <span className="mt-px shrink-0 rounded-[5px] bg-lilac-300 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-ink-950">
                            AI
                          </span>
                          <p className="text-[13.5px] leading-snug text-lilac-100 sm:text-[14px]">{step.ai}</p>
                        </div>
                      )}
                      <ul className="mt-auto hidden flex-wrap gap-1.5 pt-5 sm:flex">
                        {step.tools.map((t) => (
                          <li key={t} className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[11px] text-mist">
                            {t}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="relative order-1 min-h-[150px] overflow-hidden border-b border-white/[0.06] bg-ink-950 md:order-2 md:border-b-0">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.div
                      key={step.id}
                      className="absolute inset-0"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <StepVisual kind={step.visual} />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              <Timeline bounds={bounds} active={active} progress={scrollYProgress} onSelect={goToStep} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Timeline({ bounds, active, progress, onSelect }) {
  const playhead = useTransform(progress, (p) => `${p * 100}%`)
  const playedClip = useTransform(progress, (p) => `inset(0 ${100 - p * 100}% 0 0)`)

  return (
    <div className="shrink-0 border-t border-white/[0.06] bg-ink-950/50 px-2.5 pt-2 pb-3 sm:px-5 sm:pb-4">
      <div className="flex">
        {/* Track headers */}
        <div className="w-9 shrink-0 font-mono text-[10px] text-fog sm:w-14">
          <div className="h-6" />
          <div className="flex h-8 items-center sm:h-9">V2</div>
          <div className="flex h-10 items-center sm:h-11">V1</div>
          <div className="flex h-8 items-center sm:h-9">A1</div>
        </div>

        <div className="relative min-w-0 flex-1">
          {/* Ruler */}
          <div className="relative h-6 border-b border-white/[0.06]">
            {Array.from({ length: 21 }, (_, i) => (
              <span
                key={i}
                className={cn('absolute bottom-0 w-px bg-white/15', i % 4 === 0 ? 'h-2.5' : 'h-1.5')}
                style={{ left: `${(i / 20) * 100}%` }}
              />
            ))}
            {RULER.map((r) => (
              <span
                key={r}
                className={cn(
                  'absolute top-0 font-mono text-[9px] text-fog tabular-nums',
                  r === 0 ? 'translate-x-0' : r === 1 ? '-translate-x-full' : '-translate-x-1/2',
                  r !== 0 && r !== 1 && 'hidden sm:block',
                )}
                style={{ left: `${r * 100}%` }}
              >
                {formatTimecode(r * SEQUENCE_LENGTH, 30).slice(3, 8)}
              </span>
            ))}
          </div>

          {/* V2 — AI layer */}
          <div className="relative h-8 sm:h-9">
            {pipeline.map((s, i) =>
              s.ai ? (
                <div
                  key={s.id}
                  className={cn(
                    'absolute top-1.5 bottom-1.5 flex items-center overflow-hidden rounded-[5px] border px-1.5 transition-colors duration-300 sm:px-2',
                    active === i
                      ? 'border-lilac-300/80 bg-lilac-300/25 text-lilac-100'
                      : 'border-lilac-300/25 bg-lilac-300/[0.07] text-lilac-300/80',
                  )}
                  style={{
                    left: `calc(${bounds[i].start * 100}% + 2px)`,
                    width: `calc(${(bounds[i].end - bounds[i].start) * 100}% - 4px)`,
                  }}
                >
                  <span className="truncate font-mono text-[9.5px] sm:text-[10px]">AI</span>
                </div>
              ) : null,
            )}
          </div>

          {/* V1 — the edit */}
          <div className="relative h-10 sm:h-11">
            {pipeline.map((s, i) => (
              <button
                key={s.id}
                type="button"
                tabIndex={-1}
                onClick={() => onSelect(i)}
                className={cn(
                  'absolute top-1 bottom-1 flex items-center overflow-hidden rounded-[6px] px-1.5 text-left transition-colors duration-300 sm:px-2.5',
                  active === i
                    ? 'bg-lilac-300 text-ink-950'
                    : i < active
                      ? 'bg-dusk-600/70 text-bone/80 hover:bg-dusk-600'
                      : 'bg-dusk-800 text-mist hover:bg-dusk-700',
                )}
                style={{
                  left: `calc(${bounds[i].start * 100}% + 2px)`,
                  width: `calc(${(bounds[i].end - bounds[i].start) * 100}% - 4px)`,
                }}
              >
                <span className="truncate text-[10.5px] font-medium sm:text-[12px]">
                  <span className="sm:hidden">{String(i + 1).padStart(2, '0')}</span>
                  <span className="hidden sm:inline">{s.title}</span>
                </span>
              </button>
            ))}
          </div>

          {/* A1 — music */}
          <div className="relative h-8 sm:h-9">
            <Waveform className="text-white/15" />
            <motion.div className="absolute inset-0" style={{ clipPath: playedClip }}>
              <Waveform className="text-lilac-300/55" />
            </motion.div>
          </div>

          {/* Playhead */}
          <motion.div className="pointer-events-none absolute inset-y-0 z-10 w-px bg-rec" style={{ left: playhead }}>
            <span className="absolute -top-0.5 left-1/2 h-2.5 w-3 -translate-x-1/2 bg-rec [clip-path:polygon(0_0,100%_0,100%_55%,50%_100%,0_55%)]" />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

function Waveform({ className }) {
  return (
    <svg
      viewBox={`0 0 ${WAVEFORM.length * 4} 40`}
      preserveAspectRatio="none"
      className={cn('absolute inset-x-0 top-1 bottom-1 h-[calc(100%-0.5rem)] w-full', className)}
    >
      {WAVEFORM.map((v, i) => (
        <rect key={i} x={i * 4 + 0.6} y={20 - v * 18} width="2.4" height={v * 36} rx="1" fill="currentColor" />
      ))}
    </svg>
  )
}
