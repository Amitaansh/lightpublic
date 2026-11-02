'use client'

import { useEffect, useRef, useState } from 'react'
import { copy } from '@/content/chapters'
import { HOME_CHAPTERS } from '@/lib/chapters'
import { useLight } from '@/lib/store'
import { AnimationNote, Eyebrow, SignalDot } from '../ui/bits'
import { Button } from '../ui/Button'
import { LineReveal } from '../ui/LineReveal'
import { Chapter } from './Chapter'

const def = HOME_CHAPTERS[5]
const ROUTE = 'M60 360 L 60 250 L 210 250 L 210 140 L 400 140 L 400 60 L 540 60'
const ROUTE_LEN = 110 + 150 + 110 + 190 + 80 + 140
/** Markers sit at fractions along the route; the bike is temporary. */
const MARKERS = [
  { at: 0.2, x: 60, y: 272, label: 'Pole' },
  { at: 0.46, x: 210, y: 178, label: 'Step' },
  { at: 0.76, x: 400, y: 104, label: 'Low branch' },
]
const BIKE = { x: 300, y: 140 }
const clamp01 = (x: number) => Math.min(1, Math.max(0, x))

function pointAt(f: number) {
  const segs: [number, number, number, number][] = [
    [60, 360, 60, 250],
    [60, 250, 210, 250],
    [210, 250, 210, 140],
    [210, 140, 400, 140],
    [400, 140, 400, 60],
    [400, 60, 540, 60],
  ]
  let d = f * ROUTE_LEN
  for (const [x1, y1, x2, y2] of segs) {
    const len = Math.hypot(x2 - x1, y2 - y1)
    if (d <= len) return { x: x1 + ((x2 - x1) * d) / len, y: y1 + ((y2 - y1) * d) / len }
    d -= len
  }
  return { x: 540, y: 60 }
}

/** 06 · Route Memory. A tilted street map (CSS 3D) that draws itself with scroll. */
export function RouteMemory() {
  const motion = useLight((s) => s.motion)
  const p = useLight((s) => s.progress['route-memory'] ?? 0)
  const [replayT, setReplayT] = useState<number | null>(null)
  const lastWalk = useRef(0)

  // Scroll: first walk draws the route (0.1–0.45), second walk replays it (0.5–0.9).
  const scrollDraw = motion === 'off' ? 1 : clamp01((p - 0.08) / 0.37)
  const scrollWalk = motion === 'off' ? null : p > 0.5 ? clamp01((p - 0.5) / 0.4) : null
  const walk = replayT ?? scrollWalk
  const draw = replayT !== null ? 1 : scrollDraw

  // A remembered obstacle gives an early double pulse just before the walker reaches it.
  useEffect(() => {
    if (walk === null) {
      lastWalk.current = 0
      return
    }
    for (const m of MARKERS) {
      const cue = m.at - 0.06
      if (lastWalk.current < cue && walk >= cue) useLight.getState().pulseRing('double')
    }
    lastWalk.current = walk
  }, [walk])

  const replay = () => {
    const start = performance.now()
    const dur = motion === 'off' ? 0 : 6000
    const step = (now: number) => {
      const t = dur ? clamp01((now - start) / dur) : 1
      setReplayT(t)
      if (t < 1) requestAnimationFrame(step)
      else window.setTimeout(() => setReplayT(null), 600)
    }
    requestAnimationFrame(step)
  }

  const walker = walk !== null ? pointAt(walk) : null
  const bikeVisible = walk !== null && walk > 0.25 && walk < 0.5

  return (
    <Chapter def={def}>
      <div className="copy">
        <Eyebrow n={def.n}>{copy.routeMemory.eyebrow}</Eyebrow>
        <LineReveal id={`${def.id}-title`} className="t-h2">
          {copy.routeMemory.title}
        </LineReveal>
        {copy.routeMemory.body.map((t) => (
          <p key={t} className="t-body measure">
            {t}
          </p>
        ))}
        <ul className="flex flex-wrap gap-2" aria-label="Route Memory">
          {copy.routeMemory.badges.map((b) => (
            <li key={b} className="concept-label" style={{ listStyle: 'none' }}>
              {b}
            </li>
          ))}
        </ul>
        <p className="t-body flex items-baseline gap-3">
          <SignalDot />
          <strong>{copy.routeMemory.safety}</strong>
        </p>
        <Button variant="primary" onClick={replay} cursor="play">
          Walk it again
        </Button>
        <ol className="rule-list t-body" aria-label="What happens on the route">
          {copy.routeMemory.events.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ol>
        <AnimationNote>{copy.routeMemory.animationNote}</AnimationNote>
      </div>
      <div className="visual-rail visual-rail--sticky" aria-hidden="true">
        <div style={{ perspective: '1200px', paddingTop: '28vh' }}>
          <svg
            className="diagram"
            viewBox="0 0 600 420"
            style={{ transform: 'rotateX(48deg) rotateZ(-8deg)', transformOrigin: '50% 60%' }}
          >
            <g stroke="currentColor" strokeWidth="2" opacity="0.55" fill="none">
              {[40, 120, 200, 280, 360].map((y) => (
                <line key={`h${y}`} x1="0" y1={y} x2="600" y2={y} />
              ))}
              {[60, 210, 330, 470].map((x) => (
                <line key={`v${x}`} x1={x} y1="0" x2={x} y2="420" />
              ))}
            </g>
            <path d={ROUTE} fill="none" stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" opacity="0.25" />
            <path
              d={ROUTE}
              fill="none"
              stroke="var(--signal)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={ROUTE_LEN}
              strokeDashoffset={ROUTE_LEN * (1 - draw)}
            />
            {MARKERS.map((m) => {
              const shown = draw >= m.at
              return (
                <g key={m.label} style={{ opacity: shown ? 1 : 0, transition: 'opacity 400ms' }}>
                  <circle cx={m.x} cy={m.y} r="13" fill="var(--signal)" stroke="var(--signal-edge)" strokeWidth="3" />
                  <text x={m.x + 22} y={m.y + 6} fill="currentColor" fontSize="20" fontWeight="600">
                    {m.label}
                  </text>
                </g>
              )
            })}
            <g style={{ opacity: bikeVisible ? 1 : 0, transition: 'opacity 400ms' }}>
              <circle cx={BIKE.x} cy={BIKE.y} r="12" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="6 5" />
              <text x={BIKE.x - 40} y={BIKE.y - 22} fill="currentColor" fontSize="18">
                bike: not kept
              </text>
            </g>
            <text x="60" y="400" fill="currentColor" fontSize="20" fontWeight="700">
              Home
            </text>
            <text x="470" y="36" fill="currentColor" fontSize="20" fontWeight="700">
              Station
            </text>
            {walker && <circle cx={walker.x} cy={walker.y} r="11" fill="#ffffff" stroke="currentColor" strokeWidth="4" />}
          </svg>
        </div>
      </div>
    </Chapter>
  )
}
