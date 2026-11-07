import Hero from '../components/Hero'
import { Thesis } from '../components/Thesis'

export default function Home() {
  return (
    <main id="main" tabIndex={-1}>
      <Hero />
      <Thesis />
    </main>
  )
}
