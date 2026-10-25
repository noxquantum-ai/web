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
        <h1>Frontier models shouldn&rsquo;t need frontier hardware.</h1>
        <p className="hero-sub">
          NoxQuantum builds computationally efficient AI: smaller models, faster inference and, over
          time, better LLM architectures. Built from Africa.
        </p>
        <a className="btn btn-light" href="/research">
          Our research <span aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  )
}
