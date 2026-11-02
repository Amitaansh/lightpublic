import type { ReactNode } from 'react'

/** "(04) reliability" */
export function Eyebrow({ n, children }: { n?: number; children: ReactNode }) {
  return (
    <p className="eyebrow t-label">
      {n !== undefined && <span className="eyebrow__n">({String(n).padStart(2, '0')})</span>}
      <span>{children}</span>
    </p>
  )
}

/** Every render, 3D view and mockup carries this (AGENTS.md §5). */
export function ConceptLabel({ children = 'Concept visual' }: { children?: ReactNode }) {
  return <p className="concept-label">{children}</p>
}

/** The visible "What the animation shows" caption, next to every visual demo. */
export function AnimationNote({ children }: { children: ReactNode }) {
  return (
    <p className="animation-note">
      <span className="visually-hidden">What the animation shows: </span>
      {children}
    </p>
  )
}

export function SignalDot() {
  return <span className="signal-dot" aria-hidden="true" />
}
