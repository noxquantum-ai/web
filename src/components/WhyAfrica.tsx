import type { CSSProperties } from 'react'
import { useScrollScrub } from '../useScrollScrub'

const STATEMENT =
  'The African Union reports that most African countries lack powerful GPUs in their universities and research institutions.'
const WORDS = STATEMENT.split(' ')

const TIERS = [8, 16, 24]
const SCALE = 24
const pct = (gb: number) => `${(gb / SCALE) * 100}%`

/**
 * Pinned and dark. As you scroll, the statement fills in word by word, then a memory
 * ruler builds itself: a 7B model at 16 bits is 14 GB of weights, and a tenth of that
 * is 1.4 GB. The arithmetic is simple (parameters × bytes), not a measurement.
 */
export function Company() {
  const ref = useScrollScrub<HTMLElement>((p, el) => {
    const goal = el.querySelector('.africa-goal-num')?.firstChild
    if (!goal) return
    const k = Math.min(1, Math.max(0, (p - 0.66) / 0.2))
    goal.nodeValue = (14 - 12.6 * k).toFixed(1)
  })

  return (
    <section
      className="africa-pin"
      id="company"
      ref={ref}
      style={{ '--n': WORDS.length } as CSSProperties}
      aria-labelledby="africa-title"
    >
      <div className="africa-stage">
        <div className="wrap africa-grid">
          <div className="africa-main">
            <h2 className="eyebrow" id="africa-title">
              Why Africa
            </h2>
            <p className="africa-statement">
              {WORDS.map((w, i) => (
                <span key={i} className="w" style={{ '--i': i } as CSSProperties}>
                  {w}{' '}
                </span>
              ))}
            </p>
            <p className="source">
              Source:{' '}
              <a
                href="https://au.int/sites/default/files/documents/44004-doc-EN-_Continental_AI_Strategy_July_2024.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                African Union, Continental Artificial Intelligence Strategy (July 2024), p. 48
              </a>
            </p>
          </div>

          <div className="africa-side">
            <figure className="africa-ruler">
              <div className="africa-rows">
                <div className="africa-row africa-row-a">
                  <div className="africa-bar" />
                  <p>
                    <strong>14 GB:</strong> a 7B-parameter model with 16-bit weights
                  </p>
                </div>
                <div className="africa-row africa-row-b">
                  <div className="africa-bar africa-bar-goal" />
                  <p>
                    <strong>
                      <span className="africa-goal-num">1.4</span> GB:
                    </strong>{' '}
                    what a tenth of that would be. That’s our target, not something we’ve achieved.
                  </p>
                </div>
                {TIERS.map((t) => (
                  <span key={t} className="africa-tier" style={{ left: pct(t) }}>
                    <span>{t} GB</span>
                  </span>
                ))}
              </div>
              <figcaption>
                GPU memory sizes we’re designing for. This counts weights only, not activations or
                cache, and it’s simple arithmetic, not a measurement.
              </figcaption>
            </figure>

            <div className="africa-body">
              <p>
                Most frontier models can’t be run there because the hardware isn’t available. A
                model that needs a tenth of the memory could be used in classrooms, clinics and
                field systems. That’s why Nox is starting in Africa, and why we plan to stay here as
                we grow. Cheaper models would matter elsewhere too.
              </p>
              <p>
                AI models are where we’re starting. As the lab grows, we want to apply the same
                standard to problems in other fields: measure honestly, and compare against the best
                known methods.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
