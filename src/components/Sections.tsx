import { useEffect, useRef } from 'react'
import { paintMacro } from '../visuals'

const threads = [
  {
    num: '01',
    title: 'Tensor-structured compression',
    body: 'Whether tensor networks and related quantum-information tools can compress trained models beyond what pruning, quantization, and distillation achieve. A serious, published area — our job is a meaningful improvement.',
  },
  {
    num: '02',
    title: 'Capability-preserving evaluation',
    body: 'Fix the behaviours that matter before compressing, then report where trade-offs appear instead of averaging them away. Compression is easy; useful compression is not.',
  },
  {
    num: '03',
    title: 'Low-compute inference',
    body: 'Smaller weights only matter if they run faster on the hardware people have. We measure wall-clock inference on constrained GPUs, so a method must win where it will actually be deployed.',
  },
]

const steps = [
  { title: 'Fix the target', body: 'Lock one model and one evaluation harness before any compression work begins.' },
  { title: 'Record baselines', body: 'Measure what existing methods already achieve on that harness.' },
  { title: 'Challenge them', body: 'Test our candidates under identical conditions and hardware class.' },
  { title: 'Report everything', body: 'Quality, memory, and speed together — including negative results.' },
]

export function Research() {
  return (
    <section className="section" id="research">
      <div className="wrap rail-grid">
        <div className="rail-head">
          <h2 className="section-title">Research</h2>
          <p className="rail-sub">Three threads, one scoreboard: quality, memory, and real inference speed.</p>
        </div>
        <ol className="threads">
          {threads.map((t) => (
            <li key={t.num}>
              <span className="thread-num">{t.num}</span>
              <div>
                <h3>{t.title}</h3>
                <p>{t.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export function MediaCard() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (ref.current) return paintMacro(ref.current)
  }, [])

  return (
    <section className="section-tight" aria-label="The first problem">
      <div className="wrap">
        <div className="media-card">
          <canvas ref={ref} className="media-canvas" aria-hidden="true" />
          <div className="media-label">
            <h3>The first problem: compact models</h3>
            <a href="#approach">
              How we work <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export function Approach() {
  return (
    <section className="section section-tint" id="approach">
      <div className="wrap">
        <h2 className="section-title">Approach</h2>
        <p className="section-sub">One model. Published baselines first. Then our methods, head-to-head.</p>
        <ol className="steps">
          {steps.map((s, i) => (
            <li key={s.title}>
              <span className="step-num">0{i + 1}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export function Company() {
  return (
    <section className="section" id="company">
      <div className="wrap company-grid">
        <h2 className="section-title">Why Africa</h2>
        <div>
          <p className="company-lede">
            The African Union reports that most African countries lack powerful GPUs in
            their universities and research institutions.
          </p>
          <p>
            Frontier models are largely unusable there — not for lack of questions, but
            for lack of hardware. A model that needs a tenth of the memory stops being a
            demo and starts being infrastructure: usable in classrooms, clinics, and field
            systems. That constraint is why Nox starts from Africa, and why we intend to
            stay rooted here as we grow.
          </p>
          <p>
            AI models are the first hard problem, not the last. As the lab grows, we take
            the same standard — measure honestly, compare against the best known methods —
            to problems in other fields.
          </p>
        </div>
      </div>
    </section>
  )
}
