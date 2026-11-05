import Link from 'next/link'
import { ButtonLink } from '@/components/ui/Button'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { home } from '@/content/home'
import type { Source } from '@/content/types'

function SourceNote({ source }: { source: Source }) {
  return (
    <p className="details-stat__source">
      {home.sourcesLabel}:{' '}
      {source.url ? (
        <a href={source.url} rel="noopener noreferrer" target="_blank">
          {source.name}
          <span className="visually-hidden"> (opens in a new tab)</span>
        </a>
      ) : (
        source.name
      )}
    </p>
  )
}

/**
 * The home page after the film (layer 3): what it adds, the cane, safety,
 * privacy, why it matters, where we are, questions, and how to get involved.
 * Copy in content/home.ts. Plain, static HTML: it reads the same with a
 * screen reader, without JavaScript and with motion off.
 */
export function Details() {
  const { adds, cane, safety, privacy, why, stage, faq, involved } = home
  return (
    <div id="details" className="details" tabIndex={-1}>
      <div className="details-section">
        <ScrollReveal className="details-statement">{home.statement}</ScrollReveal>
      </div>

      <section className="details-section" aria-labelledby={`${adds.id}-title`}>
        <h2 id={`${adds.id}-title`} className="details-title">
          {adds.title}
        </h2>
        <ScrollReveal className="t-lead measure">{adds.lead}</ScrollReveal>
        <ul className="details-grid details-grid--4">
          {adds.items.map((it) => (
            <li key={it.title} className="details-card">
              <h3>{it.title}</h3>
              <p>{it.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="details-section details-split" aria-labelledby={`${cane.id}-title`}>
        <h2 id={`${cane.id}-title`} className="details-title">
          {cane.title}
        </h2>
        <div>
          <p className="t-body measure">{cane.body}</p>
          <ul className="details-facts">
            {cane.facts.map((f) => (
              <li key={f.text}>{f.text}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="details-section details-split" aria-labelledby={`${safety.id}-title`}>
        <h2 id={`${safety.id}-title`} className="details-title">
          {safety.title}
        </h2>
        <div>
          <p className="t-body measure">{safety.lead}</p>
          <ol className="details-ladder">
            {safety.ladder.map((step) => (
              <li key={step.name}>
                <strong>{step.name}</strong>
                <span>{step.text}</span>
              </li>
            ))}
          </ol>
          <p className="t-body t-secondary">{safety.note}</p>
        </div>
      </section>

      <section className="details-section details-split" aria-labelledby={`${privacy.id}-title`}>
        <h2 id={`${privacy.id}-title`} className="details-title">
          {privacy.title}
        </h2>
        <ul className="details-facts">
          {privacy.items.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </section>

      <section className="details-section" aria-labelledby={`${why.id}-title`}>
        <h2 id={`${why.id}-title`} className="details-title">
          {why.title}
        </h2>
        <ScrollReveal className="t-lead measure">{why.lead}</ScrollReveal>
        <ul className="details-grid details-grid--3">
          {why.stats.map((s) => (
            <li key={s.id} className="details-stat">
              <p className="details-stat__value">{s.value}</p>
              <p className="details-stat__label">{s.label}</p>
              <SourceNote source={s.source} />
            </li>
          ))}
        </ul>
      </section>

      <section className="details-section details-split" aria-labelledby={`${stage.id}-title`}>
        <h2 id={`${stage.id}-title`} className="details-title">
          {stage.title}
        </h2>
        <div>
          <p className="t-body measure">{stage.lead}</p>
          <ol className="details-timeline">
            {stage.milestones.map((m) => (
              <li key={m.title} data-status={m.status}>
                <span className="details-timeline__when">{m.when}</span>
                <strong>{m.title}</strong>
                <span>{m.line}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="details-section details-split" aria-labelledby={`${faq.id}-title`}>
        <h2 id={`${faq.id}-title`} className="details-title">
          {faq.title}
        </h2>
        <div className="details-faq">
          {faq.items.map((it) => (
            <details key={it.q}>
              <summary>
                <h3>{it.q}</h3>
              </summary>
              <p>{it.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="details-section" aria-labelledby={`${involved.id}-title`}>
        <h2 id={`${involved.id}-title`} className="details-title">
          {involved.title}
        </h2>
        <ScrollReveal className="t-lead measure">{involved.lead}</ScrollReveal>
        <ul className="details-grid details-grid--2">
          {involved.paths.map((p) => (
            <li key={p.id} className="details-card details-card--path">
              <h3>{p.title}</h3>
              <p>{p.text}</p>
              <ButtonLink href={p.href} variant={p.id === 'tester' ? 'primary' : 'secondary'} cursor="write">
                {p.cta}
              </ButtonLink>
            </li>
          ))}
        </ul>
        <p className="t-body t-secondary" style={{ marginTop: '1.5rem' }}>
          {involved.otherLead}{' '}
          <Link href="/contact" className="details-link" data-cursor="write">
            {involved.otherLink}
          </Link>
        </p>
      </section>
    </div>
  )
}
