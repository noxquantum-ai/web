import type { CSSProperties } from 'react'
import { useScrollScrub } from '../useScrollScrub'
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
          <path
            key={i}
            pathLength={1}
            d={`M4 ${10 + i * 10}H34C58 ${10 + i * 10} 62 40 86 40H116`}
          />
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
        <path pathLength={1} d="M4 16H92M4 40H68M4 64H108" />
        <path pathLength={1} d="M92 8v16M68 32v16M108 56v16" />
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
        <circle pathLength={1} cx="60" cy="42" r="30" />
        <path pathLength={1} d="M60 42V22M60 42l16 10M60 8v6M60 70v6M26 42h6M88 42h6" />
      </>
    ),
  },
]

/** A long section: the stage stays pinned while scrolling moves through the three threads. */
export function Research() {
  const ref = useScrollScrub<HTMLElement>((p, el) => {
    const idx = Math.min(threads.length - 1, Math.floor(p * threads.length))
    el.dataset.active = String(idx)
    // Progress through the current thread (0 to 1), for the motion inside the card.
    el.style.setProperty('--lp', (p * threads.length - idx).toFixed(4))
  })

  const jump = (i: number) => {
    const el = ref.current
    if (!el) return
    if (!('armed' in el.dataset)) return document.getElementById(threads[i].id)?.scrollIntoView()
    const span = el.offsetHeight - window.innerHeight
    const top = el.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top: top + ((i + 0.5) / threads.length) * span, behavior: 'smooth' })
  }

  return (
    <section className="research-pin" id="research" ref={ref} aria-labelledby="research-title">
      {threads.map((t, i) => (
        <span
          key={t.id}
          id={t.id}
          className="pin-anchor"
          style={{ '--at': (i + 0.5) / threads.length, '--i': i } as CSSProperties}
        />
      ))}
      <div className="research-stage">
        <div className="wrap research-grid">
          <div className="research-side">
            <h2 className="section-title" id="research-title">
              Research
            </h2>
            <p className="rail-sub">
              We work on three problems. Each is judged on quality, memory use and how fast the
              model runs.
            </p>
            <ol className="research-index">
              {threads.map((t, i) => (
                <li key={t.id} data-i={i}>
                  <button type="button" onClick={() => jump(i)}>
                    <span className="research-index-num">{t.num}</span>
                    <span>{t.title}</span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
          <div className="research-view">
            {threads.map((t, i) => (
              <article key={t.id} className="thread" data-i={i}>
                <SpotlightCard
                  theme="light"
                  className="thread-card"
                  spotlightSize={320}
                  intensity={0.3}
                >
                  <span className="thread-ghost" aria-hidden="true">
                    {t.num}
                  </span>
                  <p className="thread-num">{t.num} / 03</p>
                  <svg className="thread-glyph" viewBox="0 0 120 84" aria-hidden="true">
                    {t.glyph}
                  </svg>
                  <h3>{t.title}</h3>
                  <p className="thread-body">{t.body}</p>
                  <div className="thread-bar" aria-hidden="true">
                    <i />
                  </div>
                </SpotlightCard>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
