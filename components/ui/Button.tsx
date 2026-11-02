'use client'

import Link from 'next/link'
import { useRef, type ComponentProps, type ReactNode } from 'react'
import { useLight } from '@/lib/store'
import { TransitionLink } from '@/components/shell/PageTransition'

type Variant = 'primary' | 'secondary'

const Arrow = ({ external }: { external?: boolean }) => (
  <span className="btn__arrow" aria-hidden="true">
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      {external ? (
        <path d="M4 10L10 4M10 4H5M10 4V9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M2 7H12M12 7L7.5 2.5M12 7L7.5 11.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  </span>
)

/** Pulls the button up to 6 px toward the pointer (brief §6.7). Off when motion is off. */
function useMagnetic<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const onPointerMove = (e: React.PointerEvent<T>) => {
    if (e.pointerType !== 'mouse' || useLight.getState().motion === 'off') return
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2)
    const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2)
    el.style.transform = `translate(${dx * 6}px, ${dy * 6}px)`
  }
  const onPointerLeave = () => {
    if (ref.current) ref.current.style.transform = ''
  }
  return { ref, onPointerMove, onPointerLeave }
}

type ButtonLinkProps = {
  href: string
  variant?: Variant
  children: ReactNode
  magnetic?: boolean
  cursor?: string
  external?: boolean
  /** Use the blue page wipe (links between pages). */
  transition?: boolean
  className?: string
} & Omit<ComponentProps<'a'>, 'href' | 'ref'>

export function ButtonLink({ href, variant = 'primary', children, magnetic, cursor, external, transition, className, ...rest }: ButtonLinkProps) {
  const mag = useMagnetic<HTMLAnchorElement>()
  const cls = `btn btn--${variant} ${className ?? ''}`
  const handlers = magnetic ? { onPointerMove: mag.onPointerMove, onPointerLeave: mag.onPointerLeave } : {}
  const inner = (
    <>
      <span>{children}</span>
      {external && <span className="visually-hidden"> (opens in a new tab)</span>}
      <Arrow external={external} />
    </>
  )
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener" className={cls} data-cursor={cursor ?? 'open'} ref={mag.ref} {...handlers} {...rest}>
        {inner}
      </a>
    )
  }
  if (transition) {
    return (
      <TransitionLink href={href} className={cls} data-cursor={cursor} ref={mag.ref} {...handlers} {...rest}>
        {inner}
      </TransitionLink>
    )
  }
  return (
    <Link href={href} className={cls} data-cursor={cursor} ref={mag.ref} {...handlers} {...rest}>
      {inner}
    </Link>
  )
}

type ButtonProps = { variant?: Variant; children: ReactNode; cursor?: string; arrow?: boolean } & ComponentProps<'button'>

export function Button({ variant = 'secondary', children, cursor, arrow = false, className, type = 'button', ...rest }: ButtonProps) {
  return (
    <button type={type} className={`btn btn--${variant} ${arrow ? '' : 'btn--plain'} ${className ?? ''}`} data-cursor={cursor} {...rest}>
      <span>{children}</span>
      {arrow && <Arrow />}
    </button>
  )
}
