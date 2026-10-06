// Based on 21st.dev "Soft Blur In" by educalvolpz (per-character blur-to-sharp reveal).
// Changes: the readable text is a visually hidden copy (aria-label on a plain span is not
// announced reliably), letters stay inline so the heading wraps naturally, timing is passed in
// seconds from the hall's intro table, and reduced motion renders plain text.
import { motion, useReducedMotion } from 'motion/react'

const EASE = [0.22, 1, 0.36, 1] as const

interface Props {
  children: string
  className?: string
  /** Seconds before the first letter starts */
  delay?: number
  /** Seconds per letter */
  duration?: number
  /** Seconds between letters */
  stagger?: number
  /** Hold the letters hidden until true (the entrance gate) */
  play?: boolean
}

export function SoftBlurIn({ children, className = '', delay = 0, duration = 1.1, stagger = 0.045, play = true }: Props) {
  const reduced = useReducedMotion()
  if (reduced) return <span className={className}>{children}</span>

  return (
    <span className={className}>
      <span className="sr-only">{children}</span>
      <span aria-hidden>
        {Array.from(children).map((char, i) => (
          <motion.span
            // Characters have no stable id; the string never reorders.
            key={i}
            className="inline-block whitespace-pre will-change-[transform,filter,opacity]"
            initial={{ opacity: 0, y: '0.32em', filter: 'blur(14px)' }}
            animate={play ? { opacity: 1, y: '0em', filter: 'blur(0px)' } : undefined}
            transition={{ duration, delay: delay + i * stagger, ease: EASE }}
          >
            {char}
          </motion.span>
        ))}
      </span>
    </span>
  )
}
