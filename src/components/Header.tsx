export default function Header() {
  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <a className="wordmark" href="#top" aria-label="NoxQuantum home">
          NoxQuantum
        </a>
        <nav className="site-nav" aria-label="Primary">
          <a href="#research">Research</a>
          <a href="#approach">Approach</a>
          <a href="#company">Company</a>
        </nav>
        <a className="btn btn-ghost btn-sm" href="#contact">
          Contact
        </a>
        <a className="btn btn-light btn-sm" href="#contact">
          Talk to us
        </a>
      </div>
    </header>
  )
}
