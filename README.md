# Rohit Kumar Pandey — Portfolio

Personal portfolio for Rohit Kumar Pandey, UI/UX designer and AI-assisted video editor.

The visual language comes from his two crafts: an edit suite (viewfinder, timecode, REC light,
filmstrip, a scroll-scrubbed NLE timeline) and a design file (FigJam canvas, Figma selection
handles, multiplayer cursor). The palette is sampled from his portrait backdrop (`#686480`) and
the lilac print on his tee (`#a8a5c8`).

## Stack

- React 19 + Vite 8
- Tailwind CSS 4 (tokens live in `src/index.css` under `@theme`)
- Motion (Framer Motion) for animation, Lenis for smooth scrolling
- Phosphor icons, self-hosted fonts via Fontsource (Instrument Serif, Geist, Geist Mono)

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build → dist/
npm run preview   # serve the production build
npm run format    # Prettier
```

## Editing content

All copy and data — profile, links, videos, chapters, pipeline steps, case studies, tools,
experience — is in **`src/data/content.js`**. Components never hard-code copy.

- `*word*` renders as the italic serif accent; `\n` is a line break; `|` is a line break on
  tablet/desktop only.
- Résumé download: `public/Rohit-Kumar-Pandey-Resume.pdf`.

## Media

Originals stay untouched in `assets/` (git-ignored — the main export alone is 184 MB).
Web copies live in `public/media/`:

| File | What |
| --- | --- |
| `wedding-film-1080.mp4` / `-720.mp4` | Featured film, H.264 30 fps with faststart; the player picks 1080p on large screens, 720p on phones or Data Saver |
| `*-preview.mp4` | Silent preview loops for cards (the wedding one is a 10 s highlight montage) |
| `*-poster.webp` | Poster frames |
| `scenes/scene-NN.webp` | Chapter thumbnails for the scene index and the seek-bar preview |
| `process/*.webp` | Stills used in the Process timeline |

To add a film: put the MP4, a preview loop and a poster in `public/media/`, then add an entry
to `videos` in `content.js` (width/height/duration/fps are used for framing and timecode).
Short clips that already have `faststart` can be copied as-is; long exports should be
re-encoded, e.g.

```bash
ffmpeg -i input.mp4 -vf "fps=30,scale=1920:1080" -c:v libx264 -preset slow -crf 23 \
  -maxrate 4M -bufsize 8M -pix_fmt yuv420p -c:a aac -b:a 160k -movflags +faststart out.mp4
```

## Player

Custom lightbox player (`src/components/player/`): opens from whichever thumbnail was clicked,
chapter-segmented seek bar with scene previews, frame-accurate SMPTE timecode, and editor
shortcuts — `Space`/`K` play, `J`/`L` ±10 s, `←`/`→` ±5 s, `,`/`.` step a frame, `M` mute,
`F` full screen, `N`/`P` next/previous, `Esc` close.

## Deploying

Any static host works (Vercel, Netlify, Cloudflare Pages): build command `npm run build`,
output directory `dist`. After deploying, change `og:image` in `index.html` to the absolute URL
(`https://your-domain/og-image.jpg`) so LinkedIn and WhatsApp show the preview card.

## Accessibility & motion

- Respects `prefers-reduced-motion`: no intro, no smooth scrolling, transforms switched off.
- Keyboard: skip link, visible focus, focus trap and focus return in the player.
- The intro plays once per browser session; click or press any key to skip it.
