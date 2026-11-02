/** Concept-visuals gallery (docs/04 §3, chapter 10). Every card is labelled as a concept. */
export type GalleryCard =
  | { kind: 'live'; id: string; caption: string; alt: string }
  | { kind: 'image'; id: string; src: string; width: number; height: number; caption: string; alt: string }
  | { kind: 'app'; id: string; screen: 'notes' | 'routes' | 'status'; caption: string; alt: string }

export const gallery: GalleryCard[] = [
  {
    kind: 'live',
    id: 'live',
    caption: 'The baton, in real-time 3D.',
    alt: 'The L.I.G.H.T baton turning slowly: graphite body, dimpled grip, a soft-white light ring and dark sensor windows.',
  },
  {
    kind: 'image',
    id: 'on-cane',
    src: '/media/baton-on-cane.webp',
    width: 1536,
    height: 1024,
    caption: 'Clipped onto a white cane, sensor head toward the tip.',
    alt: 'Concept render: a graphite baton with a dimpled grip and a glowing ring, clipped on top of a white cane, on a dark backdrop.',
  },
  {
    kind: 'image',
    id: 'exploded',
    src: '/media/render-exploded.webp',
    width: 960,
    height: 1200,
    caption: 'Exploded view of the concept layout.',
    alt: 'Concept render: the baton separated along its length into sensor head, light ring, body, grip and end cap, with simplified internal parts.',
  },
  {
    kind: 'image',
    id: 'grip',
    src: '/media/render-grip.webp',
    width: 960,
    height: 1200,
    caption: 'The grip, end on: a ring of motors around your hand.',
    alt: 'Concept render: the baton seen from its end cap, with the grip shown see-through and eight motors arranged in a ring.',
  },
  {
    kind: 'app',
    id: 'app-notes',
    screen: 'notes',
    caption: 'Companion app: Guide Notes for a saved route.',
    alt: 'Concept phone screen listing three Guide Notes on the route Home to station, each with where it plays.',
  },
  {
    kind: 'app',
    id: 'app-routes',
    screen: 'routes',
    caption: 'Companion app: saved routes, kept on the device.',
    alt: 'Concept phone screen listing saved routes with the number of remembered obstacles on each.',
  },
  {
    kind: 'app',
    id: 'app-status',
    screen: 'status',
    caption: 'Companion app: “What’s working?”',
    alt: 'Concept phone screen showing system status: sensing, safety core, haptics and battery all working.',
  },
]
