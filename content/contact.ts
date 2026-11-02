/** Contact pop-up copy (docs/04 §6). */
export const contact = {
  title: 'Get in touch',
  lead: 'Investors, instructors, cane users, or just curious: write to us.',
  emailLabel: 'Your email',
  emailHint: 'So we can reply.',
  messageLabel: 'Message (optional)',
  messageMax: 2000,
  privacy:
    'We’ll only use your email to reply. Your message goes to the founders’ inbox through our email provider. This site doesn’t store it or set cookies.',
  send: 'Send',
  sending: 'Sending…',
  sentTitle: 'Message sent',
  sentBody: (email: string) => `Thanks. We’ll reply to ${email}.`,
  failed: 'That didn’t send. Please try again in a moment.',
  notConfigured: 'The contact form isn’t set up yet. Please try again later.',
  errors: {
    email: 'Enter an email address, like name@example.com.',
    messageTooLong: 'Keep your message under 2,000 characters.',
  },
}
