import { useEffect, useRef } from 'react'

/**
 * Scroll-scrubbed progress for a tall section that pins a sticky stage.
 * Sets `--p` (0 at the top of the section, 1 when the stage is released) and
 * `data-armed`. Everything renders in its final state without this: server render,
 * no JS, reduced motion, and narrow screens, where sections are not pinned.
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
    let armed = false
    let near = true
    let io: IntersectionObserver | undefined

    const update = () => {
      raf = 0
      const box = el.getBoundingClientRect()
      const span = box.height - window.innerHeight
      const p = span > 0 ? Math.min(1, Math.max(0, -box.top / span)) : 1
      el.style.setProperty('--p', p.toFixed(4))
      cb.current?.(p, el)
    }
    const onScroll = () => {
      if (near && !raf) raf = requestAnimationFrame(update)
    }
    const arm = () => {
      const shouldArm = wide.matches && !calm.matches
      if (shouldArm === armed) return
      armed = shouldArm
      if (armed) {
        el.dataset.armed = ''
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
      } else {
        io?.disconnect()
        delete el.dataset.armed
        el.style.setProperty('--p', '1')
        cb.current?.(1, el)
        window.removeEventListener('scroll', onScroll)
        window.removeEventListener('resize', onScroll)
      }
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
    }
  }, [])

  return ref
}
