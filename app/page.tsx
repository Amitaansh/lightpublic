import { Details } from '@/components/home/Details'
import { Film } from '@/components/film/Film'

/** The home page: the film (content/film.ts), then the details (content/home.ts). */
export default function Home() {
  return (
    <>
      <Film />
      <Details />
    </>
  )
}
