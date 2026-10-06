// Loading screen, after landonorris.com (a solid panel, the mark centred, one quiet line at
// the foot) and 21st.dev "Preloader" (info-mdshakeeb): the panel lifts away with a curved lower
// edge that flattens as it goes. The 0 to 100 count follows 21st.dev "Swiss Poster Counter
// Preloader" (kedhareswer). Restyled to the exhibition: "RvL's Portfolio" rolls over to
// "Exhibition", then the curtain lifts on the lit entrance hall.
//
// It waits for the fonts and the entrance portrait (at least 1.9 s so the word change is seen,
// at most 4.5 s whatever happens), opens the entrance gate as it starts to lift, and is skipped
// entirely with reduced motion.
import { useEffect, useLayoutEffect, useState } from 'react'
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from 'motion/react'
import { useLenis } from '../motion/lenis-context'
import { useReducedMotion } from '../motion/useReducedMotion'
import { openGate } from './gate'
import './loader.css'

const EASE = [0.22, 1, 0.36, 1] as const
const LIFT = [0.76, 0, 0.24, 1] as const
const MIN_MS = 1900
const MAX_MS = 4500
const WORDS = ['Portfolio', 'Exhibition'] as const

/** Fonts plus the entrance portrait (preloaded in index.html), never longer than MAX_MS. */
function pageReady() {
  const fonts = document.fonts?.ready ?? Promise.resolve()
  const portrait = new Promise<void>((res) => {
    const img = document.querySelector<HTMLImageElement>('.h-window img')
    if (!img || img.complete) return res()
    img.addEventListener('load', () => res(), { once: true })
    img.addEventListener('error', () => res(), { once: true })
  })
  const cap = new Promise<void>((res) => setTimeout(res, MAX_MS))
  return Promise.race([Promise.all([fonts, portrait]).then(() => undefined), cap])
}

/** The HTML copy of the panel from index.html, if it is still on screen. */
const boot = typeof document === 'undefined' ? null : document.getElementById('boot')

export function Loader() {
  const reduced = useReducedMotion()
  const [phase, setPhase] = useState<'loading' | 'lifting' | 'gone'>(reduced ? 'gone' : 'loading')
  const [word, setWord] = useState(0)
  const lenis = useLenis()
  const count = useMotionValue(0)
  const shown = useTransform(count, (v) => String(Math.round(v)).padStart(3, '0'))

  // This panel is now drawn exactly where the HTML copy was: take over from it without a flash.
  useLayoutEffect(() => {
    boot?.remove()
  }, [])

  // Reduced motion: no loading screen, the hall is simply there.
  useEffect(() => {
    if (reduced) openGate()
  }, [reduced])

  // Hold the page still while the panel is up.
  useEffect(() => {
    if (phase !== 'loading') return
    lenis?.stop()
    const html = document.documentElement
    const prev = html.style.overflow
    html.style.overflow = 'hidden'
    return () => {
      html.style.overflow = prev
      lenis?.start()
    }
  }, [phase, lenis])

  useEffect(() => {
    if (reduced) return
    let cancelled = false
    const swap = window.setTimeout(() => setWord(1), 900)
    // The count creeps towards 90 while loading, then runs out to 100 once everything is in.
    const creep = animate(count, 90, { duration: 2.4, ease: [0.3, 0, 0.2, 1] })
    const minWait = new Promise((res) => setTimeout(res, MIN_MS))
    Promise.all([pageReady(), minWait]).then(async () => {
      if (cancelled) return
      creep.stop()
      await animate(count, 100, { duration: 0.35, ease: 'easeOut' })
      if (cancelled) return
      openGate()
      setPhase('lifting')
    })
    return () => {
      cancelled = true
      window.clearTimeout(swap)
      creep.stop()
    }
  }, [reduced, count])

  if (phase === 'gone') return null

  return (
    <AnimatePresence onExitComplete={() => setPhase('gone')}>
      {phase === 'loading' && (
        <motion.div
          key="loader"
          className="loader"
          role="status"
          aria-label="Loading RvL's Portfolio"
          exit={{ y: '-100%', transition: { duration: 0.95, ease: LIFT } }}
        >
          {/* curved lower edge that flattens as the panel lifts */}
          <svg className="loader-edge" viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden>
            <motion.path
              d="M0 0 L100 0 L100 0 Q50 10 0 0 Z"
              exit={{ d: 'M0 0 L100 0 L100 0 Q50 0 0 0 Z', transition: { duration: 0.95, ease: LIFT } }}
            />
          </svg>

          <motion.div
            className="loader-mark"
            aria-hidden
            // already on screen from the HTML copy: no second entrance
            initial={boot ? false : { opacity: 0, y: 18, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -40, transition: { duration: 0.5, ease: [0.4, 0, 1, 1] } }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <span className="loader-rvl">RvL&rsquo;s</span>
            <span className="loader-word">
              {/* invisible copy of the longest word holds the slot's width, so the mark never shifts */}
              <span className="loader-word-in loader-word-sizer">
                {WORDS.reduce((a, b) => (b.length > a.length ? b : a))}
              </span>
              <AnimatePresence initial={false}>
                <motion.span
                  key={WORDS[word]}
                  className="loader-word-in"
                  initial="enter"
                  animate="center"
                  exit="exit"
                  variants={{
                    center: { transition: { staggerChildren: 0.035 } },
                    exit: { transition: { staggerChildren: 0.02 } },
                  }}
                >
                  {Array.from(WORDS[word]).map((ch, i) => (
                    <motion.span
                      key={i}
                      className="inline-block"
                      variants={{
                        enter: { y: '105%', opacity: 0 },
                        center: { y: '0%', opacity: 1, transition: { duration: 0.6, ease: EASE } },
                        exit: { y: '-105%', opacity: 0, transition: { duration: 0.35, ease: [0.4, 0, 1, 1] } },
                      }}
                    >
                      {ch}
                    </motion.span>
                  ))}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.div>

          <motion.div
            className="loader-foot"
            aria-hidden
            initial={boot ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <span>Opening the exhibition</span>
            <motion.span className="loader-count">{shown}</motion.span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
