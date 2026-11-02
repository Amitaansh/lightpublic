import { ButtonLink } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <section className="contact-page" data-chapter="other" data-keyframe="other" data-chapter-theme="white" data-n="0" aria-labelledby="nf-title">
      <h1 id="nf-title" className="t-h1">This page isn’t here.</h1>
      <div className="flex flex-wrap gap-3 mt-8">
        <ButtonLink href="/" variant="primary" transition>
          Go to the home page
        </ButtonLink>
        <ButtonLink href="/about" variant="secondary" transition>
          About the project
        </ButtonLink>
      </div>
    </section>
  )
}
