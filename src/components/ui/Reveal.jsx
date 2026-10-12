import { motion, useInView, useReducedMotion } from 'motion/react'
import { useRef } from 'react'
import { ease } from '../../lib/utils'

// Dissolve-and-rise for blocks of content.
export function Reveal({ as = 'div', children, className, delay = 0, y = 28, amount = 0.2, ...props }) {
  const Comp = motion[as]
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.95, ease: ease.expo, delay }}
      {...props}
    >
      {children}
    </Comp>
  )
}

const wipeFrom = {
  up: 'inset(100% 0% 0% 0%)',
  down: 'inset(0% 0% 100% 0%)',
  left: 'inset(0% 100% 0% 0%)',
  right: 'inset(0% 0% 0% 100%)',
}

// A literal wipe transition, for media.
// The observer sits on an unclipped wrapper: Chrome's IntersectionObserver honours the
// target's own clip-path, so a fully clipped element would never report as visible.
export function Wipe({ children, className, direction = 'up', delay = 0, duration = 1.15, amount = 0.2 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount })
  const reduce = useReducedMotion()
  const hidden = reduce ? { opacity: 0 } : { clipPath: wipeFrom[direction] }
  // Drop the clip once the wipe lands so focus rings and shadows aren't cut off.
  const shown = reduce ? { opacity: 1 } : { clipPath: 'inset(0% 0% 0% 0%)', transitionEnd: { clipPath: 'none' } }

  return (
    <div ref={ref} className={className}>
      <motion.div initial={hidden} animate={inView ? shown : hidden} transition={{ duration, ease: ease.cine, delay }}>
        {children}
      </motion.div>
    </div>
  )
}
