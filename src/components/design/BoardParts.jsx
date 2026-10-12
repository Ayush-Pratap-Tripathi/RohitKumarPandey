import { motion, useInView } from 'motion/react'
import { useEffect, useId, useRef, useState } from 'react'
import { CheckIcon } from '@phosphor-icons/react'
import { cn, ease } from '../../lib/utils'

export const noteTone = {
  lilac: 'bg-note-lilac',
  peach: 'bg-note-peach',
  mint: 'bg-note-mint',
  sky: 'bg-note-sky',
}

function Connector({ delay }) {
  return (
    <svg width="26" height="12" viewBox="0 0 26 12" className="mx-1 shrink-0 text-graphite/35" aria-hidden="true">
      <motion.path
        d="M1 6h19"
        stroke="currentColor"
        strokeWidth="1.4"
        fill="none"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay, ease: ease.soft }}
      />
      <motion.path
        d="M17 2.5 21.5 6 17 9.5"
        stroke="currentColor"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.2, delay: delay + 0.3 }}
      />
    </svg>
  )
}

// User-flow lanes: a sticky note per role, then the steps that role walks through.
export function FlowBoard({ lanes }) {
  return (
    <div className="space-y-5 sm:space-y-3.5">
      {lanes.map((lane, li) => (
        <div key={lane.role} className="flex flex-col items-start gap-2.5 sm:flex-row sm:items-center sm:gap-3">
          <motion.span
            className={cn(
              'shrink-0 rounded-[3px] px-2.5 py-1.5 text-[12px] font-semibold text-graphite shadow-[0_6px_14px_-8px_rgba(25,24,35,0.4)] sm:w-[104px] sm:py-2 sm:text-[13px]',
              noteTone[lane.tone],
            )}
            initial={{ opacity: 0, rotate: -6, scale: 0.8 }}
            whileInView={{ opacity: 1, rotate: li % 2 ? 1.5 : -1.5, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 300, damping: 18, delay: li * 0.15 }}
          >
            {lane.role}
          </motion.span>
          <ol className="flex min-w-0 flex-1 flex-wrap items-center gap-y-2">
            {lane.steps.map((step, i) => {
              const delay = li * 0.15 + i * 0.09 + 0.1
              return (
                <li key={`${step}-${i}`} className="flex items-center">
                  {i > 0 && <Connector delay={delay - 0.05} />}
                  <motion.span
                    className="rounded-full border border-graphite/12 bg-white px-3 py-1.5 text-[12px] font-medium whitespace-nowrap text-graphite shadow-[0_1px_0_rgba(25,24,35,0.05)] sm:text-[12.5px]"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 340, damping: 22, delay }}
                  >
                    {step}
                  </motion.span>
                </li>
              )
            })}
          </ol>
        </div>
      ))}
    </div>
  )
}

function ComponentLabel({ name, meta }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <p className="flex items-center gap-1.5 font-mono text-[10.5px] tracking-[0.12em] text-[#7b4fd6] uppercase">
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
          <path d="M5 0 7 2.5 5 5 3 2.5zM5 5l2 2.5L5 10 3 7.5zM0 5l2.5-2L5 5 2.5 7zM5 5l2.5-2L10 5 7.5 7z" fill="currentColor" />
        </svg>
        {name}
      </p>
      {meta && <span className="text-[11px] text-graphite-soft">{meta}</span>}
    </div>
  )
}

// A live component: category filter chips with a sliding selection.
export function CategoryChips({ items }) {
  const id = useId()
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.6 })
  const [selected, setSelected] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (!inView || paused) return
    const t = setInterval(() => setSelected((s) => (s + 1) % items.length), 1900)
    return () => clearInterval(t)
  }, [inView, paused, items.length])

  return (
    <div
      ref={ref}
      className="mt-5 rounded-[12px] border border-graphite/10 bg-canvas/70 p-3.5 sm:mt-6 sm:p-4"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      <ComponentLabel name="Category chips" meta={`${items.length} variants`} />
      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Marketplace categories">
        {items.map((item, i) => {
          const on = selected === i
          return (
            <button
              key={item}
              type="button"
              aria-pressed={on}
              onClick={() => setSelected(i)}
              className={cn(
                'relative rounded-full px-3.5 py-1.5 text-[12.5px] font-medium transition-colors duration-300',
                on ? 'text-white' : 'text-graphite hover:text-black',
              )}
            >
              {on ? (
                <motion.span
                  layoutId={`chip-${id}`}
                  className="absolute inset-0 rounded-full bg-graphite"
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                />
              ) : (
                <span className="absolute inset-0 rounded-full border border-graphite/15 bg-white" />
              )}
              <span className="relative">{item}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// A live component: service-request status tracker that steps through its states.
export function StatusTracker({ statuses }) {
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.6 })
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!inView) return
    const t = setInterval(() => setStep((s) => (s + 1) % (statuses.length + 1)), 1500)
    return () => clearInterval(t)
  }, [inView, statuses.length])

  // step runs 0…n; step === n is the "all resolved" beat before the loop restarts.
  const n = statuses.length
  const current = Math.min(step, n - 1)
  const column = 100 / n

  return (
    <div ref={ref} className="mt-5 rounded-[12px] border border-graphite/10 bg-canvas/70 p-3.5 sm:mt-6 sm:p-4">
      <ComponentLabel name="Request status" meta={step >= n ? 'Resolved' : statuses[current]} />
      <div className="relative mt-5">
        <div
          className="absolute top-[9px] h-[2px] rounded-full bg-graphite/10"
          style={{ left: `${column / 2}%`, right: `${column / 2}%` }}
        />
        <motion.div
          className="absolute top-[9px] h-[2px] rounded-full bg-select"
          style={{ left: `${column / 2}%` }}
          animate={{ width: `${(current / (n - 1)) * (100 - column)}%` }}
          transition={{ duration: 0.6, ease: ease.expo }}
        />
        <ol className="relative grid" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
          {statuses.map((s, i) => {
            const done = i < step
            const isCurrent = i === step
            return (
              <li key={s} className="flex flex-col items-center gap-2 text-center">
                <span
                  className={cn(
                    'relative grid size-5 place-items-center rounded-full border-2 transition-colors duration-300',
                    done
                      ? 'border-select bg-select text-white'
                      : isCurrent
                        ? 'border-select bg-white'
                        : 'border-graphite/20 bg-white',
                  )}
                >
                  {done ? (
                    <CheckIcon size={10} weight="bold" />
                  ) : (
                    isCurrent && <span className="size-1.5 animate-pulse rounded-full bg-select" />
                  )}
                </span>
                <span
                  className={cn('text-[11px] leading-tight sm:text-[12px]', i <= step ? 'text-graphite' : 'text-graphite-soft')}
                >
                  {s}
                </span>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}

export function Principles({ items }) {
  return (
    <div className="mt-5 grid grid-cols-2 gap-2 sm:mt-6">
      {items.map((p, i) => (
        <motion.p
          key={p}
          className="flex items-center gap-2 rounded-[10px] border border-graphite/10 px-3 py-2.5 text-[12.5px] font-medium text-graphite"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 + i * 0.07, ease: ease.expo }}
        >
          <span className="grid size-4 shrink-0 place-items-center rounded-full bg-note-mint text-graphite">
            <CheckIcon size={9} weight="bold" />
          </span>
          {p}
        </motion.p>
      ))}
    </div>
  )
}
