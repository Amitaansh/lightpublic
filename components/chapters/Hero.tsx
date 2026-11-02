import { copy } from '@/content/chapters'
import { HOME_CHAPTERS } from '@/lib/chapters'
import { ButtonLink } from '../ui/Button'
import { ConceptLabel, Eyebrow } from '../ui/bits'
import { ChapterPoster } from '../ui/ChapterPoster'
import { LineReveal } from '../ui/LineReveal'
import { Chapter } from './Chapter'
import { HeroDragSurface, RotateButtons } from './HeroControls'

const def = HOME_CHAPTERS[0]

/** 01 · Hero (docs/04 §3). */
export function Hero() {
  return (
    <Chapter def={def} className="hero">
      <div className="copy" style={{ background: 'transparent' }}>
        <Eyebrow n={def.n}>{copy.hero.eyebrow}</Eyebrow>
        <LineReveal as="h1" id="top-title" className="t-h1" immediate>
          {copy.hero.title}
        </LineReveal>
        <p className="t-lead-serif measure">{copy.hero.lead}</p>
        <div className="flex flex-wrap gap-3 pt-2">
          <ButtonLink href="/contact" variant="primary" magnetic cursor="open">
            Get in touch
          </ButtonLink>
          <ButtonLink href="#prototype" variant="secondary">
            See the software prototype
          </ButtonLink>
        </div>
      </div>
      <div className="visual-rail hero__visual" aria-hidden="true">
        <ChapterPoster name="hero" />
      </div>
      <div className="col-span-12 flex flex-wrap items-end justify-between gap-4 pb-6 pt-10" style={{ alignSelf: 'end' }}>
        <div className="flex flex-wrap items-center gap-4">
          <RotateButtons />
          <ConceptLabel>Concept visual · real-time 3D</ConceptLabel>
        </div>
        <p className="scroll-cue t-label" aria-hidden="true">
          <span className="scroll-cue__line" />
          scroll to explore
        </p>
      </div>
      <HeroDragSurface />
      <div className="statement-layer t-statement" aria-hidden="true">
        be your light
      </div>
    </Chapter>
  )
}
