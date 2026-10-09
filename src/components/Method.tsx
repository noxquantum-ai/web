import { useScrollScrub } from '../useScrollScrub'

const NODES = [0, 1, 2, 3]
const NODE_X = (i: number) => 400 + i * 110
const CELLS = [0, 1, 2, 3, 4, 5, 6, 7, 8]

// A 4096 x 4096 matrix, with 4096 = 8 x 8 x 8 x 8, stored as four cores of size 8 x 8
// joined by bonds of dimension 16: 1*64*16 + 16*64*16 + 16*64*16 + 16*64*1 numbers.
const FULL = 4096 * 4096
const CORES = 64 * 16 + 2 * (16 * 64 * 16) + 64 * 16

/**
 * A weight matrix as a chain of small tensors (a tensor train). The pinned stage
 * scrubs with scroll: the matrix gives way to the chain and the storage count drops.
 * The arithmetic only counts stored numbers; it says nothing about accuracy.
 */
export function Method() {
  const ref = useScrollScrub<HTMLElement>((p, el) => {
    const count = el.querySelector('.method-count')?.firstChild
    if (!count) return
    const k = Math.min(1, Math.max(0, (p - 0.5) / 0.28))
    const eased = 1 - Math.pow(1 - k, 3)
    count.nodeValue = Math.round(FULL + (CORES - FULL) * eased).toLocaleString('en-US')
  })

  return (
    <section className="method-pin" id="method" ref={ref} aria-labelledby="method-title">
      <div className="method-stage">
        <div className="wrap method-grid">
          <div className="method-text">
            <p className="kicker">The first problem</p>
            <h2 className="section-title" id="method-title">
              Compact models
            </h2>
            <p className="rail-sub">
              A large weight matrix can be stored as a chain of small tensors. We want to find out
              whether this, and related ideas from quantum information, can beat pruning,
              quantization and distillation.
            </p>
            <p className="method-caveat">
              The numbers on the right only count what has to be stored. Whether a trained model’s
              weights survive that squeeze without losing what matters is the part we’re testing.
            </p>
            <a className="text-link" href="#approach">
              How we work <span aria-hidden="true">→</span>
            </a>
          </div>

          <figure className="method-card">
            <svg
              className="tt"
              viewBox="0 0 760 300"
              role="img"
              aria-label="A large square weight matrix W, approximately equal to a chain of four small tensors G1 to G4 joined by bonds of dimension r."
            >
              <g className="tt-matrix">
                {CELLS.map((i) => (
                  <g key={i}>
                    <line x1={20} x2={240} y1={30 + i * 27.5} y2={30 + i * 27.5} />
                    <line y1={30} y2={250} x1={20 + i * 27.5} x2={20 + i * 27.5} />
                  </g>
                ))}
                <rect x={20} y={30} width={220} height={220} className="tt-frame" />
                <text x={130} y={152} className="tt-big">
                  W
                </text>
              </g>
              <text x={285} y={148} className="tt-eq">
                ≈
              </text>
              <g className="tt-chain">
                {NODES.slice(0, -1).map((i) => (
                  <g key={`bond-${i}`} className="tt-bond">
                    <line x1={NODE_X(i) + 26} x2={NODE_X(i + 1) - 26} y1={140} y2={140} />
                    <text x={(NODE_X(i) + NODE_X(i + 1)) / 2} y={126} className="tt-r">
                      r
                    </text>
                  </g>
                ))}
                {NODES.map((i) => (
                  <g key={i} className="tt-node" style={{ '--n': i } as React.CSSProperties}>
                    <line x1={NODE_X(i)} x2={NODE_X(i)} y1={92} y2={114} />
                    <line x1={NODE_X(i)} x2={NODE_X(i)} y1={166} y2={188} />
                    <circle cx={NODE_X(i)} cy={140} r={26} />
                    <text x={NODE_X(i)} y={146} className="tt-g">
                      G{i + 1}
                    </text>
                  </g>
                ))}
              </g>
            </svg>

            <dl className="method-stats">
              <div>
                <dt>One 4096 × 4096 matrix</dt>
                <dd>{FULL.toLocaleString('en-US')} numbers</dd>
              </div>
              <div className="method-stat-b">
                <dt>Four cores, bond dimension 16</dt>
                <dd>
                  <span className="method-count">{CORES.toLocaleString('en-US')}</span> numbers
                </dd>
              </div>
            </dl>
            <figcaption>
              4096 = 8 × 8 × 8 × 8, so each core is 8 × 8 with bond dimension 16.
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}
