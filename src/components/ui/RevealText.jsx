import { motion, useInView } from 'motion/react'
import { useMemo, useRef } from 'react'
import { cn, ease, parseAccents, plainText, spaceBefore } from '../../lib/utils'

/*
  Masked "push" reveal: every word rises out of its own clipping box.
  `*word*` renders as the italic serif accent. `play` lets a parent hold the
  animation (e.g. until the intro has finished).
*/
export function RevealText({
  text,
  as: Tag = 'h2',
  id,
  className,
  accentClassName = 'font-display italic text-lilac-300',
  delay = 0,
  stagger = 0.06,
  duration = 1.05,
  play = true,
  amount = 0.5,
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount })
  const tokens = useMemo(() => parseAccents(text), [text])
  const show = inView && play
  let wordIndex = 0

  return (
    <Tag ref={ref} id={id} className={className}>
      <span className="sr-only">{plainText(text)}</span>
      <span aria-hidden="true">
        {tokens.map((token, i) => {
          if (token.br) return <br key={i} className={token.soft ? 'max-sm:hidden' : undefined} />
          const index = wordIndex++
          return (
            <span key={i}>
              {spaceBefore(tokens, i)}
              <span className="-my-[0.12em] -mr-[0.06em] inline-block overflow-hidden py-[0.12em] pr-[0.06em] align-top">
                <motion.span
                  className={cn('inline-block will-change-transform', token.accent && accentClassName)}
                  initial={{ y: '115%' }}
                  animate={{ y: show ? '0%' : '115%' }}
                  transition={{ duration, ease: ease.expo, delay: show ? delay + index * stagger : 0 }}
                >
                  {token.text}
                </motion.span>
              </span>
            </span>
          )
        })}
      </span>
    </Tag>
  )
}
