'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { copy } from '@/content/chapters'
import { HOME_CHAPTERS } from '@/lib/chapters'
import { useLight, type Obstacle } from '@/lib/store'
import { AnimationNote, Eyebrow, SignalDot } from '../ui/bits'
import { Button } from '../ui/Button'
import { ChapterPoster } from '../ui/ChapterPoster'
import { LineReveal } from '../ui/LineReveal'
import { Chapter } from './Chapter'
import { RadarSvg } from './Radar'

const def = HOME_CHAPTERS[7]
const CALM: Obstacle[] = [
  { angle: 315, distance: 0.85, label: 'Bench' },
  { angle: 45, distance: 0.5, label: 'Pole' },
]

/**
 * 08 · STOP (I7). Plays once when 60% in view; Replay plays it again. The page
 * turns a steady chartreuse once (one slow transition, never a flash).
 */
export function Stop() {
  const motion = useLight((s) => s.motion)
  const [phase, setPhase] = useState(0) // 0 calm, 1 approach, 2 STOP, 3 passed
  const [cyclistX, setCyclistX] = useState(300)
  const played = useRef(false)
  const timers = useRef<number[]>([])
  const section = useRef<HTMLDivElement>(null)

  const clear = () => {
    timers.current.forEach((t) => window.clearTimeout(t))
    timers.current = []
  }

  const play = useCallback(() => {
    clear()
    const { set, pulseRing } = useLight.getState()
    const fast = useLight.getState().motion === 'off'
    const at = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, fast ? ms / 4 : ms))
    setPhase(0)
    setCyclistX(300)
    at(1600, () => {
      setPhase(1)
      setCyclistX(205)
    })
    at(2700, () => {
      setPhase(2)
      const here = useLight.getState().chapterKey === 'stop'
      set({ stopActive: true, themeOverride: here ? 'signal' : null })
      pulseRing('stop')
    })
    at(4400, () => {
      setPhase(3)
      setCyclistX(100)
      set({ stopActive: false, themeOverride: null })
    })
    at(6200, () => setPhase(0))
  }, [])

  useEffect(() => {
    const el = section.current
    if (!el || motion === 'off') return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !played.current) {
          played.current = true
          play()
        }
      },
      { threshold: 0.6 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [play, motion])

  // Leaving the chapter mid-sequence ends it, so the page never stays chartreuse elsewhere.
  useEffect(
    () =>
      useLight.subscribe((st, prev) => {
        if (st.chapterKey !== prev.chapterKey && st.chapterKey !== 'stop' && st.themeOverride === 'signal') {
          clear()
          setPhase(0)
          st.set({ stopActive: false, themeOverride: null })
        }
      }),
    [],
  )

  useEffect(
    () => () => {
      clear()
      useLight.getState().set({ stopActive: false, themeOverride: null })
    },
    [],
  )

  const stopping = phase === 2
  const obstacles = phase === 2 ? [] : CALM
  return (
    <Chapter def={def}>
      <div className="copy" ref={section}>
        <Eyebrow n={def.n}>{copy.stop.eyebrow}</Eyebrow>
        <LineReveal id={`${def.id}-title`} className="t-h2">
          {copy.stop.title}
        </LineReveal>
        {copy.stop.body.map((t) => (
          <p key={t} className="t-body measure">
            {t}
          </p>
        ))}
        <ul className="fact-list">
          {copy.stop.facts.map((f) => (
            <li key={f.text}>
              <SignalDot />
              <span>{f.text}</span>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap items-center gap-6">
          <RadarSvg
            obstacles={obstacles}
            intensities={stopping ? new Array(8).fill(1) : undefined}
            cyclist={{ x: cyclistX, y: 150, visible: phase === 1 || phase === 2 || phase === 3 }}
            title="Radar: a cyclist approaches fast from the right. During STOP, every motor in the grip's ring glows at once."
          />
          <p className="t-statement" aria-hidden="true" style={{ fontSize: 'clamp(3.5rem, 9vw, 8rem)', opacity: stopping ? 1 : 0, transition: 'opacity 600ms' }}>
            stop
          </p>
        </div>
        <Button variant="primary" onClick={play} cursor="play">
          Replay
        </Button>
        <ol className="rule-list t-body" aria-label="What happens">
          {copy.stop.steps.map((s, i) => (
            <li key={s} className="numbered-item" data-dim={phase !== 0 && i !== Math.min(2, Math.max(0, phase - 1))}>
              <span className="numbered-item__n" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
        <AnimationNote>{copy.stop.animationNote}</AnimationNote>
      </div>
      <div className="visual-rail visual-rail--sticky" aria-hidden="true">
        <ChapterPoster name="stop" />
      </div>
    </Chapter>
  )
}
