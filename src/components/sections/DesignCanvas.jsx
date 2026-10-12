import { motion } from 'motion/react'
import { ChatCircleIcon, CursorIcon, HandIcon, HashIcon, PenNibIcon, SquareIcon, TextTIcon } from '@phosphor-icons/react'
import { caseStudies, designProcess } from '../../data/content'
import { useScrollTo } from '../../hooks/useScrollTo'
import { cn } from '../../lib/utils'
import { noteTone } from '../design/BoardParts'
import { CaseStudy } from '../design/CaseStudy'
import { Eyebrow, SectionHeader } from '../ui/SectionHeader'

export function DesignCanvas() {
  return (
    <section id="design" aria-labelledby="design-title" className="relative px-2 py-6 sm:px-4 sm:py-10">
      {/* overflow-clip (not hidden) so the toolbar can stay sticky */}
      <div className="relative overflow-clip rounded-[28px] bg-canvas text-graphite sm:rounded-[40px]">
        <CanvasToolbar />
        <div className="dot-grid pb-24 sm:pb-32">
          <div className="page-x pt-16 sm:pt-24">
            <SectionHeader
              id="design-title"
              tone="light"
              index="04"
              label="Design canvas"
              title={'Interfaces,\n*thought through*'}
              intro="Product design for real workflows — from the first requirement call to developer handoff. Two products, designed end to end."
            />

            <div className="mt-20 space-y-28 sm:mt-28 sm:space-y-36">
              {caseStudies.map((study) => (
                <CaseStudy key={study.id} study={study} />
              ))}
            </div>

            <DesignProcess />
          </div>
        </div>
      </div>
    </section>
  )
}

function CanvasToolbar() {
  const scrollTo = useScrollTo()
  const tools = [CursorIcon, HashIcon, SquareIcon, PenNibIcon, TextTIcon, HandIcon, ChatCircleIcon]

  return (
    <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-graphite/10 bg-canvas/85 px-3 py-2.5 backdrop-blur-md sm:px-5">
      <div className="flex min-w-0 items-center gap-2.5 text-[13px]">
        <span className="grid size-7 shrink-0 place-items-center rounded-[7px] bg-graphite font-display text-[17px] text-canvas italic">
          R
        </span>
        <span className="hidden text-graphite-soft sm:inline">Drafts /</span>
        <span className="truncate font-medium">Rohit — Product design</span>
      </div>

      <div
        aria-hidden="true"
        className="hidden items-center gap-0.5 rounded-[10px] bg-white p-1 shadow-[0_1px_3px_rgba(25,24,35,0.1)] md:flex"
      >
        {tools.map((Icon, i) => (
          <span
            key={i}
            className={cn('grid size-8 place-items-center rounded-[7px]', i === 0 ? 'bg-select text-white' : 'text-graphite/70')}
          >
            <Icon size={16} weight={i === 0 ? 'fill' : 'regular'} />
          </span>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <span aria-hidden="true" className="hidden font-mono text-[11px] text-graphite-soft sm:inline">
          100%
        </span>
        <span
          aria-hidden="true"
          className="grid size-7 place-items-center rounded-full bg-select text-[12px] font-semibold text-white ring-2 ring-canvas"
        >
          R
        </span>
        <a
          href="#contact"
          onClick={(e) => {
            e.preventDefault()
            scrollTo('contact')
          }}
          className="rounded-[7px] bg-select px-3 py-1.5 text-[12.5px] font-medium text-white transition-colors hover:bg-[#4a43cf]"
        >
          Invite Rohit
        </a>
      </div>
    </div>
  )
}

const tilts = [-2.5, 1.5, -1, 2, -1.8, 1.2]

function DesignProcess() {
  return (
    <div className="mt-28 sm:mt-36">
      <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <Eyebrow tone="light">How a design moves</Eyebrow>
          <p className="mt-5 font-display text-[clamp(2.25rem,4.5vw,3.75rem)] leading-[0.98] text-graphite">
            Six steps, <span className="text-select italic">every time.</span>
          </p>
        </div>
        <p className="max-w-md text-[15px] leading-relaxed text-graphite-soft lg:col-span-5">
          The same loop runs on every project — from requirement analysis and user research through to handoff, design reviews and
          implementation feedback.
        </p>
      </div>

      <ol className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-6">
        {designProcess.map((p, i) => (
          <motion.li
            key={p.title}
            className={cn(
              'flex aspect-square flex-col rounded-[3px] p-4 shadow-[0_14px_28px_-16px_rgba(25,24,35,0.45)] sm:p-5',
              noteTone[p.tone],
            )}
            initial={{ opacity: 0, y: 40, rotate: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, rotate: tilts[i], scale: 1 }}
            whileHover={{ rotate: 0, y: -6, scale: 1.03 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: i * 0.07 }}
          >
            <span className="font-mono text-[11px] text-graphite/55">{String(i + 1).padStart(2, '0')}</span>
            <span className="mt-auto font-display text-[clamp(1.6rem,2.4vw,2.1rem)] leading-none text-graphite">{p.title}</span>
            <span className="mt-2 text-[12.5px] leading-snug text-graphite/70">{p.note}</span>
          </motion.li>
        ))}
      </ol>
    </div>
  )
}
