'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { contact } from '@/content/contact'
import { useLight } from '@/lib/store'
import { ContactForm } from './ContactForm'

/**
 * The contact pop-up (docs/04 §6.1): a native modal <dialog> over the current
 * page. Esc, the Close button and a click on the backdrop all close it; focus
 * returns to whatever opened it. The 3D scene and smooth scroll pause.
 */
export function ContactDialog() {
  const ref = useRef<HTMLDialogElement>(null)
  const router = useRouter()

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null
    const d = ref.current
    if (d && !d.open) d.showModal()
    d?.querySelector<HTMLInputElement>('#contact-email')?.focus()
    useLight.getState().set({ dialogOpen: true })
    return () => {
      if (d?.open) d.close()
      useLight.getState().set({ dialogOpen: false })
      requestAnimationFrame(() => opener?.focus?.({ preventScroll: true }))
    }
  }, [])

  const close = () => router.back()

  return (
    <dialog
      ref={ref}
      className="dialog"
      aria-labelledby="contact-title"
      onCancel={(e) => {
        e.preventDefault()
        close()
      }}
      onClick={(e) => {
        if (e.target === ref.current) close()
      }}
    >
      <div className="dialog__body">
        <button type="button" className="icon-button dialog__close" onClick={close} aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M3 3L13 13M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
        <h2 id="contact-title" className="t-title" style={{ paddingRight: '3.5rem' }}>
          {contact.title}
        </h2>
        <p className="t-body t-secondary" style={{ marginTop: '0.75rem' }}>{contact.lead}</p>
        <ContactForm onDone={close} />
      </div>
    </dialog>
  )
}
