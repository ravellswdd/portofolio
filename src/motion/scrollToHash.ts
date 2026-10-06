import type Lenis from 'lenis'

const FOCUSABLE = 'a[href], button, input, select, textarea, [tabindex]'

/**
 * Scroll to an in-page anchor and move keyboard focus there, so Tab continues from the room
 * the visitor jumped to. Uses Lenis when it runs, native scrolling otherwise (reduced motion).
 * Returns false when the target does not exist.
 */
export function scrollToHash(hash: string, lenis: Lenis | null) {
  const id = decodeURIComponent(hash.slice(1))
  const el = id ? document.getElementById(id) : null
  if (!el) return false

  const focus = () => {
    if (!el.matches(FOCUSABLE)) el.setAttribute('tabindex', '-1')
    el.focus({ preventScroll: true })
  }

  // The 80px clearance under the sticky nav comes from `scroll-padding-top` on <html>, which both
  // native scrolling and Lenis honour, so no extra offset here.
  if (lenis) lenis.scrollTo(el, { onComplete: focus })
  else {
    el.scrollIntoView({ block: 'start' })
    focus()
  }
  if (location.hash !== hash) history.pushState(null, '', hash)
  return true
}
