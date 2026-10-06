import { useEffect, useState } from 'react'

/**
 * Which room (section id) sits in the middle band of the viewport.
 * Returns null while the visitor is still in the entrance hall.
 */
export function useActiveRoom<T extends string>(ids: readonly T[]) {
  const [active, setActive] = useState<T | null>(null)
  const key = ids.join(',')

  useEffect(() => {
    const els = key
      .split(',')
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    if (!els.length) return
    const first = els[0]

    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (en.isIntersecting) setActive(en.target.id as T)
          // The first room dropped below the band: the visitor is back in the entrance hall.
          else if (en.target === first && en.boundingClientRect.top > 0) setActive(null)
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [key])

  return active
}
