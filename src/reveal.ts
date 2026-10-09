/**
 * Subtle fade-and-rise for anything marked `data-reveal`. Content is visible by
 * default; once JS runs (and motion is allowed) off-screen items are held back
 * and released as they scroll into view. `--d` on an element staggers it.
 */
export function initReveal(): () => void {
  if (typeof IntersectionObserver === 'undefined') return () => {}
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {}

  const items = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue
        ;(e.target as HTMLElement).dataset.rv = 'in'
        io.unobserve(e.target)
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  )
  for (const el of items) {
    // Anything already on screen at load stays put: no flash of hidden content.
    const r = el.getBoundingClientRect()
    if (r.top < window.innerHeight && r.bottom > 0) continue
    el.dataset.rv = 'out'
    io.observe(el)
  }
  return () => {
    io.disconnect()
    for (const el of items) delete el.dataset.rv
  }
}
