import type { CSSProperties } from 'react'
import SplitFlapText from './reactbits/SplitFlapText'

const metrics = [
  { name: 'Quality', body: 'We choose which capabilities to protect before we compress anything.' },
  {
    name: 'Memory',
    body: 'How much memory the model needs, weights and runtime, compared with the GPUs people have.',
  },
  { name: 'Speed', body: 'Real inference time on limited GPUs, not a calculated speed-up.' },
]

export function Scoreboard() {
  return (
    <section className="section section-tint" id="scoreboard" aria-labelledby="scoreboard-title">
      <div className="wrap rail-grid">
        <div className="rail-head" data-reveal>
          <h2 className="section-title" id="scoreboard-title">
            How we compare methods
          </h2>
          <p className="rail-sub">
            We’ll plot every method, ours included, on the same chart. We have no results yet, so
            ours isn’t on it.
          </p>
          <div
            className="flap-board"
            role="img"
            aria-label="Quality, memory and speed results: pending"
          >
            <SplitFlapText
              words={['QUALITY PENDING', 'MEMORY  PENDING', 'SPEED   PENDING']}
              padTo={15}
              fontSize={23}
              gap={3}
              tileRadius={3}
              tileColor="#0c0e0d"
              textColor="#ffffff"
              cycleDelay={2800}
              flipsPerChar={6}
              aria-hidden="true"
            />
          </div>
        </div>
        <div>
          <figure className="plot" data-reveal>
            <svg
              viewBox="0 0 640 400"
              role="img"
              aria-label="Empty trade-off plot. Horizontal axis: memory, smaller to the right. Vertical axis: quality retained, higher is better. A dashed curve marks the frontier of existing methods, to be measured. A marked slot in the upper right reads: Nox, pending."
            >
              {[1, 2, 3, 4].map((i) => (
                <g key={i} className="plot-grid">
                  <line x1={70} x2={620} y1={20 + i * 62} y2={20 + i * 62} />
                  <line y1={20} y2={330} x1={70 + i * 110} x2={70 + i * 110} />
                </g>
              ))}
              <path className="plot-axis" d="M70 20V330H620" />
              <text x={345} y={376} className="plot-label" textAnchor="middle">
                Memory — smaller →
              </text>
              <text
                transform="translate(24 175) rotate(-90)"
                className="plot-label"
                textAnchor="middle"
              >
                Quality retained — higher →
              </text>
              <path className="plot-frontier" d="M90 52C200 60 330 100 410 170S560 280 600 300" />
              <g className="plot-slot">
                <circle cx={540} cy={72} r={20} />
                <path d="M524 72h32M540 56v32" />
              </g>
              <text x={540} y={118} className="plot-nox" textAnchor="middle">
                Nox — pending
              </text>
            </svg>
            <figcaption>
              This is a sketch, not real data. The dashed line shows roughly where we expect
              existing methods (pruning, quantization, distillation) to land. We’ll measure them
              first, then add ours.
            </figcaption>
          </figure>
          <ul className="metrics">
            {metrics.map((m, i) => (
              <li key={m.name} data-reveal style={{ '--d': `${i * 0.08}s` } as CSSProperties}>
                <h3>{m.name}</h3>
                <p>{m.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
