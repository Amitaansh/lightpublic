import type { Metadata } from 'next'
import { Chapter } from '@/components/chapters/Chapter'
import { ButtonLink } from '@/components/ui/Button'
import { Eyebrow } from '@/components/ui/bits'
import { LineReveal } from '@/components/ui/LineReveal'
import { about } from '@/content/about'
import { site } from '@/content/site'

export const metadata: Metadata = {
  title: 'About',
  description: 'Why we’re building L.I.G.H.T, what we believe, and who we are.',
}

const section = (n: number, id: string, theme: 'white' | 'blue') => ({ key: `about-${n}`, id, n, theme })

/** About (docs/04 §5): purpose and motivation. */
export default function AboutPage() {
  return (
    <>
      <Chapter def={section(1, 'about', 'blue')} keyframe="about">
        <div className="copy" style={{ gridColumn: '1 / span 12', maxWidth: '62rem' }}>
          <Eyebrow>{about.eyebrow}</Eyebrow>
          <h1 id="about-title" className="t-lead-serif" style={{ fontSize: 'clamp(2rem, 4.6vw, 4.25rem)', lineHeight: 1.12 }}>
            {about.statement}
          </h1>
        </div>
      </Chapter>

      <Chapter def={section(2, 'why-we-started', 'white')} keyframe="about">
        <div className="copy">
          <LineReveal id="why-we-started-title" className="t-h2">
            {about.whyWeStarted.title}
          </LineReveal>
          {about.whyWeStarted.paragraphs.map((p) => (
            <p key={p} className="t-body-serif measure-wide">
              {p}
            </p>
          ))}
        </div>
      </Chapter>

      <Chapter def={section(3, 'beliefs', 'blue')} keyframe="about">
        <div className="copy">
          <LineReveal id="beliefs-title" className="t-h2">
            {about.principles.title}
          </LineReveal>
          <ol className="rule-list" style={{ marginTop: '2rem' }}>
            {about.principles.items.map((it) => (
              <li key={it.n} className="numbered-item">
                <span className="numbered-item__n" aria-hidden="true">
                  {it.n}
                </span>
                <div>
                  <h3 className="t-h3">{it.title}</h3>
                  <p className="t-body mt-1">{it.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Chapter>

      <Chapter def={section(4, 'name', 'white')} keyframe="about">
        <div className="copy">
          <LineReveal id="name-title" className="t-h2">
            {about.name.title}
          </LineReveal>
          <p className="t-lead-serif measure-wide">{about.name.text}</p>
          <p className="t-statement" aria-hidden="true" style={{ fontSize: 'clamp(3.5rem, 11vw, 10rem)' }}>
            be your light
          </p>
        </div>
      </Chapter>

      <Chapter def={section(5, 'founders', 'white')} keyframe="about">
        <div className="copy" style={{ gridColumn: '1 / span 12' }}>
          <LineReveal id="founders-title" className="t-h2">
            {about.founders.title}
          </LineReveal>
          <div className="founders" style={{ marginTop: '2rem', maxWidth: '56rem' }}>
            {about.founders.people.map((p) => (
              <article key={p.name} className="founder">
                <h3 className="t-h3">{p.name}</h3>
                <p className="t-label mt-1">
                  {p.role} · {p.study}
                </p>
                <p className="t-body mt-3">{p.focus}</p>
              </article>
            ))}
          </div>
        </div>
      </Chapter>

      <Chapter def={section(6, 'where-we-are', 'blue')} keyframe="about">
        <div className="copy">
          <LineReveal id="where-we-are-title" className="t-h2">
            {about.whereWeAre.title}
          </LineReveal>
          <p className="t-lead-serif measure-wide">{about.whereWeAre.text}</p>
          <div className="flex flex-wrap gap-3 pt-2">
            <ButtonLink href="/contact" variant="primary" magnetic cursor="open">
              Get in touch
            </ButtonLink>
            <ButtonLink href="/#timeline" variant="secondary" transition>
              See the timeline
            </ButtonLink>
          </div>
          <p className="t-body t-secondary">{site.smallPrint}</p>
        </div>
      </Chapter>
    </>
  )
}
