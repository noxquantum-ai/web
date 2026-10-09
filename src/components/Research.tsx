import { useEffect, useState } from 'react'
import SpotlightCard from './reactbits/SpotlightCard'

const threads = [
  {
    id: 'compression',
    num: '01',
    title: 'Tensor-structured compression',
    body: 'We’re testing whether tensor networks and other tools from quantum information can compress trained models further than pruning, quantization and distillation do. People have already shown this is a serious area of research. Our job is to see whether we can improve on it in a meaningful way.',
    glyph: (
      <>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <path key={i} d={`M4 ${10 + i * 10}H34C58 ${10 + i * 10} 62 40 86 40H116`} />
        ))}
      </>
    ),
  },
  {
    id: 'evaluation',
    num: '02',
    title: 'Capability-preserving evaluation',
    body: 'Before compressing anything, we decide which capabilities matter. Then we report where each method loses something, instead of hiding it in an average. It’s easy to make a model smaller. It’s harder to keep it useful.',
    glyph: (
      <>
        <path d="M4 16H92M4 40H68M4 64H108" />
        <path d="M92 8v16M68 32v16M108 56v16" />
      </>
    ),
  },
  {
    id: 'inference',
    num: '03',
    title: 'Low-compute inference',
    body: 'A smaller model only helps if it runs faster on the hardware people have. We time inference on limited GPUs, because that’s where a method has to work.',
    glyph: (
      <>
        <circle cx="60" cy="42" r="30" />
        <path d="M60 42V22M60 42l16 10M60 8v6M60 70v6M26 42h6M88 42h6" />
      </>
    ),
  },
]

const indexFromHash = () => threads.findIndex((t) => `#${t.id}` === window.location.hash)

/** Three panels side by side; the one you hover, focus or click opens up. They stack on phones. */
export function Research() {
  const [active, setActive] = useState(0)

  // Footer links (#compression and so on) open the matching panel.
  useEffect(() => {
    const sync = () => {
      const i = indexFromHash()
      if (i >= 0) setActive(i)
    }
    sync()
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [])

  return (
    <section className="section" id="research" aria-labelledby="research-title">
      <div className="wrap">
        <div className="research-head" data-reveal>
          <h2 className="section-title" id="research-title">
            Research
          </h2>
          <p className="rail-sub">
            We work on three problems. Each is judged on quality, memory use and how fast the model
            runs.
          </p>
        </div>
        <ol className="panels" data-active={active} data-reveal>
          {threads.map((t, i) => (
            <li
              key={t.id}
              id={t.id}
              className="panel"
              data-active={i === active}
              onPointerEnter={(e) => e.pointerType !== 'touch' && setActive(i)}
            >
              <SpotlightCard
                theme="light"
                className="panel-card"
                spotlightSize={260}
                intensity={0.3}
              >
                <h3 className="panel-title">
                  <button
                    type="button"
                    aria-expanded={i === active}
                    aria-controls={`${t.id}-body`}
                    onClick={() => setActive(i)}
                    onFocus={() => setActive(i)}
                  >
                    <span className="panel-num">{t.num}</span>
                    <span className="panel-name">{t.title}</span>
                  </button>
                </h3>
                <div className="panel-body" id={`${t.id}-body`}>
                  <svg className="panel-glyph" viewBox="0 0 120 84" aria-hidden="true">
                    {t.glyph}
                  </svg>
                  <p>{t.body}</p>
                </div>
              </SpotlightCard>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
