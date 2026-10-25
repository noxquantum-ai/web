import type { CSSProperties } from 'react'
import { useScrollThrough } from '../useScrollScrub'

const STATEMENT =
  'Large AI models should run on much less hardware. We work on model compression and faster inference, with the longer-term goal of building better LLM architectures.'
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
