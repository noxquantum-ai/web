import type { CSSProperties } from 'react'
import { useScrollScrub } from '../useScrollScrub'

const claims = [
  'Large AI models should run on much less hardware without losing the capabilities that matter.',
  'We want to find out whether ideas from quantum information, like tensor networks, can help get there.',
  'AI is where we start. Nox should grow into a research company from Africa that builds quantum and quantum-inspired algorithms for hard problems well beyond it.',
]

/** Why Nox exists, as three claims. Scrolling lights them up one at a time. */
export function Thesis() {
  const ref = useScrollScrub<HTMLElement>()

  return (
    <section className="thesis-pin" id="thesis" ref={ref} aria-labelledby="thesis-title">
      <div className="thesis-stage">
        <div className="wrap">
          <h2 className="eyebrow" id="thesis-title">
            Our thesis
          </h2>
          <ol className="thesis-claims">
            {claims.map((c, i) => (
              <li key={i} className="thesis-claim" style={{ '--i': i } as CSSProperties}>
                <span className="thesis-index">0{i + 1}</span>
                <p>{c}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
