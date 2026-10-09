import { useEffect, useState } from 'react'
import Logomark from './Logomark'

const links = [
  { href: '#research', label: 'Research' },
  { href: '#company', label: 'Why Africa' },
  { href: '#approach', label: 'Approach' },
]

export default function Header() {
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
        <a className="wordmark" href="#main" aria-label="NoxQuantum home">
          <Logomark />
          NoxQuantum
        </a>
        <nav className="site-nav" aria-label="Primary">
          {links.map((l) => (
            <a key={l.href} href={l.href}>
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
          {[...links, { href: '#contact', label: 'Contact' }].map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  )
}
