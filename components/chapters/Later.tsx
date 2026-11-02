'use client'

import Image from 'next/image'
import { copy } from '@/content/chapters'
import { milestones } from '@/content/milestones'
import { site } from '@/content/site'
import { dotGridShare, stats } from '@/content/stats'
import { HOME_CHAPTERS } from '@/lib/chapters'
import { useLight } from '@/lib/store'
import { ButtonLink } from '../ui/Button'
import { ConceptLabel, Eyebrow } from '../ui/bits'
import { ChapterPoster } from '../ui/ChapterPoster'
import { Counter } from '../ui/Counter'
import { LineReveal } from '../ui/LineReveal'
import { Chapter } from './Chapter'

/** 11 · Try the software prototype. */
export function Prototype({ screenshot }: { screenshot: boolean }) {
  const def = HOME_CHAPTERS[10]
  return (
    <Chapter def={def}>
      <div className="copy">
        <Eyebrow n={def.n}>{copy.prototype.eyebrow}</Eyebrow>
        <LineReveal id={`${def.id}-title`} className="t-h2">
          {copy.prototype.title}
        </LineReveal>
        {copy.prototype.body.map((t) => (
          <p key={t} className="t-body measure">
            {t}
          </p>
        ))}
        {screenshot && (
          <figure style={{ margin: '2rem 0 0' }}>
            <Image
              src="/media/prototype.webp"
              alt="The software prototype in a browser: a simulated street walk with detected objects outlined, a radar of nearby obstacles and the haptic ring."
              width={1440}
              height={900}
              sizes="(max-width: 900px) 92vw, 46vw"
              style={{ width: '100%', height: 'auto', border: '1.5px solid currentColor' }}
            />
            <figcaption className="t-label t-secondary mt-2">Screenshot of the software prototype (earlier device design).</figcaption>
          </figure>
        )}
        {site.prototypeUrl ? (
          <ButtonLink href={site.prototypeUrl} external variant="primary">
            Open the prototype
          </ButtonLink>
        ) : (
          <p className="concept-label">{copy.prototype.pending}</p>
        )}
      </div>
      <div className="visual-rail" aria-hidden="true">
        <ChapterPoster name="prototype" />
      </div>
    </Chapter>
  )
}

/** 59 of 100 dots filled: the "no mobility aid" figure, drawn (R2 dot motif). */
function DotShare() {
  return (
    <svg viewBox="0 0 230 230" role="img" aria-label={`${dotGridShare} out of 100 dots filled`} style={{ width: 160, marginTop: '1rem' }}>
      {Array.from({ length: 100 }, (_, i) => {
        const x = (i % 10) * 23 + 11.5
        const y = Math.floor(i / 10) * 23 + 11.5
        const on = i < dotGridShare
        return <circle key={i} cx={x} cy={y} r="8" fill={on ? 'var(--signal)' : 'none'} stroke="currentColor" strokeWidth="1.5" opacity={on ? 1 : 0.5} />
      })}
    </svg>
  )
}

/** 12 · Why it matters. Every figure shows its source. */
export function WhyItMatters() {
  const def = HOME_CHAPTERS[11]
  return (
    <Chapter def={def} rail="none">
      <div className="copy" style={{ gridColumn: '1 / -1', background: 'transparent' }}>
        <Eyebrow n={def.n}>{copy.why.eyebrow}</Eyebrow>
        <LineReveal id={`${def.id}-title`} className="t-h2">
          {copy.why.title}
        </LineReveal>
        <div className="stat-grid">
          {stats.map((s) => (
            <figure key={s.id} className="stat">
              <p className="stat__value">
                {s.count ? <Counter to={s.count.to} decimals={s.count.decimals} prefix={s.count.prefix} suffix={s.count.suffix} text={s.value} /> : s.value}
              </p>
              <p className="stat__label t-body">{s.label}</p>
              {s.id === 'no-aid-france' && <DotShare />}
              <figcaption className="stat__source">
                Source: {s.source.url ? <a className="text-link" href={s.source.url}>{s.source.name}</a> : s.source.name}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
      <div className="visual-rail" aria-hidden="true" style={{ minHeight: 0 }}>
        <ChapterPoster name="why" />
      </div>
    </Chapter>
  )
}

/** 13 · Where we are: schedule rows (R3) with a line drawn by scroll. */
export function Timeline() {
  const def = HOME_CHAPTERS[12]
  const p = useLight((s) => s.progress.timeline ?? 0)
  const motion = useLight((s) => s.motion)
  const drawn = motion === 'off' ? 1 : Math.min(1, Math.max(0, (p - 0.1) / 0.7))
  return (
    <Chapter def={def}>
      <div className="copy" style={{ gridColumn: '1 / span 8' }}>
        <Eyebrow n={def.n}>{copy.timeline.eyebrow}</Eyebrow>
        <LineReveal id={`${def.id}-title`} className="t-h2">
          {copy.timeline.title}
        </LineReveal>
        <div style={{ position: 'relative', maxWidth: '52rem' }}>
          <span className="schedule__line" style={{ transform: `scaleY(${drawn})`, top: '2.2rem', bottom: '2rem' }} aria-hidden="true" />
          <ol className="schedule">
            {milestones.map((m) => (
              <li key={`${m.when}-${m.title}`} className="schedule__row" data-status={m.status}>
                <span className="schedule__node" aria-hidden="true" />
                <div>
                  <p className="numeral">{m.when}</p>
                  <p className="status-chip">{m.status}</p>
                </div>
                <div>
                  <h3 className="t-h3">{m.title}</h3>
                  <p className="t-body mt-1">{m.line}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Chapter>
  )
}

/** 14 · Get in touch. */
export function Closing() {
  const def = HOME_CHAPTERS[13]
  return (
    <Chapter def={def} className="hero closing">
      <div className="copy" style={{ background: 'transparent' }}>
        <Eyebrow n={def.n}>{copy.closing.eyebrow}</Eyebrow>
        <LineReveal id={`${def.id}-title`} className="t-h1">
          {copy.closing.title}
        </LineReveal>
        <p className="t-lead-serif measure">{copy.closing.lead}</p>
        <div className="flex flex-wrap gap-3 pt-2">
          <ButtonLink href="/contact" variant="primary" magnetic cursor="open">
            Get in touch
          </ButtonLink>
          <ButtonLink href="/about" variant="secondary" transition>
            About the project
          </ButtonLink>
        </div>
        <p className="t-body t-secondary">Built by {site.founders}.</p>
      </div>
      <div className="visual-rail hero__visual" aria-hidden="true">
        <ChapterPoster name="contact-cta" />
      </div>
      <div className="col-span-12 pb-6" style={{ alignSelf: 'end' }}>
        <ConceptLabel>Concept visual · real-time 3D</ConceptLabel>
      </div>
      <div className="statement-layer t-statement" aria-hidden="true">
        be your light
      </div>
    </Chapter>
  )
}
