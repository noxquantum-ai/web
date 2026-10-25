export default function BlogPage() {
  return (
    <main id="main" tabIndex={-1} className="post blog-index">
      <header className="post-head">
        <h1 className="post-title">Blog</h1>
        <p className="post-dek">Experiments on model compression and efficient inference.</p>
      </header>
      <div className="post-body">
        <article className="blog-entry">
          <time dateTime="2026-10-25">October 25, 2026</time>
          <h2>
            <a href="/research">
              NEC: compressing <span className="post-term">Llama-2-7B</span> without{' '}
              <span className="post-term">gradient-based healing</span>
            </a>
          </h2>
          <p>
            5.485× storage compression, 2.028× structural reduction and the first results from our
            CPU inference prototype.
          </p>
        </article>
      </div>
    </main>
  )
}
