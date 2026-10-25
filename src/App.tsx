import { useEffect } from 'react'
import { Footer } from './components/Closing'
import Header from './components/Header'
import Home from './pages/Home'
import BlogPage from './pages/BlogPage'
import ResearchPage from './pages/ResearchPage'
import { initReveal } from './reveal'

export default function App({ path }: { path: string }) {
  const research = path === '/research'
  const blog = path === '/blog'

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
    <div className={research || blog ? 'page page-black' : 'page'}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header page={research ? 'research' : blog ? 'blog' : 'home'} />
      {research ? <ResearchPage /> : blog ? <BlogPage /> : <Home />}
      <Footer />
    </div>
  )
}
