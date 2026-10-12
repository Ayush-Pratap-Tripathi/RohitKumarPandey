import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useCallback, useEffect, useState } from 'react'
import { ArrowUpRightIcon } from '@phosphor-icons/react'
import { nav, profile } from '../../data/content'
import { useIntroDone } from '../../context/intro'
import { useActiveSection } from '../../hooks/useActiveSection'
import { useScrollLock } from '../../hooks/useScrollLock'
import { useScrollTo } from '../../hooks/useScrollTo'
import { cn, ease } from '../../lib/utils'
import { Monogram } from '../brand/Monogram'
import { Button } from '../ui/Button'
import { LiveDot } from '../ui/LiveDot'

const SECTIONS = ['top', 'about', ...nav.map((n) => n.id), 'contact']

export function Nav() {
  const introDone = useIntroDone()
  const scrollTo = useScrollTo()
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [focusWithin, setFocusWithin] = useState(false)
  const active = useActiveSection(SECTIONS)
  // The design canvas brings its own (Figma-style) toolbar, so the site nav steps aside there.
  const immersive = active === 'design'

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setScrolled(y > 24)
    if (Math.abs(y - prev) < 4) return
    setHidden(y > prev && y > 480)
  })

  const go = useCallback(
    (id) => (e) => {
      e.preventDefault()
      setMenuOpen(false)
      scrollTo(id)
    },
    [scrollTo],
  )

  const closeMenu = useCallback(() => setMenuOpen(false), [])
  const showBar = introDone && (menuOpen || focusWithin || (!hidden && !immersive))

  return (
    <>
      <motion.header
        onFocus={() => setFocusWithin(true)}
        onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setFocusWithin(false)}
        className="fixed inset-x-0 top-0 z-50"
        initial={{ y: '-100%' }}
        animate={{ y: showBar ? '0%' : '-100%' }}
        transition={{ duration: 0.7, ease: ease.expo }}
      >
        <div
          className={cn(
            'border-b transition-[background-color,border-color] duration-500',
            scrolled || menuOpen ? 'border-white/[0.06] bg-ink-950/75 backdrop-blur-xl' : 'border-transparent',
          )}
        >
          <nav aria-label="Primary" className="page-x flex h-16 items-center justify-between gap-6 sm:h-[72px]">
            <a href="#top" onClick={go('top')} className="flex items-center gap-3" aria-label={`${profile.name} — back to top`}>
              <Monogram className="size-9 text-bone" />
              <span className="hidden text-[15px] font-medium tracking-[-0.01em] sm:block">{profile.name}</span>
            </a>

            <ul className="hidden items-center gap-1 lg:flex">
              {nav.map((item) => {
                const isActive = active === item.id
                return (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      onClick={go(item.id)}
                      aria-current={isActive ? 'location' : undefined}
                      className={cn(
                        'relative block px-3.5 py-2 text-sm transition-colors duration-300',
                        isActive ? 'text-bone' : 'text-mist hover:text-bone',
                      )}
                    >
                      {item.label}
                      {isActive && (
                        <motion.span
                          layoutId="nav-active"
                          className="absolute inset-x-0 bottom-0 mx-auto size-1 rounded-full bg-lilac-300"
                          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                        />
                      )}
                    </a>
                  </li>
                )
              })}
            </ul>

            <div className="flex items-center gap-4">
              <span className="hidden items-center gap-2 text-[13px] text-mist md:flex">
                <LiveDot /> Open to work
              </span>
              <Button href="#contact" onClick={go('contact')} variant="secondary" size="sm" className="hidden sm:inline-flex">
                Contact
              </Button>
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                className="grid size-10 place-items-center rounded-full border border-white/15 lg:hidden"
              >
                <span className="relative block h-3 w-[18px]">
                  <motion.span
                    className="absolute inset-x-0 top-0 h-[1.5px] rounded-full bg-bone"
                    animate={menuOpen ? { y: 5.25, rotate: 45 } : { y: 0, rotate: 0 }}
                    transition={{ duration: 0.4, ease: ease.expo }}
                  />
                  <motion.span
                    className="absolute inset-x-0 bottom-0 h-[1.5px] rounded-full bg-bone"
                    animate={menuOpen ? { y: -5.25, rotate: -45 } : { y: 0, rotate: 0 }}
                    transition={{ duration: 0.4, ease: ease.expo }}
                  />
                </span>
              </button>
            </div>
          </nav>
        </div>
      </motion.header>

      <MobileMenu open={menuOpen} onClose={closeMenu} onNavigate={go} active={active} />
    </>
  )
}

function MobileMenu({ open, onClose, onNavigate, active }) {
  useScrollLock(open)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const items = [...nav, { id: 'contact', label: 'Contact' }]

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          className="fixed inset-0 z-40 overflow-y-auto bg-ink-950 pt-24 lg:hidden"
          initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
          animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
          transition={{ duration: 0.75, ease: ease.cine }}
          data-lenis-prevent
        >
          <div className="page-x flex min-h-full flex-col justify-between gap-12 pb-10">
            <ul>
              {items.map((item, i) => (
                <li key={item.id} className="overflow-hidden border-b border-white/[0.06]">
                  <motion.a
                    href={`#${item.id}`}
                    onClick={onNavigate(item.id)}
                    className="flex items-baseline gap-4 py-3"
                    initial={{ y: '100%' }}
                    animate={{ y: '0%' }}
                    exit={{ y: '100%', transition: { duration: 0.3 } }}
                    transition={{ duration: 0.8, ease: ease.expo, delay: 0.2 + i * 0.05 }}
                  >
                    <span className="font-mono text-xs text-fog">{String(i + 1).padStart(2, '0')}</span>
                    <span
                      className={cn(
                        'font-display text-[clamp(2.75rem,13vw,4.5rem)] leading-[1.02]',
                        active === item.id ? 'text-lilac-300 italic' : 'text-bone',
                      )}
                    >
                      {item.label}
                    </span>
                  </motion.a>
                </li>
              ))}
            </ul>

            <motion.div
              className="space-y-5"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: ease.expo, delay: 0.5 }}
            >
              <p className="flex items-center gap-2 text-sm text-mist">
                <LiveDot /> Open to work — {profile.availability.join(' · ')}
              </p>
              <div className="flex flex-wrap gap-3">
                <Button href={`mailto:${profile.email}`} size="sm">
                  {profile.email}
                </Button>
                <Button href={profile.resume} download variant="secondary" size="sm" icon={<ArrowUpRightIcon size={14} />}>
                  Résumé
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
