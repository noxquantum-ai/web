import { ContactBand, Footer } from './components/Closing'
import Header from './components/Header'
import Hero from './components/Hero'
import { Approach, Company, MediaCard, Research } from './components/Sections'

export default function App() {
  return (
    <>
      <Header />
      <main id="top">
        <Hero />
        <Research />
        <MediaCard />
        <Approach />
        <Company />
        <ContactBand />
      </main>
      <Footer />
    </>
  )
}
