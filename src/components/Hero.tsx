import { useEffect, useRef } from 'react'
import { NEC } from '../results'
import { paintField } from '../visuals'

const ORIGINAL_GB = (NEC.originalBytes / 1e9).toFixed(2)
const NEC_GB = (NEC.packageBytes / 1e9).toFixed(2)

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
        <h1>Give AI teams more room to deploy language models.</h1>
        <p className="hero-sub">
          Our NEC research cut a complete Llama-2-7B model package from {ORIGINAL_GB} GB to {NEC_GB}{' '}
          GB. We’re
          exploring what a smaller footprint could mean for AI product teams, hosting providers and
          businesses considering private or edge deployments.
        </p>
        <a className="btn btn-light" href="#commercial">
          Explore commercial fit
        </a>
        <a className="hero-research-link" href="/research#compression">
          See the research
        </a>
      </div>
    </section>
  )
}
