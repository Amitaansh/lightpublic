import type { Milestone, Stat } from './types'

/**
 * The home page after the film (layer 3): the detail a reader needs once the
 * film has shown what L.I.G.H.T is. Written for three readers at once: cane
 * users (often on a screen reader), orientation and mobility instructors and
 * families, and investors. Mostly adapted from v0.1 (content/chapters.ts at
 * f367684). DRAFT: the founders review it before it is published.
 *
 * Rules (AGENTS.md §5): say "concept" plainly, never imply it replaces the
 * cane, label targets as targets, every figure has a source, no partner names,
 * nothing about battery, weight or price until those are decided.
 */
export const home = {
  skipFilm: 'Skip the film',

  /** Opens the details: one big statement that lights up as you scroll. */
  statement:
    'L.I.G.H.T clips onto your white cane and warns you about what the cane can’t reach: obstacles ahead, branches at head height, and anything coming at you fast. Through touch and sound, without asking you to give up the tool you already trust.',

  adds: {
    id: 'what-it-adds',
    title: 'What it adds to your cane',
    lead: 'Your cane finds the ground. L.I.G.H.T looks further.',
    items: [
      { title: 'Ahead', text: 'Obstacles at a distance, before your cane or your body touches them.' },
      { title: 'Overhead', text: 'Branches, signs and mirrors at head height, which a cane can’t reach.' },
      { title: 'Coming fast', text: 'Bikes and cars approaching quickly: a spoken “STOP” and one strong vibration through the whole grip.' },
      { title: 'What it is', text: 'Point and ask. A single earbud tells you what’s there.' },
    ],
  },

  cane: {
    id: 'your-cane',
    title: 'Works with the cane you already trust',
    body: 'There’s no new technique to learn. L.I.G.H.T clips onto your own white cane without tools, and your cane’s grip nests under the baton’s, so one hand holds both. The cane keeps doing what it does best: finding the ground.',
    facts: [
      { text: 'Clips on in under 10 seconds (design target)', isTarget: true },
      { text: 'Attaching is confirmed with a sound and a vibration' },
      { text: 'Designed for common long canes' },
    ],
  },

  safety: {
    id: 'never-silent',
    title: 'Never fails silently',
    lead: 'If something stops working, L.I.G.H.T tells you, steps down to what still works, and keeps warning you.',
    ladder: [
      { name: 'Full', text: 'Everything on: sensing, identification, memory and guidance.' },
      { name: 'Reduced', text: 'Low battery or heat: the smart extras pause first.' },
      { name: 'Memory and distance', text: 'Cameras out: distance sensing and remembered obstacles keep working.' },
      { name: 'Safety core', text: 'Main system down: a separate safety system, with its own chip, sensors and battery reserve, still warns you of obstacles.' },
      { name: 'Your cane', text: 'And your cane still works, as it always has.' },
    ],
    note: 'Every step down is announced by touch and voice.',
  },

  privacy: {
    id: 'private',
    title: 'Private by design',
    items: [
      'Camera and microphone are processed on the baton. Images never leave it.',
      'Routes and Guide Notes stay on the device.',
      'Everything works offline.',
      'Recording only starts when someone presses record.',
    ],
  },

  why: {
    id: 'why-it-matters',
    title: 'Why it matters',
    lead: 'A white cane only tells you about what it touches. It can’t reach a branch at head height, and it gives no warning of a bike coming fast.',
    stats: [
      {
        id: 'blind-world',
        value: '43 million',
        label: 'people worldwide were blind in 2020. That is expected to reach 61 million by 2050.',
        source: {
          name: 'Vision Loss Expert Group / Global Burden of Disease, Lancet Global Health (2020), via the IAPB Vision Atlas',
          url: 'https://www.iapb.org/wp-content/uploads/2021/02/Vision-Atlas_Evidence-Series_Magnitude-of-VIsion-Loss_24022021.pdf',
          checked: '2026-11-04',
        },
      },
      {
        id: 'blind-region',
        value: '15 million',
        label: 'of them live in Southeast Asia, East Asia and Oceania, the region we’re starting in.',
        source: {
          name: 'Vision Loss Expert Group / Global Burden of Disease (2020), via the IAPB Vision Atlas',
          url: 'https://www.iapb.org/wp-content/uploads/2021/02/Vision-Atlas_Evidence-Series_Magnitude-of-VIsion-Loss_24022021.pdf',
          checked: '2026-11-04',
        },
      },
      {
        id: 'sg-ageing',
        value: '21.4%',
        label: 'of Singapore citizens are 65 or older, up from 13.7% ten years ago.',
        source: {
          name: 'National Population and Talent Division, Population in Brief 2026',
          // [CONFIRM] Link the official PDF; figure checked via press coverage (Mothership, 26 Sep 2026).
          url: '',
          checked: '2026-11-04',
        },
      },
    ] satisfies Stat[],
  },

  stage: {
    id: 'where-we-are',
    title: 'Where we are',
    lead: 'L.I.G.H.T is a concept. A software prototype exists; no hardware has been built yet.',
    milestones: [
      { when: 'Sep 2026', status: 'done', title: 'Concept and requirements', line: 'Product and technical requirements written, and a user-research plan drafted.', confirmed: true },
      { when: 'Sep 2026', status: 'done', title: 'Software prototype', line: 'Live object detection and a simulated haptic ring, running in the browser.', confirmed: true },
      { when: 'Nov 2026', status: 'done', title: 'Clip-on design', line: 'Redesigned as a baton that clips onto the white cane, with an independent safety core.', confirmed: true },
      { when: 'Now', status: 'now', title: 'Listening to cane users and instructors', line: 'Interviews with cane users and orientation and mobility instructors.', confirmed: false },
      { when: 'Next', status: 'next', title: 'First hardware prototype', line: 'Sensing, the haptic ring and the safety core, in one baton.', confirmed: true },
      { when: 'Later', status: 'later', title: 'Small pilot', line: 'Trying it with experienced cane users.', confirmed: true },
    ] satisfies Milestone[],
  },

  /** Only questions whose answers are decided. Battery, weight, price and dates stay out until they are. */
  faq: {
    id: 'questions',
    title: 'Questions people ask',
    items: [
      {
        q: 'Does it replace my white cane?',
        a: 'No. It clips onto your cane and adds what the cane can’t do. Your cane keeps finding the ground, and if every electronic part stopped, you would still be holding a working cane.',
      },
      {
        q: 'Do I need to learn a new way of using my cane?',
        a: 'No. You hold your cane as you always have. The vibrations follow the direction you’re walking, not the swing of the cane.',
      },
      {
        q: 'Does it need the internet or my phone?',
        a: 'No. Everything works offline, and camera images are processed on the baton itself.',
      },
      {
        q: 'Who records Guide Notes?',
        a: 'Someone you trust, like an instructor, a friend or family, walking the route with you. You hear each note again when you ask, or automatically when you reach the place it was recorded.',
      },
      {
        q: 'Can I buy one?',
        a: 'Not yet. L.I.G.H.T is a concept and no hardware has been built. If you use a cane or teach cane skills, you can sign up to help us test it.',
      },
    ],
  },

  involved: {
    id: 'get-involved',
    title: 'Get involved',
    lead: 'Tell us who you are and we’ll get back to the right person.',
    paths: [
      {
        id: 'tester',
        title: 'Help us test it',
        text: 'You use a white cane, teach orientation and mobility, or support someone who does. Sign up and we’ll be in touch when testing starts.',
        cta: 'Sign up to test',
        href: '/contact?as=cane-user',
      },
      {
        id: 'investor',
        title: 'Invest or partner',
        text: 'You back early hardware, or you’d like to work with us. We’ll share where we are and what we need.',
        cta: 'Talk to the founders',
        href: '/contact?as=investor',
      },
    ],
    otherLead: 'Something else?',
    otherLink: 'Just write to us.',
  },

  sourcesLabel: 'Source',
  targetNote: 'design target',
}
