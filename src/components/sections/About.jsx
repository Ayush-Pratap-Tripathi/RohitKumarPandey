import { about } from '../../data/content'
import { cn } from '../../lib/utils'
import { Reveal } from '../ui/Reveal'
import { ScrubText } from '../ui/ScrubText'
import { Eyebrow } from '../ui/SectionHeader'

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative pt-28 pb-8 sm:pt-40 sm:pb-12">
      <div className="page-x">
        <div className="grid gap-y-10 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <Reveal y={12}>
              <Eyebrow index="01">Profile</Eyebrow>
            </Reveal>
            <h2 id="about-title" className="sr-only">
              About Rohit
            </h2>
          </div>
          <ScrubText
            text={about.statement}
            className="text-[clamp(1.65rem,3.3vw,3.05rem)] leading-[1.14] font-medium tracking-[-0.025em] text-bone lg:col-span-9"
          />
        </div>

        <div className="mt-20 grid gap-4 sm:mt-28 md:grid-cols-3">
          {about.disciplines.map((d, i) => (
            <Reveal
              key={d.id}
              delay={i * 0.08}
              className="group relative flex flex-col overflow-hidden rounded-[22px] border border-white/[0.07] bg-ink-900 p-6 transition-colors duration-500 hover:border-white/[0.16] sm:p-7"
            >
              <div className="flex items-start justify-between">
                <span className="font-display text-5xl leading-none text-lilac-300 italic">{d.index}</span>
                <Glyph kind={d.id} />
              </div>
              <h3 className="mt-14 text-[1.4rem] font-medium tracking-[-0.02em]">{d.title}</h3>
              <p className="mt-3 flex-1 text-[15px] leading-relaxed text-mist">{d.body}</p>
              <ul className="mt-7 flex flex-wrap gap-2">
                {d.tools.map((t) => (
                  <li key={t} className="rounded-full border border-white/10 px-3 py-1 text-[12.5px] text-mist">
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// Tiny working illustrations — each comes alive on hover.
function Glyph({ kind }) {
  const base = 'h-12 w-20 text-white/30 transition-colors duration-500 group-hover:text-white/60'

  if (kind === 'design') {
    return (
      <svg viewBox="0 0 80 48" className={base} aria-hidden="true">
        <rect
          x="14"
          y="10"
          width="40"
          height="28"
          rx="2"
          fill="none"
          stroke="currentColor"
          className="origin-left transition-[width] duration-700 ease-expo group-hover:[width:52px]"
        />
        {[
          [14, 10],
          [54, 10],
          [14, 38],
          [54, 38],
        ].map(([x, y], i) => (
          <rect
            key={i}
            x={x - 2.5}
            y={y - 2.5}
            width="5"
            height="5"
            className={cn(
              'fill-ink-900 stroke-select transition-transform duration-700 ease-expo',
              x === 54 && 'group-hover:translate-x-[12px]',
            )}
            strokeWidth="1.2"
          />
        ))}
      </svg>
    )
  }

  if (kind === 'edit') {
    return (
      <svg viewBox="0 0 80 48" className={base} aria-hidden="true">
        <rect x="4" y="14" width="22" height="9" rx="1.5" fill="currentColor" opacity="0.5" />
        <rect x="28" y="14" width="30" height="9" rx="1.5" fill="currentColor" opacity="0.8" />
        <rect x="60" y="14" width="16" height="9" rx="1.5" fill="currentColor" opacity="0.5" />
        <rect x="4" y="27" width="72" height="7" rx="1.5" fill="currentColor" opacity="0.25" />
        <g className="transition-transform duration-[1.6s] ease-linear group-hover:translate-x-[58px]">
          <line x1="10" y1="8" x2="10" y2="40" className="stroke-rec" strokeWidth="1.5" />
          <path d="M7 6h6l-3 4z" className="fill-rec" />
        </g>
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 80 48" className={base} aria-hidden="true">
      {Array.from({ length: 15 }, (_, i) => {
        const col = i % 5
        const row = Math.floor(i / 5)
        return (
          <rect
            key={i}
            x={12 + col * 12}
            y={8 + row * 12}
            width="8"
            height="8"
            rx="2"
            fill="currentColor"
            className="opacity-30 transition-[opacity,fill] duration-300 group-hover:fill-lilac-300 group-hover:opacity-100"
            style={{ transitionDelay: `${(col + row) * 70}ms` }}
          />
        )
      })}
    </svg>
  )
}
