import Hero from '../components/Hero'
import { Method } from '../components/Method'
import { Thesis } from '../components/Thesis'
import { Company } from '../components/WhyAfrica'
import { CommercialOpportunity } from '../components/CommercialOpportunity'

export default function Home() {
  return (
    <main id="main" tabIndex={-1}>
      <Hero />
      <CommercialOpportunity />
      <Thesis />
      <Company />
      <Method />
    </main>
  )
}
