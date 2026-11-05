/**
 * The home page is a scroll-driven film (v0.2, founder decision 11-02). Each
 * scene carries a full screen-reader description, so the whole story is
 * available to blind and low-vision visitors, and one short visible caption
 * (added 11-04, layer 1) so sighted visitors know what they are looking at.
 * `len` is the scene's scroll length in viewport heights × 100.
 * Facts come from PRD v0.7 / TRD v0.6; product numbers are design targets.
 */
export type SceneId = 'title' | 'macro' | 'hand' | 'hold' | 'clip' | 'vibration' | 'route' | 'stop' | 'inside' | 'finale'

export type Scene = {
  id: SceneId
  len: number
  title: string
  /** Screen-reader description of the scene. */
  text: string
  /**
   * Visible caption (layer 1): one short line that fades in with the scene.
   * Hidden from screen readers, which get `text` instead. Empty = no caption.
   */
  caption: string
}

export const scenes: Scene[] = [
  {
    id: 'title',
    len: 140,
    title: 'L.I.G.H.T',
    text: 'L.I.G.H.T, LIDAR Integrated Guidance & Handheld Tracker: a sensing baton that clips onto the white cane. A concept in development. The baton floats in a dark room, its light ring glowing cyan. Selecting the baton, or the Lights button, turns the room lights off so the ring lights the scene.',
    caption: 'A sensing baton that clips onto your white cane.',
  },
  {
    id: 'macro',
    len: 260,
    title: 'The baton, up close',
    text: 'Close up: about 20 centimetres long and 38 millimetres across (design targets). A dimpled soft-touch grip, two braille-marked buttons under the thumb, the light ring, and a sensor head with a ring of dark windows and a camera at the tip.',
    caption: 'Braille buttons under your thumb. Sensors at the tip.',
  },
  {
    id: 'hand',
    len: 240,
    title: 'Pick it up',
    text: 'A hand reaches in and closes around the grip.',
    caption: 'A dimpled, soft-touch grip, made for one hand.',
  },
  {
    id: 'hold',
    len: 200,
    title: 'How to hold it',
    text: 'How to hold it: fingers around the grip, the thumb resting on the braille buttons, the sensor head pointing ahead.',
    caption: 'Fingers on the grip, thumb on the buttons, sensors facing ahead.',
  },
  {
    id: 'clip',
    len: 260,
    title: 'Clips onto your cane',
    text: 'It clips onto your own white cane without tools. The cane’s grip nests under the baton’s grip, so one hand holds both. The light ring pulses once to confirm, alongside a sound and a vibration. Your cane keeps finding the ground.',
    caption: 'Clips onto the cane you already trust. No tools.',
  },
  {
    id: 'vibration',
    len: 380,
    title: 'Feel where it is',
    text: 'Feel where it is. A ring of small motors inside the grip vibrates on the side of each obstacle, and more strongly as it gets closer: a pole ahead on the left, a branch at head height, then a person approaching on the right. It follows the way you walk, not the swing of the cane.',
    caption: 'The grip vibrates on the side of each obstacle, stronger as it gets closer.',
  },
  {
    id: 'route',
    len: 260,
    title: 'Remembers your routes',
    text: 'On routes you walk often it remembers fixed obstacles, like a bollard, a step or a low branch, and warns you early with a double pulse. It plays back Guide Notes, short directions recorded by someone you trust, at the place they were recorded. Everything works offline and stays on the device.',
    caption: 'Remembers your routes, and the voices that guide you.',
  },
  {
    id: 'stop',
    len: 180,
    title: 'STOP',
    text: 'When something comes fast, everything else goes quiet: your earbud says “STOP” and the whole grip gives one strong vibration, unlike any other cue. Designed to warn in under 50 milliseconds (target).',
    caption: 'When something comes fast: one word. STOP.',
  },
  {
    id: 'inside',
    len: 440,
    title: 'Inside the baton',
    text: 'Inside, in the current concept: distance sensors and cameras with night vision in the sensor head, ultrasonic sensors and microphones, the main computer, a separate safety-core chip, the ring of haptic motors in the grip, encrypted storage, and a battery that keeps a reserve for the safety core. If parts fail, it steps down one level at a time and tells you; the safety core keeps warning you of obstacles, and your cane still works. Illustrative layout; component choices are still open.',
    caption: 'If anything fails, it tells you. Your cane still works.',
  },
  {
    id: 'finale',
    len: 220,
    title: 'Be your light',
    text: 'The room goes dark and the baton’s own light fills it. Be your light. Get in touch.',
    caption: '',
  },
]

export const FILM_LENGTH = scenes.reduce((s, x) => s + x.len, 0)

/** Start offset (in the same units as `len`) of each scene. */
export const sceneStart: Record<SceneId, number> = (() => {
  const out = {} as Record<SceneId, number>
  let t = 0
  for (const s of scenes) {
    out[s.id] = t
    t += s.len
  }
  return out
})()

/**
 * Labels on the blueprint of the exploded baton (the "Inside" scene). Visual
 * only: the scene's screen-reader text already lists every part. `part` is the
 * object name in three/baton (buildBaton / buildInternals). Concept layout.
 */
export const insideCallouts: { part: string; label: string }[] = [
  { part: 'camera', label: 'Night-vision camera' },
  { part: 'tof', label: 'Distance sensors' },
  { part: 'ultrasonic', label: 'Ultrasonic sensors' },
  { part: 'mics', label: 'Microphones' },
  { part: 'ring', label: 'Light ring' },
  { part: 'body.buttons', label: 'Braille buttons' },
  { part: 'mainBoard', label: 'Main computer' },
  { part: 'safetyCore', label: 'Safety core' },
  { part: 'clip', label: 'Cane clip' },
  { part: 'actuators', label: 'Haptic motor ring' },
  { part: 'storage', label: 'Encrypted storage' },
  { part: 'battery', label: 'Battery' },
]
