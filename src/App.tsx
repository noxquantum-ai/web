import { ContactBand, Footer } from './components/Closing'
import Header from './components/Header'
import Hero from './components/Hero'
import { Method } from './components/Method'
import { Scoreboard } from './components/Scoreboard'
import { useEffect } from 'react'
import { initReveal } from './reveal'
import { Approach } from './components/Approach'
import { Research } from './components/Research'
import { Company } from './components/WhyAfrica'

export default function App() {
  useEffect(() => initReveal(), [])

  // The pinned sections change the page height after load; settle on a #hash target afterwards.
  useEffect(() => {
    const id = window.location.hash.slice(1)
    if (!id) return
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView()),
    )
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <>
      <a className="skip-link" href="#research">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Research />
        <Company />
        <Method />
        <Scoreboard />
        <Approach />
        <ContactBand />
      </main>
      <Footer />
    </>
  )
}
