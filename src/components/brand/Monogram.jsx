import { cn } from '../../lib/utils'

// Viewfinder brackets around a serif R, with a tally light.
export function Monogram({ className }) {
  return (
    <svg viewBox="0 0 40 40" className={cn('shrink-0', className)} aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="text-lilac-300">
        <path d="M4 12V4h8" />
        <path d="M28 4h8v8" />
        <path d="M36 28v8h-8" />
        <path d="M12 36H4v-8" />
      </g>
      <text x="20" y="27.5" textAnchor="middle" fontSize="22" fill="currentColor" className="font-display italic">
        R
      </text>
      <circle cx="31" cy="9" r="2.1" className="fill-rec" />
    </svg>
  )
}
