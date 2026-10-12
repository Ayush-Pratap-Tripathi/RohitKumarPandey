import { forwardRef } from 'react'
import { cn } from '../../lib/utils'

const variants = {
  primary: 'bg-lilac-300 text-ink-950 hover:bg-lilac-200',
  secondary: 'border border-white/15 text-bone hover:border-white/35 hover:bg-white/[0.04]',
  ghost: 'text-bone hover:text-lilac-200 px-1!',
  graphite: 'bg-graphite text-canvas hover:bg-black',
  outlineDark: 'border border-graphite/20 text-graphite hover:border-graphite/50',
}

const sizes = {
  md: 'h-12 px-6 text-[15px]',
  sm: 'h-10 px-4 text-sm',
}

// Label rolls up on hover — a small "cut" between two takes of the same word.
export const Button = forwardRef(function Button(
  { as: Comp = 'a', variant = 'primary', size = 'md', icon, iconLeft, className, children, ...props },
  ref,
) {
  return (
    <Comp
      ref={ref}
      className={cn(
        'group/btn relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full font-medium whitespace-nowrap transition-colors duration-300',
        sizes[size],
        variants[variant],
        className,
      )}
      {...props}
    >
      {iconLeft && <span className="relative shrink-0">{iconLeft}</span>}
      <span className="relative block overflow-hidden">
        <span className="block transition-transform duration-500 ease-expo group-hover/btn:-translate-y-full">{children}</span>
        <span
          aria-hidden="true"
          className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-expo group-hover/btn:translate-y-0"
        >
          {children}
        </span>
      </span>
      {icon && (
        <span className="relative shrink-0 transition-transform duration-500 ease-expo group-hover/btn:translate-x-0.5">
          {icon}
        </span>
      )}
    </Comp>
  )
})
