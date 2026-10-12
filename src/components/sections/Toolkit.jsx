import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { useRef } from 'react'
import { profile, skills, tools } from '../../data/content'
import { ease } from '../../lib/utils'
import { Reveal } from '../ui/Reveal'
import { SectionHeader } from '../ui/SectionHeader'

export function Toolkit() {
  return (
    <section id="toolkit" aria-labelledby="toolkit-title" className="relative pt-28 pb-10 sm:pt-36 sm:pb-14">
      <div className="page-x">
        <SectionHeader
          id="toolkit-title"
          index="05"
          label="Toolkit"
          title="The *kit*"
          intro="The tools I reach for every day — and the skills underneath them. Front-end fundamentals keep designs buildable; AI keeps the workflow quick."
        />

        <ul className="mt-16 grid grid-cols-2 gap-3 sm:mt-20 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {tools.map((tool, i) => (
            <ToolTile key={tool.name} tool={tool} index={i} />
          ))}
        </ul>

        <div className="mt-20 grid gap-x-10 gap-y-12 border-t border-white/[0.07] pt-12 sm:mt-24 sm:grid-cols-2 lg:grid-cols-4">
          {skills.map((group, gi) => (
            <Reveal key={group.title} delay={gi * 0.06}>
              <h3 className="flex items-baseline gap-3 text-[15px] font-medium text-bone">
                <span className="font-mono text-[11px] text-lilac-300">{String(gi + 1).padStart(2, '0')}</span>
                {group.title}
              </h3>
              <ul className="mt-5 space-y-2.5">
                {group.items.map((s) => (
                  <li key={s} className="text-[15px] text-mist transition-colors duration-300 hover:text-bone">
                    {s}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/[0.07] pt-8 text-[15px]">
          <span className="eyebrow text-fog">Languages</span>
          {profile.languages.map((l) => (
            <span key={l} className="text-bone">
              {l}
            </span>
          ))}
          <span className="eyebrow ml-auto hidden text-fog sm:inline">Education — B.A., Ranchi University</span>
        </Reveal>
      </div>
    </section>
  )
}

function ToolTile({ tool, index }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const rotateX = useSpring(rx, { stiffness: 220, damping: 20 })
  const rotateY = useSpring(ry, { stiffness: 220, damping: 20 })
  const gx = useMotionValue(50)
  const gy = useMotionValue(50)
  const glow = useMotionTemplate`radial-gradient(240px circle at ${gx}% ${gy}%, rgb(198 194 241 / 0.16), transparent 70%)`

  const onPointerMove = (e) => {
    if (reduce || e.pointerType !== 'mouse') return
    const r = ref.current.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    ry.set((px - 0.5) * 14)
    rx.set((0.5 - py) * 14)
    gx.set(px * 100)
    gy.set(py * 100)
  }
  const reset = () => {
    rx.set(0)
    ry.set(0)
  }

  return (
    <motion.li
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.85, ease: ease.expo, delay: (index % 6) * 0.05 }}
      className="group relative flex aspect-square flex-col overflow-hidden rounded-[18px] xl:aspect-[4/5] border border-white/[0.07] bg-ink-900 p-4 transition-colors duration-500 hover:border-white/[0.15] sm:p-5"
    >
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: glow }}
      />
      <div className="relative flex items-start justify-between gap-2">
        <span className="font-mono text-[10px] tracking-[0.14em] text-fog uppercase">{tool.group}</span>
        {tool.learning && (
          <span className="rounded-full border border-mint/30 px-2 py-0.5 font-mono text-[9.5px] tracking-wide text-mint">
            LEARNING
          </span>
        )}
      </div>
      <span className="relative my-auto font-display text-[clamp(2.6rem,6vw,4.5rem)] leading-none text-bone transition-colors duration-500 group-hover:text-lilac-200">
        {tool.mono}
      </span>
      <div className="relative">
        <p className="text-[15px] font-medium text-bone">{tool.name}</p>
        <p className="mt-1 text-[12.5px] leading-snug text-mist">{tool.use}</p>
      </div>
    </motion.li>
  )
}
