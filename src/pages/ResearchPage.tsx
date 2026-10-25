import { ResearchFigure } from '../components/ResearchFigure'

const contents = [
  { href: '#compression', label: 'Compression' },
  { href: '#evaluation', label: 'Accuracy' },
  { href: '#inference', label: 'CPU inference' },
]

export default function ResearchPage() {
  return (
    <main id="main" tabIndex={-1} className="post">
      <article>
        <header className="post-head">
          <h1 className="post-title">
            NEC: compressing <span className="post-term">Llama-2-7B</span> without{' '}
            <span className="post-term">gradient-based healing</span>
          </h1>
          <p className="post-meta">
            <time dateTime="2026-10-25">October 25, 2026</time>
            <span>NoxQuantum</span>
          </p>
        </header>
        <div className="post-body">
          <p id="approach">
            Our Nox Entanglement Compiler reduces a complete Llama-2-7B package from 13.48 GB to
            2.46 GB: 5.485× storage compression, with 50.7% fewer stored coefficients. Relative
            accuracy retention across evaluated tasks is 71.6–88.9%.
          </p>
          <nav className="post-toc" aria-label="On this page">
            <span>Contents</span>
            {contents.map((c) => (
              <a key={c.href} href={c.href}>
                {c.label}
              </a>
            ))}
          </nav>

          <section id="compression" className="post-section" aria-labelledby="compression-h">
            <h2 id="compression-h">Full-model compression</h2>
            <p>
              NEC replaces the seven linear projections in every transformer layer with a
              tensor-network backbone and sparse residual corrections. All 32 layers are compressed.
              Calibration activations guide analytical reconstruction; no gradient-based fine-tuning
              or healing is used.
            </p>
            <table className="compare post-results">
              <caption className="sr-only">
                Complete Llama-2-7B package and stored coefficient measurements
              </caption>
              <thead>
                <tr>
                  <th scope="col">Model</th>
                  <th scope="col">Package</th>
                  <th scope="col">Coefficients</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">
                    <span className="compare-name">Original FP16</span>
                  </th>
                  <td data-label="Package">13.479 GB</td>
                  <td data-label="Coefficients">6.738 billion</td>
                </tr>
                <tr className="is-ours">
                  <th scope="row">
                    <span className="compare-name">NEC streamed v2</span>
                  </th>
                  <td data-label="Package">2.457 GB</td>
                  <td data-label="Coefficients">3.323 billion</td>
                </tr>
              </tbody>
            </table>
            <p className="post-note">
              5.485× less serialized storage. 2.028× fewer stored coefficients. Complete package
              accounting includes retained weights, metadata, decoder and lossless containers;
              support masks count toward bytes, not coefficients.
            </p>
            <ResearchFigure
              file="01_model_storage"
              alt="The original package is 13.479 GB and NEC is 2.457 GB, a 5.485-fold compression and 81.77 percent storage reduction."
              caption="Complete serialized model storage."
            />
            <p>
              The streamed reconstruction uses 98,304 mixed-domain calibration tokens. It updates
              sparse amplitudes and selected supports while keeping the coefficient budget fixed.
              The exported loader reproduces checkpoint logits bit for bit.
            </p>
          </section>

          <section id="evaluation" className="post-section" aria-labelledby="evaluation-h">
            <h2 id="evaluation-h">Accuracy retention</h2>
            <p>
              NEC retains 71.6–88.9% of original-reference accuracy across evaluated tasks.
              Retention is the compressed model’s task accuracy divided by the reference score,
              rather than its absolute accuracy.
            </p>
            <ResearchFigure
              file="03_capability_retention"
              alt="Relative accuracy retained across evaluated tasks ranges from 71.6 percent to 88.9 percent."
              caption="Relative accuracy retained across evaluated tasks."
            />
          </section>

          <section id="inference" className="post-section" aria-labelledby="inference-h">
            <h2 id="inference-h">A separate CPU inference prototype</h2>
            <p>
              Our Sparse-MoE prototype runs a quantized 35B-total-parameter mixture-of-experts model
              on CPU, using a pinned and patched llama.cpp runtime. Expert weights are staged from
              SSD into a bounded cache. Frequently used experts stay resident.
            </p>
            <p>
              The model artifact is 12.262 GB. The frozen 3–6 GB cache configurations have expected
              hit rates from 55.7% to 93.3%; these budgets describe expert caching, not total
              process RAM.
            </p>
            <details className="post-detail">
              <summary>Expert-cache figure</summary>
              <ResearchFigure
                file="10_expert_cache_efficiency"
                alt="Frozen expected cache hit rates rise from 55.7 percent at 3 GB to 93.3 percent at 6 GB."
                caption="Expected expert-cache efficiency."
              />
            </details>
          </section>
        </div>
      </article>
    </main>
  )
}
