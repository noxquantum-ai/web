import { useEffect } from 'react'
import { Footer } from './components/Closing'
import Header from './components/Header'
import Home from './pages/Home'
import ResearchPage from './pages/ResearchPage'
import { initReveal } from './reveal'

export default function App({ path }: { path: string }) {
  const research = path === '/research'

  useEffect(() => initReveal(), [])

  // Pinned sections change the page height after load; settle on a #hash target afterwards.
  useEffect(() => {
    const id = window.location.hash.slice(1)
    if (!id) return
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView()),
    )
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className={research ? 'page page-black' : 'page'}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header page={research ? 'research' : 'home'} />
      {research ? <ResearchPage /> : <Home />}
      <Footer />
    </div>
  )
}
