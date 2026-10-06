import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import type { ExperienceRow as Row } from '../data/types'

/** Ease-out cubic, so a row decelerates into place instead of stopping dead. */
const easeOut = (p: number) => 1 - Math.pow(1 - p, 3)

interface Props {
  row: Row
  index: number
  reduced: boolean
}

/**
 * One row of the chronology. Scrubbed by scroll (DESIGN.md 6.4): 0 when the row's top touches
 * the bottom of the screen, 1 when it reaches the middle. The row travels 46vw, its title a
 * further 16vw and the side text 8vw, so it lands in three layers while the hairline above it
 * draws in from the right.
 */
export function ExperienceRow({ row, index, reduced }: Props) {
  const ref = useRef<HTMLLIElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start center'] })
  const p = useTransform(scrollYProgress, easeOut)

  const rowX = useTransform(p, (v) => `${(1 - v) * 46}vw`)
  const opacity = useTransform(p, (v) => 0.05 + v * 0.95)
  const titleX = useTransform(p, (v) => `${(1 - v) * 16}vw`)
  const sideX = useTransform(p, (v) => `${(1 - v) * 8}vw`)
  const line = p

  return (
    <motion.li ref={ref} className="exp-row" style={reduced ? undefined : { x: rowX, opacity }}>
      <motion.span className="exp-line" aria-hidden style={reduced ? undefined : { scaleX: line }} />
      <span className="exp-n">{String(index + 1).padStart(2, '0')}</span>
      <motion.h4 className="exp-role" style={reduced ? undefined : { x: titleX }}>
        {row.title}
      </motion.h4>
      <motion.div className="exp-side" style={reduced ? undefined : { x: sideX }}>
        <span className="exp-org">{row.org}</span>
        <span className="exp-what">{row.description}</span>
        <span className={`exp-when${row.current ? ' is-now' : ''}`}>{row.when}</span>
      </motion.div>
    </motion.li>
  )
}
