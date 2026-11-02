'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { copy } from '@/content/chapters'
import { gallery, type GalleryCard } from '@/content/gallery'
import { HOME_CHAPTERS } from '@/lib/chapters'
import { useLight } from '@/lib/store'
import { ConceptLabel, Eyebrow } from '../ui/bits'
import { ChapterPoster } from '../ui/ChapterPoster'
import { LineReveal } from '../ui/LineReveal'
import { Chapter } from './Chapter'

const def = HOME_CHAPTERS[9]

/** Concept companion-app screens, built in HTML so they stay crisp. */
function AppScreen({ screen }: { screen: 'notes' | 'routes' | 'status' }) {
  if (screen === 'notes')
    return (
      <div className="phone">
        <span className="phone__title">Guide Notes</span>
        <span>Home → Station</span>
        {[
          ['Door is the second one after the bench', 'plays here'],
          ['Crossing button on the pole to your right', 'plays here'],
          ['Ramp starts after the newsagent', 'on request'],
        ].map(([t, s]) => (
          <span key={t} className="phone__row">
            <span>{t}</span>
            <span className="phone__chip">{s}</span>
          </span>
        ))}
      </div>
    )
  if (screen === 'routes')
    return (
      <div className="phone">
        <span className="phone__title">Saved routes</span>
        <span>On this device · offline</span>
        {[
          ['Home → Station', '3 remembered'],
          ['Home → Office', '5 remembered'],
          ['Home → Market', '2 remembered'],
        ].map(([t, s]) => (
          <span key={t} className="phone__row">
            <span>{t}</span>
            <span className="phone__chip">{s}</span>
          </span>
        ))}
      </div>
    )
  return (
    <div className="phone">
      <span className="phone__title">What’s working?</span>
      <span>Full: everything on</span>
      {['Sensing', 'Safety core', 'Haptic ring', 'Route Memory'].map((t) => (
        <span key={t} className="phone__row">
          <span>{t}</span>
          <span className="phone__chip">working</span>
        </span>
      ))}
    </div>
  )
}

function Card({ card, dockRef }: { card: GalleryCard; dockRef?: React.Ref<HTMLDivElement> }) {
  return (
    <figure style={{ margin: 0 }}>
      <div className={`gallery__media ${card.kind === 'live' ? 'gallery__media--live' : ''}`} ref={dockRef} role={card.kind === 'image' ? undefined : 'img'} aria-label={card.kind === 'image' ? undefined : card.alt}>
        {card.kind === 'image' && <Image src={card.src} alt={card.alt} width={card.width} height={card.height} sizes="(max-width: 600px) 80vw, 440px" />}
        {card.kind === 'app' && <AppScreen screen={card.screen} />}
        {card.kind === 'live' && <ChapterPoster name="mockups" />}
      </div>
      <figcaption>
        <span className="t-body">{card.caption}</span>
        <ConceptLabel />
      </figcaption>
    </figure>
  )
}

/** 10 · Concept visuals (I9). The 3D baton docks into the first card. */
export function Mockups() {
  const track = useRef<HTMLUListElement>(null)
  const dock = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let raf = 0
    const measure = () => {
      raf = 0
      const el = dock.current
      if (!el) return
      const r = el.getBoundingClientRect()
      useLight.getState().set({ dockRect: { x: r.left, y: r.top, w: r.width, h: r.height } })
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(measure)
    }
    measure()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    const t = track.current
    t?.addEventListener('scroll', schedule, { passive: true })
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      t?.removeEventListener('scroll', schedule)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  const scrollBy = (dir: number) => {
    const t = track.current
    if (!t) return
    const card = t.querySelector('li')
    const step = (card?.getBoundingClientRect().width ?? 400) + 24
    t.scrollBy({ left: dir * step, behavior: useLight.getState().motion === 'off' ? 'auto' : 'smooth' })
  }

  return (
    <Chapter def={def} rail="none">
      <div className="copy" style={{ gridColumn: '1 / -1' }}>
        <Eyebrow n={def.n}>{copy.mockups.eyebrow}</Eyebrow>
        <LineReveal id={`${def.id}-title`} className="t-h2">
          {copy.mockups.title}
        </LineReveal>
        <p className="t-body measure">{copy.mockups.lead}</p>
      </div>
      <div className="gallery" style={{ gridColumn: '1 / -1', marginInline: 'calc(var(--margin) * -1)' }}>
        <ul ref={track} className="gallery__track" tabIndex={0} aria-label="Concept visuals, scroll sideways" data-lenis-prevent-horizontal style={{ listStyle: 'none', margin: 0 }}>
          {gallery.map((c, i) => (
            <li key={c.id} className="gallery__card">
              <Card card={c} dockRef={i === 0 ? dock : undefined} />
            </li>
          ))}
        </ul>
        <div className="gallery__controls">
          <button type="button" className="icon-button" aria-label="Previous visual" onClick={() => scrollBy(-1)}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M11 4L6 9L11 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button type="button" className="icon-button" aria-label="Next visual" onClick={() => scrollBy(1)}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M7 4L12 9L7 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </Chapter>
  )
}
