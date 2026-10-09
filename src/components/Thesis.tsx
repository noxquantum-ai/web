import type { CSSProperties } from 'react'
import { useScrollThrough } from '../useScrollScrub'

const STATEMENT =
  'Large AI models should run on much less hardware without losing the capabilities that matter. We want to find out whether ideas from quantum information can help.'
const WORDS = STATEMENT.split(' ')

/** Why Nox exists, in two sentences. The words fill in as the statement scrolls up the screen. */
export function Thesis() {
  const ref = useScrollThrough<HTMLElement>()

  return (
    <section
      className="thesis"
      id="thesis"
      ref={ref}
      style={{ '--n': WORDS.length } as CSSProperties}
      aria-labelledby="thesis-title"
    >
      <div className="wrap">
        <h2 className="kicker" id="thesis-title">
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
    </section>
  )
}
