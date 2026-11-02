import type { Metadata } from 'next'
import { ContactForm } from '@/components/contact/ContactForm'
import { Eyebrow } from '@/components/ui/bits'
import { contact } from '@/content/contact'

export const metadata: Metadata = {
  title: 'Get in touch',
  description: 'Write to the L.I.G.H.T founders.',
}

/** /contact loaded directly, or without JavaScript: the same form as a full page. */
export default function ContactPage() {
  return (
    <section
      className="contact-page"
      data-chapter="contact"
      data-keyframe="contact"
      data-chapter-theme="blue"
      data-n="0"
      aria-labelledby="contact-title"
    >
      <div style={{ maxWidth: '38rem' }}>
        <Eyebrow>contact</Eyebrow>
        <h1 id="contact-title" className="t-h1 mt-3">
          {contact.title}
        </h1>
        <p className="t-lead-serif mt-5">{contact.lead}</p>
        <ContactForm />
      </div>
    </section>
  )
}
