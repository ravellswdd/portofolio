// Scroll-linked entrance and exit follow 21st.dev "Parallax Image" (pulkitxm) and "Reveal Image
// Mask" (daiwiikharihar): one scroll progress for the frame's trip through the viewport. The frame
// slides in from the left and straightens, the mat window wipes open, and on the way out it slides
// back off the wall. Restyled as a gallery print: moulded frame, bevel-cut mat, glass, picture light.
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { Picture } from '../components/ui/Picture'
import { useReducedMotion } from '../motion/useReducedMotion'
import './portrait.css'

export function Portrait() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  // 0: frame top touches the bottom of the screen, 1: frame bottom leaves the top.
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start end', 'end start'] })

  const x = useTransform(p, [0, 0.38, 0.72, 1], ['-42%', '0%', '0%', '-36%'])
  const rotate = useTransform(p, [0, 0.38, 0.72, 1], [-4, 0, 0, 3])
  const opacity = useTransform(p, [0, 0.3, 0.8, 1], [0, 1, 1, 0])
  // The photo is unmasked once the frame has nearly arrived, and settles from a slight zoom.
  const reveal = useTransform(p, [0.14, 0.4], [100, 0], { clamp: true })
  const clipPath = useTransform(reveal, (v) => `inset(0 ${v}% 0 0)`)
  const scale = useTransform(p, [0.14, 0.5, 1], [1.2, 1.04, 1])
  // The reflection on the glass drifts as the frame moves past the light.
  const glare = useTransform(p, [0, 1], ['-60%', '60%'])

  return (
    <motion.figure ref={ref} className="portrait" style={reduced ? undefined : { x, rotate, opacity }}>
      <span className="pt-light" aria-hidden />
      <span className="pt-frame">
        <span className="pt-mat">
          <span className="pt-bevel">
            <motion.span className="pt-window" style={reduced ? undefined : { clipPath }}>
              <motion.span className="pt-photo" style={reduced ? undefined : { scale }}>
                <Picture
                  image="profile"
                  alt="Ravellino in a navy T-shirt, leaning on a rail by a tall window high above the Kuala Lumpur skyline"
                  sizes="(max-width: 900px) min(70vw, 300px), 400px"
                />
              </motion.span>
            </motion.span>
          </span>
          <motion.span className="pt-glass" aria-hidden style={reduced ? undefined : { x: glare }} />
        </span>
      </span>
      <figcaption className="pt-tag">
        <span>The curator</span> From Indonesia, to The Surface and World
      </figcaption>
    </motion.figure>
  )
}
