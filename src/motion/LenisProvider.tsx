import { useEffect, useState, type ReactNode } from 'react'
import Lenis from 'lenis'
import { cancelFrame, frame } from 'motion/react'
import { LenisContext } from './lenis-context'
import { scrollToHash } from './scrollToHash'
import { useReducedMotion } from './useReducedMotion'

/**
 * Fast smooth scroll (DESIGN.md section 5). One clock: Motion's frame loop drives Lenis, so the
 * scroll position and every scroll-linked animation update in the same frame. Touch keeps native
 * momentum (syncTouch off).
 * With reduced motion Lenis is not created and the page scrolls natively.
 */
export function LenisProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion()
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    if (reduced) return

    const instance = new Lenis({
      duration: 0.9,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      wheelMultiplier: 1.1,
      touchMultiplier: 1.4,
      syncTouch: false,
      autoRaf: false,
    })

    const tick = ({ timestamp }: { timestamp: number }) => instance.raf(timestamp)
    frame.update(tick, true)
    setLenis(instance)

    return () => {
      cancelFrame(tick)
      instance.destroy()
      setLenis(null)
    }
  }, [reduced])

  // In-page links (nav, skip link, "View work"): scroll with Lenis and hand focus to the target.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as Element | null)?.closest?.('a[href^="#"]')
      const hash = a?.getAttribute('href')
      if (!hash || hash === '#') return
      if (scrollToHash(hash, lenis)) e.preventDefault()
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [lenis])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}
