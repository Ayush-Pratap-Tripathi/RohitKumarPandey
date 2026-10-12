export { clsx as cn } from 'clsx'

// Motion curves, named after how they feel in an edit.
export const ease = {
  expo: [0.16, 1, 0.3, 1], // long, confident settle — reveals
  cine: [0.76, 0, 0.24, 1], // symmetric in-out — wipes and shutters
  soft: [0.22, 1, 0.36, 1],
}

export const clamp = (v, min, max) => Math.min(max, Math.max(min, v))

export function formatDuration(seconds) {
  const total = Math.round(seconds)
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export function spokenDuration(seconds) {
  const total = Math.round(seconds)
  const m = Math.floor(total / 60)
  const s = total % 60
  const parts = []
  if (m) parts.push(`${m} minute${m === 1 ? '' : 's'}`)
  if (s || !m) parts.push(`${s} second${s === 1 ? '' : 's'}`)
  return parts.join(' ')
}

// SMPTE-style HH:MM:SS:FF
export function formatTimecode(seconds, fps = 30) {
  const safe = Math.max(0, seconds || 0)
  const whole = Math.floor(safe)
  const h = Math.floor(whole / 3600)
  const m = Math.floor((whole % 3600) / 60)
  const s = whole % 60
  const f = Math.min(fps - 1, Math.floor((safe - whole) * fps))
  return [h, m, s, f].map((n) => String(n).padStart(2, '0')).join(':')
}

// "Selected *edits*" → [{ text: 'Selected', accent: false }, { text: 'edits', accent: true }]
// "\n" is a hard line break; "|" breaks on tablet/desktop only (phones wrap naturally).
// `join` marks a word that touches the previous one with no space ("*frames*." → "frames" + ".").
export function parseAccents(input) {
  const tokens = []
  input.split(/(\n|\|)/).forEach((line) => {
    if (line === '\n' || line === '|') {
      tokens.push({ br: true, soft: line === '|' })
      return
    }
    let prevEndsWithSpace = true
    line.split(/(\*[^*]+\*)/g).forEach((part) => {
      if (!part) return
      const accent = part.startsWith('*') && part.endsWith('*')
      const text = accent ? part.slice(1, -1) : part
      const startsWithSpace = /^\s/.test(text)
      text
        .split(/\s+/)
        .filter(Boolean)
        .forEach((word, i) => tokens.push({ text: word, accent, join: i === 0 && !startsWithSpace && !prevEndsWithSpace }))
      prevEndsWithSpace = /\s$/.test(text)
    })
  })
  return tokens
}

// Space before a token unless it hugs the previous word. (After a <br> the space collapses,
// and when a soft break is hidden on phones it keeps the two words apart.)
export const spaceBefore = (tokens, i) => (i > 0 && !tokens[i].join ? ' ' : '')

export const plainText = (text) => text.replace(/\*/g, '').replace(/[\n|]/g, ' ')

// Data Saver / "Lite mode" on phones — skip silent autoplay previews when it's on.
export const saveData = () => typeof navigator !== 'undefined' && Boolean(navigator.connection?.saveData)

export function pickSource(video) {
  if (typeof window === 'undefined') return video.sources[video.sources.length - 1].src
  const saveData = navigator.connection?.saveData
  const width = window.innerWidth * Math.min(window.devicePixelRatio || 1, 2)
  const match = video.sources.find((s) => !saveData && width >= s.minWidth)
  return (match ?? video.sources[video.sources.length - 1]).src
}

export const wrap = (min, max, v) => {
  const range = max - min
  return ((((v - min) % range) + range) % range) + min
}
