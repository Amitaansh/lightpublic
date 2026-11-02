'use client'

import { useState } from 'react'
import { copy } from '@/content/chapters'
import { insideGroups } from '@/content/inside'
import { HOME_CHAPTERS } from '@/lib/chapters'
import { useLight } from '@/lib/store'
import { autoInsideGroup } from '@/three/baton/dimensions'
import { AnimationNote, ConceptLabel, Eyebrow } from '../ui/bits'
import { ChapterPoster } from '../ui/ChapterPoster'
import { LineReveal } from '../ui/LineReveal'
import { Chapter } from './Chapter'

const def = HOME_CHAPTERS[8]

/**
 * 09 · Inside the baton (I8). Scrolling explodes the baton; the parts are a
 * list of buttons in assembly order, laid out under the parts they describe.
 * Opening one highlights its group in the 3D view.
 */
export function Inside() {
  const [open, setOpen] = useState<string | null>(null)
  const p = useLight((s) => s.pin.inside ?? 0)
  const chosen = useLight((s) => s.focusGroup)
  const active = chosen ?? autoInsideGroup(p)

  const toggle = (id: string, group: string) => {
    const next = open === id ? null : id
    setOpen(next)
    useLight.getState().set({ focusGroup: next ? (group as never) : null })
  }

  return (
    <Chapter def={def} pinned="320vh" rail="none" className="inside">
      <div className="copy inside__intro">
        <Eyebrow n={def.n}>{copy.inside.eyebrow}</Eyebrow>
        <LineReveal id={`${def.id}-title`} className="t-h2">
          {copy.inside.title}
        </LineReveal>
        <p className="t-body measure">{copy.inside.lead}</p>
      </div>
      <div className="inside__stage" aria-hidden="true">
        <ChapterPoster name="inside" />
      </div>
      <div className="inside__groups">
        {insideGroups.map((g) => (
          <section key={g.id} className="hotspot-group" data-active={active === g.id} aria-labelledby={`hs-${g.id}`}>
            <h3 id={`hs-${g.id}`} className="hotspot-group__title t-label">
              {g.title}
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {g.items.map((it) => (
                <li key={it.id}>
                  <button
                    type="button"
                    className="hotspot"
                    aria-expanded={open === it.id}
                    aria-controls={`hs-detail-${it.id}`}
                    onClick={() => toggle(it.id, g.id)}
                    data-cursor="open"
                  >
                    <span>{it.label}</span>
                    <svg className="hotspot__icon" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                      <path d="M7 1V13M1 7H13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  </button>
                  <div id={`hs-detail-${it.id}`} className="hotspot-detail" hidden={open !== it.id}>
                    {it.detail}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <div className="inside__foot">
        <AnimationNote>{copy.inside.animationNote}</AnimationNote>
        <p className="t-label t-secondary">{copy.inside.footnote}</p>
        <ConceptLabel>Concept visual · illustrative internals</ConceptLabel>
      </div>
    </Chapter>
  )
}
