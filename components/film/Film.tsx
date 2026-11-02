'use client'

import { useEffect, useRef } from 'react'
import { ButtonLink } from '@/components/ui/Button'
import { FILM_LENGTH, scenes, sceneStart } from '@/content/film'
import { getLenis } from '@/lib/scroll'
import { film, useLight } from '@/lib/store'
import { live } from '@/three/film/live'
import { frameAt } from '@/three/film/shots'

const clamp01 = (x: number) => Math.min(1, Math.max(0, x))

/**
 * The home page: a scroll-driven film (founder decision 11-02). The page is a
 * tall track; scrolling moves the film. There is no visible copy apart from
 * the opening and closing titles; each scene's full description is in the
 * page for screen readers.
 */
export function Film() {
  const track = useRef<HTMLDivElement>(null)
  const open = useRef<HTMLDivElement>(null)
  const close = useRef<HTMLDivElement>(null)
  const fill = useRef<HTMLSpanElement>(null)
  const hint = useRef<HTMLDivElement>(null)
  const tier = useLight((s) => s.tier)
  const sceneId = useLight((s) => s.sceneId)

  useEffect(() => {
    const el = track.current
    if (!el) return
    const measure = () => {
      const r = el.getBoundingClientRect()
      const total = r.height - window.innerHeight
      film.target = clamp01(-r.top / Math.max(1, total)) * FILM_LENGTH
    }

    // Debug and deep links: ?t=0.42 jumps to that point in the film.
    const t = new URLSearchParams(window.location.search).get('t')
    if (t !== null) {
      const top = el.getBoundingClientRect().top + window.scrollY
      const y = top + clamp01(Number(t)) * (el.offsetHeight - window.innerHeight)
      window.scrollTo(0, y)
      getLenis()?.scrollTo(y, { immediate: true, force: true })
    }
    measure()
    film.snap = true

    let raf = 0
    let lastScene = ''
    const loop = () => {
      measure()
      // Once the footer scrolls in, the fixed overlays ride up with the page.
      const lift = Math.min(0, el.getBoundingClientRect().bottom - window.innerHeight)
      const T = useLight.getState().tier === 'static' ? film.target : live.T
      const f = frameAt(T)
      if (open.current) {
        open.current.style.opacity = String(f.titleOpen)
        open.current.style.transform = `translateY(${(1 - f.titleOpen) * -12}px)`
      }
      if (close.current) {
        close.current.style.opacity = String(f.titleClose)
        close.current.style.transform = `translateY(${(1 - f.titleClose) * 16 + lift}px)`
        close.current.dataset.inert = f.titleClose < 0.5 ? 'true' : 'false'
      }
      if (fill.current) {
        fill.current.style.transform = `scaleX(${T / FILM_LENGTH})`
        ;(fill.current.parentElement as HTMLElement).style.transform = `translateY(${lift}px)`
      }
      if (hint.current) hint.current.style.opacity = String(1 - clamp01(T / 40))
      if (f.scene !== lastScene) {
        lastScene = f.scene
        useLight.getState().set({ sceneId: f.scene })
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  // Keyboard users reaching the closing buttons: bring the end of the film into view.
  const revealEnd = () => {
    const el = track.current
    if (!el) return
    const y = el.getBoundingClientRect().bottom + window.scrollY - window.innerHeight
    const lenis = getLenis()
    if (lenis) lenis.scrollTo(y, { immediate: true, force: true })
    else window.scrollTo(0, y)
  }

  return (
    <div className="film">
      {tier === 'static' && (
        <div className="film__poster" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/posters/${sceneId}.webp`} alt="" />
        </div>
      )}

      <div ref={track} style={{ position: 'relative', height: `calc(${FILM_LENGTH}vh + 100vh)` }}>
        {scenes.map((s, i) => (
          <section
            key={s.id}
            id={s.id}
            className="film__scene"
            aria-labelledby={`${s.id}-title`}
            style={{ position: 'absolute', top: `${sceneStart[s.id]}vh`, height: `${s.len}vh`, left: 0, right: 0 }}
          >
            {i === 0 ? (
              <h1 id={`${s.id}-title`} className="visually-hidden">
                L.I.G.H.T: a sensing baton for the white cane
              </h1>
            ) : (
              <h2 id={`${s.id}-title`} className="visually-hidden">
                {s.title}
              </h2>
            )}
            <p className="visually-hidden">{s.text}</p>
            <noscript>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="film__noscript-poster" src={`/posters/${s.id}.webp`} alt="" />
            </noscript>
          </section>
        ))}
      </div>

      <div ref={open} className="title-card title-card--open" aria-hidden="true">
        <p className="t-display">
          L<span className="wordmark__dot">.</span>I<span className="wordmark__dot">.</span>G<span className="wordmark__dot">.</span>H
          <span className="wordmark__dot">.</span>T
        </p>
      </div>

      <div ref={close} className="title-card title-card--close" data-inert="true" onFocusCapture={revealEnd}>
        <p className="t-display" aria-hidden="true">
          Be your light.
        </p>
        <div className="title-card__actions">
          <ButtonLink href="/contact" variant="primary" magnetic cursor="write">
            Get in touch
          </ButtonLink>
          <ButtonLink href="/about" variant="secondary" transition>
            About the project
          </ButtonLink>
        </div>
      </div>

      <div ref={hint} className="scroll-hint" aria-hidden="true" />
      <div className="film-progress" aria-hidden="true">
        <span ref={fill} className="film-progress__fill" />
        {scenes.slice(1).map((s) => (
          <span key={s.id} className="film-progress__tick" style={{ left: `${(sceneStart[s.id] / FILM_LENGTH) * 100}%` }} />
        ))}
      </div>
    </div>
  )
}
