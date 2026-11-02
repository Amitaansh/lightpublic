/** Content model (docs/05 §9). Copy lives here so copy edits never touch components. */

export type Source = {
  name: string
  /** Leave empty until the founder supplies the exact link. Never invent one. */
  url: string
  /** ISO date the figure was last re-checked against its source; null = not yet re-checked. */
  checked: string | null
}

export type Stat = {
  id: string
  /** The value as displayed, e.g. "2.55 million". */
  value: string
  /** Optional count-up target for the animated numeral. */
  count?: { to: number; decimals?: number; prefix?: string; suffix?: string }
  label: string
  source: Source
}

export type Fact = {
  text: string
  /** True when the fact is a product number, which must be labelled as a target. */
  isTarget?: boolean
}

export type Milestone = {
  when: string
  status: 'done' | 'now' | 'next' | 'later'
  title: string
  line: string
  /** False until the founder confirms the wording and date. */
  confirmed: boolean
}

export type Hotspot = {
  id: string
  label: string
  detail: string
  trd: string[]
}

export type HotspotGroup = {
  id: 'head' | 'ring' | 'body' | 'grip' | 'cap'
  title: string
  items: Hotspot[]
}

export type ChapterCopy = {
  eyebrow: string
  title: string
  lead?: string
  body?: string[]
  facts?: Fact[]
  /** Visible caption: "What the animation shows". */
  animationNote?: string
}
