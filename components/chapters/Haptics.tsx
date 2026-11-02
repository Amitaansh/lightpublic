'use client'

import { copy } from '@/content/chapters'
import { HOME_CHAPTERS } from '@/lib/chapters'
import { describeObstacles, DIRECTIONS, DISTANCES } from '@/lib/haptics'
import { useLight } from '@/lib/store'
import { AnimationNote, ConceptLabel, Eyebrow } from '../ui/bits'
import { ChapterPoster } from '../ui/ChapterPoster'
import { LineReveal } from '../ui/LineReveal'
import { Chapter } from './Chapter'
import { RadarSvg } from './Radar'

const def = HOME_CHAPTERS[6]
/** Grid layout for the 8 direction buttons around the walker. */
const GRID: Record<number, [number, number]> = {
  315: [1, 1],
  0: [1, 2],
  45: [1, 3],
  270: [2, 1],
  90: [2, 3],
  225: [3, 1],
  180: [3, 2],
  135: [3, 3],
}

/** I6: place the obstacle. Native radios and a range input, plus drag on the radar. */
function PlaceObstacle() {
  const obstacles = useLight((s) => s.obstacles)
  const primary = obstacles.find((o) => o.label === 'Pole') ?? obstacles[0]
  const hasPerson = obstacles.some((o) => o.label === 'Person')
  const distIndex = Math.max(0, DISTANCES.findIndex((d) => d.value === primary?.distance))

  const update = (patch: Partial<{ angle: number; distance: number }>) => {
    const s = useLight.getState()
    const next = s.obstacles.map((o) => (o.label === 'Pole' ? { ...o, ...patch } : o))
    s.set({ obstacles: next })
  }
  const togglePerson = (on: boolean) => {
    const s = useLight.getState()
    const rest = s.obstacles.filter((o) => o.label !== 'Person')
    s.set({ obstacles: on ? [...rest, { angle: 90, distance: 0.5, label: 'Person' }] : rest })
  }

  return (
    <div className="radar">
      <div className="flex flex-wrap items-start gap-6">
        <RadarSvg
          obstacles={obstacles}
          title="Radar: the walker at the centre, the obstacles around, and the grip's ring of motors glowing toward each obstacle."
          onPlace={(angle, distance) => update({ angle, distance })}
        />
        <div className="radar__controls">
          <fieldset>
            <legend className="t-label mb-2">Where is the pole?</legend>
            <div className="dir-grid">
              {DIRECTIONS.map((d) => {
                const [row, col] = GRID[d.angle]
                return (
                  <label key={d.angle} style={{ gridRow: row, gridColumn: col }}>
                    <input
                      type="radio"
                      name="pole-direction"
                      value={d.angle}
                      checked={primary?.angle === d.angle}
                      onChange={() => update({ angle: d.angle })}
                    />
                    {d.short}
                  </label>
                )
              })}
              <span className="dir-center" style={{ gridRow: 2, gridColumn: 2 }} aria-hidden="true">
                you
              </span>
            </div>
          </fieldset>
          <label className="grid gap-1">
            <span className="t-label">How far? {DISTANCES[distIndex].name}</span>
            <input
              className="range"
              type="range"
              min={0}
              max={DISTANCES.length - 1}
              step={1}
              value={distIndex}
              aria-valuetext={DISTANCES[distIndex].name}
              onChange={(e) => update({ distance: DISTANCES[Number(e.target.value)].value })}
            />
          </label>
          <label className="flex items-center gap-2" style={{ minHeight: 44 }}>
            <input type="checkbox" checked={hasPerson} onChange={(e) => togglePerson(e.target.checked)} style={{ width: 22, height: 22 }} />
            <span>Add a person to the right</span>
          </label>
        </div>
      </div>
      <p className="live-text t-body" aria-live="polite">
        {describeObstacles(obstacles)}
      </p>
    </div>
  )
}

/** 07 · Feel where it is. */
export function Haptics() {
  return (
    <Chapter def={def}>
      <div className="copy">
        <Eyebrow n={def.n}>{copy.haptics.eyebrow}</Eyebrow>
        <LineReveal id={`${def.id}-title`} className="t-h2">
          {copy.haptics.title}
        </LineReveal>
        {copy.haptics.body.map((t) => (
          <p key={t} className="t-body measure">
            {t}
          </p>
        ))}
        <PlaceObstacle />
        <AnimationNote>{copy.haptics.animationNote}</AnimationNote>
        <p className="t-label t-secondary">{copy.haptics.illustration}</p>
        <ConceptLabel />
      </div>
      <div className="visual-rail visual-rail--sticky" aria-hidden="true">
        <ChapterPoster name="haptics" />
      </div>
    </Chapter>
  )
}
