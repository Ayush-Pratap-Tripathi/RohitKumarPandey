import { motion } from 'motion/react'
import { CheckIcon } from '@phosphor-icons/react'
import { ease } from '../../lib/utils'
import { Reveal } from '../ui/Reveal'
import { RevealText } from '../ui/RevealText'
import { CategoryChips, FlowBoard, Principles, StatusTracker } from './BoardParts'
import { FigmaFrame } from './FigmaFrame'

export function CaseStudy({ study }) {
  const meta = [
    { label: 'Role', value: study.role },
    { label: 'Studio', value: study.org },
    { label: 'Scope', value: study.scope },
  ].filter((m) => m.value)

  return (
    <article aria-labelledby={`${study.id}-title`} className="grid gap-x-14 gap-y-12 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <Reveal y={12}>
          <p className="font-mono text-[11px] tracking-[0.14em] text-graphite-soft uppercase">
            <span className="text-select">{study.index}</span> — {study.tagline}
          </p>
        </Reveal>
        <RevealText
          as="h3"
          id={`${study.id}-title`}
          text={study.name}
          className="mt-4 font-display text-[clamp(3.5rem,7vw,6rem)] leading-[0.9] tracking-[-0.02em] text-graphite"
        />
        <Reveal delay={0.08}>
          <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-graphite/85">{study.summary}</p>
        </Reveal>

        <Reveal delay={0.14} className="mt-8">
          <dl
            className="grid gap-4 border-y border-graphite/10 py-5"
            style={{ gridTemplateColumns: `repeat(${meta.length}, minmax(0, 1fr))` }}
          >
            {meta.map((m) => (
              <div key={m.label}>
                <dt className="font-mono text-[10px] tracking-[0.14em] text-graphite-soft uppercase">{m.label}</dt>
                <dd className="mt-2 text-[13.5px] leading-snug text-graphite">{m.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <ul className="mt-7 grid grid-cols-2 gap-x-4 gap-y-2.5">
          {study.deliverables.map((d, i) => (
            <motion.li
              key={d}
              className="flex items-center gap-2.5 text-[14px] text-graphite"
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.06, ease: ease.expo }}
            >
              <span className="grid size-[18px] shrink-0 place-items-center rounded-[5px] bg-graphite text-canvas">
                <CheckIcon size={11} weight="bold" />
              </span>
              {d}
            </motion.li>
          ))}
        </ul>

        <Reveal delay={0.1} className="mt-8 border-l-2 border-select pl-4">
          <p className="font-mono text-[10px] tracking-[0.14em] text-graphite-soft uppercase">Outcome</p>
          <p className="mt-1.5 text-[15px] leading-relaxed text-graphite">{study.outcome}</p>
        </Reveal>
      </div>

      <Reveal delay={0.1} className="lg:col-span-7 lg:pt-10">
        <FigmaFrame label={`${study.name} / ${study.board}`}>
          <FlowBoard lanes={study.lanes} />
          {study.categories && <CategoryChips items={study.categories} />}
          {study.statuses && <StatusTracker statuses={study.statuses} />}
          {study.principles && <Principles items={study.principles} />}
        </FigmaFrame>
      </Reveal>
    </article>
  )
}
