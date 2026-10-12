import { motion } from 'motion/react'
import { videos } from '../../data/content'
import { cn, ease } from '../../lib/utils'

const film = videos[0]
const scene = (n) => film.chapters[n - 1].thumb

// One illustration per pipeline step, built from Rohit's own footage where possible.
export function StepVisual({ kind }) {
  switch (kind) {
    case 'script':
      return <ScriptPage />
    case 'generate':
      return <GenerateGrid />
    case 'assemble':
      return <AssemblyStrip />
    case 'motion':
      return <MotionTitle />
    case 'polish':
      return <Scopes />
    case 'deliver':
      return <Deliverables />
    default:
      return null
  }
}

function Frame({ children, className }) {
  return <div className={cn('relative size-full overflow-hidden', className)}>{children}</div>
}

function ScriptPage() {
  const lines = [
    { t: 'SCENE 06 — MEHANDI', c: 'text-bone font-medium' },
    { t: 'WIDE. Courtyard, marigold canopy, late-afternoon light.', c: 'text-mist' },
    { t: 'SUPER: 29 November · 05:00 pm — Our Residence', c: 'text-lilac-300' },
    { t: 'CLOSE. Henna on open palms. Laughter off-screen.', c: 'text-mist' },
    { t: 'MUSIC: dholak enters on the cut.', c: 'text-mist' },
    { t: 'TITLE: “Mehandi” — hand-lettered, warm gold.', c: 'text-lilac-300' },
  ]
  return (
    <Frame className="grid place-items-center p-5 sm:p-8">
      <div className="w-full max-w-md rounded-[12px] border border-white/[0.08] bg-ink-850 p-5 font-mono text-[11px] leading-relaxed sm:p-6 sm:text-[12px]">
        <p className="mb-4 flex justify-between text-[10px] tracking-[0.14em] text-fog uppercase">
          <span>Shot list · draft 3</span>
          <span>p. 2</span>
        </p>
        {lines.map((l, i) => (
          <motion.p
            key={l.t}
            className={cn('mb-2', l.c)}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.15 + i * 0.12, ease: ease.expo }}
          >
            {l.t}
          </motion.p>
        ))}
        <span className="inline-block h-3.5 w-1.5 animate-rec bg-lilac-300 align-middle" />
      </div>
    </Frame>
  )
}

function GenerateGrid() {
  const takes = [1, 2, 3, 4]
  return (
    <Frame className="grid place-items-center p-3 sm:p-5">
      <div className="grid w-full grid-cols-2 gap-2 sm:gap-3">
        {takes.map((n, i) => (
          <div key={n} className="relative aspect-video overflow-hidden rounded-[10px] bg-ink-800">
            <motion.img
              src={`/media/process/generate-${n}.webp`}
              alt=""
              className="size-full object-cover"
              initial={{ filter: 'blur(14px) saturate(0.4)', scale: 1.08 }}
              animate={{ filter: 'blur(0px) saturate(1)', scale: 1 }}
              transition={{ duration: 1.1, delay: 0.1 + i * 0.18, ease: ease.expo }}
            />
            <motion.span
              className="absolute inset-y-0 w-1/3 bg-linear-to-r from-transparent via-white/25 to-transparent"
              initial={{ left: '-40%' }}
              animate={{ left: '120%' }}
              transition={{ duration: 1.1, delay: 0.1 + i * 0.18, ease: 'easeInOut' }}
            />
            <span className="absolute bottom-1.5 left-1.5 rounded-[5px] bg-ink-950/70 px-1.5 py-0.5 font-mono text-[9.5px] text-bone/85">
              take {String(i + 1).padStart(2, '0')}
            </span>
          </div>
        ))}
        <p className="col-span-2 mt-1 flex items-center gap-2 font-mono text-[10.5px] text-mist">
          <span className="rounded-full bg-lilac-300 px-2 py-0.5 font-sans text-[10.5px] font-semibold text-ink-950">
            Consistent
          </span>
          Same couple, every scene
        </p>
      </div>
    </Frame>
  )
}

function AssemblyStrip() {
  const shots = [1, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
  return (
    <Frame className="flex flex-col justify-center gap-4 p-4 sm:p-6">
      <div className="overflow-hidden">
        <motion.div
          className="flex w-max gap-1.5"
          initial={{ x: 0 }}
          animate={{ x: '-38%' }}
          transition={{ duration: 7, ease: 'linear' }}
        >
          {shots.map((n) => (
            <img key={n} src={scene(n)} alt="" className="aspect-video h-20 rounded-[6px] object-cover sm:h-28" />
          ))}
        </motion.div>
      </div>
      <div className="flex items-center justify-between font-mono text-[10.5px] text-fog">
        <span>15 beats</span>
        <span className="h-px flex-1 mx-3 bg-white/10" />
        <span className="text-bone">1:42 to music</span>
      </div>
    </Frame>
  )
}

function MotionTitle() {
  const keys = [8, 22, 36, 64, 78]
  return (
    <Frame className="flex flex-col justify-center gap-3 p-3 sm:p-5">
      <div className="relative aspect-video w-full overflow-hidden rounded-[10px]">
        <img src="/media/process/motion-title.webp" alt="" className="size-full object-cover" />
        <span className="absolute inset-[8%] rounded-[4px] border border-dashed border-white/40" />
        <span className="absolute top-[9%] right-[9%] font-mono text-[9px] tracking-[0.12em] text-white/70">TITLE SAFE</span>
      </div>
      <div className="relative h-7 shrink-0 rounded-[6px] bg-ink-850 px-2">
        <span className="absolute inset-x-2 top-1/2 h-px bg-white/10" />
        {keys.map((k, i) => (
          <motion.span
            key={k}
            className="absolute top-1/2 size-2.5 -translate-1/2 rotate-45 bg-lilac-300"
            style={{ left: `${k}%` }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 + i * 0.1, type: 'spring', stiffness: 400, damping: 18 }}
          />
        ))}
      </div>
    </Frame>
  )
}

function Scopes() {
  const parade = ['bg-[#ff6b6b]', 'bg-[#6bdc8b]', 'bg-[#6ba8ff]']
  return (
    <Frame className="grid grid-cols-[0.8fr_1fr] gap-3 p-3 sm:gap-4 sm:p-5">
      <div className="relative overflow-hidden rounded-[10px]">
        <img src={videos[2].poster} alt="" className="size-full object-cover" />
        <span className="absolute top-2 left-2 rounded-[5px] bg-ink-950/70 px-1.5 py-0.5 font-mono text-[9.5px] text-bone/85">
          Night Run · grade
        </span>
      </div>
      <div className="flex min-h-0 flex-col gap-3">
        <div className="relative flex-1 overflow-hidden rounded-[10px] bg-ink-950 p-3">
          <p className="font-mono text-[9.5px] tracking-[0.12em] text-fog">RGB PARADE</p>
          <div className="mt-2 grid h-[calc(100%-1.5rem)] grid-cols-3 gap-1.5">
            {parade.map((color, c) => (
              <div key={color} className="relative flex items-end gap-px">
                {Array.from({ length: 14 }, (_, i) => {
                  const h = 22 + Math.abs(Math.sin((i + 1) * (c + 2) * 0.9)) * 64
                  return (
                    <motion.span
                      key={i}
                      className={cn('w-full rounded-t-[1px] opacity-70', color)}
                      initial={{ height: '6%' }}
                      animate={{ height: `${h}%` }}
                      transition={{ duration: 0.8, delay: 0.05 * i, ease: ease.expo }}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[10px] bg-ink-950 p-3">
          <p className="font-mono text-[9.5px] tracking-[0.12em] text-fog">VOICE · LOUDNESS</p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-mint"
              initial={{ width: '20%' }}
              animate={{ width: '78%' }}
              transition={{ duration: 1.2, ease: ease.expo }}
            />
          </div>
        </div>
      </div>
    </Frame>
  )
}

function Deliverables() {
  // 16:9 over 2.39:1 on the left, 9:16 spanning both on the right — the column ratio
  // (≈1.75 : 1) makes the vertical frame's height match the stack beside it.
  const appear = (i) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay: 0.1 + i * 0.12, ease: ease.expo },
  })
  const Label = ({ children }) => (
    <span className="absolute bottom-2 left-2 rounded-[5px] bg-ink-950/75 px-1.5 py-0.5 font-mono text-[10px] text-bone/90">
      {children}
    </span>
  )
  return (
    <Frame className="grid place-items-center p-4 sm:p-6">
      <div className="grid w-full grid-cols-[1.75fr_1fr] gap-3">
        <div className="flex flex-col gap-3">
          <motion.div {...appear(0)} className="relative aspect-video overflow-hidden rounded-[8px] ring-1 ring-white/10">
            <img src={videos[0].posterSmall} alt="" className="size-full object-cover" />
            <Label>16:9</Label>
          </motion.div>
          <motion.div {...appear(1)} className="relative aspect-[1280/544] overflow-hidden rounded-[8px] ring-1 ring-white/10">
            <img src={videos[3].poster} alt="" className="size-full object-cover" />
            <Label>2.39:1</Label>
          </motion.div>
        </div>
        <motion.div {...appear(2)} className="relative overflow-hidden rounded-[8px] ring-1 ring-white/10">
          <img src={videos[2].poster} alt="" className="size-full object-cover" />
          <Label>9:16</Label>
        </motion.div>
      </div>
    </Frame>
  )
}
