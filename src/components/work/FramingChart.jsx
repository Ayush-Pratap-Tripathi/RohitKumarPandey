import { motion } from 'motion/react'
import { ease } from '../../lib/utils'

// The framing chart an editor checks before export — here, the three ratios in this reel.
// Class names are written out in full so Tailwind can find them.
const frames = [
  {
    id: '16:9',
    x: 1,
    y: 1,
    w: 318,
    h: 178,
    stroke: 'stroke-white/45',
    fill: 'fill-white/60',
    legend: 'text-white/60',
    film: 'Wedding Invitation Film',
  },
  {
    id: '2.39:1',
    x: 1,
    y: 23.4,
    w: 318,
    h: 133.2,
    stroke: 'stroke-lilac-300',
    fill: 'fill-lilac-300',
    legend: 'text-lilac-300',
    film: 'Activewear Fit Check',
  },
  {
    id: '9:16',
    x: 109.4,
    y: 1,
    w: 101.2,
    h: 178,
    stroke: 'stroke-rec',
    fill: 'fill-rec',
    legend: 'text-rec',
    film: 'Podcast Reel · Night Run',
  },
]

export function FramingChart() {
  return (
    <motion.div
      className="rounded-[18px] border border-white/[0.07] bg-ink-900 p-6 sm:p-7"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
    >
      <p className="eyebrow text-fog">Framing chart</p>
      <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-mist">
        Three aspect ratios across this reel — each cut framed for the screen it lives on.
      </p>

      <div className="mt-7 grid items-center gap-7 sm:grid-cols-[1.35fr_1fr]">
        <svg viewBox="0 0 320 180" className="w-full overflow-visible" aria-hidden="true">
          <line x1="160" y1="80" x2="160" y2="100" className="stroke-white/25" strokeWidth="0.8" />
          <line x1="150" y1="90" x2="170" y2="90" className="stroke-white/25" strokeWidth="0.8" />
          {frames.map((f, i) => (
            <g key={f.id}>
              <motion.rect
                x={f.x}
                y={f.y}
                width={f.w}
                height={f.h}
                rx="2"
                fill="none"
                strokeWidth="1.2"
                className={f.stroke}
                variants={{ hidden: { pathLength: 0, opacity: 0 }, show: { pathLength: 1, opacity: 1 } }}
                transition={{ duration: 1.4, ease: ease.cine, delay: 0.2 + i * 0.25 }}
              />
              <motion.text
                x={f.x + 6}
                y={f.y + 13}
                className={`${f.fill} font-mono`}
                fontSize="9"
                letterSpacing="0.06em"
                variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
                transition={{ duration: 0.5, delay: 0.9 + i * 0.25 }}
              >
                {f.id}
              </motion.text>
            </g>
          ))}
        </svg>

        <ul className="space-y-3.5">
          {frames.map((f) => (
            <li key={f.id} className="flex items-baseline gap-3">
              <span className={`w-12 shrink-0 font-mono text-[12px] ${f.legend}`}>{f.id}</span>
              <span className="text-[14px] leading-snug text-bone/85">{f.film}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}
