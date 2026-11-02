import type { Metadata } from 'next'
import { ContactForm } from '@/components/contact/ContactForm'
import { contact } from '@/content/contact'

export const metadata: Metadata = {
  title: 'Get in touch',
  description: 'Write to the L.I.G.H.T founders.',
}

/** /contact loaded directly, or without JavaScript: the same form as a full page. */
export default function ContactPage() {
  return (
    <section className="page" aria-labelledby="contact-title">
      <div style={{ maxWidth: '38rem' }}>
        <p className="t-label t-secondary">Contact</p>
        <h1 id="contact-title" className="t-title" style={{ marginTop: '1rem' }}>
          {contact.title}
        </h1>
        <p className="t-lead" style={{ marginTop: '1.25rem' }}>
          {contact.lead}
        </p>
        <ContactForm />
      </div>
    </section>
  )
}
