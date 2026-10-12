import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'motion/react'
import { useRef } from 'react'
import { marquee } from '../../data/content'
import { cn, wrap } from '../../lib/utils'

// A strip of film running through the gate: scroll faster and it speeds up, scroll back and it reverses.
export function Marquee() {
  return (
    <section aria-label="What I do" className="relative py-12 sm:py-16">
      <p className="sr-only">{marquee.join(', ')}</p>
      <div aria-hidden="true" className="relative border-y border-white/[0.05] bg-ink-850">
        <div className="sprockets h-[18px]" />
        <VelocityRow baseVelocity={-1.4}>
          {marquee.map((item, i) => (
            <span key={item} className="flex shrink-0 flex-col border-l border-white/[0.07] px-7 py-3 sm:px-9">
              <span className="font-mono text-[9px] tracking-[0.2em] text-lilac-300/60">
                RKP {String(i + 1).padStart(2, '0')}A
              </span>
              <span
                className={cn(
                  'mt-1.5 font-display text-[clamp(2.1rem,4.6vw,3.9rem)] leading-none whitespace-nowrap text-bone/90',
                  i % 2 === 1 && 'italic text-lilac-200/90',
                )}
              >
                {item}
              </span>
            </span>
          ))}
        </VelocityRow>
        <div className="sprockets h-[18px]" />
      </div>
    </section>
  )
}

function VelocityRow({ children, baseVelocity }) {
  const ref = useRef(null)
  const inView = useInView(ref)
  const reduce = useReducedMotion()
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const velocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(velocity, { damping: 50, stiffness: 400 })
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 4], { clamp: false })
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`)
  const direction = useRef(1)

  useAnimationFrame((_, delta) => {
    if (reduce || !inView) return
    let moveBy = direction.current * baseVelocity * (delta / 1000)
    const factor = velocityFactor.get()
    if (factor < 0) direction.current = -1
    else if (factor > 0) direction.current = 1
    moveBy += direction.current * moveBy * factor
    baseX.set(baseX.get() + moveBy)
  })

  return (
    <div ref={ref} className="overflow-hidden">
      <motion.div className="flex w-max" style={{ x }}>
        <div className="flex">{children}</div>
        <div className="flex">{children}</div>
      </motion.div>
    </div>
  )
}
