import { cn } from '../../lib/utils'

export function LiveDot({ className }) {
  return (
    <span className={cn('relative flex size-2 shrink-0', className)} aria-hidden="true">
      <span className="absolute inline-flex size-full animate-ping rounded-full bg-mint opacity-50" />
      <span className="relative inline-flex size-2 rounded-full bg-mint" />
    </span>
  )
}
