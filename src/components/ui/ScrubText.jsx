import { motion, useScroll, useTransform } from 'motion/react'
import { useMemo, useRef } from 'react'
import { cn, parseAccents, plainText, spaceBefore } from '../../lib/utils'

// Words light up as the paragraph is scrolled through — reading pace follows the reader.
export function ScrubText({ text, className, accentClassName = 'font-display italic font-normal text-lilac-300' }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.82', 'end 0.42'] })
  const tokens = useMemo(() => parseAccents(text).filter((t) => !t.br), [text])

  return (
    <p ref={ref} className={className}>
      <span className="sr-only">{plainText(text)}</span>
      <span aria-hidden="true">
        {tokens.map((token, i) => (
          <Word
            key={i}
            space={spaceBefore(tokens, i)}
            progress={scrollYProgress}
            range={[i / tokens.length, (i + 1) / tokens.length]}
            className={cn(token.accent && accentClassName)}
          >
            {token.text}
          </Word>
        ))}
      </span>
    </p>
  )
}

function Word({ space, progress, range, className, children }) {
  const opacity = useTransform(progress, range, [0.16, 1])
  return (
    <>
      {space}
      <motion.span style={{ opacity }} className={className}>
        {children}
      </motion.span>
    </>
  )
}
