import { cn } from '../../lib/utils'
import { Reveal } from './Reveal'
import { RevealText } from './RevealText'

export function Eyebrow({ index, children, tone = 'dark', className }) {
  return (
    <p className={cn('eyebrow flex items-center gap-3', tone === 'dark' ? 'text-fog' : 'text-graphite-soft', className)}>
      {index && <span className={tone === 'dark' ? 'text-lilac-300' : 'text-select'}>{index}</span>}
      <span aria-hidden="true" className="h-px w-8 bg-current opacity-40" />
      <span>{children}</span>
    </p>
  )
}

export function SectionHeader({ id, index, label, title, intro, aside, tone = 'dark', className }) {
  return (
    <header className={cn('grid items-end gap-x-10 gap-y-8 lg:grid-cols-12', className)}>
      <div className="lg:col-span-7">
        <Reveal y={12}>
          <Eyebrow index={index} tone={tone}>
            {label}
          </Eyebrow>
        </Reveal>
        <RevealText
          id={id}
          text={title}
          className="mt-6 font-display text-[clamp(3rem,8vw,6.75rem)] leading-[0.9] tracking-[-0.02em]"
          accentClassName={cn('font-display italic', tone === 'dark' ? 'text-lilac-300' : 'text-select')}
        />
      </div>
      {(intro || aside) && (
        <Reveal delay={0.15} className="lg:col-span-5 lg:pb-3">
          {intro && (
            <p
              className={cn(
                'max-w-md text-[17px] leading-relaxed text-pretty',
                tone === 'dark' ? 'text-mist' : 'text-graphite-soft',
              )}
            >
              {intro}
            </p>
          )}
          {aside}
        </Reveal>
      )}
    </header>
  )
}
