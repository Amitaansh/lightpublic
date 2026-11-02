import type { ChapterCopy } from './types'

/**
 * Working copy for the hero page (docs/04 §3). DRAFT: the founder reviews it
 * before the site is published. Sources are noted per chapter.
 */
export const copy = {
  // PRD §1, PRD-F-003, PRD-F-006
  hero: {
    eyebrow: 'concept · in development',
    title: 'Be your light.',
    lead: 'L.I.G.H.T is a sensing baton that clips onto your white cane. It warns you about what the cane can’t reach: obstacles ahead, things at head height, and anything coming at you fast.',
  },

  // PRD §3, PRD-F-003, PRD-F-004, PRD-F-006, PRD-NF-009
  whatItAdds: {
    eyebrow: 'what it adds',
    title: 'Your cane finds the ground. L.I.G.H.T looks further.',
    items: [
      { n: '01', title: 'Ahead', text: 'Obstacles at a distance, before your cane or your body touches them.' },
      { n: '02', title: 'Overhead', text: 'Branches, signs and mirrors at head height, which a cane can’t reach.' },
      {
        n: '03',
        title: 'Coming fast',
        text: 'Bikes and cars approaching quickly: a spoken “STOP” and a strong vibration through the whole grip.',
      },
      { n: '04', title: 'What it is', text: 'Point and ask. A single earbud tells you what’s there.' },
    ],
    animationNote:
      'The baton turns as if it were on a cane, and a field of dots opens from its sensor head for each of the four items.',
  },

  // PRD-F-016, PRD-F-017, PRD-F-019; TRD-HW-014
  cane: {
    eyebrow: 'works with your cane',
    title: 'Clips onto the cane you already trust.',
    body: [
      'There’s no new technique to learn. L.I.G.H.T clips onto your own white cane without tools. Your cane’s grip nests under the baton’s grip, so your hand holds both as one handle.',
      'The cane keeps doing what it does best: finding the ground.',
    ],
    facts: [
      { text: 'Clips on in under 10 seconds (design target)', isTarget: true },
      { text: 'Attaching is confirmed with a sound and a vibration' },
      { text: 'Designed for common long canes' },
    ],
    steps: ['A white cane slides into place.', 'The baton lowers onto the shaft and its clip closes.', 'The light ring glows once to confirm.'],
    animationNote:
      'The baton lowers onto a white cane, its clip closes around the shaft, and its light ring glows once to confirm.',
  },

  // PRD §6.2, PRD-F-020…024; TRD §4
  reliability: {
    eyebrow: 'reliability',
    title: 'Never fails silently.',
    lead: 'If something stops working, L.I.G.H.T tells you, steps down to what still works, and keeps warning you. If every electronic part stops, you are still holding your cane.',
    facts: [
      { text: 'An independent safety core: its own chip, its own sensors, its own reserved battery.' },
      { text: 'Smart features switch off first. The battery keeps a reserve only for basic warnings.' },
      { text: 'Never silent. Every step down is announced by touch and voice.' },
    ],
    animationNote:
      'Choose a level to see which parts of the baton keep working. The parts that stop are dimmed; the light ring glows once each time it steps down.',
  },

  // PRD-F-025…030
  guideNotes: {
    eyebrow: 'guide notes',
    title: 'Directions, in a voice you know.',
    body: [
      'Walk a route once with your instructor, a friend or family. They record short spoken notes along the way.',
      'Later, walking alone, you hear each note again when you ask, or automatically when you reach the place it was recorded.',
    ],
    note: 'The crossing button is on the pole to your right.',
    privacy: 'Recording only starts when someone presses record. Notes stay on the device.',
    animationNote:
      'Two people walk a path; the companion’s voice becomes a pin at that spot. Later, one person reaches the pin and the note plays back to an earbud.',
  },

  // PRD-F-033…041, PRD-F-036, PRD-NF-002
  routeMemory: {
    eyebrow: 'route memory',
    title: 'Learns the routes you walk.',
    body: [
      'L.I.G.H.T learns the routes you walk often, and asks before saving one. It remembers fixed obstacles along them, like a bollard, a step or a low branch, and warns you early next time.',
      'You can rehearse a route at home before you walk it.',
    ],
    badges: ['Works offline', 'Stays on the device'],
    safety: 'Memory only adds warnings. It never switches off a live one.',
    events: [
      'The route is drawn as you walk it for the first time.',
      'Pole: fixed, remembered.',
      'Step: fixed, remembered.',
      'Low branch: fixed, remembered.',
      'Parked bike: temporary, not remembered.',
      'Next time, each remembered obstacle gives an early double pulse before you reach it.',
    ],
    animationNote:
      'A route draws itself across a street map. Fixed obstacles drop in as markers and stay; a parked bike appears and is not kept.',
  },

  // PRD-F-001, PRD-F-002; TRD-HW-005, TRD-HW-006
  haptics: {
    eyebrow: '360° haptics',
    title: 'Feel where it is.',
    body: [
      'A ring of small motors inside the grip vibrates on the side where the obstacle is, and more strongly as it gets closer.',
      'It follows the direction you’re walking, not the swing of the cane. When there’s more than one obstacle, you feel up to three at once, nearest strongest.',
    ],
    illustration: 'Illustration shows 8 motors; the design calls for 8 to 16.',
    animationNote:
      'Place an obstacle around the walker. The matching motors in the ring glow, larger and brighter the closer the obstacle is.',
  },

  // PRD-F-006, PRD-F-007, PRD-NF-001
  stop: {
    eyebrow: 'threat alert',
    title: 'When something comes fast: STOP.',
    body: [
      'Everything else goes quiet. Your earbud says “STOP”, and the whole grip gives one strong vibration, unlike any other cue.',
    ],
    facts: [{ text: 'Designed to warn in under 50 milliseconds (target)', isTarget: true }],
    steps: [
      'Calm: quiet cues show what is around you.',
      'A cyclist approaches fast from the side. Everything else stops; the earbud says “STOP” and the whole grip vibrates once, strongly.',
      'The cyclist passes and the calm cues return.',
    ],
    animationNote:
      'A cyclist approaches fast from the side. All other cues stop, the whole ring swells once, and the page turns chartreuse with the word STOP.',
  },

  // TRD-HW-001…018
  inside: {
    eyebrow: 'inside',
    title: 'Inside the baton.',
    lead: 'About 20 cm long and 38 mm across (design targets). This is what’s inside, in the current concept.',
    footnote: 'Concept layout, for illustration. Component choices are still open.',
    animationNote:
      'Scrolling separates the baton into its parts along its length, holds on each group, then puts it back together.',
  },

  mockups: {
    eyebrow: 'concept visuals',
    title: 'Concept visuals.',
    lead: 'How L.I.G.H.T might look and work. Every image here is a concept.',
  },

  // POC README, "Try live awareness"
  prototype: {
    eyebrow: 'software prototype',
    title: 'Try the software prototype.',
    body: [
      'Our browser prototype runs real object detection on your camera or on a sample walk, and shows how the haptic ring and the STOP alert respond.',
      'It was built for an earlier, handheld version of the device, so it shows the older design. Camera frames stay in your browser.',
    ],
    pending: 'The public link is coming soon.',
  },

  why: {
    eyebrow: 'why it matters',
    title: 'Why it matters.',
  },

  timeline: {
    eyebrow: 'timeline',
    title: 'Where we are.',
  },

  closing: {
    eyebrow: 'get in touch',
    title: 'Let’s talk.',
    lead: 'Investors, orientation and mobility instructors, cane users, or just curious: we’d like to hear from you.',
  },
} satisfies Record<string, Partial<ChapterCopy> & Record<string, unknown>>
