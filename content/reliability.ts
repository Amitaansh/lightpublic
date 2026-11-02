/** The fallback ladder (PRD §6.2; wording from docs/animations.md A6). Index = ladder level. */
export const ladder = [
  { id: 'full', name: 'Full', text: 'Everything on: sensing, identification, memory, guidance.' },
  { id: 'reduced', name: 'Reduced', text: 'Low battery or heat: the smart extras pause first.' },
  {
    id: 'memory',
    name: 'Memory and distance',
    text: 'Cameras out: distance sensing and remembered obstacles keep working.',
  },
  {
    id: 'safety-core',
    name: 'Safety core',
    text: 'Main system down: a separate safety system still warns you of obstacles.',
  },
  { id: 'cane', name: 'Cane', text: 'And your cane still works, as it always has.' },
] as const
