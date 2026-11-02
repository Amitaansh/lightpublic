'use client'

import { useEffect, useRef, useState } from 'react'
import { copy } from '@/content/chapters'
import { HOME_CHAPTERS } from '@/lib/chapters'
import { useLight } from '@/lib/store'
import { AnimationNote, Eyebrow } from '../ui/bits'
import { Button } from '../ui/Button'
import { ChapterPoster } from '../ui/ChapterPoster'
import { LineReveal } from '../ui/LineReveal'
import { Chapter } from './Chapter'

const def = HOME_CHAPTERS[4]
const PLAY_MS = 4200

/** Line drawing (R2): two walkers record a note that becomes a pin; later one walker hears it. */
function NotesScene({ playing }: { playing: boolean }) {
  const bars = [6, 14, 22, 12, 26, 18, 9, 20, 12, 6]
  return (
    <svg className="diagram" viewBox="0 0 600 420" role="img" aria-labelledby="gn-scene-title" data-playing={playing}>
      <title id="gn-scene-title">
        Illustration: two people walk a path and a voice note is pinned at a spot. Later, one person reaches the pin and the note plays to an earbud.
      </title>
      <g fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M30 330 C 160 330, 200 230, 300 230 S 450 130, 570 120" />
        {/* recording: two figures */}
        <circle cx="96" cy="262" r="13" />
        <path d="M96 278 V 318 M 82 296 H 110" />
        <circle cx="132" cy="258" r="13" />
        <path d="M132 274 V 314 M 118 292 H 146" />
        {/* later: one figure near the pin */}
        <circle cx="430" cy="128" r="13" />
        <path d="M430 144 V 184 M 416 162 H 444 M 430 184 L 470 236" />
      </g>
      {/* waveform rising into a pin */}
      <g transform="translate(232 120)">
        {bars.map((h, i) => (
          <rect
            key={i}
            x={i * 9}
            y={40 - h}
            width="5"
            height={h * 2}
            rx="2.5"
            className="gn-bar"
            style={{ animationDelay: `${i * 70}ms` }}
            fill="currentColor"
          />
        ))}
      </g>
      <g transform="translate(300 230)">
        <path d="M0 0 C -18 -24 -18 -44 0 -52 C 18 -44 18 -24 0 0 Z" fill="var(--signal)" stroke="var(--signal-edge)" strokeWidth="3" className="gn-pin" />
        <circle cx="0" cy="-34" r="6" fill="currentColor" />
      </g>
      {/* earbud with sound arcs */}
      <g transform="translate(470 92)" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round">
        <circle cx="0" cy="0" r="9" fill="var(--signal)" stroke="var(--signal-edge)" strokeWidth="3" />
        <path d="M18 -14 Q 28 0 18 14" className="gn-arc" />
        <path d="M30 -24 Q 46 0 30 24" className="gn-arc" style={{ animationDelay: '200ms' }} />
      </g>
    </svg>
  )
}

/** 05 · Guide Notes. */
export function GuideNotes() {
  const [playing, setPlaying] = useState(false)
  const timer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  const play = () => {
    setPlaying(true)
    useLight.getState().set({ notePlaying: true })
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      setPlaying(false)
      useLight.getState().set({ notePlaying: false })
    }, PLAY_MS)
  }

  return (
    <Chapter def={def} rail="right">
      <div className="copy">
        <Eyebrow n={def.n}>{copy.guideNotes.eyebrow}</Eyebrow>
        <LineReveal id={`${def.id}-title`} className="t-h2">
          {copy.guideNotes.title}
        </LineReveal>
        {copy.guideNotes.body.map((t) => (
          <p key={t} className="t-body measure">
            {t}
          </p>
        ))}
        <figure className="rule-list" style={{ margin: '2rem 0 0' }}>
          <blockquote className="t-lead-serif" style={{ padding: '1.25rem 0' }}>
            “{copy.guideNotes.note}”
          </blockquote>
          <figcaption className="t-label t-secondary pb-4">Example Guide Note, recorded by a companion</figcaption>
        </figure>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary" onClick={play} aria-pressed={playing} cursor="play">
            {playing ? 'Playing the note…' : 'Play the note'}
          </Button>
          <span className="t-label t-secondary" role="status">
            {playing ? 'Playing back at the place it was recorded.' : ''}
          </span>
        </div>
        <p className="t-body">{copy.guideNotes.privacy}</p>
        <AnimationNote>{copy.guideNotes.animationNote}</AnimationNote>
      </div>
      <div className="visual-rail visual-rail--sticky">
        <NotesScene playing={playing} />
        <div aria-hidden="true">
          <ChapterPoster name="guide-notes" />
        </div>
      </div>
    </Chapter>
  )
}
