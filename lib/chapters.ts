export type ChapterTheme = 'white' | 'blue'

export type ChapterDef = {
  key: string
  /** Anchor id on the page. */
  id: string
  n: number
  theme: ChapterTheme
  /** Short name of the chapter. */
  name: string
}

/** The hero page's chapters, in story order (docs/04 §3). */
export const HOME_CHAPTERS: ChapterDef[] = [
  { key: 'hero', id: 'top', n: 1, theme: 'white', name: 'Introduction' },
  { key: 'what-it-adds', id: 'what-it-adds', n: 2, theme: 'blue', name: 'What the cane can’t reach' },
  { key: 'cane', id: 'cane', n: 3, theme: 'white', name: 'Clips onto your cane' },
  { key: 'reliability', id: 'reliability', n: 4, theme: 'blue', name: 'Never fails silently' },
  { key: 'guide-notes', id: 'guide-notes', n: 5, theme: 'white', name: 'Guide Notes' },
  { key: 'route-memory', id: 'route-memory', n: 6, theme: 'blue', name: 'Route Memory' },
  { key: 'haptics', id: 'haptics', n: 7, theme: 'white', name: 'Feel where it is' },
  { key: 'stop', id: 'stop', n: 8, theme: 'blue', name: 'STOP' },
  { key: 'inside', id: 'inside', n: 9, theme: 'white', name: 'Inside the baton' },
  { key: 'mockups', id: 'mockups', n: 10, theme: 'blue', name: 'Concept visuals' },
  { key: 'prototype', id: 'prototype', n: 11, theme: 'white', name: 'Try the prototype' },
  { key: 'why', id: 'why', n: 12, theme: 'blue', name: 'Why it matters' },
  { key: 'timeline', id: 'timeline', n: 13, theme: 'white', name: 'Where we are' },
  { key: 'contact-cta', id: 'contact-cta', n: 14, theme: 'blue', name: 'Get in touch' },
]

export const CHAPTER_COUNT = HOME_CHAPTERS.length

export const chapterByKey = (key: string) => HOME_CHAPTERS.find((c) => c.key === key)

/** Comma index nav (docs/04 §2.2). `chapters` marks where the item counts as current. */
export const NAV_ITEMS: { label: string; href: string; chapters: string[] }[] = [
  { label: 'Product', href: '/#what-it-adds', chapters: ['what-it-adds', 'cane', 'guide-notes', 'route-memory', 'haptics', 'stop'] },
  { label: 'Reliability', href: '/#reliability', chapters: ['reliability'] },
  { label: 'Inside', href: '/#inside', chapters: ['inside', 'mockups'] },
  { label: 'Prototype', href: '/#prototype', chapters: ['prototype'] },
  { label: 'Timeline', href: '/#timeline', chapters: ['why', 'timeline'] },
  { label: 'About', href: '/about', chapters: [] },
]
