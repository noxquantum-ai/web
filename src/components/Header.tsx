import { useEffect, useState } from 'react'
import Logomark from './Logomark'

const links = {
  home: [
    { href: '/research', label: 'Research' },
    { href: '#company', label: 'Why Africa' },
  ],
  research: [
    { href: '/research', label: 'Research', current: true },
    { href: '/#company', label: 'Why Africa' },
  ],
}

export default function Header({ page }: { page: 'home' | 'research' }) {
  const items: { href: string; label: string; current?: boolean }[] = links[page]
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <a className="wordmark" href="/" aria-label="NoxQuantum home">
          <Logomark />
          NoxQuantum
        </a>
        <nav className="site-nav" aria-label="Primary">
          {items.map((l) => (
            <a key={l.href} href={l.href} aria-current={l.current ? 'page' : undefined}>
              {l.label}
            </a>
          ))}
        </nav>
        <a className="btn btn-light btn-sm header-cta" href="#contact">
          Contact
        </a>
        <button
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>
      <nav id="mobile-menu" className="mobile-menu" aria-label="Mobile" hidden={!open}>
        <div className="wrap">
          {[...items, { href: '#contact', label: 'Contact', current: false }].map((l) => (
            <a
              key={l.href}
              href={l.href}
              aria-current={l.current ? 'page' : undefined}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  )
}
