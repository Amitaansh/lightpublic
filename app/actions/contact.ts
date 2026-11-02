'use server'

import { Resend } from 'resend'
import { z } from 'zod'
import { contact } from '@/content/contact'

export type ContactState = {
  status: 'idle' | 'invalid' | 'sent' | 'error'
  email?: string
  message?: string
  errors?: { email?: string; message?: string }
  error?: string
}

const schema = z.object({
  email: z.email().max(254),
  message: z.string().max(contact.messageMax),
})

/**
 * Contact pop-up (docs/04 §6.4): validate, drop obvious spam silently, send to
 * the founders' inbox through Resend. Nothing is stored and the message
 * content is never logged.
 */
export async function sendContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const email = String(formData.get('email') ?? '').trim()
  const message = String(formData.get('message') ?? '').trim()
  const honeypot = String(formData.get('company') ?? '')
  const openedAt = Number(formData.get('openedAt') ?? 0)

  const parsed = schema.safeParse({ email, message })
  if (!parsed.success) {
    const errors: NonNullable<ContactState['errors']> = {}
    for (const issue of parsed.error.issues) {
      if (issue.path[0] === 'email') errors.email = contact.errors.email
      if (issue.path[0] === 'message') errors.message = contact.errors.messageTooLong
    }
    return { status: 'invalid', email, message, errors }
  }

  // A filled honeypot, or a submit within 3 s of opening: pretend it worked.
  if (honeypot || (openedAt > 0 && Date.now() - openedAt < 3000)) return { status: 'sent', email }

  if (process.env.CONTACT_DRY_RUN === '1') {
    console.info('[contact] dry run: accepted, nothing sent')
    return { status: 'sent', email }
  }

  const { RESEND_API_KEY: key, CONTACT_TO: to, CONTACT_FROM: from } = process.env
  if (!key || !to || !from) {
    console.error('[contact] not configured: set RESEND_API_KEY, CONTACT_TO and CONTACT_FROM')
    return { status: 'error', email, message, error: contact.notConfigured }
  }

  try {
    const resend = new Resend(key)
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `L.I.G.H.T site: message from ${email}`,
      text: `${message || '(No message, just an email address.)'}\n\nSent from the contact form on the L.I.G.H.T site. Reply to ${email}.`,
    })
    if (error) {
      console.error('[contact] send failed:', error.name)
      return { status: 'error', email, message, error: contact.failed }
    }
    return { status: 'sent', email }
  } catch {
    console.error('[contact] send failed')
    return { status: 'error', email, message, error: contact.failed }
  }
}
