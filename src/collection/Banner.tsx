// Sway follows 21st.dev "Pendulum component" (kaif-ui): a weight on a line swinging slowly about
// its hinge, built with Motion instead of GSAP. Restyled as a printed cloth banner on a wooden batten, hung by two wires from
// a ceiling rail. It unrolls from the batten the first time it comes into view (after 21st.dev
// "3D Parallax Unfurling Gallery", piyushxdev), then sways gently in the air and leans with fast
// scrolling. It does not react to hover or touch.
import { useEffect, useRef, type CSSProperties } from 'react'
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'motion/react'
import { ACCESSION } from '../data/collection'
import type { Exhibit } from '../data/types'
import { useReducedMotion } from '../motion/useReducedMotion'

/** Wire lengths in px, so neighbours hang at different heights like a real hang. */
const DROPS = [34, 58, 22, 70, 46, 28, 64, 40, 52, 30]

interface Props {
  exhibit: Exhibit
  /** 1-based position in the hang (staggers the unroll and the sway) */
  number: number
}

export function Banner({ exhibit, number }: Props) {
  const ref = useRef<HTMLLIElement>(null)
  const reduced = useReducedMotion()

  // Ambient sway (air in the room): the hinge angle.
  const angle = useMotionValue(0)
  // The cloth twists a little as it swings, and its folds catch the light differently.
  const twist = useTransform(angle, (v) => v * -1.5)
  const foldShift = useTransform(angle, (v) => `${v * 6}px`)
  // Shadow on the floor slides the other way and tightens as the banner swings out.
  const shadowX = useTransform(angle, (v) => v * -5)

  // Fast scrolling moves air past the banners: they lean back, then settle.
  const { scrollY } = useScroll()
  const scrollV = useVelocity(scrollY)
  const lean = useSpring(useTransform(scrollV, [-2500, 0, 2500], [-7, 0, 7], { clamp: true }), {
    stiffness: 60,
    damping: 9,
  })

  // Unroll: 0 = rolled up on the batten, 1 = hanging. The weighted hem rides down with the edge.
  const unroll = useMotionValue(reduced ? 1 : 0)
  const clip = useTransform(unroll, (v) => (v >= 1 ? 'none' : `inset(-4px -16px ${(1 - v) * 100}% -16px)`))
  const hemTop = useTransform(unroll, (v) => `calc(${v * 100}% - var(--hem))`)
  // The floor shadow only forms as the hem comes down: faint and narrow while rolled, full once hung.
  const shadowOpacity = useTransform(unroll, [0.4, 1], [0, 1])
  const shadowScale = useTransform(unroll, [0.4, 1], [0.55, 1])
  const seen = useInView(ref, { once: true, amount: 0.3 })

  useEffect(() => {
    if (!seen || reduced) return
    const delay = ((number - 1) % 5) * 0.12
    const controls = animate(unroll, 1, { duration: 1.5, ease: [0.65, 0, 0.35, 1], delay })
    return () => controls.stop()
  }, [seen, reduced, number, unroll])

  useEffect(() => {
    if (reduced) return
    // Each banner gets its own slow period and phase, so the room never moves in step.
    const period = 4.2 + (number % 4) * 0.55
    const amp = 0.55 + (number % 3) * 0.2
    angle.set(-amp)
    const controls = animate(angle, amp, {
      duration: period / 2,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatType: 'mirror',
      delay: (number % 5) * 0.37,
    })
    return () => controls.stop()
  }, [reduced, number, angle])

  const accession = ACCESSION[exhibit.id]
  const style = { '--drop': `${DROPS[(number - 1) % DROPS.length]}px` } as CSSProperties

  return (
    <li ref={ref} className={`banner${exhibit.centrepiece ? ' is-centre' : ''}`} style={style}>
      <span className="b-rail" aria-hidden />
      <motion.div className="b-hang" style={reduced ? undefined : { rotate: angle, rotateY: twist, rotateX: lean }}>
        <span className="b-wires" aria-hidden />
        <span className="b-rod" aria-hidden />
        <motion.div
          className="b-cloth"
          style={{ '--c': exhibit.color, ...(reduced ? {} : { '--fold': foldShift, clipPath: clip }) } as never}
        >
          <span className="b-acc">{accession}</span>
          <span className="b-medal" aria-hidden>
            <svg viewBox={exhibit.mark.viewBox}>
              {exhibit.mark.paths.map((p, i) => (
                <path key={i} d={p.d} fill={p.fill} />
              ))}
            </svg>
          </span>
          <strong className="b-name">{exhibit.name}</strong>
          <span className="b-kind">{exhibit.kind}</span>
          <span className="b-used">
            <span className="b-used-k">Used in</span>
            {exhibit.usedIn}
          </span>
          <span className="b-light" aria-hidden />
          <motion.span className="b-weight" aria-hidden style={reduced ? undefined : { top: hemTop }} />
        </motion.div>
      </motion.div>
      <motion.span
        className="b-shadow"
        aria-hidden
        style={reduced ? undefined : { x: shadowX, opacity: shadowOpacity, scaleX: shadowScale }}
      />
    </li>
  )
}
