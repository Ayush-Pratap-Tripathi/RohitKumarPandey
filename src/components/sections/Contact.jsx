import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { ArrowUpRightIcon, CheckIcon, CopyIcon, DownloadSimpleIcon, LinkedinLogoIcon, PhoneIcon } from '@phosphor-icons/react'
import { profile } from '../../data/content'
import { cn, ease } from '../../lib/utils'
import { Button } from '../ui/Button'
import { LiveDot } from '../ui/LiveDot'
import { Magnetic } from '../ui/Magnetic'
import { Reveal } from '../ui/Reveal'
import { RevealText } from '../ui/RevealText'
import { Eyebrow } from '../ui/SectionHeader'

const mailto = `mailto:${profile.email}?subject=${encodeURIComponent('Hello Rohit — let’s work together')}`

export function Contact() {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), 2200)
    return () => clearTimeout(t)
  }, [copied])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
    } catch {
      window.location.href = mailto
    }
  }

  const cells = [
    { label: 'Phone', value: profile.phone, href: profile.phoneHref, icon: PhoneIcon },
    { label: 'LinkedIn', value: profile.linkedinLabel, href: profile.linkedin, icon: LinkedinLogoIcon, external: true },
    { label: 'Résumé', value: 'PDF · one page', href: profile.resume, icon: DownloadSimpleIcon, download: true },
  ]

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative isolate overflow-hidden pt-24 sm:pt-32">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute bottom-[-25%] left-1/2 h-[80vh] w-[95vw] -translate-x-1/2 rounded-full bg-dusk-500/25 blur-[150px]" />
      </div>

      <div className="page-x">
        <Reveal y={12}>
          <Eyebrow index="07">Contact</Eyebrow>
        </Reveal>
        <RevealText
          id="contact-title"
          text="Have a product to design|or a story to *cut?*"
          className="mt-6 font-display text-[clamp(2.9rem,7.6vw,7.25rem)] leading-[0.92] tracking-[-0.02em]"
        />

        <Reveal delay={0.1} className="mt-14 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <a
            href={mailto}
            className="group inline-flex max-w-full items-end gap-3 font-display text-[clamp(1.75rem,5.4vw,4.6rem)] leading-none break-all text-lilac-200 italic sm:break-normal"
          >
            <span className="relative">
              {profile.email}
              <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-lilac-200 transition-transform duration-700 ease-expo group-hover:scale-x-100" />
            </span>
            <ArrowUpRightIcon className="mb-[0.08em] size-[0.6em] shrink-0 transition-transform duration-500 ease-expo group-hover:translate-x-1 group-hover:-translate-y-1" />
          </a>

          <div className="flex flex-wrap gap-3">
            <Button
              as="button"
              type="button"
              onClick={copy}
              variant="secondary"
              aria-live="polite"
              iconLeft={copied ? <CheckIcon size={16} weight="bold" /> : <CopyIcon size={16} />}
            >
              {copied ? 'Copied to clipboard' : 'Copy email'}
            </Button>
            <Magnetic>
              <Button href={mailto} icon={<ArrowUpRightIcon size={16} />}>
                Write to me
              </Button>
            </Magnetic>
          </div>
        </Reveal>

        <Reveal
          delay={0.15}
          className="mt-16 grid gap-px overflow-hidden rounded-[20px] border border-white/[0.07] bg-white/[0.07] sm:grid-cols-2 lg:grid-cols-4"
        >
          {cells.map(({ label, value, href, icon: Icon, external, download }) => (
            <a
              key={label}
              href={href}
              {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
              {...(download ? { download: '' } : {})}
              className="group flex flex-col gap-6 bg-ink-950 p-6 transition-colors duration-300 hover:bg-ink-900 sm:p-7"
            >
              <span className="flex items-center justify-between">
                <span className="eyebrow text-fog">{label}</span>
                <Icon size={18} className="text-mist transition-colors group-hover:text-lilac-200" />
              </span>
              <span className="text-[16px] text-bone">{value}</span>
            </a>
          ))}
          <div className="flex flex-col gap-6 bg-ink-950 p-6 sm:p-7">
            <span className="eyebrow flex items-center gap-2 text-fog">
              <LiveDot /> Availability
            </span>
            <span className="text-[16px] leading-snug text-bone">{profile.availability.join(' · ')}</span>
          </div>
        </Reveal>
      </div>

      <EndCard />

      <AnimatePresence>
        {copied && (
          <motion.div
            role="status"
            className="fixed bottom-6 left-1/2 z-[70] flex -translate-x-1/2 items-center gap-2 rounded-full bg-bone px-4 py-2.5 text-sm font-medium text-ink-950 shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: ease.expo }}
          >
            <CheckIcon size={16} weight="bold" /> {profile.email} copied
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

// End credits: the name, set huge, sinking below the fold.
function EndCard() {
  return (
    <div aria-hidden="true" className="relative mt-24 select-none sm:mt-32">
      <p className="page-x eyebrow flex justify-between text-fog">
        <span>End of reel</span>
        <span>Thanks for watching</span>
      </p>
      <motion.p
        className={cn(
          'mt-4 overflow-hidden text-center font-display leading-[0.8] tracking-[-0.03em] whitespace-nowrap text-transparent',
          'bg-linear-to-b from-dusk-400/50 to-dusk-800/0 bg-clip-text',
          'text-[clamp(3.5rem,13.8vw,15rem)]',
        )}
        initial={{ y: '30%', opacity: 0 }}
        whileInView={{ y: '0%', opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: ease.expo }}
      >
        Rohit Kumar Pandey
      </motion.p>
    </div>
  )
}
