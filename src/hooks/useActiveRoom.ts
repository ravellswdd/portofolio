import { useEffect, useState } from 'react'

/**
 * Which room (section id) sits in the middle band of the viewport.
 * Returns null while the visitor is still in the entrance hall.
 *
 * Rooms further down load as their own chunks (App.tsx), so they can appear after this runs:
 * each room is observed as soon as it is in the page.
 */
export function useActiveRoom<T extends string>(ids: readonly T[]) {
  const [active, setActive] = useState<T | null>(null)
  const key = ids.join(',')

  useEffect(() => {
    const wanted = key.split(',')
    const first = wanted[0]
    const seen = new Set<string>()

    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (en.isIntersecting) setActive(en.target.id as T)
          // The first room dropped below the band: the visitor is back in the entrance hall.
          else if (en.target.id === first && en.boundingClientRect.top > 0) setActive(null)
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )

    const attach = () => {
      for (const id of wanted) {
        if (seen.has(id)) continue
        const el = document.getElementById(id)
        if (!el) continue
        seen.add(id)
        io.observe(el)
      }
      if (seen.size === wanted.length) mo.disconnect()
    }
    const mo = new MutationObserver(attach)
    mo.observe(document.body, { childList: true, subtree: true })
    attach()

    return () => {
      mo.disconnect()
      io.disconnect()
    }
  }, [key])

  return active
}
