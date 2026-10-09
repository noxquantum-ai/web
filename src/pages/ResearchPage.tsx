const threads = [
  {
    id: 'compression',
    title: 'Tensor-structured compression',
    body: 'We’re testing whether tensor networks and other tools from quantum information can compress trained models further than pruning, quantization and distillation do. People have already shown this is a serious area of research. Our job is to see whether we can improve on it in a meaningful way.',
  },
  {
    id: 'evaluation',
    title: 'Capability-preserving evaluation',
    body: 'Before compressing anything, we decide which capabilities matter. Then we report where each method loses something, instead of hiding it in an average. It’s easy to make a model smaller. It’s harder to keep it useful.',
  },
  {
    id: 'inference',
    title: 'Low-compute inference',
    body: 'A smaller model only helps if it runs faster on the hardware people have. We time inference on limited GPUs, because that’s where a method has to work.',
  },
]

const steps = [
  {
    title: 'Pick the model',
    body: 'Choose one model and one way of evaluating it before any compression work starts.',
  },
  {
    title: 'Measure existing methods',
    body: 'Find out what current methods already achieve on that evaluation.',
  },
  {
    title: 'Test ours against them',
    body: 'Run our methods under the same conditions and on the same kind of hardware.',
  },
  {
    title: 'Publish all of it',
    body: 'Report quality, memory and speed together, including the results that didn’t work.',
  },
]

const columns = [
  { name: 'Quality', note: 'Capabilities we choose before compressing anything.' },
  { name: 'Memory', note: 'Weights and runtime memory, against the GPUs people have.' },
  { name: 'Speed', note: 'Real inference time on limited GPUs.' },
]

const rows = [
  { name: 'Pruning', note: 'Existing method' },
  { name: 'Quantization', note: 'Existing method' },
  { name: 'Distillation', note: 'Existing method' },
  { name: 'Nox', note: 'Our methods', ours: true },
]

const contents = [
  { href: '#compression', label: 'Compression' },
  { href: '#evaluation', label: 'Evaluation' },
  { href: '#inference', label: 'Inference' },
  { href: '#approach', label: 'How we work' },
  { href: '#compare', label: 'How we compare' },
  { href: '#status', label: 'Where we are' },
]

/** A long-form article on a black page: what we research, how we work and how we will judge it. */
export default function ResearchPage() {
  return (
    <main id="main" tabIndex={-1} className="post">
      <article>
        <header className="post-head" data-reveal>
          <p className="post-meta">
            <span>Research</span>
            <span>3 min read</span>
          </p>
          <h1 className="post-title">How we research compact models</h1>
          <p className="post-dek">
            We work on three problems. Each is judged on quality, memory use and how fast the model
            runs.
          </p>
        </header>

        <div className="post-body">
          <p>
            Nox starts by researching algorithms that let large AI models run on much less hardware
            without losing the capabilities that matter.
          </p>

          <nav className="post-toc" aria-label="On this page">
            <span>On this page</span>
            {contents.map((c) => (
              <a key={c.href} href={c.href}>
                {c.label}
              </a>
            ))}
          </nav>

          {threads.map((t) => (
            <section
              key={t.id}
              id={t.id}
              className="post-section"
              aria-labelledby={`${t.id}-h`}
              data-reveal
            >
              <h2 id={`${t.id}-h`}>{t.title}</h2>
              <p>{t.body}</p>
            </section>
          ))}

          <section id="approach" className="post-section" aria-labelledby="approach-h" data-reveal>
            <h2 id="approach-h">How we work</h2>
            <p>
              We start with one model, measure what existing methods can do, then test ours against
              them.
            </p>
            <ol className="post-steps">
              {steps.map((s) => (
                <li key={s.title}>
                  <strong>{s.title}.</strong> {s.body}
                </li>
              ))}
            </ol>
          </section>

          <section id="compare" className="post-section" aria-labelledby="compare-h" data-reveal>
            <h2 id="compare-h">How we compare methods</h2>
            <p>
              We’ll run every method on the same model and the same hardware, and judge them all the
              same way. We have no results yet, so nothing here is filled in.
            </p>
            <table className="compare">
              <caption className="sr-only">
                Planned comparison of methods on quality, memory and speed. No results yet.
              </caption>
              <thead>
                <tr>
                  <th scope="col">Method</th>
                  {columns.map((c) => (
                    <th key={c.name} scope="col">
                      {c.name}
                      <small>{c.note}</small>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.name} className={r.ours ? 'is-ours' : undefined}>
                    <th scope="row">
                      <span className="compare-name">{r.name}</span>
                      <small>{r.note}</small>
                      {r.ours && <span className="compare-pending">Pending</span>}
                    </th>
                    {columns.map((c) => (
                      <td key={c.name} data-label={c.name}>
                        <span className="track" aria-hidden="true" />
                        <span className="sr-only">Not measured yet</span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section id="status" className="post-section" aria-labelledby="status-h" data-reveal>
            <h2 id="status-h">Where we are</h2>
            <p>
              We’ve just started. We’re choosing the first model and how to evaluate it. There are
              no results yet. When there are, we’ll post them here, including the ones that didn’t
              work.
            </p>
            <p className="post-sign">The Nox team</p>
          </section>
        </div>
      </article>
    </main>
  )
}
