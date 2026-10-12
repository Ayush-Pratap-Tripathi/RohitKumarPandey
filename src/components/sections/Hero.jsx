import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { ArrowDownIcon, DownloadSimpleIcon, PlayIcon } from '@phosphor-icons/react'
import { hero, profile, videos } from '../../data/content'
import { useIntroDone } from '../../context/intro'
import { usePlayer } from '../../context/player'
import { useInViewPlayback } from '../../hooks/useInViewPlayback'
import { useScrollTo } from '../../hooks/useScrollTo'
import { cn, ease, formatDuration } from '../../lib/utils'
import { RunningTimecode } from '../brand/RunningTimecode'
import { Button } from '../ui/Button'
import { LiveDot } from '../ui/LiveDot'
import { Magnetic } from '../ui/Magnetic'
import { RevealText } from '../ui/RevealText'

const film = videos[0]
const totalRuntime = videos.reduce((sum, v) => sum + v.duration, 0)

export function Hero() {
  const introDone = useIntroDone()
  const scrollTo = useScrollTo()
  const { open } = usePlayer()
  const sectionRef = useRef(null)
  const pipRef = useRef(null)

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const portraitY = useTransform(scrollYProgress, [0, 1], ['0%', '10%'])
  const portraitScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.12])
  const gridOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const appear = (delay) => ({
    initial: { opacity: 0, y: 18 },
    animate: introDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 },
    transition: { duration: 1, ease: ease.expo, delay },
  })

  const playReel = () => open(0, { origin: pipRef.current })

  return (
    <section id="top" ref={sectionRef} className="relative isolate flex min-h-svh flex-col overflow-hidden pt-24 sm:pt-28">
      {/* Backdrop: the portrait's own dusk light, spilling into the page */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-[18%] right-[-12%] h-[95vh] w-[75vw] rounded-full bg-dusk-500/30 blur-[130px]" />
        <div className="absolute -bottom-[35%] -left-[20%] h-[70vh] w-[60vw] rounded-full bg-lilac-700/15 blur-[150px]" />
        <motion.div style={{ opacity: gridOpacity }} className="absolute inset-0">
          <LayoutGrid play={introDone} />
        </motion.div>
      </div>

      <div className="page-x flex flex-1 flex-col">
        <div className="grid flex-1 grid-cols-1 items-center gap-x-10 gap-y-14 lg:grid-cols-12">
          {/* Copy */}
          <div className="lg:col-span-7">
            <motion.div {...appear(0.05)} className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <span className="eyebrow text-fog">
                <span className="text-lilac-300">Portfolio</span> — 2026
              </span>
              <span className="eyebrow text-fog">UI/UX × Video × AI</span>
            </motion.div>

            <h1 className="mt-7 font-display text-[clamp(3.9rem,15.5vw,6.5rem)] leading-[0.86] tracking-[-0.025em] text-bone sm:text-[clamp(5rem,12vw,8.5rem)] lg:text-[clamp(6rem,9.6vw,10.25rem)]">
              <RevealText as="span" text="Rohit Kumar" className="block" play={introDone} delay={0.1} stagger={0.09} amount={0} />
              <span className="flex flex-wrap items-end gap-x-7 gap-y-3">
                <RevealText as="span" text="Pandey" className="block" play={introDone} delay={0.28} amount={0} />
                <motion.span
                  {...appear(0.55)}
                  className="mb-[0.18em] block border-l border-lilac-300/60 pl-4 font-sans text-[13px] leading-snug tracking-normal text-mist sm:text-[15px]"
                >
                  UI/UX Designer
                  <br />
                  <span className="text-bone">&amp; Video Editor</span>
                </motion.span>
              </span>
            </h1>

            <motion.p
              {...appear(0.6)}
              className="mt-9 max-w-[34rem] text-[clamp(1.2rem,1.9vw,1.55rem)] leading-[1.35] font-medium tracking-[-0.015em] text-pretty text-bone"
            >
              {hero.statement}
            </motion.p>
            <motion.p {...appear(0.68)} className="mt-4 max-w-[30rem] text-[15px] leading-relaxed text-mist sm:text-base">
              {hero.sub}
            </motion.p>

            <motion.div {...appear(0.78)} className="mt-10 flex flex-wrap items-center gap-3">
              <Magnetic>
                <Button
                  as="button"
                  type="button"
                  onClick={playReel}
                  iconLeft={<PlayIcon size={16} weight="fill" />}
                  aria-label={`Watch the reel — ${videos.length} films`}
                >
                  Watch the reel
                  <span className="ml-2 font-mono text-xs opacity-60">{formatDuration(totalRuntime)}</span>
                </Button>
              </Magnetic>
              <Magnetic>
                <Button
                  href="#design"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollTo('design')
                  }}
                  variant="secondary"
                  icon={<ArrowDownIcon size={15} />}
                >
                  Design work
                </Button>
              </Magnetic>
              <Button href={profile.resume} download variant="ghost" icon={<DownloadSimpleIcon size={16} />} className="ml-1">
                Résumé
              </Button>
            </motion.div>
          </div>

          {/* Portrait */}
          <div className="relative lg:col-span-5">
            <Portrait introDone={introDone} y={portraitY} scale={portraitScale} />
            <PipCard ref={pipRef} introDone={introDone} onPlay={playReel} />
          </div>
        </div>

        <MetaStrip introDone={introDone} />
      </div>
    </section>
  )
}

function Portrait({ introDone, y, scale }) {
  const reduce = useReducedMotion()
  // A wipe up from the bottom of frame; a plain fade for reduced motion.
  const hidden = reduce ? { opacity: 0 } : { clipPath: 'inset(100% 0% 0% 0% round 20px)' }
  const shown = reduce ? { opacity: 1 } : { clipPath: 'inset(0% 0% 0% 0% round 20px)' }

  return (
    <div className="relative mx-auto w-full max-w-[460px] lg:mr-0 lg:ml-auto">
      <motion.div
        className="group relative aspect-[4/5] overflow-hidden rounded-[20px] bg-dusk-600"
        initial={hidden}
        animate={introDone ? shown : undefined}
        transition={{ duration: reduce ? 0.6 : 1.35, ease: ease.cine, delay: 0.15 }}
      >
        <motion.img
          src={profile.portrait}
          srcSet={`${profile.portraitSmall} 640w, ${profile.portrait} 1000w`}
          sizes="(min-width: 1024px) 460px, 92vw"
          alt="Portrait of Rohit Kumar Pandey"
          fetchPriority="high"
          style={{ y, scale }}
          className="absolute inset-0 size-full object-cover object-[50%_32%]"
        />
        <Viewfinder running={introDone} />
        <LowerThird play={introDone} />
      </motion.div>
    </div>
  )
}

function Viewfinder({ running }) {
  const corners = [
    'left-4 top-4 border-l border-t',
    'right-4 top-4 border-r border-t',
    'bottom-4 left-4 border-b border-l',
    'bottom-4 right-4 border-b border-r',
  ]
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 bg-linear-to-b from-ink-950/35 via-transparent to-ink-950/55" />
      {corners.map((c) => (
        <span key={c} className={cn('absolute size-6 border-white/75', c)} />
      ))}
      <div className="absolute inset-x-7 top-7 flex items-center justify-between font-mono text-[11px] tracking-[0.12em] text-white/90">
        <span className="flex items-center gap-2">
          <span className="size-2 animate-rec rounded-full bg-rec" />
          REC
          <RunningTimecode running={running} className="tabular-nums text-white/75" />
        </span>
        <span className="text-white/75">CAM A</span>
      </div>
      {/* Rule of thirds, for anyone who hovers */}
      <div className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100">
        <span className="absolute inset-y-0 left-1/3 w-px bg-white/25" />
        <span className="absolute inset-y-0 left-2/3 w-px bg-white/25" />
        <span className="absolute inset-x-0 top-1/3 h-px bg-white/25" />
        <span className="absolute inset-x-0 top-2/3 h-px bg-white/25" />
      </div>
    </div>
  )
}

function LowerThird({ play }) {
  return (
    <div className="absolute bottom-6 left-6 flex items-stretch">
      <motion.span
        className="w-[3px] origin-bottom bg-lilac-300"
        initial={{ scaleY: 0 }}
        animate={play ? { scaleY: 1 } : undefined}
        transition={{ duration: 0.5, ease: ease.expo, delay: 1.15 }}
      />
      <motion.div
        className="bg-ink-950/70 px-4 py-2.5 backdrop-blur-md"
        initial={{ clipPath: 'inset(0% 100% 0% 0%)' }}
        animate={play ? { clipPath: 'inset(0% 0% 0% 0%)' } : undefined}
        transition={{ duration: 0.8, ease: ease.cine, delay: 1.3 }}
      >
        <p className="text-[15px] font-semibold tracking-[-0.01em] text-bone">{profile.name}</p>
        <p className="mt-1 font-mono text-[10px] tracking-[0.14em] text-lilac-200 uppercase">Designer · Editor · India</p>
      </motion.div>
    </div>
  )
}

// Multiplayer cursor — someone is always in the file.
function FigmaCursor({ play }) {
  const reduce = useReducedMotion()
  return (
    <motion.span
      aria-hidden="true"
      className="pointer-events-none absolute -top-11 right-10 z-20 hidden lg:block"
      initial={{ opacity: 0 }}
      animate={play ? { opacity: 1, x: reduce ? 0 : [0, 26, 8, 0], y: reduce ? 0 : [0, -14, 18, 0] } : undefined}
      transition={{
        opacity: { duration: 0.6, delay: 1.6 },
        default: { duration: 9, ease: 'easeInOut', repeat: Infinity, delay: 1.6 },
      }}
    >
      <svg width="18" height="20" viewBox="0 0 18 20" className="drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]">
        <path d="M1 1l15 7.2-6.4 1.7L6.4 17z" className="fill-select stroke-white" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
      <span className="mt-0.5 ml-4 inline-block rounded-[5px] rounded-tl-none bg-select px-2 py-0.5 text-[11px] font-medium text-white">
        Rohit
      </span>
    </motion.span>
  )
}

function PipCard({ ref, introDone, onPlay }) {
  const videoRef = useRef(null)
  const { isOpen } = usePlayer()
  useInViewPlayback(videoRef, { enabled: introDone && !isOpen })

  return (
    <motion.button
      type="button"
      onClick={onPlay}
      data-cursor="Play"
      aria-label={`Play ${film.title}`}
      className="group mt-5 flex w-full items-center gap-4 rounded-[16px] border border-white/10 bg-ink-900/80 p-2.5 pr-5 text-left backdrop-blur-xl transition-colors hover:border-white/20 sm:mx-auto sm:max-w-[460px] lg:absolute lg:top-[29%] lg:left-[-4.5rem] lg:mt-0 lg:w-[232px] xl:top-[38%] xl:w-[268px] lg:flex-col lg:items-stretch lg:gap-0 lg:p-2 lg:pr-2 xl:left-[-6rem]"
      initial={{ opacity: 0, y: 30 }}
      animate={introDone ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 1, ease: ease.expo, delay: 1.0 }}
    >
      <FigmaCursor play={introDone} />
      <span
        ref={ref}
        data-video-frame={film.id}
        className="relative block aspect-video w-[44%] shrink-0 overflow-hidden rounded-[10px] bg-ink-800 lg:w-full"
      >
        <img src={film.posterSmall} alt="" className="absolute inset-0 size-full object-cover" />
        <video
          ref={videoRef}
          src={film.previewSmall}
          muted
          loop
          playsInline
          preload="none"
          className="absolute inset-0 size-full object-cover"
        />
        <span className="absolute inset-0 grid place-items-center bg-ink-950/10 transition-colors group-hover:bg-ink-950/30">
          <span className="grid size-9 place-items-center rounded-full bg-bone/90 text-ink-950 transition-transform duration-500 ease-expo group-hover:scale-110">
            <PlayIcon size={14} weight="fill" />
          </span>
        </span>
      </span>
      <span className="block min-w-0 lg:px-2 lg:pt-3 lg:pb-1.5">
        <span className="eyebrow flex items-center gap-2 text-fog">
          <span className="size-1.5 animate-rec rounded-full bg-rec" /> Now playing
        </span>
        <span className="mt-2 flex items-baseline justify-between gap-3">
          <span className="line-clamp-2 text-[15px] leading-snug font-medium text-bone xl:line-clamp-1">{film.title}</span>
          <span className="shrink-0 font-mono text-[11px] text-mist">{formatDuration(film.duration)}</span>
        </span>
      </span>
    </motion.button>
  )
}

function LayoutGrid({ play }) {
  return (
    <div className="page-x hidden h-full lg:block">
      <div className="grid h-full grid-cols-12 gap-x-10">
        {Array.from({ length: 12 }, (_, i) => (
          <motion.span
            key={i}
            className="block h-full origin-top bg-lilac-300/[0.014]"
            initial={{ scaleY: 0 }}
            animate={play ? { scaleY: 1 } : undefined}
            transition={{ duration: 1.4, ease: ease.cine, delay: 0.05 * i }}
          />
        ))}
      </div>
    </div>
  )
}

function MetaStrip({ introDone }) {
  return (
    <motion.dl
      className="mt-20 grid grid-cols-2 border-t border-white/[0.08] md:grid-cols-4 lg:mt-24"
      initial="hidden"
      animate={introDone ? 'show' : 'hidden'}
      variants={{ show: { transition: { staggerChildren: 0.07, delayChildren: 1.0 } } }}
    >
      {hero.meta.map((item, i) => (
        <motion.div
          key={item.label}
          variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: ease.expo } } }}
          className={cn(
            'border-white/[0.06] py-5 pr-4 md:border-l md:py-6 md:pl-6 md:first:border-l-0 md:first:pl-0',
            i < 2 && 'border-b md:border-b-0',
          )}
        >
          <dt className="eyebrow text-fog">{item.label}</dt>
          <dd className="mt-3 flex items-center gap-2.5 text-[15px] text-bone">
            {item.live && <LiveDot />}
            {item.value}
          </dd>
        </motion.div>
      ))}
    </motion.dl>
  )
}
