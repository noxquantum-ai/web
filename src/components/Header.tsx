import Logomark from './Logomark'

export default function Header() {
  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <a className="wordmark" href="/" aria-label="NoxQuantum home">
          <Logomark />
          NoxQuantum
        </a>
      </div>
    </header>
  )
}
