import type { CSSProperties } from 'react'
import { useScrollScrub } from '../useScrollScrub'
import { ORIGINAL_GB, NEC_GB } from '../results'

const STATEMENT =
  'The African Union reports that most African countries lack powerful GPUs in their universities and research institutions.'
const WORDS = STATEMENT.split(' ')

const TIERS = [8, 16, 24]
const SCALE = 24
const pct = (gb: number) => `${(gb / SCALE) * 100}%`

/** The original pinned ruler animation, using the measured full-model package sizes. */
export function Company() {
  const ref = useScrollScrub<HTMLElement>((p, el) => {
    const goal = el.querySelector('.africa-goal-num')?.firstChild
    if (!goal) return
    const k = Math.min(1, Math.max(0, (p - 0.66) / 0.2))
    goal.nodeValue = (ORIGINAL_GB + (NEC_GB - ORIGINAL_GB) * k).toFixed(2)
  })

  return (
    <section
      className="africa-pin"
      data-overlap
      id="company"
      ref={ref}
      style={
        {
          '--n': WORDS.length,
          '--model-original': pct(ORIGINAL_GB),
          '--model-nec': pct(NEC_GB),
        } as CSSProperties
      }
      aria-labelledby="africa-title"
    >
      <div className="africa-stage">
        <div className="wrap africa-grid">
          <div className="africa-main">
            <h2 className="kicker" id="africa-title">
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
                    <strong>{ORIGINAL_GB.toFixed(2)} GB:</strong> original Llama-2-7B package
                  </p>
                </div>
                <div className="africa-row africa-row-b">
                  <div className="africa-bar africa-bar-goal" />
                  <p>
                    <strong>
                      <span className="africa-goal-num">{NEC_GB.toFixed(2)}</span> GB:
                    </strong>{' '}
                    our NEC result. 5.485× compression and 81.77% less storage.
                  </p>
                </div>
                {TIERS.map((t) => (
                  <span key={t} className="africa-tier" style={{ left: pct(t) }}>
                    <span>{t} GB</span>
                  </span>
                ))}
              </div>
              <figcaption>
                Measured serialized model packages. The scale is in GB; inference memory is a
                separate measurement.
              </figcaption>
            </figure>

            <div className="africa-body">
              <p>
                Compute is a constraint we know first-hand. Our work focuses on smaller model
                representations, faster inference and, over time, more efficient LLM architectures.
                We’re building from Africa for the hardware people actually have.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
