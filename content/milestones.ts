import type { Milestone } from './types'

/**
 * Timeline (docs/04 §3, chapter 13). No organisation names, anywhere.
 * [OPEN] Future dates; [CONFIRM] the "Now" item. Items with confirmed: false
 * are flagged by the content check before publishing.
 */
export const milestones: Milestone[] = [
  {
    when: 'Sep 2026',
    status: 'done',
    title: 'Concept and requirements',
    line: 'Product and technical requirements written, and a user-research plan drafted.',
    confirmed: true,
  },
  {
    when: 'Sep 2026',
    status: 'done',
    title: 'Software prototype',
    line: 'Live object detection and a simulated haptic ring, running in the browser.',
    confirmed: true,
  },
  {
    when: 'Nov 2026',
    status: 'done',
    title: 'Clip-on design',
    line: 'Redesigned as a baton that clips onto the white cane, with an independent safety core.',
    confirmed: true,
  },
  {
    when: 'Now',
    status: 'now',
    title: 'Listening to cane users and instructors',
    line: 'Interviews with cane users and orientation and mobility instructors.',
    confirmed: false,
  },
  {
    when: 'Next',
    status: 'next',
    title: 'First hardware prototype',
    line: 'Sensing, the haptic ring and the safety core, in one baton.',
    confirmed: true,
  },
  {
    when: 'Later',
    status: 'later',
    title: 'Small pilot',
    line: 'Trying it with experienced cane users.',
    confirmed: true,
  },
]
