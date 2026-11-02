'use client'

import { useRef, type KeyboardEvent } from 'react'
import { copy } from '@/content/chapters'
import { ladder } from '@/content/reliability'
import { HOME_CHAPTERS } from '@/lib/chapters'
import { useLight } from '@/lib/store'
import { AnimationNote, ConceptLabel, Eyebrow, SignalDot } from '../ui/bits'
import { ChapterPoster } from '../ui/ChapterPoster'
import { LineReveal } from '../ui/LineReveal'
import { Chapter } from './Chapter'

const def = HOME_CHAPTERS[3]

/** I3: the fallback ladder as an accessible tablist (automatic activation). */
function Ladder() {
  const level = useLight((s) => s.ladderLevel)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const select = (i: number, focus = false) => {
    const prev = useLight.getState().ladderLevel
    if (i === prev) return
    useLight.getState().set({ ladderLevel: i })
    // Every step down is announced: one light-ring swell (PRD-F-022).
    if (i > prev) useLight.getState().pulseRing('swell')
    if (focus) tabs.current[i]?.focus()
  }
  const onKey = (e: KeyboardEvent) => {
    const n = ladder.length
    const map: Record<string, number> = {
      ArrowRight: (level + 1) % n,
      ArrowDown: (level + 1) % n,
      ArrowLeft: (level - 1 + n) % n,
      ArrowUp: (level - 1 + n) % n,
      Home: 0,
      End: n - 1,
    }
    if (e.key in map) {
      e.preventDefault()
      select(map[e.key], true)
    }
  }
  const current = ladder[level]
  return (
    <div className="stepper">
      <p className="t-label" id="ladder-label">
        The fallback ladder: choose a level
      </p>
      <div className="stepper__list mt-2" role="tablist" aria-labelledby="ladder-label" onKeyDown={onKey}>
        {ladder.map((l, i) => (
          <button
            key={l.id}
            ref={(el) => {
              tabs.current[i] = el
            }}
            type="button"
            role="tab"
            id={`ladder-tab-${l.id}`}
            aria-selected={i === level}
            aria-controls="ladder-panel"
            tabIndex={i === level ? 0 : -1}
            className="stepper__tab"
            data-cursor="step"
            onClick={() => select(i)}
          >
            <span className="numeral" aria-hidden="true">
              L{4 - i}
            </span>
            <span>{l.name}</span>
          </button>
        ))}
      </div>
      <div className="stepper__panel" role="tabpanel" id="ladder-panel" aria-labelledby={`ladder-tab-${current.id}`}>
        <p className="t-lead-serif">{current.text}</p>
      </div>
    </div>
  )
}

/** 04 · Never fails silently. */
export function Reliability() {
  const level = useLight((s) => s.ladderLevel)
  return (
    <Chapter def={def} rail="right">
      <div className="copy">
        <Eyebrow n={def.n}>{copy.reliability.eyebrow}</Eyebrow>
        <LineReveal id={`${def.id}-title`} className="t-h2">
          {copy.reliability.title}
        </LineReveal>
        <p className="t-lead-serif measure-wide">{copy.reliability.lead}</p>
        <Ladder />
        <ul className="fact-list t-body">
          {copy.reliability.facts.map((f) => (
            <li key={f.text}>
              <SignalDot />
              <span>{f.text}</span>
            </li>
          ))}
        </ul>
        <AnimationNote>{copy.reliability.animationNote}</AnimationNote>
        <ConceptLabel>Concept visual · illustrative internals</ConceptLabel>
      </div>
      <div className="visual-rail visual-rail--sticky" aria-hidden="true">
        <ChapterPoster name={`reliability-${level}`} />
      </div>
    </Chapter>
  )
}
