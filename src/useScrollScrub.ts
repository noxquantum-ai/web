import { useEffect, useRef } from 'react'

/**
 * Scroll-driven progress for a tall section. Sets `--p` (0 to 1) and calls `onProgress`.
 *
 * Wide screens pin a sticky stage and mark the section `data-armed`; the section's height is what gives
 * the animation its length. Narrow screens cannot hold a full stage on screen, so they use the section's
 * own travel through the viewport instead (`data-flow`, no sticky): 0 as its top enters from the bottom,
 * 1 as its bottom leaves at the top. Reduced motion and no-JS leave everything in its final state.
 */
export function useScrollScrub<T extends HTMLElement>(onProgress?: (p: number, el: T) => void) {
  const ref = useRef<T>(null)
  const cb = useRef(onProgress)

  useEffect(() => {
    cb.current = onProgress
  })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const wide = window.matchMedia('(min-width: 921px)')
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)')
    let raf = 0
    let mode: 'pin' | 'flow' | null = null
    let near = true
    let io: IntersectionObserver | undefined

    const update = () => {
      raf = 0
      const box = el.getBoundingClientRect()
      const vh = window.innerHeight
      let p: number
      if (mode === 'flow') {
        p = Math.min(1, Math.max(0, (vh - box.top) / (box.height + vh)))
        el.style.setProperty('--c', '0')
      } else {
        // A section marked data-overlap lets the next one slide over its pinned stage for the
        // last screen of scrolling; --c (0 to 1) says how far it has been covered.
        const over = 'overlap' in el.dataset ? vh : 0
        const span = box.height - vh - over
        p = span > 0 ? Math.min(1, Math.max(0, -box.top / span)) : 1
        el.style.setProperty(
          '--c',
          over ? Math.min(1, Math.max(0, (-box.top - span) / over)).toFixed(4) : '0',
        )
      }
      el.style.setProperty('--p', p.toFixed(4))
      cb.current?.(p, el)
    }
    const onScroll = () => {
      if (near && !raf) raf = requestAnimationFrame(update)
    }
    const arm = () => {
      const next = calm.matches ? null : wide.matches ? 'pin' : 'flow'
      if (next === mode) return
      io?.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      delete el.dataset.armed
      delete el.dataset.flow
      mode = next
      if (!mode) {
        el.style.setProperty('--p', '1')
        el.style.setProperty('--c', '0')
        cb.current?.(1, el)
        return
      }
      if (mode === 'pin') el.dataset.armed = ''
      else el.dataset.flow = ''
      update()
      window.addEventListener('scroll', onScroll, { passive: true })
      window.addEventListener('resize', onScroll)
      // Only do scroll work while the section is within a screen of the viewport.
      io = new IntersectionObserver(
        ([entry]) => {
          near = entry.isIntersecting
          if (!raf) raf = requestAnimationFrame(update) // settle on 0 or 1 when leaving
        },
        { rootMargin: '100% 0px' },
      )
      io.observe(el)
    }

    arm()
    wide.addEventListener('change', arm)
    calm.addEventListener('change', arm)
    return () => {
      wide.removeEventListener('change', arm)
      calm.removeEventListener('change', arm)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      io?.disconnect()
      cancelAnimationFrame(raf)
      delete el.dataset.armed
      delete el.dataset.flow
    }
  }, [])

  return ref
}

/**
 * Progress for an ordinary, unpinned block as it scrolls up the screen: `--p` runs from 0 (its top
 * enters the lower part of the viewport) to 1 (its top has reached the upper part). Sets `data-armed`
 * once running. Without JS, with reduced motion, it stays in its finished state.
 */
export function useScrollThrough<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    let near = true

    const update = () => {
      raf = 0
      const vh = window.innerHeight
      const top = el.getBoundingClientRect().top
      const p = Math.min(1, Math.max(0, (vh * 0.92 - top) / (vh * 0.7)))
      el.style.setProperty('--p', p.toFixed(4))
    }
    const onScroll = () => {
      if (near && !raf) raf = requestAnimationFrame(update)
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        near = entry.isIntersecting
        if (!raf) raf = requestAnimationFrame(update)
      },
      { rootMargin: '20% 0px' },
    )

    el.dataset.armed = ''
    update()
    io.observe(el)
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

  return ref
}
