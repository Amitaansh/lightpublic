import { ButtonLink } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <section className="page" aria-labelledby="nf-title">
      <h1 id="nf-title" className="t-title">This page isn’t here.</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "2rem" }}>
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
