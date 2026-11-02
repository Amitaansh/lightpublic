'use client'

import { copy } from '@/content/chapters'
import { HOME_CHAPTERS } from '@/lib/chapters'
import { useLight } from '@/lib/store'
import { AnimationNote, ConceptLabel, Eyebrow, SignalDot } from '../ui/bits'
import { ChapterPoster } from '../ui/ChapterPoster'
import { LineReveal } from '../ui/LineReveal'
import { Chapter } from './Chapter'

const def = HOME_CHAPTERS[2]

/** 03 · Clips onto the cane you already trust (pinned; scroll scrubs the clip-on). */
export function CaneClip() {
  const p = useLight((s) => s.pin.cane ?? 0)
  const step = p < 0.3 ? 0 : p < 0.62 ? 1 : 2

  return (
    <Chapter def={def} pinned="240vh">
      <div className="copy">
        <Eyebrow n={def.n}>{copy.cane.eyebrow}</Eyebrow>
        <LineReveal id={`${def.id}-title`} className="t-h2">
          {copy.cane.title}
        </LineReveal>
        {copy.cane.body.map((t) => (
          <p key={t} className="t-body measure">
            {t}
          </p>
        ))}
        <ul className="fact-list">
          {copy.cane.facts.map((f) => (
            <li key={f.text}>
              <SignalDot />
              <span>{f.text}</span>
            </li>
          ))}
        </ul>
        <ol className="rule-list t-body" aria-label="How it clips on">
          {copy.cane.steps.map((s, i) => (
            <li key={s} className="numbered-item" data-dim={i !== step}>
              <span className="numbered-item__n" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
        <AnimationNote>{copy.cane.animationNote}</AnimationNote>
        <ConceptLabel />
      </div>
      <div className="visual-rail" aria-hidden="true">
        <ChapterPoster name="cane" />
      </div>
    </Chapter>
  )
}
