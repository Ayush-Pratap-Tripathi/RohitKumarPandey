import { ArrowUpIcon } from '@phosphor-icons/react'
import { profile } from '../../data/content'
import { useLocalTime } from '../../hooks/useLocalTime'
import { useScrollTo } from '../../hooks/useScrollTo'
import { Monogram } from '../brand/Monogram'

export function Footer() {
  const time = useLocalTime(profile.timeZone)
  const scrollTo = useScrollTo()

  return (
    <footer className="relative border-t border-white/[0.07] bg-ink-950">
      <div className="page-x flex flex-col gap-5 py-7 text-[13px] text-mist sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-3">
          <Monogram className="size-7 text-bone" />
          <span>
            © {new Date().getFullYear()} {profile.name}
          </span>
        </p>
        <p className="font-mono text-[11px] tracking-[0.12em] text-fog uppercase">Designed &amp; edited frame by frame</p>
        <div className="flex items-center gap-6">
          <p className="font-mono text-[12px] tabular-nums">
            <span className="text-fog">Local time </span>
            <span className="text-bone">
              {time} {profile.timeZoneLabel}
            </span>
          </p>
          <button
            type="button"
            onClick={() => scrollTo('top')}
            className="group flex items-center gap-1.5 text-bone transition-colors hover:text-lilac-200"
          >
            Back to top
            <ArrowUpIcon size={14} className="transition-transform duration-500 ease-expo group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </footer>
  )
}
