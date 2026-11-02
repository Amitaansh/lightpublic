import type { Stat } from './types'

/**
 * Market figures, from the approved list in AGENTS.md §6.
 * [CONFIRM] Each source must be re-checked before publishing: set `checked` to
 * the date and `url` to the exact page. The content check warns while any is null.
 */
export const stats: Stat[] = [
  {
    id: 'blind-europe',
    value: '2.55 million',
    count: { to: 2.55, decimals: 2, suffix: ' million' },
    label: 'blind people in Europe.',
    source: { name: 'WHO, via the European Blind Union', url: '', checked: null },
  },
  {
    id: 'no-aid-france',
    value: '59%',
    count: { to: 59, suffix: '%' },
    label: 'of severely visually impaired people in France use no mobility aid.',
    source: { name: 'Étude Homère, via Institut de la Vision', url: '', checked: null },
  },
  {
    id: 'market',
    value: '$6.87B → $12.71B',
    label: 'Assistive technology for visual impairment, 2025 to 2030: 13.1% growth a year.',
    source: {
      name: 'The Business Research Company, Assistive Technologies for Visually Impaired Global Market Report 2026',
      url: '',
      checked: null,
    },
  },
]

/** The "59%" figure is also drawn as 100 dots, 59 of them filled. */
export const dotGridShare = 59
