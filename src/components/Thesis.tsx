import type { CSSProperties } from 'react'
import { useScrollScrub } from '../useScrollScrub'

const STATEMENT =
  'Large AI models should run on much less hardware without losing the capabilities that matter. We want to find out whether ideas from quantum information, like tensor networks, can help get there. AI is where we start. We want Nox to grow into a research company from Africa that builds quantum and quantum-inspired algorithms for hard problems well beyond it.'
const WORDS = STATEMENT.split(' ')

/** The short version of why Nox exists. The words fill in as you scroll. */
export function Thesis() {
  const ref = useScrollScrub<HTMLElement>()

  return (
    <section
      className="thesis-pin"
      id="thesis"
      ref={ref}
      data-overlap
      style={{ '--n': WORDS.length } as CSSProperties}
      aria-labelledby="thesis-title"
    >
      <div className="thesis-stage">
        <div className="wrap">
          <h2 className="eyebrow" id="thesis-title">
            Our thesis
          </h2>
          <p className="thesis-statement">
            {WORDS.map((w, i) => (
              <span key={i} className="w" style={{ '--i': i } as CSSProperties}>
                {w}{' '}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  )
}
