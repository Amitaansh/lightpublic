import type { HotspotGroup } from './types'

/** Exploded-view hotspots, in assembly order from the sensor head (docs/04 §3, chapter 09). */
export const insideGroups: HotspotGroup[] = [
  {
    id: 'head',
    title: 'Sensor head',
    items: [
      {
        id: 'tof',
        label: 'Distance sensors',
        detail: 'Multi-zone time-of-flight (LIDAR) modules behind the ring of windows, angled to cover ahead and overhead while the baton lies along the cane.',
        trd: ['TRD-HW-002'],
      },
      {
        id: 'camera',
        label: 'Wide-angle cameras with night vision',
        detail: 'Forward-facing cameras that also see in infrared, with a small night illuminator, for identifying objects and fast-approaching threats.',
        trd: ['TRD-HW-003', 'TRD-HW-013'],
      },
      {
        id: 'ultrasonic',
        label: 'Ultrasonic sensors for the safety core',
        detail: 'Wired only to the safety core. They work in darkness and bright sun, and detect glass.',
        trd: ['TRD-HW-016'],
      },
      {
        id: 'mics',
        label: 'Microphones',
        detail: 'Pick up the sound of approaching traffic, and record Guide Notes when someone presses record.',
        trd: ['TRD-HW-004'],
      },
    ],
  },
  {
    id: 'ring',
    title: 'Light ring',
    items: [
      {
        id: 'ring',
        label: 'Status light',
        detail: 'A soft ring of light that glows to confirm things like clipping on. It is for the people around you; everything the user needs comes by touch and sound.',
        trd: [],
      },
    ],
  },
  {
    id: 'body',
    title: 'Body',
    items: [
      {
        id: 'buttons',
        label: 'Braille buttons',
        detail: 'Planned controls for identify, replay, record and “what’s working?”, under the thumb. The final layout is still open.',
        trd: ['TRD-HW-012'],
      },
      {
        id: 'clip',
        label: 'Cane clip with mode sensor',
        detail: 'A tool-free sprung clip grips the cane shaft. A small sensor in the jaw tells the baton when it is attached.',
        trd: ['TRD-HW-014'],
      },
      {
        id: 'main',
        label: 'Main computer with AI accelerator',
        detail: 'Runs object detection and threat classification on the device, so camera images never leave it.',
        trd: ['TRD-HW-001'],
      },
      {
        id: 'safety',
        label: 'Independent safety-core chip',
        detail: 'A separate low-power chip with its own sensors and battery reserve. It keeps basic obstacle warnings working if the main computer fails.',
        trd: ['TRD-HW-015'],
      },
      {
        id: 'imu',
        label: 'Motion sensor and satellite positioning',
        detail: 'Keeps directions steady as the cane sweeps, and helps Route Memory know where you are.',
        trd: ['TRD-HW-006', 'TRD-HW-007'],
      },
    ],
  },
  {
    id: 'grip',
    title: 'Grip',
    items: [
      {
        id: 'actuators',
        label: 'Ring of haptic motors',
        detail: 'A full ring of small vibration motors around your hand: 8 to 16 in the design.',
        trd: ['TRD-HW-005'],
      },
      {
        id: 'battery',
        label: 'Battery, with a reserve for the safety core',
        detail: 'When the battery runs low, smart features switch off first. The last part is kept for basic warnings.',
        trd: ['TRD-HW-009', 'TRD-HW-017'],
      },
      {
        id: 'storage',
        label: 'Encrypted storage',
        detail: 'Holds Guide Notes and saved routes on the device, encrypted.',
        trd: ['TRD-HW-018'],
      },
    ],
  },
  {
    id: 'cap',
    title: 'End cap',
    items: [
      {
        id: 'charging',
        label: 'Wireless charging',
        detail: 'Charges on a dock, with no port to keep clean.',
        trd: ['TRD-HW-009'],
      },
    ],
  },
]
