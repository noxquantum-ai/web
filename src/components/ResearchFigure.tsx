import { useEffect, useRef } from 'react'
import { NEC } from '../results'

type FigureFile = '01_model_storage' | '03_capability_retention' | '10_expert_cache_efficiency'
type Bar = { label: string; value: string; fraction: number; accent?: boolean }
const retention = [
  (100 * 0.5766779525990838) / 0.8055,
  (100 * 0.7055045871559633) / 0.7935779816513762,
]

/** Native, accessible page graphics. The publication SVG is a download, not an embed. */
export function ResearchFigure({
  file,
  alt,
  caption,
}: {
  file: FigureFile
  alt: string
  caption: string
}) {
  const ref = useRef<HTMLElement>(null)
  const cache = file === '10_expert_cache_efficiency'
  const storage = file === '01_model_storage'
  const bars: Bar[] = storage
    ? [
        {
          label: 'Original FP16',
          value: `${(NEC.originalBytes / 1e9).toFixed(3)} GB`,
          fraction: 1,
        },
        {
          label: 'NEC streamed v2',
          value: `${(NEC.packageBytes / 1e9).toFixed(3)} GB`,
          fraction: NEC.packageBytes / NEC.originalBytes,
          accent: true,
        },
      ]
    : []

  useEffect(() => {
    const element = ref.current
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!element || preference.matches || !('IntersectionObserver' in window)) return
    const animations: Animation[] = []
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        if (preference.matches) return
        for (const bar of element.querySelectorAll('.native-bar-fill, .native-accuracy-range')) {
          animations.push(
            bar.animate([{ transform: 'scaleX(.02)' }, { transform: 'scaleX(1)' }], {
              duration: 800,
              easing: 'cubic-bezier(.16,1,.3,1)',
            }),
          )
        }
        const line = element.querySelector<SVGPathElement>('.native-cache-line')
        if (line) {
          const length = line.getTotalLength()
          animations.push(
            line.animate(
              [
                { strokeDasharray: `${length}`, strokeDashoffset: `${length}` },
                { strokeDasharray: `${length}`, strokeDashoffset: '0' },
              ],
              { duration: 1000, easing: 'ease-out' },
            ),
          )
        }
      },
      { threshold: 0.3 },
    )
    const stop = () => {
      if (preference.matches) animations.forEach((animation) => animation.finish())
    }
    preference.addEventListener('change', stop)
    observer.observe(element)
    return () => {
      observer.disconnect()
      preference.removeEventListener('change', stop)
      animations.forEach((animation) => animation.cancel())
    }
  }, [file])

  return (
    <figure className="post-figure native-plot" ref={ref}>
      <div className="native-plot-heading">
        {storage
          ? '5.485× storage compression'
          : cache
            ? 'Expert-cache hit rate'
            : 'Relative accuracy retained across evaluated tasks'}
      </div>
      {cache ? (
        <CachePlot />
      ) : storage ? (
        <div className="native-bars" role="img" aria-label={alt}>
          {bars.map((bar) => (
            <div className="native-bar-row" key={bar.label}>
              <div className="native-bar-label">
                <span>{bar.label}</span>
                <strong>{bar.value}</strong>
              </div>
              <div className="native-bar-track">
                <span
                  className={`native-bar-fill${bar.accent ? ' is-accent' : ''}`}
                  style={{ width: `${bar.fraction * 100}%` }}
                />
              </div>
            </div>
          ))}
          <p className="native-plot-note">81.77% less serialized storage.</p>
        </div>
      ) : (
        <AccuracyRange alt={alt} />
      )}
      <figcaption>
        {caption} <a href={`/figures/${file}.svg`}>Download SVG</a>
      </figcaption>
    </figure>
  )
}

function AccuracyRange({ alt }: { alt: string }) {
  const left = 85 + 485 * (retention[0] / 100)
  const right = 85 + 485 * (retention[1] / 100)
  return (
    <div className="native-accuracy-plot">
      <svg viewBox="0 0 640 105" role="img" aria-label={alt}>
        <line className="native-grid-line" x1="85" x2="570" y1="52" y2="52" />
        {[0, 50, 100].map((value) => {
          const x = 85 + 485 * (value / 100)
          return (
            <g key={value}>
              <line className="native-grid-line" x1={x} x2={x} y1="46" y2="59" />
              <text className="native-axis-label" x={x} y="88" textAnchor="middle">
                {value}%
              </text>
            </g>
          )
        })}
        <rect className="native-accuracy-range" x={left} y="45" width={right - left} height="14" />
        <circle className="native-cache-dot" cx={left} cy="52" r="5" />
        <circle className="native-cache-dot" cx={right} cy="52" r="5" />
        <text className="native-cache-value" x={left - 8} y="27" textAnchor="end">
          71.6%
        </text>
        <text className="native-cache-value" x={right + 8} y="27" textAnchor="start">
          88.9%
        </text>
      </svg>
      <p className="native-plot-note">
        Compressed task accuracy relative to original-model reference accuracy.
      </p>
    </div>
  )
}

function CachePlot() {
  const values = [55.733, 75.2819, 85.8976, 93.2773]
  const x = (index: number) => 80 + index * 166
  const y = (value: number) => 210 - value * 1.6
  const path = values
    .map((value, index) => `${index ? 'L' : 'M'} ${x(index)} ${y(value)}`)
    .join(' ')
  return (
    <div className="native-cache-plot">
      <svg
        viewBox="0 0 640 255"
        role="img"
        aria-label="Expected expert-cache hit rate: 55.7% at 3 GB, 75.3% at 4 GB, 85.9% at 5 GB and 93.3% at 6 GB."
      >
        {[0, 50, 100].map((value) => (
          <g key={value}>
            <line className="native-grid-line" x1="80" x2="578" y1={y(value)} y2={y(value)} />
            <text className="native-axis-label" x="65" y={y(value) + 4} textAnchor="end">
              {value}%
            </text>
          </g>
        ))}
        <path className="native-cache-line" d={path} fill="none" strokeWidth="2.5" />
        {values.map((value, index) => (
          <g key={index}>
            <circle className="native-cache-dot" cx={x(index)} cy={y(value)} r="4" />
            <text className="native-cache-value" x={x(index)} y={y(value) - 15} textAnchor="middle">
              {value.toFixed(1)}%
            </text>
            <text className="native-axis-label" x={x(index)} y="235" textAnchor="middle">
              {index + 3} GB
            </text>
          </g>
        ))}
      </svg>
      <p className="native-plot-note">
        Frozen expected hit rates by cache budget. Cache budgets are separate from total RAM.
      </p>
    </div>
  )
}
