// Pattern after 21st.dev "Text Cycle" by wensity (rotating words with a per-character blur
// stagger), built on motion/react to match the hall's Soft Blur In. Letters of the outgoing word
// roll up and out while the next word's letters roll up into place.
import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion, type Variants } from 'motion/react'

const EASE = [0.22, 1, 0.36, 1] as const
const STAGGER = 0.035

const word: Variants = {
  enter: {},
  center: { transition: { staggerChildren: STAGGER } },
  exit: { transition: { staggerChildren: STAGGER * 0.6 } },
}
const letter: Variants = {
  enter: { y: '105%', opacity: 0, filter: 'blur(6px)' },
  center: { y: '0%', opacity: 1, filter: 'blur(0px)', transition: { duration: 0.6, ease: EASE } },
  exit: { y: '-105%', opacity: 0, filter: 'blur(6px)', transition: { duration: 0.36, ease: [0.4, 0, 1, 1] } },
}

interface Props {
  words: readonly string[]
  /** ms each word stays on screen */
  interval?: number
  /** Hold the current word (hover / focus on the parent link) */
  paused?: boolean
  className?: string
}

/**
 * Visual only: the parent supplies the accessible name, so this is aria-hidden.
 * Stops with reduced motion, while paused, and while the tab is hidden.
 */
export function WordCycle({ words, interval = 3400, paused = false, className = '' }: Props) {
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (reduced || paused || words.length < 2) return
    const id = window.setInterval(() => {
      if (!document.hidden) setIndex((i) => (i + 1) % words.length)
    }, interval)
    return () => window.clearInterval(id)
  }, [reduced, paused, interval, words.length])

  const current = reduced ? words[0] : words[index]

  return (
    // One grid cell for both words, so the outgoing and incoming word overlap while they swap.
    <span aria-hidden className={`inline-grid overflow-hidden align-bottom ${className}`}>
      <AnimatePresence initial={false}>
        <motion.span
          key={current}
          className="col-start-1 row-start-1 inline-flex whitespace-pre"
          variants={word}
          initial="enter"
          animate="center"
          exit="exit"
        >
          {Array.from(current).map((char, i) => (
            <motion.span key={i} className="inline-block" variants={letter}>
              {char}
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
