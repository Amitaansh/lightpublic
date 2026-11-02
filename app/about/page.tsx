import type { Metadata } from 'next'
import { ButtonLink } from '@/components/ui/Button'
import { LineReveal } from '@/components/ui/LineReveal'
import { about } from '@/content/about'

export const metadata: Metadata = {
  title: 'About',
  description: 'Why we’re building L.I.G.H.T, and who we are.',
}

/** About: purpose and founders (v0.2). The baton floats behind, in the same room. */
export default function AboutPage() {
  return (
    <article className="page">
      <div className="page__inner">
        <p className="t-label t-secondary">{about.eyebrow}</p>
        <LineReveal as="h1" id="about-title" className="t-title" immediate>
          {about.statement}
        </LineReveal>

        <section className="page-section" aria-labelledby="why-title">
          <h2 id="why-title" className="t-label t-secondary">
            {about.whyWeStarted.title}
          </h2>
          {about.whyWeStarted.paragraphs.map((p) => (
            <p key={p} className="t-lead measure" style={{ marginTop: '1.5rem' }}>
              {p}
            </p>
          ))}
          <p className="t-body t-secondary measure" style={{ marginTop: '1.5rem' }}>
            {about.stage} {about.name}
          </p>
        </section>

        <section className="page-section" aria-labelledby="founders-title">
          <h2 id="founders-title" className="t-label t-secondary">
            {about.founders.title}
          </h2>
          <div className="founders">
            {about.founders.people.map((p) => (
              <div key={p.name} className="founder">
                <h3>{p.name}</h3>
                <p className="t-label t-secondary" style={{ marginTop: '0.5rem' }}>
                  {p.role} · {p.study}
                </p>
                <p className="t-body" style={{ marginTop: '1rem' }}>
                  {p.focus}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="page-section" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <ButtonLink href="/contact" variant="primary" magnetic cursor="write">
            Get in touch
          </ButtonLink>
          <ButtonLink href="/" variant="secondary" transition>
            Watch the film
          </ButtonLink>
        </div>
      </div>
    </article>
  )
}
