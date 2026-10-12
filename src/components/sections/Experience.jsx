import { motion } from 'motion/react'
import { useState } from 'react'
import { experience } from '../../data/content'
import { cn, ease } from '../../lib/utils'
import { Reveal } from '../ui/Reveal'
import { SectionHeader } from '../ui/SectionHeader'

const START = 2017
const END = 2027
const NOW = 2026 + 9.4 / 12 // mid-October 2026
const years = Array.from({ length: END - START }, (_, i) => START + i)
const pos = (year) => ((year - START) / (END - START)) * 100

export function Experience() {
  const [hovered, setHovered] = useState(null)

  return (
    <section id="experience" aria-labelledby="experience-title" className="relative pt-20 pb-6 sm:pt-28 sm:pb-10">
      <div className="page-x">
        <SectionHeader
          id="experience-title"
          index="06"
          label="Experience"
          title={'Six years,\n*two crafts*'}
          intro="From freelance briefs to an agency product team — design and the edit have grown up side by side."
        />

        <CareerTimeline hovered={hovered} onHover={setHovered} />

        <div className="mt-14 border-t border-white/[0.07] sm:mt-20">
          {experience.map((item) => (
            <Role key={item.id} item={item} highlighted={hovered === item.id} onHover={setHovered} />
          ))}
        </div>
      </div>
    </section>
  )
}

// The career, laid out like a sequence: study on V2, work on V1, playhead parked at today.
function CareerTimeline({ hovered, onHover }) {
  const tracks = ['Study', 'Work']

  return (
    <Reveal
      className="mt-16 rounded-[20px] border border-white/[0.07] bg-ink-900 px-3 pt-4 pb-5 sm:mt-20 sm:px-6 sm:pt-5 sm:pb-6"
      aria-hidden="true"
    >
      <div className="flex">
        <div className="w-12 shrink-0 font-mono text-[10px] text-fog sm:w-16">
          <div className="h-7" />
          {tracks.map((t) => (
            <div key={t} className="flex h-12 items-center sm:h-14">
              {t}
            </div>
          ))}
        </div>

        <div className="relative min-w-0 flex-1">
          <div className="relative h-7 border-b border-white/[0.06]">
            {years.map((y) => (
              <span key={y} className="absolute top-0 flex h-full flex-col justify-between" style={{ left: `${pos(y)}%` }}>
                <span
                  className={cn(
                    '-translate-x-1/2 font-mono text-[9.5px] text-fog tabular-nums',
                    y % 2 === 1 && 'max-sm:invisible',
                  )}
                >
                  ’{String(y).slice(2)}
                </span>
                <span className="h-1.5 w-px bg-white/20" />
              </span>
            ))}
          </div>

          {tracks.map((track) => (
            <div key={track} className="relative h-12 sm:h-14">
              {experience
                .filter((e) => e.track === track)
                .map((e, i) => (
                  <motion.div
                    key={e.id}
                    onPointerEnter={() => onHover(e.id)}
                    onPointerLeave={() => onHover(null)}
                    className={cn(
                      'absolute top-1.5 bottom-1.5 flex origin-left items-center overflow-hidden rounded-[7px] px-2 transition-colors duration-300 sm:px-3',
                      e.id === 'condigence'
                        ? 'bg-lilac-300 text-ink-950'
                        : e.track === 'Study'
                          ? 'bg-dusk-700 text-bone'
                          : 'bg-dusk-500 text-bone',
                      hovered === e.id && 'ring-2 ring-bone/80',
                    )}
                    style={{ left: `calc(${pos(e.from)}% + 1px)`, width: `calc(${pos(e.to) - pos(e.from)}% - 2px)` }}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.1, ease: ease.cine, delay: 0.2 + (e.track === 'Study' ? 0 : 0.5 + i * 0.4) }}
                  >
                    <span className="truncate text-[11px] font-medium sm:text-[12.5px]">{e.org}</span>
                  </motion.div>
                ))}
            </div>
          ))}

          <motion.div
            className="pointer-events-none absolute inset-y-0 z-10 w-px bg-rec"
            initial={{ left: '0%' }}
            whileInView={{ left: `${pos(NOW)}%` }}
            viewport={{ once: true }}
            transition={{ duration: 2.2, ease: ease.cine, delay: 0.2 }}
          >
            <span className="absolute -top-0.5 left-1/2 h-2.5 w-3 -translate-x-1/2 bg-rec [clip-path:polygon(0_0,100%_0,100%_55%,50%_100%,0_55%)]" />
          </motion.div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pl-12 font-mono text-[10.5px] text-fog sm:pl-16">
        <span>2017 → today</span>
        <span className="flex items-center gap-2 text-bone">
          <span className="size-1.5 animate-rec rounded-full bg-rec" /> Now — open to new roles
        </span>
      </div>
    </Reveal>
  )
}

function Role({ item, highlighted, onHover }) {
  return (
    <Reveal
      as="article"
      onPointerEnter={() => onHover(item.id)}
      onPointerLeave={() => onHover(null)}
      className="relative grid gap-x-10 gap-y-5 border-b border-white/[0.07] py-10 sm:py-12 lg:grid-cols-12"
    >
      <span
        aria-hidden="true"
        className={cn(
          'absolute top-0 left-0 h-px origin-left bg-lilac-300 transition-transform duration-700 ease-expo',
          highlighted ? 'w-full scale-x-100' : 'w-full scale-x-0',
        )}
      />
      <div className="lg:col-span-3">
        <p className="font-mono text-[12px] text-bone tabular-nums">{item.period}</p>
        <p className="mt-2 text-[13px] text-fog">{item.note}</p>
      </div>
      <div className="lg:col-span-4">
        <h3 className="font-display text-[clamp(2rem,3.4vw,3rem)] leading-[1.02] text-bone">{item.role}</h3>
        <p className="mt-2 text-[16px] text-lilac-200">{item.org}</p>
      </div>
      {item.points.length > 0 && (
        <ul className="space-y-3 lg:col-span-5">
          {item.points.map((p) => (
            <li key={p} className="flex gap-3 text-[15px] leading-relaxed text-mist">
              <span aria-hidden="true" className="mt-[0.75em] h-px w-3 shrink-0 bg-lilac-300/60" />
              {p}
            </li>
          ))}
        </ul>
      )}
    </Reveal>
  )
}
