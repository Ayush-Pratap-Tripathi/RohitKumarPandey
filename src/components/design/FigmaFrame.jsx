import { useEffect, useRef, useState } from 'react'
import { HashIcon } from '@phosphor-icons/react'
import { cn } from '../../lib/utils'

function useElementSize(ref) {
  const [size, setSize] = useState({ width: 0, height: 0 })
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const box = entry.borderBoxSize?.[0]
      setSize({
        width: Math.round(box ? box.inlineSize : entry.contentRect.width),
        height: Math.round(box ? box.blockSize : entry.contentRect.height),
      })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref])
  return size
}

// A frame on the canvas: label above, selection box + handles + live size on hover.
export function FigmaFrame({ label, children, className }) {
  const ref = useRef(null)
  const { width, height } = useElementSize(ref)
  const handles = ['-top-1 -left-1', '-top-1 -right-1', '-bottom-1 -left-1', '-bottom-1 -right-1']

  return (
    <div className={cn('group/frame relative', className)}>
      <p className="mb-2 flex items-center gap-1.5 text-[12px] text-graphite-soft transition-colors group-hover/frame:text-select">
        <HashIcon size={12} weight="bold" /> {label}
      </p>
      <div
        ref={ref}
        className="relative rounded-[6px] bg-white p-4 shadow-[0_1px_2px_rgba(25,24,35,0.06),0_18px_50px_-18px_rgba(25,24,35,0.22)] sm:p-6"
      >
        {children}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px rounded-[6px] border-[1.5px] border-select opacity-0 transition-opacity duration-300 group-hover/frame:opacity-100"
        />
        {handles.map((pos) => (
          <span
            key={pos}
            aria-hidden="true"
            className={cn(
              'pointer-events-none absolute size-2 border-[1.5px] border-select bg-white opacity-0 transition-opacity duration-300 group-hover/frame:opacity-100',
              pos,
            )}
          />
        ))}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 rounded-[4px] bg-select px-1.5 py-0.5 font-mono text-[10px] whitespace-nowrap text-white opacity-0 transition-opacity duration-300 group-hover/frame:opacity-100"
        >
          {width} × {height}
        </span>
      </div>
    </div>
  )
}
