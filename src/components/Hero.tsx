import { useEffect, useRef } from 'react'
import { paintField } from '../visuals'

export default function Hero() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (ref.current) return paintField(ref.current)
  }, [])

  return (
    <section className="hero">
      <canvas ref={ref} className="hero-canvas" aria-hidden="true" />
      <div className="hero-grain" aria-hidden="true" />
      <div className="wrap hero-inner">
        <h1>
          Frontier models shouldn&rsquo;t need frontier hardware.
        </h1>
        <p className="hero-sub">
          NoxQuantum is a research company built from Africa, developing quantum
          and quantum-inspired algorithms for hard computational problems,
          starting with compact AI models.
        </p>
        <a className="btn btn-light" href="#approach">
          Our approach <span aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  )
}
