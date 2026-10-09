export function ContactBand() {
  return (
    <section className="cta-band" id="contact">
      <div className="wrap">
        <h2>Work on compression, tensor methods, or research capacity in Africa?</h2>
        <p>No product to demo, no API to sell. Replies come from a researcher.</p>
        <a className="btn btn-light" href="mailto:hello@noxquantum.com">
          hello@noxquantum.com
        </a>
      </div>
    </section>
  )
}

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div className="footer-brand">
          <p className="wordmark">NoxQuantum</p>
          <p>Quantum-inspired algorithms for hard problems. Built from Africa.</p>
          <a className="footer-mail" href="mailto:hello@noxquantum.com">
            hello@noxquantum.com
          </a>
        </div>
        <nav aria-label="Research">
          <p>Research</p>
          <a href="#research">Compression</a>
          <a href="#research">Evaluation</a>
          <a href="#research">Inference</a>
        </nav>
        <nav aria-label="Company">
          <p>Company</p>
          <a href="#company">Why Africa</a>
          <a href="#approach">Approach</a>
          <a href="#contact">Contact</a>
        </nav>
      </div>
      <div className="wrap footer-base">
        <p>© {year} NoxQuantum</p>
      </div>
    </footer>
  )
}
