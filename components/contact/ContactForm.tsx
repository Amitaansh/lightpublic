'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { sendContact, type ContactState } from '@/app/actions/contact'
import { contact } from '@/content/contact'

const initial: ContactState = { status: 'idle' }

/**
 * Email + optional message (docs/04 §6). Visible labels, errors tied to their
 * fields, focus moved to the first error or to the result. Posts to a Server
 * Action, so it also works without JavaScript.
 */
export function ContactForm({ onDone }: { onDone?: () => void }) {
  const [state, formAction, pending] = useActionState(sendContact, initial)
  const [openedAt, setOpenedAt] = useState(0)
  const [count, setCount] = useState(state.message?.length ?? 0)
  const emailRef = useRef<HTMLInputElement>(null)
  const messageRef = useRef<HTMLTextAreaElement>(null)
  const resultRef = useRef<HTMLHeadingElement>(null)
  const errorRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => setOpenedAt(Date.now()), [])

  useEffect(() => {
    if (state.status === 'invalid') {
      if (state.errors?.email) emailRef.current?.focus()
      else if (state.errors?.message) messageRef.current?.focus()
    }
    if (state.status === 'sent') resultRef.current?.focus()
    if (state.status === 'error') errorRef.current?.focus()
  }, [state])

  if (state.status === 'sent') {
    return (
      <div className="grid gap-4" style={{ marginTop: '1.5rem' }}>
        <h2 ref={resultRef} tabIndex={-1} className="t-h3">
          {contact.sentTitle}
        </h2>
        <p className="t-body">{contact.sentBody(state.email ?? 'you')}</p>
        {onDone && (
          <div>
            <button type="button" className="btn btn--primary btn--plain" onClick={onDone}>
              Close
            </button>
          </div>
        )}
      </div>
    )
  }

  const emailError = state.status === 'invalid' ? state.errors?.email : undefined
  const messageError = state.status === 'invalid' ? state.errors?.message : undefined

  return (
    <form action={formAction} noValidate className="grid gap-5" style={{ marginTop: '1.5rem' }}>
      {state.status === 'error' && (
        <p ref={errorRef} tabIndex={-1} role="alert" className="form-error">
          {state.error}
        </p>
      )}
      <div className="form-field">
        <label htmlFor="contact-email">{contact.emailLabel}</label>
        <span id="contact-email-hint" className="form-hint">
          {contact.emailHint}
        </span>
        <input
          ref={emailRef}
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          aria-required="true"
          defaultValue={state.email}
          aria-invalid={emailError ? true : undefined}
          aria-describedby={`contact-email-hint${emailError ? ' contact-email-error' : ''}`}
        />
        {emailError && (
          <p id="contact-email-error" className="form-error">
            {emailError}
          </p>
        )}
      </div>
      <div className="form-field">
        <label htmlFor="contact-message">{contact.messageLabel}</label>
        <textarea
          ref={messageRef}
          id="contact-message"
          name="message"
          maxLength={contact.messageMax}
          defaultValue={state.message}
          onChange={(e) => setCount(e.target.value.length)}
          aria-invalid={messageError ? true : undefined}
          aria-describedby={`contact-message-count${messageError ? ' contact-message-error' : ''}`}
        />
        <span id="contact-message-count" className="form-hint">
          {count} of {contact.messageMax.toLocaleString('en-GB')} characters
        </span>
        {messageError && (
          <p id="contact-message-error" className="form-error">
            {messageError}
          </p>
        )}
      </div>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="contact-company">Company</label>
        <input id="contact-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="openedAt" value={openedAt} />
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" className="btn btn--primary btn--plain" disabled={pending} aria-disabled={pending}>
          {pending ? contact.sending : contact.send}
        </button>
        <span role="status" className="form-hint">
          {pending ? contact.sending : ''}
        </span>
      </div>
      <p className="form-hint">{contact.privacy}</p>
    </form>
  )
}
