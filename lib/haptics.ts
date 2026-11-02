import type { Obstacle } from './store'

export const ACTUATOR_COUNT = 8

export const DIRECTIONS = [
  { angle: 0, name: 'ahead', short: 'Ahead' },
  { angle: 45, name: 'ahead right', short: 'Ahead right' },
  { angle: 90, name: 'right', short: 'Right' },
  { angle: 135, name: 'behind right', short: 'Behind right' },
  { angle: 180, name: 'behind', short: 'Behind' },
  { angle: 225, name: 'behind left', short: 'Behind left' },
  { angle: 270, name: 'left', short: 'Left' },
  { angle: 315, name: 'ahead left', short: 'Ahead left' },
] as const

export const DISTANCES = [
  { value: 0.2, name: 'close', strength: 'strongly' },
  { value: 0.5, name: 'a few steps away', strength: 'clearly' },
  { value: 0.85, name: 'far', strength: 'gently' },
] as const

const norm = (angle: number) => ((angle % 360) + 360) % 360

/** Where it vibrates = where the obstacle is; how strongly = how close (PRD-F-001, PRD-F-002). */
export function actuatorIntensities(obstacles: Obstacle[], count = ACTUATOR_COUNT): number[] {
  const top = [...obstacles].sort((a, b) => a.distance - b.distance).slice(0, 3)
  return Array.from({ length: count }, (_, k) => {
    const a = (k * 360) / count
    let v = 0
    for (const o of top) {
      let d = Math.abs(a - norm(o.angle)) % 360
      if (d > 180) d = 360 - d
      const falloff = Math.max(0, Math.cos((d * Math.PI) / 180)) ** 6
      v = Math.max(v, falloff * (1 - o.distance))
    }
    return Math.min(1, v * 1.15)
  })
}

export const directionName = (angle: number) =>
  DIRECTIONS.find((d) => d.angle === norm(angle))?.name ?? `${angle} degrees`

export const distanceInfo = (distance: number) =>
  DISTANCES.reduce<(typeof DISTANCES)[number]>(
    (best, d) => (Math.abs(d.value - distance) < Math.abs(best.value - distance) ? d : best),
    DISTANCES[0],
  )

const GRIP_SIDE: Record<number, string> = {
  0: 'front',
  45: 'front-right',
  90: 'right side',
  135: 'back-right',
  180: 'back',
  225: 'back-left',
  270: 'left side',
  315: 'front-left',
}

/** Live-region text, e.g. "Pole, ahead left, close: the front-left of the grip vibrates strongly." */
export function describeObstacles(obstacles: Obstacle[]): string {
  if (!obstacles.length) return 'No obstacles: the grip is still.'
  const sorted = [...obstacles].sort((a, b) => a.distance - b.distance)
  return sorted
    .map((o, i) => {
      const dist = distanceInfo(o.distance)
      const side = GRIP_SIDE[norm(o.angle)] ?? 'matching side'
      const lead = i === 0 && sorted.length > 1 ? ' This one is nearest, so it is strongest.' : ''
      return `${o.label}, ${directionName(o.angle)}, ${dist.name}: the ${side} of the grip vibrates ${dist.strength}.${lead}`
    })
    .join(' ')
}
