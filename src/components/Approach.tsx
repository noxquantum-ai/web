import { useEffect, useRef } from 'react'

const steps = [
  {
    title: 'Pick the model',
    body: 'Choose one model and one way of evaluating it before any compression work starts.',
  },
  {
    title: 'Measure existing methods',
    body: 'Find out what current methods already achieve on that evaluation.',
  },
  {
    title: 'Test ours against them',
    body: 'Run our methods under the same conditions and on the same kind of hardware.',
  },
  {
    title: 'Publish all of it',
    body: 'Report quality, memory and speed together, including the results that didn’t work.',
  },
]

/** Steps hang off a rail that fills as you scroll. Without JS or with reduced motion it is fully drawn. */
export function Approach() {
  const rail = useRef<HTMLOListElement>(null)

  useEffect(() => {
    const el = rail.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const items = Array.from(el.children) as HTMLElement[]
    el.dataset.armed = ''
    let raf = 0
    let near = true

    const update = () => {
      raf = 0
      const line = window.innerHeight * 0.62
      const box = el.getBoundingClientRect()
      const p = Math.min(1, Math.max(0, (line - box.top) / box.height))
      el.style.setProperty('--p', p.toFixed(3))
      items.forEach((li) => {
        li.dataset.reached = String(li.getBoundingClientRect().top < line)
      })
    }
    const onScroll = () => {
      if (near && !raf) raf = requestAnimationFrame(update)
    }
    // Skip all scroll work while the rail is more than a screen away.
    const io = new IntersectionObserver(
      ([entry]) => {
        near = entry.isIntersecting
        if (near) onScroll()
      },
      { rootMargin: '100% 0px' },
    )
    io.observe(el)
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      delete el.dataset.armed
    }
  }, [])

  return (
    <section className="section" id="approach">
      <div className="wrap rail-grid">
        <div className="rail-head" data-reveal>
          <h2 className="section-title">Approach</h2>
          <p className="rail-sub">
            We start with one model, measure what existing methods can do, then test ours against
            them.
          </p>
        </div>
        <ol className="protocol" ref={rail}>
          {steps.map((s, i) => (
            <li key={s.title}>
              <span className="protocol-num">0{i + 1}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </li>
          ))}
          <li className="protocol-now">
            <span className="protocol-num">Oct 2026</span>
            <h3>Where we are</h3>
            <p>
              We’ve just started. We’re choosing the first model and how to evaluate it. There are
              no results yet. When there are, we’ll post them here, including the ones that didn’t
              work.
            </p>
          </li>
        </ol>
      </div>
    </section>
  )
}
