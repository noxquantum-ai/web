import Logomark from './Logomark'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="site-footer" id="contact">
      <div className="wrap footer-grid">
        <div className="footer-brand">
          <p className="wordmark">
            <Logomark />
            NoxQuantum
          </p>
          <p>Model compression research for AI products, infrastructure and private deployments.</p>
          <a className="footer-mail" href="mailto:hello@noxquantum.com">
            hello@noxquantum.com
          </a>
        </div>
        <nav aria-label="Research">
          <p>Research</p>
          <a href="/research#compression">Compression</a>
          <a href="/research#evaluation">Evaluation</a>
          <a href="/research#inference">Inference</a>
        </nav>
        <nav aria-label="Company">
          <p>Company</p>
          <a href="/#commercial">Commercial fit</a>
          <a href="/#company">Why Africa</a>
          <a href="/blog">Blog</a>
          <a href="#contact">Contact</a>
        </nav>
      </div>
      <div className="wrap footer-base">
        <p>© {year} NoxQuantum</p>
        <p>
          No cookies, no analytics. <a href="/privacy">Privacy</a>
        </p>
      </div>
      <div className="footer-giant" aria-hidden="true" />
    </footer>
  )
}
