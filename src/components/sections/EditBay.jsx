import { videos } from '../../data/content'
import { formatDuration } from '../../lib/utils'
import { SectionHeader } from '../ui/SectionHeader'
import { FeaturedFilm } from '../work/FeaturedFilm'
import { FramingChart } from '../work/FramingChart'
import { VideoCard } from '../work/VideoCard'

const runtime = videos.reduce((sum, v) => sum + v.duration, 0)

export function EditBay() {
  return (
    <section id="work" aria-labelledby="work-title" className="relative pt-24 pb-10 sm:pt-32 sm:pb-14">
      <div className="page-x">
        <SectionHeader
          id="work-title"
          index="02"
          label="Edit bay"
          title="Selected *edits*"
          intro="AI-generated worlds, cut like real footage. Every piece below was built for a specific screen — cinema-wide, landscape or vertical."
          aside={
            <dl className="mt-7 flex gap-8 font-mono text-[11px] tracking-[0.1em] text-fog uppercase">
              <div>
                <dt>Films</dt>
                <dd className="mt-1.5 text-base tracking-normal text-bone">{String(videos.length).padStart(2, '0')}</dd>
              </div>
              <div>
                <dt>Runtime</dt>
                <dd className="mt-1.5 text-base tracking-normal text-bone">{formatDuration(runtime)}</dd>
              </div>
              <div>
                <dt>Formats</dt>
                <dd className="mt-1.5 text-base tracking-normal text-bone">03</dd>
              </div>
            </dl>
          }
        />

        <FeaturedFilm />

        <div className="mt-24 grid gap-x-6 gap-y-16 sm:mt-32 lg:grid-cols-12">
          <div className="grid grid-cols-2 gap-x-4 gap-y-14 sm:gap-x-6 lg:contents">
            <VideoCard video={videos[1]} className="lg:col-span-3" compact />
            <VideoCard video={videos[2]} className="lg:col-span-3" delay={0.08} compact />
          </div>
          <div className="flex flex-col gap-10 lg:col-span-6">
            <VideoCard video={videos[3]} delay={0.16} />
            <FramingChart />
          </div>
        </div>
      </div>
    </section>
  )
}
