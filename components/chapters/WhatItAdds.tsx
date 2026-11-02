'use client'

import { useEffect } from 'react'
import { copy } from '@/content/chapters'
import { HOME_CHAPTERS } from '@/lib/chapters'
import { useLight } from '@/lib/store'
import { AnimationNote, Eyebrow } from '../ui/bits'
import { ChapterPoster } from '../ui/ChapterPoster'
import { LineReveal } from '../ui/LineReveal'
import { Chapter } from './Chapter'

const def = HOME_CHAPTERS[1]

/** 02 · What the cane can't reach. Each item lights its sensing cone as it is reached. */
export function WhatItAdds() {
  const p = useLight((s) => s.progress['what-it-adds'] ?? 0)
  const active = Math.min(3, Math.max(0, Math.floor(((p - 0.18) / 0.62) * 4)))
  useEffect(() => {
    useLight.getState().set({ activeCone: active })
  }, [active])

  return (
    <Chapter def={def}>
      <div className="copy">
        <Eyebrow n={def.n}>{copy.whatItAdds.eyebrow}</Eyebrow>
        <LineReveal id={`${def.id}-title`} className="t-h2">
          {copy.whatItAdds.title}
        </LineReveal>
        <ol className="rule-list" style={{ marginTop: '2rem' }}>
          {copy.whatItAdds.items.map((item, i) => (
            <li key={item.n} className="numbered-item" data-dim={i !== active}>
              <span className="numbered-item__n" aria-hidden="true">
                {item.n}
              </span>
              <div>
                <h3 className="t-h3">{item.title}</h3>
                <p className="t-body mt-1">{item.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <AnimationNote>{copy.whatItAdds.animationNote}</AnimationNote>
      </div>
      <div className="visual-rail" aria-hidden="true">
        <ChapterPoster name="what-it-adds" />
      </div>
    </Chapter>
  )
}
